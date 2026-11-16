import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BEGIN = '<!-- mfmap:begin -->';
const END = '<!-- mfmap:end -->';

export type PointerResult = 'added' | 'updated' | 'unchanged' | 'no-agents-md';

export function mapPointer(mapDir: string): string {
  const page = `${mapDir}/MAP.md`;
  return [
    BEGIN,
    `> **Codebase map:** for the location of anything in this codebase (files, symbols, imports, dependencies), refer to the map at [\`${page}\`](${page}) before searching. After adding, removing, or changing files, run \`mfmap update\` to keep it current.`,
    END,
  ].join('\n');
}

/**
 * Puts the map pointer at the very top of AGENTS.md, or refreshes an existing pointer in place.
 * Never creates AGENTS.md.
 */
export function writeAgentsMdPointer(projectRoot: string, mapDir: string): PointerResult {
  const path = join(projectRoot, 'AGENTS.md');
  if (!existsSync(path)) return 'no-agents-md';
  const current = readFileSync(path, 'utf8');
  const pointer = mapPointer(mapDir);
  const begin = current.indexOf(BEGIN);
  const end = current.indexOf(END);
  if (begin !== -1 && end > begin) {
    const next = current.slice(0, begin) + pointer + current.slice(end + END.length);
    if (next === current) return 'unchanged';
    writeFileSync(path, next);
    return 'updated';
  }
  writeFileSync(path, `${pointer}\n\n${current}`);
  return 'added';
}
