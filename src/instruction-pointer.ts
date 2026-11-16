import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BEGIN = '<!-- mfmap:begin -->';
const END = '<!-- mfmap:end -->';
/** Agent instruction files that get the pointer when they exist. They are never created. */
export const INSTRUCTION_FILES = ['AGENTS.md', 'CLAUDE.md'] as const;

export type PointerResult = 'added' | 'updated' | 'unchanged' | 'missing' | 'imports AGENTS.md';

export function mapPointer(mapDir: string): string {
  const page = `${mapDir}/MAP.md`;
  return [
    BEGIN,
    `> **Codebase map:** for the location of anything in this codebase (files, symbols, imports, dependencies), refer to the map at [\`${page}\`](${page}) before searching. After adding, removing, or changing files, run \`mfmap update\` (the codebase-map skill's CLI, usually \`node ~/.agents/skills/codebase-map/bin/mfmap.mjs\`) to keep it current.`,
    END,
  ].join('\n');
}

/**
 * Puts the map pointer at the very top of AGENTS.md and CLAUDE.md, or refreshes an existing
 * pointer in place. A CLAUDE.md that imports AGENTS.md (`@AGENTS.md`) already sees the pointer,
 * so it is left alone rather than given a duplicate.
 */
export function writeInstructionPointers(projectRoot: string, mapDir: string): Record<string, PointerResult> {
  const results: Record<string, PointerResult> = {};
  for (const name of INSTRUCTION_FILES) {
    const path = join(projectRoot, name);
    if (!existsSync(path)) {
      results[name] = 'missing';
      continue;
    }
    const current = readFileSync(path, 'utf8');
    const importsAgentsMd = name === 'CLAUDE.md' && /^@\.?\/?AGENTS\.md\s*$/m.test(current);
    if (importsAgentsMd && results['AGENTS.md'] !== 'missing' && !current.includes(BEGIN)) {
      results[name] = 'imports AGENTS.md';
      continue;
    }
    results[name] = writePointer(path, current, mapPointer(mapDir));
  }
  return results;
}

function writePointer(path: string, current: string, pointer: string): PointerResult {
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

export function describePointerResults(results: Record<string, PointerResult>): string {
  return Object.entries(results).map(([name, result]) => `${name}: ${result}`).join(', ');
}
