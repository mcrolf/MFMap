import { type Area, areaIndex, areaOfDir, planAreas } from '../map/areas.ts';
import { DependencyGraph, type Edge } from '../map/dependency-graph.ts';
import type { PendingSummaries, SummaryBook } from '../map/summaries.ts';
import type { FileEntry, MapIndex } from '../model.ts';

export interface AreaLink {
  area: Area;
  imports: number;
}

/** Read-only view of a map index with the derived facts the renderers share. */
export class MapView {
  readonly index: MapIndex;
  readonly summaries: SummaryBook;
  readonly graph: DependencyGraph;
  readonly areas: Area[];
  readonly entries: Map<string, FileEntry>;
  readonly pending: PendingSummaries;
  private readonly areaByFile: Map<string, Area>;
  private readonly areaByDir = new Map<string, Area | undefined>();

  constructor(index: MapIndex, summaries: SummaryBook, areaFileLimit: number) {
    this.index = index;
    this.summaries = summaries;
    this.graph = new DependencyGraph(index.files);
    this.areas = planAreas(index.files.map((f) => f.path), areaFileLimit);
    this.areaByFile = areaIndex(this.areas);
    this.entries = new Map(index.files.map((entry) => [entry.path, entry]));
    this.pending = summaries.pending();
  }

  /** The area owning a file, or for a package-level target directory, the area holding its files. */
  areaOf(path: string): Area | undefined {
    const byFile = this.areaByFile.get(path);
    if (byFile) return byFile;
    if (!this.areaByDir.has(path)) this.areaByDir.set(path, areaOfDir(path, this.areas));
    return this.areaByDir.get(path);
  }

  /** Summary text for display, marked when the file changed after it was written. */
  describeFile(path: string): string | undefined {
    const summary = this.summaries.fileSummary(path);
    return summary && (summary.stale ? `${summary.text} (summary may be outdated)` : summary.text);
  }

  describeDir(dir: string): string | undefined {
    const summary = this.summaries.dirSummary(dir);
    return summary && (summary.stale ? `${summary.text} (summary may be outdated)` : summary.text);
  }

  /** Areas this area imports from, most imports first. */
  areaDependencies(area: Area): AreaLink[] {
    return this.countAreas(
      this.graph.edges.filter((edge) => this.areaOf(edge.from) === area),
      (edge) => this.areaOf(edge.to),
      area,
    );
  }

  /** Areas that import from this area, most imports first. */
  areaDependents(area: Area): AreaLink[] {
    return this.countAreas(
      this.graph.edges.filter((edge) => this.areaOf(edge.to) === area),
      (edge) => this.areaOf(edge.from),
      area,
    );
  }

  private countAreas(edges: Edge[], pick: (edge: Edge) => Area | undefined, self: Area): AreaLink[] {
    const counts = new Map<Area, number>();
    for (const edge of edges) {
      const other = pick(edge);
      if (other && other !== self) counts.set(other, (counts.get(other) ?? 0) + 1);
    }
    return [...counts]
      .map(([area, imports]) => ({ area, imports }))
      .sort((a, b) => b.imports - a.imports || a.area.dir.localeCompare(b.area.dir));
  }
}
