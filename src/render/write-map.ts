import type { MapFolder } from '../map/map-folder.ts';
import { GENERATOR_NAME } from '../map/generator.ts';
import { SUMMARIES_FILE, type SummaryBook } from '../map/summaries.ts';
import type { MapIndex } from '../model.ts';
import { renderAreaPage } from './area-page.ts';
import { buildGraphData } from './graph-data.ts';
import { renderGraphPage } from './graph-page.ts';
import { renderMapPage } from './map-page.ts';
import { MapView } from './map-view.ts';
import { renderEdgesTable, renderFilesTable, renderSymbolsTable } from './tables.ts';
import { viewerScript } from './viewer-script.ts';

export const MAP_PAGE = 'MAP.md';
export const GRAPH_PAGE = 'graph.html';
const AREA_DIR = 'modules';

/** Renders every human/agent-facing map file. Returns the files whose content changed. */
export async function writeMapOutputs(folder: MapFolder, index: MapIndex, summaries: SummaryBook): Promise<string[]> {
  const view = new MapView(index, summaries, folder.config.areaFileLimit);
  const outputs = new Map<string, string>([
    [MAP_PAGE, renderMapPage(view, { mapDir: folder.relativeDir, generator: GENERATOR_NAME })],
    ['symbols.tsv', renderSymbolsTable(view)],
    ['files.tsv', renderFilesTable(view)],
    ['edges.tsv', renderEdgesTable(view)],
    [SUMMARIES_FILE, `${JSON.stringify(summaries.toJSON(), null, 2)}\n`],
    [GRAPH_PAGE, renderGraphPage(buildGraphData(view, folder.relativeDir), await viewerScript())],
  ]);
  for (const area of view.areas) outputs.set(`${AREA_DIR}/${area.page}`, renderAreaPage(view, area));

  const written = [...outputs].filter(([name, content]) => folder.writeIfChanged(name, content)).map(([name]) => name);
  const pages = new Set(view.areas.map((area) => area.page));
  const removed = folder.pruneDir(AREA_DIR, pages).map((page) => `${AREA_DIR}/${page} (removed)`);
  return [...written, ...removed];
}
