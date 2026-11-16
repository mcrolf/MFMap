import { drag } from 'd3-drag';
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom';
import type { GraphData } from '../render/graph-data.ts';

/** Interactive network view of a codebase map. Runs in graph.html; data is embedded as JSON. */

type NodeKind = 'file' | 'folder' | 'package';

interface GraphNode extends SimulationNodeDatum {
  id: string;
  kind: NodeKind;
  label: string;
  path: string;
  group: number;
  radius: number;
  /** Indexes into data.files that this node stands for. */
  files: number[];
  lines: number;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: GraphNode;
  target: GraphNode;
  weight: number;
}

interface ViewState {
  mode: 'files' | 'folders';
  depth: number;
  tests: boolean;
  packages: boolean;
  unconnected: boolean;
  query: string;
  isolatedGroup: number | undefined;
  selected: GraphNode | undefined;
  hovered: GraphNode | undefined;
}

const FILE_MODE_LIMIT = 1500;
const HIT_RADIUS_PX = 12;
const OTHER_GROUP_SLOT = 7;

const data = JSON.parse(document.getElementById('map-data')!.textContent!) as GraphData;
const canvas = document.querySelector<HTMLCanvasElement>('#graph')!;
const context = canvas.getContext('2d')!;
const tooltip = document.querySelector<HTMLElement>('#tooltip')!;
const panel = document.querySelector<HTMLElement>('#panel')!;
const tableView = document.querySelector<HTMLElement>('#table-view')!;
const searchInput = document.querySelector<HTMLInputElement>('#search')!;
const searchCount = document.querySelector<HTMLElement>('#search-count')!;
const depthInput = document.querySelector<HTMLInputElement>('#depth')!;

const codeFileCount = data.files.filter((file) => file.category !== 'test').length;
const maxDepth = Math.max(1, ...data.files.map((file) => relativeDir(file.path).split('/').filter(Boolean).length));
const state: ViewState = {
  mode: codeFileCount > FILE_MODE_LIMIT ? 'folders' : 'files',
  depth: Math.min(2, maxDepth),
  tests: false,
  packages: false,
  unconnected: false,
  query: '',
  isolatedGroup: undefined,
  selected: undefined,
  hovered: undefined,
};

let nodes: GraphNode[] = [];
let links: GraphLink[] = [];
let outgoing = new Map<GraphNode, GraphLink[]>();
let incoming = new Map<GraphNode, GraphLink[]>();
let matches = new Set<GraphNode>();
let transform: ZoomTransform = zoomIdentity;
let colors = readColors();
const simulation: Simulation<GraphNode, GraphLink> = forceSimulation<GraphNode, GraphLink>().on('tick', draw);

// ---------------------------------------------------------------- graph building

function relativeDir(path: string): string {
  const dir = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
  if (!data.prefix) return dir;
  return dir === data.prefix ? '' : dir.startsWith(`${data.prefix}/`) ? dir.slice(data.prefix.length + 1) : dir;
}

function folderKey(path: string): string {
  const parts = relativeDir(path).split('/').filter(Boolean).slice(0, state.depth);
  const base = parts.join('/');
  if (!data.prefix) return base;
  return base ? `${data.prefix}/${base}` : data.prefix;
}

function isVisibleFile(index: number): boolean {
  return state.tests || data.files[index].category !== 'test';
}

function rebuild(): void {
  const previous = new Map(nodes.map((node) => [node.id, node]));
  const built = state.mode === 'files' ? buildFileGraph() : buildFolderGraph();
  if (state.packages) addPackages(built);

  const linked = new Set(built.links.flatMap((link) => [link.source, link.target]));
  nodes = state.unconnected ? built.nodes : built.nodes.filter((node) => linked.has(node));
  const kept = new Set(nodes);
  links = built.links.filter((link) => kept.has(link.source) && kept.has(link.target));
  for (const node of nodes) {
    const old = previous.get(node.id);
    if (old) Object.assign(node, { x: old.x, y: old.y, vx: old.vx, vy: old.vy });
  }
  outgoing = groupLinks(links, (link) => link.source);
  incoming = groupLinks(links, (link) => link.target);
  if (state.selected) state.selected = nodes.find((node) => node.id === state.selected!.id);
  state.hovered = undefined;
  updateMatches();
  configureForces();
  renderLegend();
  renderStats();
  if (!tableView.hidden) renderTable();
  if (state.selected) renderPanel(state.selected);
  else panel.hidden = true;
}

function buildFileGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const byIndex = new Map<number, GraphNode>();
  data.files.forEach((file, i) => {
    if (!isVisibleFile(i)) return;
    byIndex.set(i, {
      id: `f:${file.path}`,
      kind: 'file',
      label: file.path.slice(file.path.lastIndexOf('/') + 1),
      path: file.path,
      group: file.group,
      radius: 3 + Math.sqrt(Math.max(file.lines, 1)) / 3,
      files: [i],
      lines: file.lines,
    });
  });
  const graphLinks: GraphLink[] = [];
  for (const [from, to] of data.links) {
    const source = byIndex.get(from);
    const target = byIndex.get(to);
    if (source && target) graphLinks.push({ source, target, weight: 1 });
  }
  return { nodes: [...byIndex.values()], links: graphLinks };
}

function buildFolderGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const byKey = new Map<string, GraphNode>();
  const nodeOfFile = new Map<number, GraphNode>();
  data.files.forEach((file, i) => {
    if (!isVisibleFile(i)) return;
    const key = folderKey(file.path);
    let node = byKey.get(key);
    if (!node) {
      const label = key === data.prefix ? data.prefix || '(root)' : key.slice(data.prefix ? data.prefix.length + 1 : 0);
      node = { id: `d:${key}`, kind: 'folder', label: `${label}/`, path: key, group: file.group, radius: 0, files: [], lines: 0 };
      byKey.set(key, node);
    }
    node.files.push(i);
    node.lines += file.lines;
    nodeOfFile.set(i, node);
  });
  for (const node of byKey.values()) node.radius = 5 + Math.sqrt(node.files.length) * 2.4;

  const weights = new Map<string, GraphLink>();
  for (const [from, to] of data.links) {
    const source = nodeOfFile.get(from);
    const target = nodeOfFile.get(to);
    if (!source || !target || source === target) continue;
    const key = `${source.id}\u0000${target.id}`;
    const existing = weights.get(key);
    if (existing) existing.weight++;
    else weights.set(key, { source, target, weight: 1 });
  }
  return { nodes: [...byKey.values()], links: [...weights.values()] };
}

function addPackages(graph: { nodes: GraphNode[]; links: GraphLink[] }): void {
  const ownerOf = new Map<number, GraphNode>();
  for (const node of graph.nodes) for (const i of node.files) ownerOf.set(i, node);
  for (const pkg of data.externals) {
    const users = [...new Set(pkg.files.map((i) => ownerOf.get(i)).filter((n): n is GraphNode => n !== undefined))];
    if (users.length === 0) continue;
    const node: GraphNode = {
      id: `p:${pkg.name}`, kind: 'package', label: pkg.name, path: pkg.name, group: -1,
      radius: 4 + Math.sqrt(users.length) * 1.6, files: [], lines: 0,
    };
    graph.nodes.push(node);
    for (const user of users) graph.links.push({ source: user, target: node, weight: 1 });
  }
}

function groupLinks(all: GraphLink[], key: (link: GraphLink) => GraphNode): Map<GraphNode, GraphLink[]> {
  const grouped = new Map<GraphNode, GraphLink[]>();
  for (const link of all) {
    const node = key(link);
    grouped.set(node, [...(grouped.get(node) ?? []), link]);
  }
  return grouped;
}

// ---------------------------------------------------------------- layout

/** Each group is pulled toward its own anchor on a circle, so areas form separate, labelable clusters. */
function configureForces(): void {
  const groupCount = Math.max(1, Math.min(data.groups.length, OTHER_GROUP_SLOT + 1));
  const spread = 110 + Math.sqrt(nodes.length) * 16;
  const anchor = (node: GraphNode): [number, number] => {
    if (node.group < 0) return [0, 0];
    const slot = Math.min(node.group, groupCount - 1);
    const angle = (slot / groupCount) * Math.PI * 2 - Math.PI / 2;
    return groupCount === 1 ? [0, 0] : [Math.cos(angle) * spread, Math.sin(angle) * spread];
  };
  simulation
    .nodes(nodes)
    .force('link', forceLink<GraphNode, GraphLink>(links).distance((l) => 24 + l.source.radius + l.target.radius).strength((l) => Math.min(0.5, 0.06 * l.weight + 0.03) * (l.source.group === l.target.group ? 1 : 0.35)))
    .force('charge', forceManyBody<GraphNode>().strength((n) => -18 - n.radius * 4).distanceMax(400))
    .force('collide', forceCollide<GraphNode>((n) => n.radius + 2))
    .force('x', forceX<GraphNode>((n) => anchor(n)[0]).strength(0.14))
    .force('y', forceY<GraphNode>((n) => anchor(n)[1]).strength(0.14))
    .stop();
  // Settle most of the layout before drawing, then fit it, so the view opens calm and fully visible.
  simulation.alpha(1);
  simulation.tick(Math.min(300, 60 + Math.round(30000 / Math.max(nodes.length, 100))));
  fitToView();
  simulation.alpha(0.08).restart();
}

function fitToView(): void {
  if (nodes.length === 0 || canvas.clientWidth === 0) return;
  const xs = nodes.map((n) => n.x!);
  const ys = nodes.map((n) => n.y!);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const margin = 48;
  const scale = Math.min(2, (canvas.clientWidth - margin * 2) / Math.max(maxX - minX, 1), (canvas.clientHeight - margin * 2) / Math.max(maxY - minY, 1));
  const next = zoomIdentity
    .translate(canvas.clientWidth / 2 - ((minX + maxX) / 2) * scale, canvas.clientHeight / 2 - ((minY + maxY) / 2) * scale)
    .scale(scale);
  select(canvas).call(zoomBehavior.transform, next);
}

// ---------------------------------------------------------------- drawing

function readColors() {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string) => style.getPropertyValue(name).trim();
  return {
    surface: token('--surface-1'),
    ink: token('--text-primary'),
    secondary: token('--text-secondary'),
    muted: token('--text-muted'),
    edge: token('--edge'),
    series: Array.from({ length: OTHER_GROUP_SLOT + 1 }, (_, i) => token(`--series-${i + 1}`)),
  };
}

function colorOf(group: number): string {
  if (group < 0) return colors.surface;
  return colors.series[Math.min(group, OTHER_GROUP_SLOT)];
}

/** The node whose neighbourhood is emphasised: hover wins over selection. */
function focusNode(): GraphNode | undefined {
  return state.hovered ?? state.selected;
}

function isDimmed(node: GraphNode, neighbours: Set<GraphNode> | undefined): boolean {
  if (neighbours) return !neighbours.has(node);
  if (state.query) return !matches.has(node);
  if (state.isolatedGroup !== undefined) return node.group !== state.isolatedGroup;
  return false;
}

function neighbourhood(node: GraphNode | undefined): Set<GraphNode> | undefined {
  if (!node) return undefined;
  const set = new Set<GraphNode>([node]);
  for (const link of outgoing.get(node) ?? []) set.add(link.target);
  for (const link of incoming.get(node) ?? []) set.add(link.source);
  return set;
}

function draw(): void {
  const ratio = window.devicePixelRatio || 1;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  context.translate(transform.x, transform.y);
  context.scale(transform.k, transform.k);

  const focus = focusNode();
  const neighbours = neighbourhood(focus);
  drawLinks(focus, neighbours);
  drawNodes(neighbours, focus);
  drawGroupLabels(neighbours);
  drawNodeLabels(neighbours, focus);
}

function drawLinks(focus: GraphNode | undefined, neighbours: Set<GraphNode> | undefined): void {
  context.lineWidth = 1 / transform.k;
  context.strokeStyle = colors.edge;
  const density = links.length > 800 ? 0.35 : links.length > 300 ? 0.5 : 0.7;
  context.globalAlpha = neighbours || state.query ? 0.2 : density;
  context.beginPath();
  for (const link of links) {
    if (focus && (link.source === focus || link.target === focus)) continue;
    context.moveTo(link.source.x!, link.source.y!);
    context.lineTo(link.target.x!, link.target.y!);
  }
  context.stroke();
  context.globalAlpha = 1;
  if (!focus) return;
  // Imports of the focused node in primary ink, importers in secondary ink; arrows point at the imported side.
  for (const link of outgoing.get(focus) ?? []) drawArrow(link, colors.ink, 1.6);
  for (const link of incoming.get(focus) ?? []) drawArrow(link, colors.secondary, 1.2);
}

function drawArrow(link: GraphLink, color: string, width: number): void {
  const { source, target } = link;
  const dx = target.x! - source.x!;
  const dy = target.y! - source.y!;
  const length = Math.hypot(dx, dy) || 1;
  const endX = target.x! - (dx / length) * (target.radius + 2);
  const endY = target.y! - (dy / length) * (target.radius + 2);
  const head = 6 / Math.sqrt(transform.k);
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = width / transform.k;
  context.beginPath();
  context.moveTo(source.x!, source.y!);
  context.lineTo(endX, endY);
  context.stroke();
  const angle = Math.atan2(dy, dx);
  context.beginPath();
  context.moveTo(endX, endY);
  context.lineTo(endX - head * Math.cos(angle - 0.45), endY - head * Math.sin(angle - 0.45));
  context.lineTo(endX - head * Math.cos(angle + 0.45), endY - head * Math.sin(angle + 0.45));
  context.closePath();
  context.fill();
}

function drawNodes(neighbours: Set<GraphNode> | undefined, focus: GraphNode | undefined): void {
  for (const node of nodes) {
    context.globalAlpha = isDimmed(node, neighbours) ? 0.14 : 1;
    context.beginPath();
    context.arc(node.x!, node.y!, node.radius, 0, Math.PI * 2);
    context.fillStyle = colorOf(node.group);
    context.fill();
    // Surface ring separates overlapping marks; packages are hollow so they read as outside the codebase.
    context.lineWidth = (node.kind === 'package' ? 1.5 : 2) / transform.k;
    context.strokeStyle = node.kind === 'package' ? colors.muted : colors.surface;
    context.stroke();
    const isEntry = node.kind === 'file' && data.files[node.files[0]].entry;
    if (isEntry || node === focus || node === state.selected) {
      context.beginPath();
      context.arc(node.x!, node.y!, node.radius + 3 / transform.k, 0, Math.PI * 2);
      context.lineWidth = 1.5 / transform.k;
      context.strokeStyle = colors.ink;
      context.stroke();
    }
  }
  context.globalAlpha = 1;
}

/** Direct labels at each cluster's centre carry group identity alongside color. */
function drawGroupLabels(neighbours: Set<GraphNode> | undefined): void {
  if (neighbours || data.groups.length < 2 || nodes.length < 40) return;
  const sums = new Map<number, { x: number; y: number; count: number }>();
  for (const node of nodes) {
    if (node.group < 0) continue;
    const slot = Math.min(node.group, OTHER_GROUP_SLOT);
    const sum = sums.get(slot) ?? { x: 0, y: 0, count: 0 };
    sum.x += node.x!;
    sum.y += node.y!;
    sum.count++;
    sums.set(slot, sum);
  }
  context.font = `600 ${13 / transform.k}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (const [slot, sum] of sums) {
    if (sum.count < 2) continue;
    const name = slot === OTHER_GROUP_SLOT && data.groups.length > OTHER_GROUP_SLOT + 1 ? 'other' : data.groups[slot];
    haloText(name, sum.x / sum.count, sum.y / sum.count, colors.ink);
  }
}

function drawNodeLabels(neighbours: Set<GraphNode> | undefined, focus: GraphNode | undefined): void {
  context.font = `${11 / transform.k}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  const showAll = transform.k > 2.2 || nodes.length < 40;
  for (const node of nodes) {
    const wanted = neighbours ? neighbours.has(node) : showAll || (state.query !== '' && matches.has(node)) || node.radius * transform.k > 14;
    if (!wanted || (neighbours && neighbours.size > 60 && node !== focus)) continue;
    haloText(node.label, node.x! + node.radius + 3 / transform.k, node.y!, node === focus ? colors.ink : colors.secondary);
  }
}

function haloText(text: string, x: number, y: number, color: string): void {
  context.lineWidth = 3 / transform.k;
  context.strokeStyle = colors.surface;
  context.strokeText(text, x, y);
  context.fillStyle = color;
  context.fillText(text, x, y);
}

// ---------------------------------------------------------------- interaction

function nodeAt(clientX: number, clientY: number): GraphNode | undefined {
  const rect = canvas.getBoundingClientRect();
  const [x, y] = transform.invert([clientX - rect.left, clientY - rect.top]);
  let best: GraphNode | undefined;
  let bestDistance = Infinity;
  for (const node of nodes) {
    const distance = Math.hypot(node.x! - x, node.y! - y) - node.radius;
    if (distance < bestDistance) {
      best = node;
      bestDistance = distance;
    }
  }
  return bestDistance * transform.k <= HIT_RADIUS_PX ? best : undefined;
}

function resize(): void {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  draw();
}

const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
  .scaleExtent([0.08, 8])
  .on('zoom', (event: { transform: ZoomTransform }) => {
    transform = event.transform;
    draw();
  });

const dragBehavior = drag<HTMLCanvasElement, unknown, GraphNode | undefined>()
  .subject((event: { sourceEvent: PointerEvent }) => nodeAt(event.sourceEvent.clientX, event.sourceEvent.clientY))
  .on('start', (event: { active: number; subject: GraphNode }) => {
    if (!event.active) simulation.alphaTarget(0.25).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  })
  .on('drag', (event: { subject: GraphNode; sourceEvent: PointerEvent }) => {
    const rect = canvas.getBoundingClientRect();
    const [x, y] = transform.invert([event.sourceEvent.clientX - rect.left, event.sourceEvent.clientY - rect.top]);
    event.subject.fx = x;
    event.subject.fy = y;
  })
  .on('end', (event: { active: number; subject: GraphNode }) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = undefined;
    event.subject.fy = undefined;
  });

function centerOn(node: GraphNode): void {
  const scale = Math.max(transform.k, 1.4);
  const next = zoomIdentity.translate(canvas.clientWidth / 2 - node.x! * scale, canvas.clientHeight / 2 - node.y! * scale).scale(scale);
  select(canvas).call(zoomBehavior.transform, next);
}

function selectNode(node: GraphNode | undefined, recenter = false): void {
  state.selected = node;
  if (node) {
    renderPanel(node);
    if (recenter) centerOn(node);
  } else {
    panel.hidden = true;
  }
  draw();
}

function showTooltip(node: GraphNode, clientX: number, clientY: number): void {
  tooltip.replaceChildren();
  const stats = el('div', 'tip-stats', statsLine(node));
  const name = el('div', 'tip-name', node.kind === 'folder' ? node.label : node.path);
  tooltip.append(stats, name);
  const summary = summaryOf(node);
  if (summary) tooltip.append(el('div', 'tip-summary', summary));
  tooltip.hidden = false;
  const stage = canvas.getBoundingClientRect();
  const left = Math.min(clientX - stage.left + 14, stage.width - tooltip.offsetWidth - 8);
  const top = clientY - stage.top + 14 + tooltip.offsetHeight > stage.height ? clientY - stage.top - tooltip.offsetHeight - 10 : clientY - stage.top + 14;
  tooltip.style.transform = `translate(${Math.max(8, left)}px, ${Math.max(8, top)}px)`;
}

function statsLine(node: GraphNode): string {
  const imports = outgoing.get(node)?.length ?? 0;
  const importers = incoming.get(node)?.length ?? 0;
  if (node.kind === 'package') return `external package · used by ${importers}`;
  const size = node.kind === 'folder' ? plural(node.files.length, 'file') : plural(node.lines, 'line');
  return `${size} · imports ${imports} · imported by ${importers}`;
}

function summaryOf(node: GraphNode): string | undefined {
  if (node.kind === 'file') return data.files[node.files[0]].summary;
  if (node.kind === 'folder') return data.dirSummaries[node.path];
  return undefined;
}

// ---------------------------------------------------------------- panel, legend, table

function renderPanel(node: GraphNode): void {
  panel.replaceChildren();
  const close = el('button', 'panel-close', 'Close');
  close.setAttribute('aria-label', 'Close details');
  close.addEventListener('click', () => selectNode(undefined));
  panel.append(close, el('div', 'panel-kind', node.kind === 'package' ? 'External package' : node.kind === 'folder' ? 'Folder' : data.files[node.files[0]].type));
  panel.append(el('h2', 'panel-title', node.kind === 'file' ? node.path : node.label));
  const summary = summaryOf(node);
  panel.append(el('p', summary ? 'panel-summary' : 'panel-summary empty', summary ?? 'No summary yet. Run "mfmap summaries pending" to add one.'));
  panel.append(el('p', 'panel-stats', statsLine(node)));

  if (node.kind === 'file') renderFileDetails(node);
  if (node.kind === 'folder') {
    panel.append(nodeList('Files', node.files.map((i) => fileNodeFor(i) ?? textItem(data.files[i].path))));
  }
  if (node.kind === 'package') {
    panel.append(nodeList('Used by', (incoming.get(node) ?? []).map((l) => l.source)));
  } else {
    panel.append(nodeList('Imports', (outgoing.get(node) ?? []).map((l) => l.target)));
    panel.append(nodeList('Imported by', (incoming.get(node) ?? []).map((l) => l.source)));
  }
  panel.hidden = false;
}

function renderFileDetails(node: GraphNode): void {
  const file = data.files[node.files[0]];
  const actions = el('div', 'panel-actions');
  const page = document.createElement('a');
  page.href = `modules/${file.page}`;
  page.textContent = 'Area page';
  actions.append(page);
  const root = projectRootUrl();
  if (root) {
    const editor = document.createElement('a');
    editor.href = `vscode://file${root}/${file.path}`;
    editor.textContent = 'Open in VS Code';
    actions.append(editor);
  }
  panel.append(actions);
  if (file.symbols.length > 0) {
    const list = el('ul', 'symbols');
    for (const symbol of file.symbols) {
      const [kind, name, line] = symbol.split(' ');
      const item = el('li');
      item.append(el('span', 'symbol-kind', kind), el('span', 'symbol-name', name), el('span', 'symbol-line', `L${line}`));
      list.append(item);
    }
    const more = file.symbolCount > file.symbols.length ? ` (${file.symbols.length} of ${file.symbolCount})` : '';
    panel.append(el('h3', '', `Symbols${more}`), list);
  }
}

/** The project directory on disk when graph.html is opened from the file system. */
function projectRootUrl(): string | undefined {
  if (location.protocol !== 'file:') return undefined;
  const pageDir = decodeURIComponent(location.pathname.slice(0, location.pathname.lastIndexOf('/')));
  const depth = data.mapDir ? data.mapDir.split('/').length : 0;
  const parts = pageDir.split('/');
  return parts.slice(0, parts.length - depth).join('/');
}

function fileNodeFor(index: number): GraphNode | undefined {
  return nodes.find((node) => node.kind === 'file' && node.files[0] === index);
}

function textItem(text: string): HTMLElement {
  return el('span', 'plain', text);
}

function nodeList(title: string, items: Array<GraphNode | HTMLElement>): HTMLElement {
  const section = el('section');
  if (items.length === 0) return section;
  section.append(el('h3', '', `${title} (${items.length})`));
  const list = el('ul', 'node-list');
  for (const item of items.slice(0, 200)) {
    const row = el('li');
    if (item instanceof HTMLElement) {
      row.append(item);
    } else {
      const button = el('button', 'link', item.kind === 'file' ? item.path : item.label);
      const swatch = el('span', 'swatch');
      swatch.style.background = colorOf(item.group);
      if (item.kind === 'package') swatch.classList.add('hollow');
      button.prepend(swatch);
      button.addEventListener('click', () => selectNode(item, true));
      row.append(button);
    }
    list.append(row);
  }
  section.append(list);
  return section;
}

function renderLegend(): void {
  const legend = document.querySelector<HTMLElement>('#legend')!;
  legend.replaceChildren();
  const counts = new Map<number, number>();
  for (const node of nodes) if (node.group >= 0) counts.set(Math.min(node.group, OTHER_GROUP_SLOT), (counts.get(Math.min(node.group, OTHER_GROUP_SLOT)) ?? 0) + 1);
  const slots = [...counts.keys()].sort((a, b) => a - b);
  for (const slot of slots) {
    const name = slot === OTHER_GROUP_SLOT && data.groups.length > OTHER_GROUP_SLOT + 1 ? `other (${data.groups.length - OTHER_GROUP_SLOT} areas)` : data.groups[slot];
    const button = el('button', state.isolatedGroup === slot ? 'legend-item active' : 'legend-item');
    button.setAttribute('aria-pressed', String(state.isolatedGroup === slot));
    const swatch = el('span', 'swatch');
    swatch.style.background = colorOf(slot);
    button.append(swatch, el('span', 'legend-name', name), el('span', 'legend-count', String(counts.get(slot))));
    button.addEventListener('click', () => {
      state.isolatedGroup = state.isolatedGroup === slot ? undefined : slot;
      renderLegend();
      draw();
    });
    legend.append(button);
  }
  if (state.packages) {
    const item = el('div', 'legend-item static');
    const swatch = el('span', 'swatch hollow');
    item.append(swatch, el('span', 'legend-name', 'external package'));
    legend.append(item);
  }
  const key = el('div', 'legend-key', 'Hover or select a node: bold arrows point to what it imports, lighter arrows come from its importers.');
  legend.append(key);
}

function renderStats(): void {
  const unit = state.mode === 'files' ? 'files' : 'folders';
  document.querySelector('#stats')!.textContent = `${nodes.length} ${unit} · ${links.length} links`;
}

let tableSort: { key: 'name' | 'group' | 'size' | 'imports' | 'importers'; descending: boolean } = { key: 'importers', descending: true };

function renderTable(): void {
  const rows = nodes.map((node) => ({
    node,
    name: node.kind === 'file' ? node.path : node.label,
    group: node.group < 0 ? 'external' : data.groups[node.group],
    size: node.kind === 'folder' ? node.files.length : node.lines,
    imports: outgoing.get(node)?.length ?? 0,
    importers: incoming.get(node)?.length ?? 0,
  }));
  const { key, descending } = tableSort;
  rows.sort((a, b) => {
    const order = typeof a[key] === 'number' ? (a[key] as number) - (b[key] as number) : String(a[key]).localeCompare(String(b[key]));
    return descending ? -order : order;
  });
  const table = el('table');
  const head = el('tr');
  const columns: Array<[typeof tableSort.key, string]> = [
    ['name', state.mode === 'files' ? 'File' : 'Folder'], ['group', 'Area'],
    ['size', state.mode === 'files' ? 'Lines' : 'Files'], ['imports', 'Imports'], ['importers', 'Imported by'],
  ];
  for (const [column, label] of columns) {
    const th = el('th');
    const button = el('button', 'sort', label + (key === column ? (descending ? ' ↓' : ' ↑') : ''));
    th.setAttribute('aria-sort', key === column ? (descending ? 'descending' : 'ascending') : 'none');
    button.addEventListener('click', () => {
      tableSort = { key: column, descending: key === column ? !descending : column !== 'name' && column !== 'group' };
      renderTable();
    });
    th.append(button);
    head.append(th);
  }
  table.append(el('thead'), el('tbody'));
  table.tHead!.append(head);
  for (const row of rows.slice(0, 2000)) {
    const tr = el('tr');
    const nameCell = el('td');
    const button = el('button', 'link', row.name);
    button.addEventListener('click', () => selectNode(row.node));
    nameCell.append(button);
    tr.append(nameCell, el('td', '', row.group), el('td', 'num', String(row.size)), el('td', 'num', String(row.imports)), el('td', 'num', String(row.importers)));
    table.tBodies[0].append(tr);
  }
  tableView.replaceChildren(table);
}

// ---------------------------------------------------------------- search

function updateMatches(): void {
  const query = state.query.trim().toLowerCase();
  matches = new Set();
  if (query) {
    for (const node of nodes) {
      const haystack = [node.path, summaryOf(node) ?? '', ...node.files.flatMap((i) => data.files[i].symbols.map((s) => s.split(' ')[1]))]
        .join('\n')
        .toLowerCase();
      if (haystack.includes(query)) matches.add(node);
    }
  }
  searchCount.textContent = query ? `${matches.size} match${matches.size === 1 ? '' : 'es'}` : '';
}

// ---------------------------------------------------------------- helpers

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

// ---------------------------------------------------------------- wiring

function setMode(mode: ViewState['mode']): void {
  state.mode = mode;
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-mode]')) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  }
  document.querySelector<HTMLElement>('#depth-control')!.hidden = mode !== 'folders';
  rebuild();
}

function bindControls(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-mode]')) {
    button.addEventListener('click', () => setMode(button.dataset.mode as ViewState['mode']));
  }
  depthInput.max = String(maxDepth);
  depthInput.value = String(state.depth);
  document.querySelector('#depth-value')!.textContent = String(state.depth);
  depthInput.addEventListener('input', () => {
    state.depth = Number(depthInput.value);
    document.querySelector('#depth-value')!.textContent = depthInput.value;
    rebuild();
  });
  const toggles: Array<[string, 'tests' | 'packages' | 'unconnected']> = [['#show-tests', 'tests'], ['#show-packages', 'packages'], ['#show-unconnected', 'unconnected']];
  for (const [selector, key] of toggles) {
    const input = document.querySelector<HTMLInputElement>(selector)!;
    input.checked = state[key];
    input.addEventListener('change', () => {
      state[key] = input.checked;
      rebuild();
    });
  }
  searchInput.addEventListener('input', () => {
    state.query = searchInput.value;
    updateMatches();
    draw();
  });
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && matches.size > 0) selectNode([...matches][0], true);
  });
  document.querySelector('#view-toggle')!.addEventListener('click', (event) => {
    const button = event.currentTarget as HTMLButtonElement;
    tableView.hidden = !tableView.hidden;
    button.textContent = tableView.hidden ? 'Table view' : 'Graph view';
    button.setAttribute('aria-pressed', String(!tableView.hidden));
    if (!tableView.hidden) renderTable();
  });
  document.querySelector('#theme-toggle')!.addEventListener('click', cycleTheme);
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput.focus();
    } else if (event.key === 'Escape') {
      searchInput.value = '';
      state.query = '';
      updateMatches();
      selectNode(undefined);
    }
  });

  select(canvas).call(dragBehavior).call(zoomBehavior).on('dblclick.zoom', null);
  canvas.addEventListener('pointermove', (event) => {
    const node = nodeAt(event.clientX, event.clientY);
    if (node !== state.hovered) {
      state.hovered = node;
      canvas.style.cursor = node ? 'pointer' : 'grab';
      draw();
    }
    if (node) showTooltip(node, event.clientX, event.clientY);
    else tooltip.hidden = true;
  });
  canvas.addEventListener('pointerleave', () => {
    state.hovered = undefined;
    tooltip.hidden = true;
    draw();
  });
  canvas.addEventListener('click', (event) => selectNode(nodeAt(event.clientX, event.clientY)));
  canvas.addEventListener('dblclick', (event) => {
    const node = nodeAt(event.clientX, event.clientY);
    if (node?.kind === 'folder' && state.depth < maxDepth) {
      depthInput.value = String(state.depth + 1);
      depthInput.dispatchEvent(new Event('input'));
    }
  });
  new ResizeObserver(resize).observe(canvas);
}

const THEMES = ['system', 'light', 'dark'] as const;

function cycleTheme(): void {
  const current = document.documentElement.dataset.theme ?? 'system';
  const next = THEMES[(THEMES.indexOf(current as (typeof THEMES)[number]) + 1) % THEMES.length];
  applyTheme(next);
  try {
    localStorage.setItem('mfmap-theme', next);
  } catch {
    // Storage can be unavailable for file:// pages; the theme still applies for this visit.
  }
}

function applyTheme(theme: string): void {
  if (theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  document.querySelector('#theme-toggle')!.textContent = `Theme: ${theme}`;
  colors = readColors();
  if (state.selected) renderPanel(state.selected);
  renderLegend();
  draw();
}

function start(): void {
  let saved = 'system';
  try {
    saved = localStorage.getItem('mfmap-theme') ?? 'system';
  } catch {
    // See cycleTheme.
  }
  bindControls();
  applyTheme(saved);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(document.documentElement.dataset.theme ?? 'system'));
  setMode(state.mode);
}

start();
