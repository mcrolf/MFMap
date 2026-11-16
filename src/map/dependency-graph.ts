import type { FileEntry } from '../model.ts';
import { dirOf } from '../paths.ts';

export interface Edge {
  from: string;
  /** A file path, or a directory for package-level imports. */
  to: string;
  names: string[];
}

/** File-to-file import relationships across the project. */
export class DependencyGraph {
  readonly edges: Edge[];
  private readonly importers = new Map<string, Edge[]>();

  constructor(entries: FileEntry[]) {
    this.edges = collectEdges(entries);
    for (const edge of this.edges) this.importers.set(edge.to, [...(this.importers.get(edge.to) ?? []), edge]);
  }

  /** Edges into a file, including package-level edges into its directory. */
  importersOf(path: string): Edge[] {
    const direct = this.importers.get(path) ?? [];
    const viaPackage = (this.importers.get(dirOf(path)) ?? []).filter((edge) => dirOf(edge.from) !== dirOf(path));
    return [...direct, ...viaPackage];
  }
}

function collectEdges(entries: FileEntry[]): Edge[] {
  const edges = new Map<string, Edge>();
  for (const entry of entries) {
    for (const imported of entry.imports) {
      if (!imported.target) continue;
      const key = `${entry.path}\0${imported.target}`;
      const existing = edges.get(key);
      if (existing) existing.names = [...new Set([...existing.names, ...imported.names])];
      else edges.set(key, { from: entry.path, to: imported.target, names: [...imported.names] });
    }
  }
  return [...edges.values()];
}
