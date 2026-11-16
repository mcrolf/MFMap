import { languageForPath, RESOLVERS } from '../languages/index.ts';
import type { Ecosystem, ImportResolver, ProjectContext } from '../languages/types.ts';
import type { FileEntry, ResolvedImport } from '../model.ts';

/**
 * Resolves every raw import against the whole project. Runs on all files each update
 * because adding or removing one file can change how other files' imports resolve.
 */
export function resolveImports(entries: FileEntry[], project: ProjectContext): FileEntry[] {
  const resolvers = new Map<Ecosystem, ImportResolver | undefined>();
  const resolverFor = (ecosystem: Ecosystem): ImportResolver | undefined => {
    if (!resolvers.has(ecosystem)) resolvers.set(ecosystem, RESOLVERS[ecosystem]?.(project));
    return resolvers.get(ecosystem);
  };

  return entries.map((entry) => {
    const language = languageForPath(entry.path);
    const resolver = language && resolverFor(language.ecosystem);
    if (!resolver || entry.imports.length === 0) return entry;
    const imports = entry.imports.map((imported) => resolveOne(resolver, entry.path, imported));
    return { ...entry, imports };
  });
}

function resolveOne(resolver: ImportResolver, fromPath: string, imported: ResolvedImport): ResolvedImport {
  const raw = { specifier: imported.specifier, names: imported.names, line: imported.line };
  const resolution = resolver.resolve(fromPath, raw);
  if ('target' in resolution) return resolution.target === fromPath ? raw : { ...raw, target: resolution.target };
  if ('external' in resolution) return { ...raw, external: resolution.external };
  if ('builtin' in resolution) return { ...raw, builtin: true };
  return raw;
}
