import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { installHooks, parseAgents, uninstallHooks } from './hooks.ts';
import { describePointerResults, writeInstructionPointers } from './instruction-pointer.ts';
import { CONFIG_FILE, MapFolder } from './map/map-folder.ts';
import { emptySummaries, SUMMARIES_FILE, type SummaryInput, SummaryBook } from './map/summaries.ts';
import { INDEX_FILE, type UpdateReport, updateMap } from './map/update-map.ts';
import type { MapIndex, Summaries } from './model.ts';
import { plural } from './render/markdown.ts';
import { writeMapOutputs } from './render/write-map.ts';
import { watchProject } from './watch.ts';

const USAGE = `mfmap: build and maintain an agent-readable map of a codebase.

Usage:
  mfmap init <folder> [--root <dir>] [--no-pointer]
      Create the map in <folder> (relative to the project root), build it, and add a
      pointer to the top of AGENTS.md and CLAUDE.md when they exist.
  mfmap update [--map <folder>] [--quiet]
      Re-scan and rewrite the map. Only files whose content changed are re-parsed.
  mfmap watch [--map <folder>]
      Keep the map updated while files change.
  mfmap summaries pending [--map <folder>] [--json] [--limit <n>]
      List files and directories that need a new or refreshed summary.
  mfmap summaries set [--map <folder>] [--input <file.json>]
      Record summaries from JSON ({"files": {path: text}, "dirs": {path: text}}) on stdin or --input.
  mfmap hooks install|uninstall [--agent claude,cursor,codex|all] [--map <folder>]
      Add or remove hooks that run update after agent edits and at the end of each turn.
      claude: .claude/settings.local.json  cursor: .cursor/hooks.json  codex: .codex/hooks.json
      (default: claude). Codex asks you to trust new repo hooks once via /hooks.
  mfmap pointer [--map <folder>]
      Add or refresh the map pointer at the top of AGENTS.md and CLAUDE.md.

Without --map, the map folder is found from the current directory (any folder holding ${CONFIG_FILE}).`;

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      map: { type: 'string' },
      root: { type: 'string' },
      input: { type: 'string' },
      limit: { type: 'string' },
      json: { type: 'boolean', default: false },
      quiet: { type: 'boolean', default: false },
      agent: { type: 'string' },
      'no-pointer': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  const [command, subcommand] = positionals;
  if (values.help || !command) {
    console.log(USAGE);
    return command || values.help ? 0 : 1;
  }

  switch (command) {
    case 'init':
      return init(subcommand, values.root, !values['no-pointer']);
    case 'update': {
      const report = await updateMap(openMap(values.map));
      if (!values.quiet) printReport(report);
      return 0;
    }
    case 'watch':
      return watchMap(openMap(values.map));
    case 'summaries':
      if (subcommand === 'pending') return listPending(openMap(values.map), values.json, Number(values.limit ?? 0));
      if (subcommand === 'set') return setSummaries(openMap(values.map), values.input);
      throw new UsageError('summaries needs "pending" or "set".');
    case 'hooks': {
      const folder = openMap(values.map);
      const agents = parseAgents(values.agent);
      if (subcommand === 'install') {
        for (const path of installHooks(folder.root, folder.dir, agents)) console.log(`Installed hooks in ${path}`);
        if (agents.includes('codex')) console.log('Codex: run /hooks in Codex once to review and trust the new repo hooks.');
      } else if (subcommand === 'uninstall') {
        const cleaned = uninstallHooks(folder.root, agents);
        console.log(cleaned.length ? `Removed mfmap hooks from ${cleaned.join(', ')}` : 'No hook settings files found.');
      } else {
        throw new UsageError('hooks needs "install" or "uninstall".');
      }
      return 0;
    }
    case 'pointer': {
      const folder = openMap(values.map);
      console.log(describePointerResults(writeInstructionPointers(folder.root, folder.relativeDir)));
      return 0;
    }
    default:
      throw new UsageError(`Unknown command "${command}".`);
  }
}

class UsageError extends Error {}

function openMap(explicit: string | undefined): MapFolder {
  if (explicit) return MapFolder.open(resolve(explicit));
  const found = MapFolder.find(process.cwd());
  if (!found) throw new UsageError(`No map found from ${process.cwd()}. Run "mfmap init <folder>" first, or pass --map.`);
  return found;
}

async function init(folderName: string | undefined, rootOption: string | undefined, addPointer: boolean): Promise<number> {
  if (!folderName) throw new UsageError('init needs the name of the folder to hold the map, e.g. "mfmap init codebase-map".');
  const root = resolve(rootOption ?? process.cwd());
  const dir = isAbsolute(folderName) ? folderName : resolve(root, folderName);
  if (!dir.startsWith(root)) throw new UsageError(`The map folder must be inside the project root (${root}).`);
  if (existsSync(dir) && !existsSync(resolve(dir, CONFIG_FILE)) && readdirSync(dir).length > 0) {
    throw new UsageError(`${dir} already exists and is not an mfmap folder. Choose another name.`);
  }
  const folder = existsSync(resolve(dir, CONFIG_FILE)) ? MapFolder.open(dir) : MapFolder.create(dir, root);
  // The pointer goes in first so the map records the instruction files as they will stay.
  if (addPointer) console.log(describePointerResults(writeInstructionPointers(folder.root, folder.relativeDir)));
  printReport(await updateMap(folder));
  console.log(`Map entry point: ${resolve(dir, 'MAP.md')}`);
  return 0;
}

function watchMap(folder: MapFolder): Promise<number> {
  console.log(`Watching ${folder.root} (Ctrl+C to stop).`);
  return new Promise(() => {
    watchProject(
      folder,
      (report) => {
        if (report.added.length + report.changed.length + report.removed.length > 0) printReport(report);
      },
      (error) => console.error(`mfmap update failed: ${error.message}`),
    );
  });
}

function listPending(folder: MapFolder, asJson: boolean, limit: number): number {
  const book = loadSummaryBook(folder);
  const pending = book.pending();
  const index = folder.readJson<MapIndex>(INDEX_FILE)!;
  const entries = new Map(index.files.map((entry) => [entry.path, entry]));
  const files = (limit > 0 ? pending.files.slice(0, limit) : pending.files).map((item) => {
    const entry = entries.get(item.path)!;
    const symbols = entry.symbols.filter((s) => !s.container).map((s) => `${s.kind} ${s.name}`);
    return { ...item, type: entry.fileType ?? entry.category, lines: entry.lines, symbols: symbols.slice(0, 20) };
  });
  const dirs = limit > 0 ? pending.dirs.slice(0, limit) : pending.dirs;
  if (asJson) {
    console.log(JSON.stringify({ totalFiles: pending.files.length, totalDirs: pending.dirs.length, files, dirs }, null, 2));
    return 0;
  }
  console.log(`${pending.files.length} files and ${pending.dirs.length} directories need summaries.`);
  for (const file of files) console.log(`file  ${file.reason.padEnd(7)} ${file.path}  (${file.type}, ${file.lines} lines)`);
  for (const dir of dirs) console.log(`dir   ${dir.reason.padEnd(7)} ${dir.path}/`);
  return 0;
}

async function setSummaries(folder: MapFolder, inputPath: string | undefined): Promise<number> {
  const raw = inputPath ? readFileSync(inputPath, 'utf8') : await readStdin();
  let input: SummaryInput;
  try {
    input = JSON.parse(raw) as SummaryInput;
  } catch (error) {
    throw new UsageError(`Summaries input is not valid JSON: ${(error as Error).message}`);
  }
  const index = folder.readJson<MapIndex>(INDEX_FILE);
  if (!index) throw new UsageError('The map has not been built yet. Run "mfmap update" first.');
  const book = new SummaryBook(folder.readJson<Summaries>(SUMMARIES_FILE) ?? emptySummaries(), index);
  const unknown = book.apply(input);
  writeMapOutputs(folder, index, book);
  const pending = book.pending();
  const recorded = Object.keys(input.files ?? {}).length + Object.keys(input.dirs ?? {}).length - unknown.length;
  console.log(`Recorded ${recorded} summaries. Still pending: ${pending.files.length} files, ${pending.dirs.length} directories.`);
  if (unknown.length > 0) console.log(`Not in the map (ignored): ${unknown.join(', ')}`);
  return 0;
}

function loadSummaryBook(folder: MapFolder): SummaryBook {
  const index = folder.readJson<MapIndex>(INDEX_FILE);
  if (!index) throw new UsageError('The map has not been built yet. Run "mfmap update" first.');
  return new SummaryBook(folder.readJson<Summaries>(SUMMARIES_FILE) ?? emptySummaries(), index);
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

function printReport(report: UpdateReport): void {
  const parts = [`${report.fileCount} files mapped`];
  if (report.added.length) parts.push(`${report.added.length} added`);
  if (report.changed.length) parts.push(`${report.changed.length} changed`);
  if (report.removed.length) parts.push(`${report.removed.length} removed`);
  console.log(`${parts.join(', ')}. ${report.written.length} map files rewritten.`);
  if (report.pendingFileSummaries + report.pendingDirSummaries > 0) {
    const files = plural(report.pendingFileSummaries, 'file');
    const dirs = plural(report.pendingDirSummaries, 'directory', 'directories');
    console.log(`Summaries pending: ${files}, ${dirs} ("mfmap summaries pending").`);
  }
}

main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (error: Error) => {
    console.error(error instanceof UsageError ? error.message : `mfmap: ${error.stack ?? error.message}`);
    process.exitCode = error instanceof UsageError ? 2 : 1;
  },
);
