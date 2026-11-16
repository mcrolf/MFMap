/** Shared data model for a codebase map. Paths are repo-relative and use forward slashes. */

export type LanguageId =
  | 'typescript'
  | 'tsx'
  | 'javascript'
  | 'python'
  | 'go'
  | 'rust'
  | 'java'
  | 'kotlin'
  | 'csharp'
  | 'swift';

export type SymbolKind =
  | 'class'
  | 'interface'
  | 'type'
  | 'enum'
  | 'function'
  | 'method'
  | 'variable'
  | 'struct'
  | 'trait'
  | 'impl'
  | 'module'
  | 'namespace'
  | 'protocol'
  | 'extension'
  | 'object'
  | 'record';

export type FileCategory = 'code' | 'test' | 'config' | 'docs' | 'asset' | 'other';

export interface CodeSymbol {
  name: string;
  kind: SymbolKind;
  line: number;
  endLine: number;
  exported: boolean;
  /** Name of the enclosing class, struct, module, etc. */
  container?: string;
  /** Base classes, implemented interfaces, or conformed protocols, as written. */
  extends?: string[];
}

/** An import exactly as written in source, before resolution. */
export interface RawImport {
  specifier: string;
  /** Imported names when the syntax lists them (`import { a, b }`, `from x import a`). */
  names: string[];
  line: number;
}

/** What a language extractor reads from one parsed file. */
export interface Extraction {
  symbols: CodeSymbol[];
  imports: RawImport[];
  /** Go package, Java/Kotlin package, or C# namespace declared by the file. */
  packageName?: string;
  /** The file starts a program (main function, `__main__` guard, `@main`). */
  entryPoint?: boolean;
}

export interface ResolvedImport extends RawImport {
  /** Repo path of the imported file, or of a directory for package-level imports (Go, C#, Swift). */
  target?: string;
  /** Third-party package, module, or crate name. */
  external?: string;
  /** Standard library or platform module. */
  builtin?: boolean;
}

export interface FileEntry {
  path: string;
  hash: string;
  bytes: number;
  lines: number;
  category: FileCategory;
  /** Display name of the file type, such as "TypeScript" or "Markdown". */
  fileType?: string;
  language?: LanguageId;
  packageName?: string;
  entryPoint?: boolean;
  symbols: CodeSymbol[];
  imports: ResolvedImport[];
  /** Why the file was listed without parsing (binary, too large, minified, parse failure). */
  skipped?: string;
}

export interface DeclaredDependency {
  name: string;
  version?: string;
  dev?: boolean;
}

export interface Manifest {
  path: string;
  ecosystem: 'npm' | 'python' | 'go' | 'cargo' | 'swiftpm' | 'gradle' | 'maven' | 'nuget';
  name?: string;
  dependencies: DeclaredDependency[];
  /** Files the manifest declares as program or package entry points. */
  entryPoints: string[];
}

export interface MapIndex {
  schema: 1;
  generator: string;
  projectName: string;
  files: FileEntry[];
  manifests: Manifest[];
}

export interface SummaryRecord {
  /** File hash, or directory signature, the summary was written against. */
  hash: string;
  summary: string;
}

export interface Summaries {
  files: Record<string, SummaryRecord>;
  dirs: Record<string, SummaryRecord>;
}
