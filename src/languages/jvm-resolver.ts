import type { FileEntry } from '../model.ts';
import { dirOf } from '../paths.ts';
import type { ImportResolver, ProjectContext, Resolution, ResolverFactory } from './types.ts';

const JVM_LANGUAGES: ReadonlySet<string> = new Set(['java', 'kotlin']);
const PLATFORM_PREFIXES = ['java.', 'javax.', 'jdk.', 'sun.', 'kotlin.'];

interface JvmIndex {
  /** Fully qualified name of each top-level declaration to its file. */
  filesByName: ReadonlyMap<string, string>;
  /** Package to the sorted directories whose files declare it. */
  dirsByPackage: ReadonlyMap<string, readonly string[]>;
}

/** Resolves Java and Kotlin imports against one index shared by both languages. */
export const jvmResolver: ResolverFactory = (project) => {
  const index = buildIndex(project);
  return { resolve: (_fromPath, imported) => resolveImport(index, imported.specifier, imported.names) } satisfies ImportResolver;
};

function buildIndex(project: ProjectContext): JvmIndex {
  const filesByName = new Map<string, string>();
  const dirs = new Map<string, Set<string>>();
  for (const entry of sortedJvmEntries(project)) {
    const { packageName } = entry;
    if (!packageName) continue;
    for (const symbol of entry.symbols) {
      if (!symbol.container && !filesByName.has(`${packageName}.${symbol.name}`)) {
        filesByName.set(`${packageName}.${symbol.name}`, entry.path);
      }
    }
    dirs.set(packageName, (dirs.get(packageName) ?? new Set()).add(dirOf(entry.path)));
  }
  const dirsByPackage = new Map([...dirs].map(([name, set]) => [name, [...set].sort()] as const));
  return { filesByName, dirsByPackage };
}

function sortedJvmEntries(project: ProjectContext): FileEntry[] {
  return [...project.entries.values()]
    .filter((entry) => entry.language !== undefined && JVM_LANGUAGES.has(entry.language))
    .sort((a, b) => a.path.localeCompare(b.path));
}

function resolveImport(index: JvmIndex, specifier: string, names: string[]): Resolution {
  if (names[0] === '*') {
    const dir = index.dirsByPackage.get(specifier)?.[0];
    if (dir !== undefined) return { target: dir };
  }
  // Exact class first; then drop trailing segments for static members and nested classes.
  for (let name = specifier; name.includes('.'); name = name.slice(0, name.lastIndexOf('.'))) {
    const file = index.filesByName.get(name);
    if (file) return { target: file };
    if (index.dirsByPackage.has(name)) return { unresolved: true };
  }
  return resolveOutsideProject(specifier);
}

function resolveOutsideProject(specifier: string): Resolution {
  const root = leadingSegments(specifier, 2);
  if (PLATFORM_PREFIXES.some((prefix) => specifier.startsWith(prefix))) return { builtin: root };
  return { external: root };
}

function leadingSegments(name: string, count: number): string {
  return name.split('.').slice(0, count).join('.');
}
