import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

let cached: Promise<string> | undefined;

/**
 * The browser script for graph.html. The bundled CLI ships it as viewer.js beside itself;
 * running from source builds it on demand with esbuild (a dev dependency).
 */
export function viewerScript(): Promise<string> {
  cached ??= loadViewerScript();
  return cached;
}

async function loadViewerScript(): Promise<string> {
  const here = dirname(fileURLToPath(import.meta.url));
  const bundled = join(here, 'viewer.js');
  if (existsSync(bundled)) return readFileSync(bundled, 'utf8');
  const { build } = await import('esbuild');
  const result = await build({
    entryPoints: [join(here, '..', 'viewer', 'main.ts')],
    bundle: true,
    format: 'iife',
    minify: true,
    target: 'es2020',
    write: false,
    legalComments: 'none',
  });
  return result.outputFiles[0].text;
}
