import type { Extraction, FileEntry } from '../src/model.ts';
import type { LanguageSupport, ProjectContext } from '../src/languages/types.ts';
import { ancestorDirs } from '../src/paths.ts';
import { SourceParser } from '../src/parse/parser.ts';

let shared: Promise<SourceParser> | undefined;

/** Parses `source` with the language's grammar and runs its extractor. */
export async function extractFrom(language: LanguageSupport, source: string): Promise<Extraction> {
  shared ??= SourceParser.create();
  const parser = await shared;
  return parser.parse(language, source, (root) => language.extract(root, source));
}

/** Compact `kind name@line` view of symbols, with container prefix, for readable assertions. */
export function outline(extraction: Extraction): string[] {
  return extraction.symbols.map(
    (s) => `${s.exported ? '+' : '-'}${s.kind} ${s.container ? `${s.container}.` : ''}${s.name}@${s.line}`,
  );
}

/** A ProjectContext over in-memory files. `entries` supplies parsed facts for code files. */
export function projectFrom(
  files: Record<string, string>,
  entries: Array<Partial<FileEntry> & { path: string }> = [],
): ProjectContext {
  const dirs = new Set<string>(['']);
  for (const path of Object.keys(files)) {
    for (const dir of ancestorDirs(path)) dirs.add(dir);
  }
  const byPath = new Map<string, FileEntry>(
    entries.map((entry) => [
      entry.path,
      { hash: '', bytes: 0, lines: 0, category: 'code', symbols: [], imports: [], ...entry },
    ]),
  );
  return {
    files: new Set(Object.keys(files)),
    dirs,
    entries: byPath,
    readText: (path) => files[path],
  };
}

/** Extracts every file of `language` in `files` and returns entries for `projectFrom`. */
export async function entriesFor(
  language: LanguageSupport,
  files: Record<string, string>,
): Promise<FileEntry[]> {
  const result: FileEntry[] = [];
  for (const [path, source] of Object.entries(files)) {
    if (!language.extensions.some((ext) => path.endsWith(ext))) continue;
    const extraction = await extractFrom(language, source);
    result.push({
      path,
      hash: '',
      bytes: source.length,
      lines: source.split('\n').length,
      category: 'code',
      language: language.id,
      ...extraction,
    });
  }
  return result;
}
