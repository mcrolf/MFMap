import type { CodeSymbol, FileEntry } from '../model.ts';
import { dirOf } from '../paths.ts';
import type { MapView } from './map-view.ts';

/** Areas beyond this many get the neutral "other" color; the palette has seven validated slots. */
export const COLORED_GROUPS = 7;
const MAX_LISTED_SYMBOLS = 40;

/** Everything the graph viewer needs, embedded in graph.html. Indexes refer to `files`. */
export interface GraphData {
  project: string;
  /** Map folder relative to the project root; the viewer uses it to build editor links. */
  mapDir: string;
  /** Directory where the main code splits into areas; stripped when naming groups and folder nodes. */
  prefix: string;
  /** Group names, largest first. A file's `group` indexes this list. */
  groups: string[];
  files: GraphFile[];
  /** [from, to, imported names] between file indexes. Package-level imports fan out to the package's files. */
  links: Array<[number, number, string[]]>;
  externals: Array<{ name: string; files: number[] }>;
  dirSummaries: Record<string, string>;
}

export interface GraphFile {
  path: string;
  group: number;
  lines: number;
  type: string;
  category: string;
  page: string;
  summary?: string;
  entry?: true;
  /** `kind name line` for display, exported first. */
  symbols: string[];
  symbolCount: number;
}

export function buildGraphData(view: MapView, mapDir: string): GraphData {
  const files = view.index.files.filter(isGraphFile);
  const indexByPath = new Map(files.map((entry, i) => [entry.path, i]));
  const chain = prefixChain(
    commonDirPrefix(files.map((entry) => entry.path)),
    files.filter((entry) => entry.language && entry.category !== 'test').map((entry) => entry.path),
  );
  const prefix = chain[chain.length - 1];
  const groupOfFile = (path: string) => groupOf(path, chain);
  const groups = rankGroups(files.map((entry) => groupOfFile(entry.path)));
  const groupIndex = new Map(groups.map((name, i) => [name, i]));

  return {
    project: view.index.projectName,
    mapDir,
    prefix,
    groups,
    files: files.map((entry) => ({
      path: entry.path,
      group: groupIndex.get(groupOfFile(entry.path))!,
      lines: entry.lines,
      type: entry.fileType ?? entry.category,
      category: entry.category,
      page: view.areaOf(entry.path)?.page ?? '_root.md',
      ...(view.describeFile(entry.path) ? { summary: view.describeFile(entry.path) } : {}),
      ...(entry.entryPoint ? { entry: true as const } : {}),
      symbols: listedSymbols(entry.symbols),
      symbolCount: entry.symbols.length,
    })),
    links: graphLinks(view, files, indexByPath),
    externals: externalPackages(files),
    dirSummaries: Object.fromEntries(
      [...new Set(files.map((entry) => dirOf(entry.path)))]
        .flatMap((dir) => ancestorsWithin(dir))
        .map((dir) => [dir, view.describeDir(dir)])
        .filter((pair): pair is [string, string] => Boolean(pair[1])),
    ),
  };
}

/** Parsed code, plus any other file something imports (stylesheets, JSON). */
function isGraphFile(entry: FileEntry): boolean {
  return entry.language !== undefined || entry.category === 'code';
}

function graphLinks(view: MapView, files: FileEntry[], indexByPath: Map<string, number>): GraphData['links'] {
  const filesByDir = new Map<string, number[]>();
  files.forEach((entry, i) => {
    if (!entry.language) return;
    const dir = dirOf(entry.path);
    filesByDir.set(dir, [...(filesByDir.get(dir) ?? []), i]);
  });
  const links: GraphData['links'] = [];
  for (const edge of view.graph.edges) {
    const from = indexByPath.get(edge.from);
    if (from === undefined) continue;
    const direct = indexByPath.get(edge.to);
    const targets = direct !== undefined ? [direct] : (filesByDir.get(edge.to) ?? []);
    for (const to of targets) if (to !== from) links.push([from, to, edge.names]);
  }
  return links;
}

function externalPackages(files: FileEntry[]): GraphData['externals'] {
  const users = new Map<string, Set<number>>();
  files.forEach((entry, i) => {
    for (const imported of entry.imports) {
      if (!imported.external) continue;
      if (!users.has(imported.external)) users.set(imported.external, new Set());
      users.get(imported.external)!.add(i);
    }
  });
  return [...users]
    .map(([name, set]) => ({ name, files: [...set] }))
    .sort((a, b) => b.files.length - a.files.length || a.name.localeCompare(b.name));
}

function listedSymbols(symbols: CodeSymbol[]): string[] {
  const ordered = [...symbols.filter((s) => s.exported && !s.container), ...symbols.filter((s) => !s.exported && !s.container)];
  return ordered.slice(0, MAX_LISTED_SYMBOLS).map((s) => `${s.kind} ${s.name} ${s.line}`);
}

/** The deepest directory every path sits under, so `RomRaider/src/main/java/com/x/...` groups by what follows. */
export function commonDirPrefix(paths: string[]): string {
  if (paths.length === 0) return '';
  let shared = dirOf(paths[0]).split('/').filter(Boolean);
  for (const path of paths) {
    const parts = dirOf(path).split('/');
    let i = 0;
    while (i < shared.length && parts[i] === shared[i]) i++;
    shared = shared.slice(0, i);
  }
  return shared.join('/');
}

/** Share of the code a single subdirectory must hold for grouping to look inside it instead. */
const DOMINANT_SHARE = 0.8;

/**
 * Directories from `base` down to where the code splits into areas. Descends into a
 * subdirectory holding at least 80% of the code, so `app/src/main/java/com/acme/{billing,auth}`
 * groups by billing and auth rather than by `main`.
 */
export function prefixChain(base: string, codePaths: string[]): string[] {
  const chain = [base];
  let inside = codePaths.filter((path) => isUnder(path, base));
  while (inside.length > 0) {
    const current = chain[chain.length - 1];
    const counts = new Map<string, number>();
    for (const path of inside) {
      const segment = firstSegmentUnder(path, current);
      if (segment !== undefined) counts.set(segment, (counts.get(segment) ?? 0) + 1);
    }
    const [top, count] = [...counts].sort((a, b) => b[1] - a[1])[0] ?? [];
    if (top === undefined || count! < inside.length * DOMINANT_SHARE || (counts.size > 1 && count === inside.length)) break;
    const next = current ? `${current}/${top}` : top;
    chain.push(next);
    inside = inside.filter((path) => isUnder(path, next));
  }
  return chain;
}

function isUnder(path: string, dir: string): boolean {
  return dir === '' || path.startsWith(`${dir}/`);
}

/** The directory right under `prefix` holding `path`, or undefined when the file sits directly in it. */
function firstSegmentUnder(path: string, prefix: string): string | undefined {
  const rest = prefix ? path.slice(prefix.length + 1) : path;
  const slash = rest.indexOf('/');
  return slash === -1 ? undefined : rest.slice(0, slash);
}

/**
 * A file's group: its first directory under the deepest prefix in `chain` that contains it,
 * or "(root)" for files directly in that prefix. Code beside the dominant directory (tests,
 * small siblings) therefore keeps its own group.
 */
export function groupOf(path: string, chain: string[]): string {
  const prefix = [...chain].reverse().find((dir) => isUnder(path, dir)) ?? '';
  return firstSegmentUnder(path, prefix) ?? '(root)';
}

function rankGroups(names: string[]): string[] {
  const counts = new Map<string, number>();
  for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name]) => name);
}

function ancestorsWithin(dir: string): string[] {
  const dirs: string[] = [];
  for (let current = dir; current; current = dirOf(current)) dirs.push(current);
  return dirs;
}
