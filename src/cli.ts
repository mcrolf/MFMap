import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { writeAgentsMdPointer } from './agents-md.ts';
import { installClaudeHooks, uninstallClaudeHooks } from './hooks.ts';
import { CONFIG_FILE, MapFolder } from './map/map-folder.ts';
import { emptySummaries, SUMMARIES_FILE, type SummaryInput, SummaryBook } from './map/summaries.ts';
import { INDEX_FILE, type UpdateReport, updateMap } from './map/update-map.ts';
import type { MapIndex, Summaries } from './model.ts';
import { writeMapOutputs } from './render/write-map.ts';
import { watchProject } from './watch.ts';

const USAGE = `mfmap: build and maintain an agent-readable map of a codebase.

Usage:
  mfmap init <folder> [--root <dir>] [--no-agents-md]
      Create the map in <folder> (relative to the project root), build it, and add a
      pointer to the top of AGENTS.md when AGENTS.md exists.
  mfmap update [--map <folder>] [--quiet]
      Re-scan and rewrite the map. Only files whose content changed are re-parsed.
  mfmap watch [--map <folder>]
      Keep the map updated while files change.
  mfmap summaries pending [--map <folder>] [--json] [--limit <n>]
      List files and directories that need a new or refreshed summary.
  mfmap summaries set [--map <folder>] [--input <file.json>]
      Record summaries from JSON ({"files": {path: text}, "dirs": {path: text}}) on stdin or --input.
  mfmap hooks install|uninstall [--map <folder>]
      Add or remove Claude Code hooks (.claude/settings.local.json) that run update after edits.
  mfmap agents-md [--map <folder>]
      Add or refresh the map pointer at the top of AGENTS.md.

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
      'no-agents-md': { type: 'boolean', default: false },
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
      return init(subcommand, values.root, !values['no-agents-md']);
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
      if (subcommand === 'install') console.log(`Installed Claude Code hooks in ${installClaudeHooks(folder.root, folder.dir)}`);
      else if (subcommand === 'uninstall') console.log(`Removed mfmap hooks from ${uninstallClaudeHooks(folder.root) ?? 'nothing (no settings file)'}`);
      else throw new UsageError('hooks needs "install" or "uninstall".');
      return 0;
    }
    case 'agents-md': {
      const folder = openMap(values.map);
      console.log(`AGENTS.md: ${writeAgentsMdPointer(folder.root, folder.relativeDir)}`);
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

async function init(folderName: string | undefined, rootOption: string | undefined, linkAgentsMd: boolean): Promise<number> {
  if (!folderName) throw new UsageError('init needs the name of the folder to hold the map, e.g. "mfmap init codebase-map".');
  const root = resolve(rootOption ?? process.cwd());
  const dir = isAbsolute(folderName) ? folderName : resolve(root, folderName);
  if (!dir.startsWith(root)) throw new UsageError(`The map folder must be inside the project root (${root}).`);
  if (existsSync(dir) && !existsSync(resolve(dir, CONFIG_FILE)) && readdirSync(dir).length > 0) {
    throw new UsageError(`${dir} already exists and is not an mfmap folder. Choose another name.`);
  }
  const folder = existsSync(resolve(dir, CONFIG_FILE)) ? MapFolder.open(dir) : MapFolder.create(dir, root);
  // The pointer goes in first so the map records AGENTS.md as it will stay.
  if (linkAgentsMd) console.log(`AGENTS.md: ${writeAgentsMdPointer(folder.root, folder.relativeDir)}`);
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
    console.log(`Summaries pending: ${report.pendingFileSummaries} files, ${report.pendingDirSummaries} directories ("mfmap summaries pending").`);
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
