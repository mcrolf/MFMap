import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import ignore, { type Ignore } from 'ignore';

/** Directories skipped even when git is unavailable or a project forgot to ignore them. */
const ALWAYS_EXCLUDED = [
  '.git/', 'node_modules/', '.venv/', 'venv/', '__pycache__/', '.mypy_cache/', '.pytest_cache/', '.tox/',
  '.next/', '.nuxt/', '.turbo/', '.svelte-kit/', '.gradle/', '.idea/', '.vs/', 'DerivedData/', 'Pods/',
  '.build/', '.DS_Store', '.claude/settings.local.json',
];
/** Build output skipped only for non-git projects; in git projects the .gitignore decides. */
const UNTRACKED_BUILD_DIRS = ['dist/', 'build/', 'out/', 'target/', 'coverage/', 'bin/', 'obj/', 'vendor/'];

export interface ListOptions {
  root: string;
  /** Extra gitignore-style patterns from the map config. */
  exclude: string[];
}

/** Lists repo-relative POSIX paths of files that belong in the map, sorted. */
export function listProjectFiles(options: ListOptions): string[] {
  const filter = ignore().add(ALWAYS_EXCLUDED).add(options.exclude);
  const fromGit = gitFiles(options.root);
  const paths = fromGit ?? walkFiles(options.root, ignore().add(UNTRACKED_BUILD_DIRS).add(readGitignore(options.root)));
  return paths.filter((path) => !filter.ignores(path) && existsSync(join(options.root, path))).sort();
}

/** Tracked plus untracked-but-not-ignored files, or undefined outside a git work tree. */
function gitFiles(root: string): string[] | undefined {
  try {
    const output = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return [...new Set(output.split('\0').filter(Boolean))];
  } catch {
    return undefined;
  }
}

function readGitignore(root: string): string {
  try {
    return readFileSync(join(root, '.gitignore'), 'utf8');
  } catch {
    return '';
  }
}

function walkFiles(root: string, ignored: Ignore): string[] {
  const files: string[] = [];
  const visit = (relativeDir: string): void => {
    for (const entry of readdirSync(join(root, relativeDir), { withFileTypes: true })) {
      const path = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (!ignored.ignores(`${path}/`) && !ALWAYS_EXCLUDED.includes(`${entry.name}/`)) visit(path);
      } else if (entry.isFile() && !ignored.ignores(path)) {
        files.push(path);
      }
    }
  };
  visit('');
  return files;
}
