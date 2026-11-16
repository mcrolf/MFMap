import type { GraphData } from './graph-data.ts';

/** JSON safe to embed in a <script> element: no `<` can close the tag early. */
function embeddableJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]!);
}

/** Renders graph.html: a single offline file with the viewer script and map data inlined. */
export function renderGraphPage(data: GraphData, viewerScript: string): string {
  const title = `${escapeHtml(data.project)} · codebase graph`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="mfmap">
<title>${title}</title>
<style>${STYLES}</style>
</head>
<body>
<header class="bar">
  <div class="heading">
    <h1>${escapeHtml(data.project)}</h1>
    <span id="stats" class="stats"></span>
  </div>
  <div class="controls">
    <div class="search">
      <span class="search-field"><input id="search" type="search" placeholder="Search files, symbols, summaries" aria-label="Search the graph" autocomplete="off"><kbd>/</kbd></span>
      <span id="search-count" class="search-count" aria-live="polite"></span>
    </div>
    <div class="segmented" role="group" aria-label="Show">
      <button type="button" data-mode="files">Files</button>
      <button type="button" data-mode="folders">Folders</button>
    </div>
    <label id="depth-control" class="depth" hidden>Depth <input id="depth" type="range" min="1" max="6" step="1"> <span id="depth-value"></span></label>
    <label class="check"><input id="show-tests" type="checkbox"> Tests</label>
    <label class="check"><input id="show-packages" type="checkbox"> Packages</label>
    <label class="check"><input id="show-unconnected" type="checkbox"> Unconnected</label>
    <button type="button" id="view-toggle" class="ghost" aria-pressed="false">Table view</button>
    <button type="button" id="theme-toggle" class="ghost">Theme</button>
  </div>
</header>
<main class="layout">
  <div class="stage">
    <canvas id="graph" role="img" aria-label="Network graph of files and their imports. Use the table view for a keyboard-accessible list."></canvas>
    <div id="legend" class="legend"></div>
    <div id="tooltip" class="tooltip" hidden></div>
    <p class="hint">Scroll to zoom · drag to pan or move a node · click for details · double-click a folder to go deeper</p>
    <div id="table-view" class="table-view" hidden></div>
  </div>
  <aside id="panel" class="panel" hidden aria-live="polite"></aside>
</main>
<script type="application/json" id="map-data">${embeddableJson(data)}</script>
<script>${viewerScript.replace(/<\/script/gi, '<\\/script')}</script>
</body>
</html>
`;
}

const STYLES = `
:root {
  color-scheme: light;
  --surface-1: #fcfcfb;
  --page: #f9f9f7;
  --text-primary: #0b0b0b;
  --text-secondary: #52514e;
  --text-muted: #898781;
  --hairline: #e1e0d9;
  --edge: #c3c2b7;
  --ring: rgba(11, 11, 11, 0.10);
  --wash: rgba(11, 11, 11, 0.05);
  --series-1: #2a78d6; --series-2: #eb6834; --series-3: #1baf7a; --series-4: #eda100;
  --series-5: #e87ba4; --series-6: #008300; --series-7: #6250d6; --series-8: #a3a29d;
}
@media (prefers-color-scheme: dark) {
  :root:where(:not([data-theme="light"])) {
    color-scheme: dark;
    --surface-1: #1a1a19; --page: #0d0d0d; --text-primary: #f0efec; --text-secondary: #c3c2b7; --text-muted: #898781;
    --hairline: #2c2c2a; --edge: #605f58; --ring: rgba(255, 255, 255, 0.10); --wash: rgba(255, 255, 255, 0.06);
    --series-1: #3987e5; --series-2: #d95926; --series-3: #199e70; --series-4: #c98500;
    --series-5: #d55181; --series-6: #0ca30c; --series-7: #9085e9; --series-8: #6b6a65;
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --surface-1: #1a1a19; --page: #0d0d0d; --text-primary: #f0efec; --text-secondary: #c3c2b7; --text-muted: #898781;
  --hairline: #2c2c2a; --edge: #605f58; --ring: rgba(255, 255, 255, 0.10); --wash: rgba(255, 255, 255, 0.06);
  --series-1: #3987e5; --series-2: #d95926; --series-3: #199e70; --series-4: #c98500;
  --series-5: #d55181; --series-6: #0ca30c; --series-7: #9085e9; --series-8: #6b6a65;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body {
  display: flex; flex-direction: column; background: var(--page); color: var(--text-primary);
  font: 14px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif;
}
button, input { font: inherit; color: inherit; }
button { cursor: pointer; }
:focus-visible { outline: 2px solid var(--series-1); outline-offset: 2px; }
.bar {
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px 20px; padding: 10px 16px;
  background: var(--surface-1); border-bottom: 1px solid var(--hairline);
}
.heading { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
h1 { margin: 0; font-size: 16px; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stats { color: var(--text-secondary); font-size: 13px; white-space: nowrap; font-variant-numeric: tabular-nums; }
.controls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; flex: 1; justify-content: flex-end; }
.search { display: flex; align-items: center; gap: 8px; }
.search input {
  width: min(300px, 70vw); padding: 6px 30px 6px 10px; border: 1px solid var(--hairline); border-radius: 8px;
  background: var(--page);
}
.search-field { position: relative; display: inline-flex; }
.search kbd {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font: 11px ui-monospace, monospace; color: var(--text-muted);
  border: 1px solid var(--hairline); border-radius: 4px; padding: 0 5px;
}
.search-count { color: var(--text-secondary); font-size: 12px; min-width: 64px; }
.segmented { display: inline-flex; border: 1px solid var(--hairline); border-radius: 8px; overflow: hidden; }
.segmented button { border: 0; background: transparent; padding: 5px 12px; }
.segmented button + button { border-left: 1px solid var(--hairline); }
.segmented button[aria-pressed="true"] { background: var(--text-primary); color: var(--surface-1); }
.depth, .check { display: inline-flex; align-items: center; gap: 6px; color: var(--text-secondary); white-space: nowrap; }
.depth[hidden] { display: none; }
.depth input { width: 90px; accent-color: var(--text-primary); }
.check input { accent-color: var(--text-primary); }
.ghost { border: 1px solid var(--hairline); background: transparent; border-radius: 8px; padding: 5px 10px; }
.ghost:hover, .link:hover, .legend-item:hover { background: var(--wash); }
.layout { position: relative; flex: 1; display: flex; min-height: 0; }
.stage { position: relative; flex: 1; min-width: 0; background: var(--surface-1); }
canvas { display: block; width: 100%; height: 100%; cursor: grab; touch-action: none; }
.legend {
  position: absolute; left: 12px; top: 12px; display: flex; flex-direction: column; gap: 2px; max-width: 260px;
  padding: 8px; background: color-mix(in srgb, var(--surface-1) 92%, transparent); border: 1px solid var(--hairline); border-radius: 10px;
}
.legend-item {
  display: flex; align-items: center; gap: 8px; border: 0; background: transparent; padding: 3px 6px; border-radius: 6px;
  text-align: left; color: var(--text-primary);
}
.legend-item.active { background: var(--wash); font-weight: 600; }
.legend-item.static { cursor: default; }
.legend-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.legend-count { color: var(--text-secondary); font-variant-numeric: tabular-nums; font-size: 12px; }
.legend-key { color: var(--text-secondary); font-size: 12px; padding: 6px 6px 2px; border-top: 1px solid var(--hairline); margin-top: 4px; }
.swatch { width: 10px; height: 10px; border-radius: 50%; flex: none; box-shadow: 0 0 0 1px var(--ring); }
.swatch.hollow { background: transparent !important; box-shadow: inset 0 0 0 1.5px var(--text-muted); }
.tooltip {
  position: absolute; left: 0; top: 0; max-width: 340px; padding: 8px 10px; pointer-events: none; z-index: 3;
  background: var(--surface-1); border: 1px solid var(--hairline); border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,.12);
}
.tip-stats { font-weight: 650; font-variant-numeric: tabular-nums; }
.tip-name { color: var(--text-secondary); font-size: 12px; word-break: break-all; }
.tip-summary { margin-top: 4px; }
.hint { position: absolute; right: 12px; bottom: 8px; margin: 0; color: var(--text-muted); font-size: 12px; text-align: right; }
.table-view { position: absolute; inset: 0; overflow: auto; background: var(--surface-1); padding: 12px 16px; z-index: 2; }
.table-view[hidden] { display: none; }
table { border-collapse: collapse; width: 100%; font-size: 13px; }
th { text-align: left; position: sticky; top: 0; background: var(--surface-1); border-bottom: 1px solid var(--hairline); }
th .sort { border: 0; background: transparent; padding: 6px 8px; font-weight: 600; color: var(--text-secondary); }
td { padding: 4px 8px; border-bottom: 1px solid var(--hairline); }
td.num { text-align: right; font-variant-numeric: tabular-nums; }
.link {
  display: inline-flex; align-items: center; gap: 8px; border: 0; background: transparent; padding: 2px 4px; border-radius: 4px;
  text-align: left; word-break: break-all;
}
.panel {
  width: 360px; flex: none; overflow: auto; padding: 16px; background: var(--surface-1); border-left: 1px solid var(--hairline);
}
.panel[hidden] { display: none; }
.panel-close { float: right; border: 1px solid var(--hairline); background: transparent; border-radius: 6px; padding: 2px 8px; font-size: 12px; }
.panel-kind { color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
.panel-title { margin: 4px 0 8px; font-size: 15px; word-break: break-all; }
.panel-summary { margin: 0 0 6px; }
.panel-summary.empty { color: var(--text-muted); font-style: italic; }
.panel-stats { margin: 0 0 10px; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
.panel-actions { display: flex; gap: 12px; margin-bottom: 8px; }
.panel-actions a { color: var(--series-1); }
.panel h3 { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-secondary); margin: 16px 0 6px; }
.panel ul { list-style: none; margin: 0; padding: 0; }
.symbols li { display: flex; gap: 8px; padding: 2px 0; font-size: 13px; }
.symbol-kind { color: var(--text-muted); width: 64px; flex: none; }
.symbol-name { flex: 1; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; word-break: break-all; }
.symbol-line { color: var(--text-muted); font-variant-numeric: tabular-nums; }
.node-list li { font-size: 13px; }
.plain { color: var(--text-secondary); }
@media (max-width: 760px) {
  .controls { justify-content: flex-start; }
  .panel { position: absolute; inset: auto 0 0 0; width: auto; max-height: 55%; border-left: 0; border-top: 1px solid var(--hairline); z-index: 4; }
  .legend { max-width: 180px; font-size: 12px; }
  .hint { display: none; }
}
`;
