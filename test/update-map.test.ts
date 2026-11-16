import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { installHooks, uninstallHooks } from '../src/hooks.ts';
import { writeInstructionPointers } from '../src/instruction-pointer.ts';
import { MapFolder } from '../src/map/map-folder.ts';
import { SummaryBook } from '../src/map/summaries.ts';
import { updateMap } from '../src/map/update-map.ts';
import type { MapIndex, Summaries } from '../src/model.ts';
import { writeMapOutputs } from '../src/render/write-map.ts';

let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'mfmap-test-'));
  writeProject({
    'package.json': '{ "name": "shop", "dependencies": { "express": "^4.0.0" } }',
    'src/server.ts': "import express from 'express';\nimport { cartTotal } from './cart';\nexport const app = express();\n",
    'src/cart.ts': 'export function cartTotal(items: number[]): number { return items.reduce((a, b) => a + b, 0); }\n',
    'README.md': '# Shop\n',
  });
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

function writeProject(files: Record<string, string>): void {
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
}

const read = (folder: MapFolder, name: string) => readFileSync(folder.path(name), 'utf8');

test('a new map lists files, symbols, resolved imports, importers, and declared packages', async () => {
  const folder = MapFolder.create(join(root, 'codebase-map'), root);
  const report = await updateMap(folder);

  assert.equal(report.fileCount, 4);
  assert.deepEqual(report.added.sort(), ['README.md', 'package.json', 'src/cart.ts', 'src/server.ts']);
  assert.match(read(folder, 'symbols.tsv'), /^cartTotal\tfunction\tsrc\/cart\.ts\t1\t/m);
  assert.match(read(folder, 'edges.tsv'), /^src\/server\.ts\tsrc\/cart\.ts\tfile\tcartTotal$/m);
  assert.match(read(folder, 'edges.tsv'), /^src\/server\.ts\texpress\texternal\tdefault$/m);
  const page = read(folder, 'modules/_root.md');
  assert.match(page, /## `src\/cart\.ts`[\s\S]*Imported by: `src\/server\.ts`/);
  assert.match(read(folder, 'MAP.md'), /express \^4\.0\.0 · 1 file/);
  assert.doesNotMatch(read(folder, 'files.tsv'), /codebase-map\//, 'the map folder never maps itself');
});

test('an update re-parses only changed files and drops removed files', async () => {
  const folder = MapFolder.create(join(root, 'codebase-map'), root);
  await updateMap(folder);

  writeProject({ 'src/cart.ts': 'export function cartTotal() { return 0; }\nexport function applyCoupon() {}\n' });
  rmSync(join(root, 'README.md'));
  writeProject({ 'src/coupon.ts': "import { applyCoupon } from './cart';\n" });
  const report = await updateMap(folder);

  assert.deepEqual(report.changed, ['src/cart.ts']);
  assert.deepEqual(report.added, ['src/coupon.ts']);
  assert.deepEqual(report.removed, ['README.md']);
  assert.match(read(folder, 'symbols.tsv'), /^applyCoupon\tfunction\tsrc\/cart\.ts\t2\t/m);
  assert.doesNotMatch(read(folder, 'files.tsv'), /README\.md/);

  const again = await updateMap(folder);
  assert.deepEqual([again.added, again.changed, again.removed, again.written], [[], [], [], []]);
});

test('summaries attach to the current content and go stale when the file changes', async () => {
  const folder = MapFolder.create(join(root, 'codebase-map'), root);
  await updateMap(folder);
  const index = folder.readJson<MapIndex>('index.json')!;
  const book = new SummaryBook({ files: {}, dirs: {} }, index);
  assert.deepEqual(book.apply({ files: { 'src/cart.ts': 'Sums cart line items.' }, dirs: { 'src/': 'Shop server.' } }), []);
  writeMapOutputs(folder, index, book);
  assert.match(read(folder, 'files.tsv'), /src\/cart\.ts\tcode\tTypeScript\t1\t_root\.md\tSums cart line items\.$/m);

  writeProject({ 'src/cart.ts': 'export const cartTotal = () => 1;\n' });
  const report = await updateMap(folder);
  assert.match(read(folder, 'files.tsv'), /Sums cart line items\. \(summary may be outdated\)/);
  const stored = folder.readJson<Summaries>('summaries.json')!;
  assert.equal(stored.files['src/cart.ts'].summary, 'Sums cart line items.');
  assert.ok(report.pendingFileSummaries >= 1);
});

test('the pointer goes at the top of AGENTS.md and CLAUDE.md once and is refreshed in place', () => {
  assert.deepEqual(writeInstructionPointers(root, 'codebase-map'), { 'AGENTS.md': 'missing', 'CLAUDE.md': 'missing' });
  writeProject({ 'AGENTS.md': '# Rules\n\nUse tabs.\n', 'CLAUDE.md': '# Claude\n' });

  assert.deepEqual(writeInstructionPointers(root, 'codebase-map'), { 'AGENTS.md': 'added', 'CLAUDE.md': 'added' });
  assert.deepEqual(writeInstructionPointers(root, 'codebase-map'), { 'AGENTS.md': 'unchanged', 'CLAUDE.md': 'unchanged' });
  assert.deepEqual(writeInstructionPointers(root, 'docs/map'), { 'AGENTS.md': 'updated', 'CLAUDE.md': 'updated' });
  const text = readFileSync(join(root, 'AGENTS.md'), 'utf8');
  assert.ok(text.startsWith('<!-- mfmap:begin -->\n> **Codebase map:** for the location of anything'));
  assert.match(text, /\[`docs\/map\/MAP\.md`\]\(docs\/map\/MAP\.md\)/);
  assert.equal(text.match(/mfmap:begin/g)?.length, 1);
  assert.ok(text.endsWith('# Rules\n\nUse tabs.\n'));
});

test('a CLAUDE.md that imports AGENTS.md is not given a duplicate pointer', () => {
  writeProject({ 'AGENTS.md': '# Rules\n', 'CLAUDE.md': '@AGENTS.md\n' });
  assert.deepEqual(writeInstructionPointers(root, 'codebase-map'), { 'AGENTS.md': 'added', 'CLAUDE.md': 'imports AGENTS.md' });
  assert.equal(readFileSync(join(root, 'CLAUDE.md'), 'utf8'), '@AGENTS.md\n');
});

test('hook install is idempotent per agent and uninstall keeps unrelated settings', () => {
  const existing = {
    '.claude/settings.local.json': { permissions: { allow: ['Bash(ls)'] }, hooks: { Stop: [{ hooks: [{ type: 'command', command: 'say done' }] }] } },
    '.cursor/hooks.json': { version: 1, hooks: { stop: [{ command: 'say done' }] } },
    '.codex/hooks.json': { hooks: { Stop: [{ hooks: [{ type: 'command', command: 'say done' }] }] } },
  };
  writeProject(Object.fromEntries(Object.entries(existing).map(([path, json]) => [path, JSON.stringify(json)])));
  const mapDir = join(root, 'codebase-map');
  installHooks(root, mapDir, ['claude', 'cursor', 'codex']);
  installHooks(root, mapDir, ['claude', 'cursor', 'codex']);
  const settings = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8'));

  const claude = settings('.claude/settings.local.json');
  assert.equal(claude.hooks.PostToolUse.length, 1);
  assert.equal(claude.hooks.Stop.length, 2);
  assert.match(claude.hooks.PostToolUse[0].hooks[0].command, /^MFMAP_HOOK=1; \[ -f .+ \] && node .+ update --quiet --map '.*codebase-map' >\/dev\/null 2>&1; echo '\{\}'$/);
  const cursor = settings('.cursor/hooks.json');
  assert.equal(cursor.version, 1);
  assert.deepEqual([cursor.hooks.afterFileEdit.length, cursor.hooks.stop.length], [1, 2]);
  assert.match(cursor.hooks.afterFileEdit[0].command, / --map 'codebase-map' /, 'committed Cursor hooks use a project-relative map path');
  const codex = settings('.codex/hooks.json');
  assert.equal(codex.hooks.PostToolUse[0].matcher, 'apply_patch|Edit|Write');
  assert.equal(codex.hooks.Stop.length, 2);

  uninstallHooks(root, ['claude', 'cursor', 'codex']);
  for (const [path, json] of Object.entries(existing)) assert.deepEqual(settings(path), json);
});

test('the hook command always succeeds and prints JSON, even when the CLI is missing', async () => {
  const { execFileSync } = await import('node:child_process');
  installHooks(root, join(root, 'codebase-map'), ['codex']);
  const command = JSON.parse(readFileSync(join(root, '.codex/hooks.json'), 'utf8')).hooks.Stop[0].hooks[0].command as string;
  const broken = command.replace(/\[ -f [^\]]+\]/, "[ -f '/nonexistent/mfmap.mjs' ]");
  assert.equal(execFileSync('sh', ['-c', broken], { cwd: root, encoding: 'utf8' }), '{}\n');
});

test('the map folder is found from the project root, from inside it, and from a subdirectory', () => {
  const folder = MapFolder.create(join(root, 'docs', 'codebase-map'), root);
  writeProject({ 'src/deep/file.ts': '' });
  mkdirSync(join(root, '.git'));
  assert.equal(MapFolder.find(root)?.dir, folder.dir);
  assert.equal(MapFolder.find(folder.dir)?.dir, folder.dir);
  assert.equal(MapFolder.find(join(root, 'src', 'deep'))?.dir, folder.dir);
  assert.equal(MapFolder.find(join(root, 'src', 'deep'))?.root, root);
});

test('directories listed as files (git submodules) are skipped, not read', async () => {
  const { execFileSync } = await import('node:child_process');
  execFileSync('git', ['init', '-q'], { cwd: root });
  mkdirSync(join(root, 'vendor', 'lib'), { recursive: true });
  writeProject({ 'vendor/lib/x.ts': '' });
  execFileSync('git', ['init', '-q'], { cwd: join(root, 'vendor', 'lib') });
  execFileSync('git', ['-C', join(root, 'vendor', 'lib'), '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-q', '--allow-empty', '-m', 'x']);
  execFileSync('git', ['add', '.'], { cwd: root });
  const folder = MapFolder.create(join(root, 'codebase-map'), root);
  const report = await updateMap(folder);
  assert.ok(!report.added.includes('vendor/lib'));
  assert.ok(report.added.includes('src/cart.ts'));
});
