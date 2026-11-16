import type Parser from 'web-tree-sitter';
import type { Extraction, FileEntry, LanguageId, RawImport, SymbolKind } from '../model.ts';

export type SyntaxNode = Parser.SyntaxNode;

/** Languages that share one import resolution scheme. */
export type Ecosystem = 'node' | 'python' | 'go' | 'rust' | 'jvm' | 'dotnet' | 'swift';

export interface LanguageSupport {
  id: LanguageId;
  displayName: string;
  /** Grammar file stem inside tree-sitter-wasms, e.g. `c_sharp` for `tree-sitter-c_sharp.wasm`. */
  grammar: string;
  extensions: string[];
  ecosystem: Ecosystem;
  extract(root: SyntaxNode, source: string): Extraction;
}

/** Everything a resolver may consult about the repository. Built once per map update. */
export interface ProjectContext {
  files: ReadonlySet<string>;
  dirs: ReadonlySet<string>;
  /** Parsed entries for every code file, keyed by path. Imports are still unresolved here. */
  entries: ReadonlyMap<string, FileEntry>;
  readText(path: string): string | undefined;
}

export type Resolution =
  | { target: string }
  | { external: string }
  | { builtin: string }
  | { unresolved: true };

export interface ImportResolver {
  resolve(fromPath: string, imported: RawImport): Resolution;
}

export type ResolverFactory = (project: ProjectContext) => ImportResolver;

/** A definition recognised by a language classifier. */
export interface Definition {
  kind: SymbolKind;
  name: string;
  exported: boolean;
  extends?: string[];
  /** The node whose line range the symbol covers; defaults to the classified node. */
  span?: SyntaxNode;
}

/**
 * Classifier result: a definition, `'skip'` to prune the subtree (function bodies),
 * or `undefined` to keep walking.
 */
export type Classification = Definition | 'skip' | undefined;
