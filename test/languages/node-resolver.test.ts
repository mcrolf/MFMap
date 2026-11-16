import assert from 'node:assert/strict';
import { test } from 'node:test';
import { nodeResolver } from '../../src/languages/node-resolver.ts';
import { projectFrom } from '../helpers.ts';

const files = {
  'tsconfig.base.json': '{ "compilerOptions": { "baseUrl": ".", "paths": { "@app/*": ["apps/web/src/*"] } } }',
  'apps/web/tsconfig.json': `{
    // comments and trailing commas are allowed
    "extends": "../../tsconfig.base.json",
    "compilerOptions": { "paths": { "@/*": ["./src/*"], }, },
  }`,
  'apps/web/src/index.tsx': '',
  'apps/web/src/lib/util.ts': '',
  'apps/web/src/components/Button/index.tsx': '',
  'apps/web/src/styles.css': '',
  'packages/ui/package.json': '{ "name": "@acme/ui", "main": "dist/index.js" }',
  'packages/ui/src/index.ts': '',
  'packages/ui/src/button.ts': '',
  'scripts/build.mjs': '',
};

const resolver = nodeResolver(projectFrom(files));
const resolve = (from: string, specifier: string) => resolver.resolve(from, { specifier, names: [], line: 1 });
const FROM = 'apps/web/src/index.tsx';

test('relative imports try extensions, index files, and .js to .ts mapping', () => {
  assert.deepEqual(resolve(FROM, './lib/util'), { target: 'apps/web/src/lib/util.ts' });
  assert.deepEqual(resolve(FROM, './lib/util.js'), { target: 'apps/web/src/lib/util.ts' });
  assert.deepEqual(resolve(FROM, './components/Button'), { target: 'apps/web/src/components/Button/index.tsx' });
  assert.deepEqual(resolve(FROM, './styles.css'), { target: 'apps/web/src/styles.css' });
  assert.deepEqual(resolve(FROM, './missing'), { unresolved: true });
});

test('tsconfig paths, with baseUrl inherited through extends', () => {
  assert.deepEqual(resolve(FROM, '@/lib/util'), { target: 'apps/web/src/lib/util.ts' });
  assert.deepEqual(resolve(FROM, 'apps/web/src/lib/util'), { target: 'apps/web/src/lib/util.ts' });
});

test('a child tsconfig with its own paths replaces the inherited paths', () => {
  assert.deepEqual(resolve(FROM, '@app/lib/util'), { external: '@app/lib' });
});

test('workspace packages resolve to source, not build output', () => {
  assert.deepEqual(resolve(FROM, '@acme/ui'), { target: 'packages/ui/src/index.ts' });
  assert.deepEqual(resolve(FROM, '@acme/ui/button'), { target: 'packages/ui/src/button.ts' });
});

test('node builtins and third-party packages', () => {
  assert.deepEqual(resolve(FROM, 'node:fs'), { builtin: 'fs' });
  assert.deepEqual(resolve(FROM, 'path'), { builtin: 'path' });
  assert.deepEqual(resolve(FROM, 'react-dom/client'), { external: 'react-dom' });
  assert.deepEqual(resolve(FROM, '@tanstack/react-query'), { external: '@tanstack/react-query' });
});
