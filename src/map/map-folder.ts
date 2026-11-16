import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

export const CONFIG_FILE = 'mfmap.json';
const SEARCH_DEPTH = 3;
const SKIPPED_DIRS = new Set(['node_modules', '.git', '.venv', 'venv', 'dist', 'build', 'target', 'Pods', '.next']);

export interface MapConfig {
  schema: 1;
  /** Project root, relative to the map folder. */
  root: string;
  /** Extra gitignore-style patterns to leave out of the map. */
  exclude: string[];
  /** Files per area page before the area is split into sub-areas. */
  areaFileLimit: number;
}

/** A map folder on disk and the project it maps. */
export class MapFolder {
  readonly dir: string;
  readonly config: MapConfig;

  constructor(dir: string, config: MapConfig) {
    this.dir = dir;
    this.config = config;
  }

  get root(): string {
    return resolve(this.dir, this.config.root);
  }

  /** The map folder's path relative to the project root, in POSIX form. */
  get relativeDir(): string {
    return relative(this.root, this.dir).split('\\').join('/');
  }

  path(...segments: string[]): string {
    return join(this.dir, ...segments);
  }

  readJson<T>(name: string): T | undefined {
    try {
      return JSON.parse(readFileSync(this.path(name), 'utf8')) as T;
    } catch {
      return undefined;
    }
  }

  /** Writes only when content differs, so unchanged map files keep clean diffs and timestamps. */
  writeIfChanged(name: string, content: string): boolean {
    const target = this.path(name);
    if (existsSync(target) && readFileSync(target, 'utf8') === content) return false;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    return true;
  }

  writeJson(name: string, value: unknown): boolean {
    return this.writeIfChanged(name, `${JSON.stringify(value, null, 2)}\n`);
  }

  /** Deletes files in `subdir` that are not in `keep`. */
  pruneDir(subdir: string, keep: ReadonlySet<string>): string[] {
    const dir = this.path(subdir);
    if (!existsSync(dir)) return [];
    const removed = readdirSync(dir).filter((name) => !keep.has(name));
    for (const name of removed) rmSync(join(dir, name));
    return removed;
  }

  static create(dir: string, projectRoot: string): MapFolder {
    const config: MapConfig = {
      schema: 1,
      root: relative(dir, projectRoot) || '.',
      exclude: [],
      areaFileLimit: 80,
    };
    mkdirSync(dir, { recursive: true });
    const folder = new MapFolder(dir, config);
    folder.writeJson(CONFIG_FILE, config);
    folder.writeIfChanged('.gitignore', '.cache/\n');
    return folder;
  }

  static open(dir: string): MapFolder {
    const config = JSON.parse(readFileSync(join(dir, CONFIG_FILE), 'utf8')) as Partial<MapConfig>;
    if (config.schema !== 1) throw new Error(`${join(dir, CONFIG_FILE)} is not an mfmap config (schema ${config.schema}).`);
    return new MapFolder(dir, { root: '..', exclude: [], areaFileLimit: 80, ...config, schema: 1 });
  }

  /**
   * Finds the map folder for `start`: an enclosing map folder, or one at most three levels
   * below `start` or below the enclosing git work tree root.
   */
  static find(start: string): MapFolder | undefined {
    const ancestors = ancestorsOf(resolve(start));
    const enclosing = ancestors.find((dir) => existsSync(join(dir, CONFIG_FILE)));
    if (enclosing) return MapFolder.open(enclosing);
    const gitRoot = ancestors.find((dir) => existsSync(join(dir, '.git')));
    const searchRoots = [...new Set([ancestors[0], gitRoot].filter((dir): dir is string => dir !== undefined))];
    for (const root of searchRoots) {
      const found = findConfigBelow(root, SEARCH_DEPTH);
      if (found) return MapFolder.open(found);
    }
    return undefined;
  }
}

function ancestorsOf(dir: string): string[] {
  const dirs = [dir];
  while (dirname(dirs[dirs.length - 1]) !== dirs[dirs.length - 1]) dirs.push(dirname(dirs[dirs.length - 1]));
  return dirs;
}

function findConfigBelow(dir: string, depth: number): string | undefined {
  if (depth === 0) return undefined;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return undefined;
  }
  const subdirs = entries
    .filter((entry) => entry.isDirectory() && !SKIPPED_DIRS.has(entry.name))
    .map((entry) => join(dir, entry.name))
    .sort();
  const direct = subdirs.find((sub) => existsSync(join(sub, CONFIG_FILE)));
  if (direct) return direct;
  for (const sub of subdirs) {
    const nested = findConfigBelow(sub, depth - 1);
    if (nested) return nested;
  }
  return undefined;
}
