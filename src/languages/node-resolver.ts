import { builtinModules } from 'node:module';
import { parseJsonc } from '../jsonc.ts';
import { ancestorDirs, baseName, dirOf, joinRepoPath } from '../paths.ts';
import type { ProjectContext, Resolution, ResolverFactory } from './types.ts';

const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.d.ts', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.json', '.vue', '.svelte'];
/** ESM TypeScript imports `./a.js` for the source file `./a.ts`. */
const COMPILED_TO_SOURCE: Record<string, string[]> = {
  '.js': ['.ts', '.tsx'],
  '.jsx': ['.tsx'],
  '.mjs': ['.mts'],
  '.cjs': ['.cts'],
};
const BUILTINS = new Set(builtinModules);
const PACKAGE_NAME = /^(@[\w.~-]+\/)?[\w.~-]+$/;

interface PathAlias {
  prefix: string;
  suffix: string;
  hasWildcard: boolean;
  targets: string[];
}

interface CompilerPaths {
  baseUrl?: string;
  aliases: PathAlias[];
}

interface WorkspacePackage {
  dir: string;
  entries: string[];
}

export const nodeResolver: ResolverFactory = (project) => {
  const findFile = fileFinder(project.files);
  const configs = new CompilerPathsCache(project);
  const packages = workspacePackages(project);

  const resolveBare = (fromPath: string, specifier: string): Resolution => {
    const compilerPaths = configs.forFile(fromPath);
    for (const candidate of aliasCandidates(compilerPaths, specifier)) {
      const target = findFile(candidate);
      if (target) return { target };
    }
    const packageName = packageNameOf(specifier);
    const local = packageName ? packages.get(packageName) : undefined;
    if (local) {
      const target = resolveWorkspaceImport(local, specifier.slice(packageName!.length + 1), findFile);
      if (target) return { target };
    }
    if (compilerPaths.baseUrl !== undefined) {
      const target = findFile(joinRepoPath(compilerPaths.baseUrl, specifier));
      if (target) return { target };
    }
    if (specifier.startsWith('node:') || BUILTINS.has(specifier) || BUILTINS.has(packageName ?? '')) {
      return { builtin: specifier.replace(/^node:/, '') };
    }
    return packageName ? { external: packageName } : { unresolved: true };
  };

  return {
    resolve(fromPath, imported) {
      const specifier = imported.specifier.split('?')[0];
      if (specifier.startsWith('.') || specifier.startsWith('/')) {
        const base = specifier.startsWith('/') ? '' : dirOf(fromPath);
        const target = findFile(joinRepoPath(base, specifier.replace(/^\//, '')));
        return target ? { target } : { unresolved: true };
      }
      return resolveBare(fromPath, specifier);
    },
  };
};

/** Returns the repo file a module path points at, trying extensions and index files. */
function fileFinder(files: ReadonlySet<string>): (candidate: string | undefined) => string | undefined {
  return (candidate) => {
    if (candidate === undefined) return undefined;
    if (files.has(candidate)) return candidate;
    for (const [compiled, sources] of Object.entries(COMPILED_TO_SOURCE)) {
      if (!candidate.endsWith(compiled)) continue;
      const stem = candidate.slice(0, -compiled.length);
      const found = sources.map((ext) => stem + ext).find((path) => files.has(path));
      if (found) return found;
    }
    for (const ext of SOURCE_EXTENSIONS) if (files.has(candidate + ext)) return candidate + ext;
    const indexBase = candidate === '' ? 'index' : `${candidate}/index`;
    for (const ext of SOURCE_EXTENSIONS) if (files.has(indexBase + ext)) return indexBase + ext;
    return undefined;
  };
}

function packageNameOf(specifier: string): string | undefined {
  const parts = specifier.split('/');
  const name = specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
  return PACKAGE_NAME.test(name) && !name.startsWith('.') ? name : undefined;
}

function aliasCandidates(paths: CompilerPaths, specifier: string): Array<string | undefined> {
  const candidates: Array<string | undefined> = [];
  for (const alias of paths.aliases) {
    if (alias.hasWildcard) {
      if (!specifier.startsWith(alias.prefix) || !specifier.endsWith(alias.suffix)) continue;
      const matched = specifier.slice(alias.prefix.length, specifier.length - alias.suffix.length);
      candidates.push(...alias.targets.map((target) => target.replace('*', matched)));
    } else if (specifier === alias.prefix) {
      candidates.push(...alias.targets);
    }
  }
  return candidates;
}

function resolveWorkspaceImport(
  pkg: WorkspacePackage,
  subpath: string,
  findFile: (candidate: string | undefined) => string | undefined,
): string | undefined {
  if (subpath) return findFile(joinRepoPath(pkg.dir, subpath)) ?? findFile(joinRepoPath(pkg.dir, 'src', subpath));
  const candidates = [...pkg.entries, joinRepoPath(pkg.dir, 'src/index'), joinRepoPath(pkg.dir, 'index')];
  for (const candidate of candidates) {
    const found = findFile(candidate) ?? findFile(builtToSource(candidate, pkg.dir));
    if (found) return found;
  }
  return undefined;
}

/** `dist/index.js` and `lib/index.js` usually come from `src/index.ts`. */
function builtToSource(entry: string | undefined, dir: string): string | undefined {
  if (!entry) return undefined;
  const inside = dir === '' ? entry : entry.slice(dir.length + 1);
  const swapped = inside.replace(/^(dist|lib|build|out)\//, 'src/').replace(/\.(c|m)?js$/, '');
  return joinRepoPath(dir, swapped);
}

function workspacePackages(project: ProjectContext): Map<string, WorkspacePackage> {
  const packages = new Map<string, WorkspacePackage>();
  for (const path of project.files) {
    if (baseName(path) !== 'package.json') continue;
    const manifest = parseJsonc(project.readText(path) ?? '') as Record<string, unknown> | undefined;
    const name = typeof manifest?.name === 'string' ? manifest.name : undefined;
    if (!name || packages.has(name)) continue;
    const dir = dirOf(path);
    const entries = [manifest!.source, manifest!.module, manifest!.main, exportEntry(manifest!.exports)]
      .filter((value): value is string => typeof value === 'string')
      .map((entry) => joinRepoPath(dir, entry))
      .filter((entry): entry is string => entry !== undefined);
    packages.set(name, { dir, entries });
  }
  return packages;
}

function exportEntry(exports: unknown): string | undefined {
  if (typeof exports === 'string') return exports;
  if (!exports || typeof exports !== 'object') return undefined;
  const root = (exports as Record<string, unknown>)['.'] ?? exports;
  if (typeof root === 'string') return root;
  if (!root || typeof root !== 'object') return undefined;
  const conditions = root as Record<string, unknown>;
  for (const key of ['source', 'import', 'default', 'require', 'types']) {
    const value = conditions[key];
    if (typeof value === 'string') return value;
  }
  return undefined;
}

/** Loads the nearest tsconfig.json or jsconfig.json for each directory, following `extends`. */
class CompilerPathsCache {
  private readonly byDir = new Map<string, CompilerPaths>();
  private readonly project: ProjectContext;

  constructor(project: ProjectContext) {
    this.project = project;
  }

  forFile(path: string): CompilerPaths {
    const configDir = ancestorDirs(path).find((dir) => this.configPathIn(dir) !== undefined);
    if (configDir === undefined) return { aliases: [] };
    let paths = this.byDir.get(configDir);
    if (!paths) {
      paths = this.load(this.configPathIn(configDir)!, new Set());
      this.byDir.set(configDir, paths);
    }
    return paths;
  }

  private configPathIn(dir: string): string | undefined {
    return ['tsconfig.json', 'jsconfig.json']
      .map((name) => (dir === '' ? name : `${dir}/${name}`))
      .find((path) => this.project.files.has(path));
  }

  private load(configPath: string, seen: Set<string>): CompilerPaths {
    seen.add(configPath);
    const config = parseJsonc(this.project.readText(configPath) ?? '') as
      | { extends?: string | string[]; compilerOptions?: { baseUrl?: string; paths?: Record<string, string[]> } }
      | undefined;
    const configDir = dirOf(configPath);
    let inherited: CompilerPaths = { aliases: [] };
    for (const parent of [config?.extends ?? []].flat()) {
      if (!parent.startsWith('.')) continue;
      const parentPath = joinRepoPath(configDir, parent.endsWith('.json') ? parent : `${parent}.json`);
      if (parentPath && this.project.files.has(parentPath) && !seen.has(parentPath)) inherited = this.load(parentPath, seen);
    }
    const options = config?.compilerOptions ?? {};
    const baseUrl = options.baseUrl !== undefined ? joinRepoPath(configDir, options.baseUrl) : inherited.baseUrl;
    if (!options.paths) return { baseUrl, aliases: inherited.aliases };
    const pathsBase = options.baseUrl !== undefined ? baseUrl : configDir;
    const aliases = Object.entries(options.paths).map(([pattern, targets]) => toAlias(pattern, targets, pathsBase ?? ''));
    return { baseUrl, aliases };
  }
}

function toAlias(pattern: string, targets: string[], base: string): PathAlias {
  const star = pattern.indexOf('*');
  return {
    prefix: star === -1 ? pattern : pattern.slice(0, star),
    suffix: star === -1 ? '' : pattern.slice(star + 1),
    hasWildcard: star !== -1,
    targets: targets.map((target) => joinRepoPath(base, target)).filter((t): t is string => t !== undefined),
  };
}
