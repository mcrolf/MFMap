// Bundles the CLI into skill/codebase-map/bin/mfmap.mjs and copies the tree-sitter runtime and the grammars
// the registered languages use into bin/grammars/, and bundles the graph viewer into bin/viewer.js.
// Run with: npm run build
import { build } from 'esbuild';
import { chmodSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { LANGUAGES } from '../src/languages/index.ts';

const require = createRequire(import.meta.url);
const outDir = 'skill/codebase-map/bin';
const grammarDir = join(outDir, 'grammars');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(grammarDir, { recursive: true });

await build({
  entryPoints: ['src/cli.ts'],
  outfile: join(outDir, 'mfmap.mjs'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  legalComments: 'none',
  // The bundled CLI reads viewer.js from beside itself; esbuild is only used when running from source.
  external: ['esbuild'],
  // web-tree-sitter is CommonJS that calls require() and reads __dirname.
  banner: {
    js: [
      '#!/usr/bin/env node',
      "import { createRequire as __mfmapCreateRequire } from 'node:module';",
      "import { fileURLToPath as __mfmapFileURLToPath } from 'node:url';",
      "import { dirname as __mfmapDirname } from 'node:path';",
      'const require = __mfmapCreateRequire(import.meta.url);',
      'const __filename = __mfmapFileURLToPath(import.meta.url);',
      'const __dirname = __mfmapDirname(__filename);',
    ].join('\n'),
  },
});

chmodSync(join(outDir, 'mfmap.mjs'), 0o755);

await build({
  entryPoints: ['src/viewer/main.ts'],
  outfile: join(outDir, 'viewer.js'),
  bundle: true,
  format: 'iife',
  minify: true,
  target: 'es2020',
  legalComments: 'none',
});
copyFileSync(require.resolve('web-tree-sitter/tree-sitter.wasm'), join(grammarDir, 'tree-sitter.wasm'));
const grammarSource = join(dirname(require.resolve('tree-sitter-wasms/package.json')), 'out');
for (const grammar of new Set(LANGUAGES.map((language) => language.grammar))) {
  copyFileSync(join(grammarSource, `tree-sitter-${grammar}.wasm`), join(grammarDir, `tree-sitter-${grammar}.wasm`));
}
console.log(`Built ${outDir}/mfmap.mjs with ${new Set(LANGUAGES.map((l) => l.grammar)).size} grammars.`);
