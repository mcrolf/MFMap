import { posix } from 'node:path';

/** Repo-relative POSIX path helpers. The repository root is the empty string. */

export function dirOf(path: string): string {
  const dir = posix.dirname(path);
  return dir === '.' ? '' : dir;
}

/** Joins and normalises segments. Returns `undefined` when the result escapes the repo root. */
export function joinRepoPath(...segments: string[]): string | undefined {
  const joined = posix.normalize(segments.filter(Boolean).join('/'));
  if (joined === '.' || joined === './') return '';
  if (joined.startsWith('../') || joined === '..' || joined.startsWith('/')) return undefined;
  return joined.replace(/\/$/, '');
}

export function baseName(path: string): string {
  return posix.basename(path);
}

export function stemOf(path: string): string {
  const base = posix.basename(path);
  const dot = base.lastIndexOf('.');
  return dot > 0 ? base.slice(0, dot) : base;
}

export function extensionOf(path: string): string {
  return posix.extname(path).toLowerCase();
}

/** True when `path` is `dir` itself or inside it. The root directory contains everything. */
export function isWithin(path: string, dir: string): boolean {
  return dir === '' || path === dir || path.startsWith(`${dir}/`);
}

/** Ancestor directories of a file, nearest first, ending with the root (''). */
export function ancestorDirs(path: string): string[] {
  const dirs: string[] = [];
  let dir = dirOf(path);
  while (true) {
    dirs.push(dir);
    if (dir === '') return dirs;
    dir = dirOf(dir);
  }
}
