import { createHash } from 'node:crypto';
import { languageForPath } from '../languages/index.ts';
import type { FileEntry } from '../model.ts';
import type { SourceParser } from '../parse/parser.ts';
import { baseName } from '../paths.ts';
import { categoryOf, fileTypeOf } from '../scan/file-types.ts';

const MAX_PARSED_BYTES = 1024 * 1024;
const MINIFIED_AVERAGE_LINE_LENGTH = 300;
const BINARY_SNIFF_BYTES = 8000;

export function hashContent(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

/** Builds the map entry for one file. Imports are left unresolved; see resolveImports. */
export async function analyzeFile(path: string, content: Buffer, parser: SourceParser): Promise<FileEntry> {
  const language = languageForPath(path);
  const isBinary = content.subarray(0, BINARY_SNIFF_BYTES).includes(0);
  const text = isBinary ? '' : content.toString('utf8');
  const lines = isBinary ? 0 : countLines(text);
  const entry: FileEntry = {
    path,
    hash: hashContent(content),
    bytes: content.length,
    lines,
    category: categoryOf(path, language !== undefined),
    symbols: [],
    imports: [],
  };
  const fileType = language?.displayName ?? fileTypeOf(path);
  if (fileType) entry.fileType = fileType;
  if (!language) return entry;

  entry.language = language.id;
  const skipped = skipReason(content.length, lines, isBinary);
  if (skipped) return { ...entry, skipped };
  try {
    const extraction = await parser.parse(language, text, (root) => language.extract(root, text));
    return {
      ...entry,
      symbols: extraction.symbols,
      imports: extraction.imports,
      ...(extraction.packageName ? { packageName: extraction.packageName } : {}),
      ...(extraction.entryPoint || baseName(path) === 'main.swift' ? { entryPoint: true } : {}),
    };
  } catch (error) {
    return { ...entry, skipped: `parse failed: ${(error as Error).message}` };
  }
}

function skipReason(bytes: number, lines: number, isBinary: boolean): string | undefined {
  if (isBinary) return 'binary';
  if (bytes > MAX_PARSED_BYTES) return 'larger than 1 MB';
  if (lines > 0 && bytes / lines > MINIFIED_AVERAGE_LINE_LENGTH) return 'minified or generated';
  return undefined;
}

function countLines(text: string): number {
  if (text.length === 0) return 0;
  let count = 1;
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) count++;
  return text.endsWith('\n') ? count - 1 : count;
}
