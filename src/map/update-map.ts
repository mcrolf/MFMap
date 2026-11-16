import { readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { ProjectContext } from '../languages/types.ts';
import type { FileEntry, MapIndex, Summaries } from '../model.ts';
import { SourceParser } from '../parse/parser.ts';
import { ancestorDirs } from '../paths.ts';
import { writeMapOutputs } from '../render/write-map.ts';
import { listProjectFiles } from '../scan/list-files.ts';
import { analyzeFile, hashContent } from './analyze-file.ts';
import { GENERATOR_NAME } from './generator.ts';
import { readManifests } from './manifests.ts';
import type { MapFolder } from './map-folder.ts';
import { resolveImports } from './resolve-imports.ts';
import { emptySummaries, SUMMARIES_FILE, SummaryBook } from './summaries.ts';

export const INDEX_FILE = 'index.json';
const STAT_CACHE_FILE = '.cache/stat.json';
/** Bump when extraction output changes shape, so cached entries are re-parsed. */
const EXTRACTOR_VERSION = 2;

interface StatCache {
  extractorVersion: number;
  files: Record<string, { mtimeMs: number; size: number; hash: string }>;
}

export interface UpdateReport {
  added: string[];
  changed: string[];
  removed: string[];
  fileCount: number;
  pendingFileSummaries: number;
  pendingDirSummaries: number;
  written: string[];
}

/**
 * Brings the map in line with the project. Unchanged files (same size and mtime, or same
 * content hash) reuse their previous entry, so an update after a small edit parses one file.
 */
export async function updateMap(folder: MapFolder): Promise<UpdateReport> {
  const root = folder.root;
  const paths = listProjectFiles({ root, exclude: [...folder.config.exclude, `${folder.relativeDir}/`] });
  const previousIndex = folder.readJson<MapIndex>(INDEX_FILE);
  const previous = new Map((previousIndex?.files ?? []).map((entry) => [entry.path, entry]));
  const cached = folder.readJson<StatCache>(STAT_CACHE_FILE);
  const extractorCurrent = cached?.extractorVersion === EXTRACTOR_VERSION;
  const stats = extractorCurrent ? cached.files : {};
  const nextStats: StatCache['files'] = {};

  let parser: SourceParser | undefined;
  const added: string[] = [];
  const changed: string[] = [];
  const entries: FileEntry[] = [];
  for (const path of paths) {
    const absolute = join(root, path);
    const stat = statSync(absolute);
    const prior = previous.get(path);
    const known = stats[path];
    if (prior && known && known.mtimeMs === stat.mtimeMs && known.size === stat.size && known.hash === prior.hash) {
      entries.push(prior);
      nextStats[path] = known;
      continue;
    }
    const content = readFileSync(absolute);
    const hash = hashContent(content);
    nextStats[path] = { mtimeMs: stat.mtimeMs, size: stat.size, hash };
    if (prior && prior.hash === hash && extractorCurrent) {
      entries.push(prior);
      continue;
    }
    parser ??= await SourceParser.create();
    entries.push(await analyzeFile(path, content, parser));
    (prior ? changed : added).push(path);
  }
  const removed = [...previous.keys()].filter((path) => !nextStats[path]);

  const project = projectContext(root, entries);
  const index: MapIndex = {
    schema: 1,
    generator: GENERATOR_NAME,
    projectName: basename(root),
    files: resolveImports(entries, project),
    manifests: readManifests(paths, project.readText),
  };
  const summaries = new SummaryBook(folder.readJson<Summaries>(SUMMARIES_FILE) ?? emptySummaries(), index);
  summaries.pruneRemoved();

  const written = await writeMapOutputs(folder, index, summaries);
  if (folder.writeIfChanged(INDEX_FILE, serializeIndex(index))) written.push(INDEX_FILE);
  folder.writeJson(STAT_CACHE_FILE, { extractorVersion: EXTRACTOR_VERSION, files: nextStats } satisfies StatCache);
  const pending = summaries.pending();
  return {
    added,
    changed,
    removed,
    fileCount: entries.length,
    pendingFileSummaries: pending.files.length,
    pendingDirSummaries: pending.dirs.length,
    written,
  };
}

/** One file or manifest per line: compact, and a one-file change is a one-line diff. */
function serializeIndex(index: MapIndex): string {
  const { files, manifests, ...header } = index;
  const fields = Object.entries(header).map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)}`);
  const list = (items: unknown[]) => items.map((item) => `    ${JSON.stringify(item)}`).join(',\n');
  return `{\n${fields.join(',\n')},\n  "manifests": [\n${list(manifests)}\n  ],\n  "files": [\n${list(files)}\n  ]\n}\n`;
}

function projectContext(root: string, entries: FileEntry[]): ProjectContext {
  const files = new Set(entries.map((entry) => entry.path));
  const dirs = new Set(entries.flatMap((entry) => ancestorDirs(entry.path)));
  const texts = new Map<string, string | undefined>();
  return {
    files,
    dirs,
    entries: new Map(entries.filter((entry) => entry.language).map((entry) => [entry.path, entry])),
    readText(path) {
      if (!files.has(path)) return undefined;
      if (!texts.has(path)) texts.set(path, readFileSync(join(root, path), 'utf8'));
      return texts.get(path);
    },
  };
}
