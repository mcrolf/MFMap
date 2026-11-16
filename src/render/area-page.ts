import type { Area } from '../map/areas.ts';
import type { CodeSymbol, FileEntry } from '../model.ts';
import { isWithin } from '../paths.ts';
import { code, joinParts, plural } from './markdown.ts';
import type { AreaLink, MapView } from './map-view.ts';

const MAX_LISTED_IMPORTERS = 12;
const MAX_LISTED_MEMBERS = 40;

/** Renders `modules/<area>.md`: every file in the area with symbols and relationships. */
export function renderAreaPage(view: MapView, area: Area): string {
  const entries = area.files.map((path) => view.entries.get(path)!);
  const codeEntries = entries.filter((entry) => entry.language);
  const otherEntries = entries.filter((entry) => !entry.language);
  const title = area.dir === '' ? 'Project root' : `${area.dir}/`;

  const lines = [
    `# ${title}`,
    '',
    `Part of the [codebase map](../MAP.md). ${areaScope(view, area)}`,
    '',
  ];
  const summary = area.dir && view.describeDir(area.dir);
  if (summary) lines.push(summary, '');
  lines.push(...relationshipLines(view, area));

  for (const entry of codeEntries) lines.push(...fileSection(view, entry));
  if (otherEntries.length > 0) {
    lines.push('## Other files', '');
    for (const entry of otherEntries) lines.push(`- ${otherFileLine(view, entry)}`);
    lines.push('');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

function areaScope(view: MapView, area: Area): string {
  const nested = view.areas.filter((other) => other !== area && isWithin(other.dir, area.dir) && other.dir !== area.dir);
  const direct = nested.filter((other) => !nested.some((mid) => mid !== other && isWithin(other.dir, mid.dir)));
  const count = plural(area.files.length, 'file');
  if (direct.length === 0) return `${count}.`;
  const links = direct.map((other) => `[${other.dir}/](${other.page})`).join(', ');
  return `${count}. Subdirectories with their own pages: ${links}.`;
}

function relationshipLines(view: MapView, area: Area): string[] {
  const format = (links: AreaLink[]) =>
    links.slice(0, 10).map(({ area: other, imports }) => `[${other.dir || '(root)'}](${other.page}) (${imports})`).join(', ');
  const dependsOn = view.areaDependencies(area);
  const usedBy = view.areaDependents(area);
  const lines: string[] = [];
  if (dependsOn.length) lines.push(`- Depends on: ${format(dependsOn)}`);
  if (usedBy.length) lines.push(`- Used by: ${format(usedBy)}`);
  return lines.length ? [...lines, ''] : [];
}

function fileSection(view: MapView, entry: FileEntry): string[] {
  const header = joinParts([entry.fileType, plural(entry.lines, 'line'), entry.entryPoint ? 'entry point' : undefined]);
  const lines = [`## ${code(entry.path)}`, '', joinParts([header, view.describeFile(entry.path)])];
  if (entry.skipped) lines.push(`Not parsed: ${entry.skipped}.`);
  lines.push(...symbolLines(entry.symbols));
  lines.push(...importLines(entry));
  const importers = view.graph.importersOf(entry.path);
  if (importers.length > 0) {
    const shown = importers.slice(0, MAX_LISTED_IMPORTERS).map((edge) => code(edge.from)).join(', ');
    const more = importers.length > MAX_LISTED_IMPORTERS ? ` and ${importers.length - MAX_LISTED_IMPORTERS} more (see edges.tsv)` : '';
    lines.push(`Imported by: ${shown}${more}`);
  }
  lines.push('');
  return lines;
}

/**
 * Exported top-level symbols one per line, members folded onto one line under their container,
 * and non-exported top-level helpers folded onto one `Internal:` line.
 */
function symbolLines(symbols: CodeSymbol[]): string[] {
  const members = new Map<string, CodeSymbol[]>();
  const topLevel: CodeSymbol[] = [];
  for (const symbol of symbols) {
    if (symbol.container) members.set(symbol.container, [...(members.get(symbol.container) ?? []), symbol]);
    else topLevel.push(symbol);
  }
  const lines: string[] = [];
  const emit = (symbol: CodeSymbol, qualified: string, depth: number): void => {
    const indent = '  '.repeat(depth);
    const heritage = symbol.extends?.length ? ` : ${symbol.extends.join(', ')}` : '';
    lines.push(`${indent}- L${symbol.line} ${symbol.exported ? '' : 'private '}${symbol.kind} ${code(symbol.name)}${heritage}`);
    const children = members.get(qualified) ?? [];
    const containers = children.filter((child) => members.has(`${qualified}.${child.name}`));
    const leaves = children.filter((child) => !containers.includes(child));
    if (leaves.length > 0) {
      const shown = leaves.slice(0, MAX_LISTED_MEMBERS).map((leaf) => `${leaf.name} L${leaf.line}`).join(', ');
      const more = leaves.length > MAX_LISTED_MEMBERS ? `, and ${leaves.length - MAX_LISTED_MEMBERS} more in symbols.tsv` : '';
      lines.push(`${indent}  - ${shown}${more}`);
    }
    for (const child of containers) emit(child, `${qualified}.${child.name}`, depth + 1);
  };
  const internal = topLevel.filter((symbol) => !symbol.exported && !members.has(symbol.name));
  for (const symbol of topLevel) if (!internal.includes(symbol)) emit(symbol, symbol.name, 0);
  if (internal.length > 0) {
    lines.push(`- Internal: ${internal.map((symbol) => `${symbol.kind} ${symbol.name} L${symbol.line}`).join(', ')}`);
  }
  return lines;
}

function importLines(entry: FileEntry): string[] {
  const internal = new Map<string, Set<string>>();
  const external = new Set<string>();
  for (const imported of entry.imports) {
    if (imported.target) {
      const names = internal.get(imported.target) ?? new Set<string>();
      imported.names.filter((name) => name !== '*' && name !== 'default').forEach((name) => names.add(name));
      internal.set(imported.target, names);
    } else if (imported.external) {
      external.add(imported.external);
    }
  }
  const lines: string[] = [];
  if (internal.size > 0) {
    const list = [...internal].map(([target, names]) => (names.size ? `${code(target)} (${[...names].join(', ')})` : code(target)));
    lines.push(`Imports: ${list.join(', ')}`);
  }
  if (external.size > 0) lines.push(`Packages: ${[...external].sort().join(', ')}`);
  return lines;
}

function otherFileLine(view: MapView, entry: FileEntry): string {
  const size = entry.lines > 0 ? plural(entry.lines, 'line') : undefined;
  return joinParts([code(entry.path), entry.fileType ?? entry.category, size, view.describeFile(entry.path)]);
}
