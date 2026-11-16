import { tsv } from './markdown.ts';
import type { MapView } from './map-view.ts';

/** `symbols.tsv`: one definition per row, for `grep -P '^Name\t'`. */
export function renderSymbolsTable(view: MapView): string {
  const rows = view.index.files.flatMap((entry) =>
    entry.symbols.map((symbol) => [
      symbol.name,
      symbol.kind,
      entry.path,
      symbol.line,
      symbol.endLine,
      symbol.container,
      symbol.exported ? 'exported' : 'private',
      symbol.extends?.join(', '),
    ]),
  );
  return tsv(['name', 'kind', 'path', 'line', 'end_line', 'container', 'visibility', 'extends'], rows);
}

/** `files.tsv`: every mapped file with its summary, for keyword search. */
export function renderFilesTable(view: MapView): string {
  const rows = view.index.files.map((entry) => [
    entry.path,
    entry.category,
    entry.fileType,
    entry.lines,
    view.areaOf(entry.path)?.page,
    view.describeFile(entry.path),
  ]);
  return tsv(['path', 'category', 'type', 'lines', 'area_page', 'summary'], rows);
}

/**
 * `edges.tsv`: imports between files (`file`), into package directories (`package`),
 * and of third-party packages (`external`).
 */
export function renderEdgesTable(view: MapView): string {
  const rows: Array<Array<string | number>> = [];
  for (const entry of view.index.files) {
    const externals = new Map<string, Set<string>>();
    for (const imported of entry.imports) {
      if (imported.external) {
        const names = externals.get(imported.external) ?? new Set<string>();
        imported.names.forEach((name) => names.add(name));
        externals.set(imported.external, names);
      }
    }
    for (const [name, names] of externals) rows.push([entry.path, name, 'external', [...names].join(', ')]);
  }
  for (const edge of view.graph.edges) {
    const kind = view.entries.has(edge.to) ? 'file' : 'package';
    rows.push([edge.from, edge.to, kind, edge.names.join(', ')]);
  }
  rows.sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1])));
  return tsv(['from', 'to', 'kind', 'names'], rows);
}
