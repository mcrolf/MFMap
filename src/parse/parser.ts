import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Parser from 'web-tree-sitter';
import type { LanguageSupport, SyntaxNode } from '../languages/types.ts';

/**
 * Grammar and runtime WASM files live in `grammars/` next to the bundled CLI,
 * or in node_modules when running from source.
 */
function locateWasmDirs(): { runtimeDir: string; grammarDir: string } {
  const bundled = join(dirname(fileURLToPath(import.meta.url)), 'grammars');
  if (existsSync(join(bundled, 'tree-sitter.wasm'))) return { runtimeDir: bundled, grammarDir: bundled };
  const require = createRequire(import.meta.url);
  return {
    runtimeDir: dirname(require.resolve('web-tree-sitter/tree-sitter.wasm')),
    grammarDir: join(dirname(require.resolve('tree-sitter-wasms/package.json')), 'out'),
  };
}

export class SourceParser {
  private readonly parser: Parser;
  private readonly grammarDir: string;
  private readonly loaded = new Map<string, Parser.Language>();

  private constructor(parser: Parser, grammarDir: string) {
    this.parser = parser;
    this.grammarDir = grammarDir;
  }

  static async create(): Promise<SourceParser> {
    const { runtimeDir, grammarDir } = locateWasmDirs();
    await Parser.init({ locateFile: (name: string) => join(runtimeDir, name) });
    return new SourceParser(new Parser(), grammarDir);
  }

  /** Parses source and hands the root to `read`. The tree is freed afterwards. */
  async parse<T>(language: LanguageSupport, source: string, read: (root: SyntaxNode) => T): Promise<T> {
    this.parser.setLanguage(await this.grammarFor(language));
    const tree = this.parser.parse(source);
    try {
      return read(tree.rootNode);
    } finally {
      tree.delete();
    }
  }

  private async grammarFor(language: LanguageSupport): Promise<Parser.Language> {
    const cached = this.loaded.get(language.grammar);
    if (cached) return cached;
    const grammar = await Parser.Language.load(join(this.grammarDir, `tree-sitter-${language.grammar}.wasm`));
    this.loaded.set(language.grammar, grammar);
    return grammar;
  }
}
