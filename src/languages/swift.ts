import type { Extraction, RawImport, SymbolKind } from '../model.ts';
import { ancestorDirs, baseName, dirOf, joinRepoPath } from '../paths.ts';
import { collectSymbols, lineOf } from './syntax.ts';
import type { Classification, LanguageSupport, ProjectContext, ResolverFactory, SyntaxNode } from './types.ts';

const DECLARATION_KEYWORDS: Record<string, SymbolKind> = {
  class: 'class',
  actor: 'class',
  struct: 'struct',
  enum: 'enum',
  extension: 'extension',
};

const EXPORTED_ACCESS = new Set(['public', 'open']);

/** Closures and members that hold no declarations worth listing. */
const SKIPPED_TYPES = new Set([
  'lambda_literal',
  'deinit_declaration',
  'subscript_declaration',
  'protocol_property_declaration',
  'enum_entry',
]);

function extractSwift(root: SyntaxNode, source: string): Extraction {
  return {
    symbols: collectSymbols(root, classify),
    imports: collectImports(root),
    ...(/^\s*@main\b/m.test(source) ? { entryPoint: true } : {}),
  };
}

function classify(node: SyntaxNode): Classification {
  switch (node.type) {
    case 'class_declaration':
      return classifyDeclaration(node);
    case 'protocol_declaration':
      return { kind: 'protocol', name: nameOf(node), exported: isExported(node), extends: heritage(node) };
    case 'function_declaration':
    case 'protocol_function_declaration':
      return { kind: 'function', name: nameOf(node), exported: isExported(node) };
    case 'init_declaration':
      return { kind: 'method', name: 'init', exported: isExported(node) };
    case 'typealias_declaration':
      return { kind: 'type', name: nameOf(node), exported: isExported(node) };
    case 'property_declaration':
      return classifyProperty(node);
    default:
      return SKIPPED_TYPES.has(node.type) ? 'skip' : undefined;
  }
}

/** Class, struct, enum, extension and actor all share one node type, told apart by a keyword child. */
function classifyDeclaration(node: SyntaxNode): Classification {
  const keyword = node.children.find((child) => !child.isNamed && child.type in DECLARATION_KEYWORDS);
  if (!keyword) return undefined;
  return {
    kind: DECLARATION_KEYWORDS[keyword.type],
    name: nameOf(node),
    exported: isExported(node),
    extends: heritage(node),
  };
}

/** Only file-level properties are listed; member properties are implementation detail. */
function classifyProperty(node: SyntaxNode): Classification {
  if (node.parent?.type !== 'source_file') return 'skip';
  const name = node.childForFieldName('name')?.childForFieldName('bound_identifier')?.text;
  return name ? { kind: 'variable', name, exported: isExported(node) } : 'skip';
}

/** The declared name; an extension's name is the extended type. Typealiases carry the aliased type in a second `name` field. */
function nameOf(node: SyntaxNode): string {
  return node.childForFieldName('name')?.text ?? '';
}

function accessModifiers(node: SyntaxNode): string[] {
  const modifiers = node.namedChildren.find((child) => child.type === 'modifiers');
  return (modifiers?.namedChildren ?? [])
    .filter((child) => child.type === 'visibility_modifier')
    .map((child) => child.text);
}

/**
 * An explicit access modifier decides. Without one, protocol and extension members
 * take the access of the declaration that holds them; everything else is internal.
 */
function isExported(node: SyntaxNode): boolean {
  const explicit = accessModifiers(node);
  if (explicit.length > 0) return explicit.some((modifier) => EXPORTED_ACCESS.has(modifier));
  const owner = node.parent?.parent;
  return owner ? inheritsAccess(owner) && isExported(owner) : false;
}

function inheritsAccess(owner: SyntaxNode): boolean {
  if (owner.type === 'protocol_declaration') return true;
  return owner.type === 'class_declaration' && owner.children.some((child) => child.type === 'extension');
}

function heritage(node: SyntaxNode): string[] {
  return node.namedChildren
    .filter((child) => child.type === 'inheritance_specifier')
    .map((specifier) => specifier.childForFieldName('inherits_from')?.text ?? specifier.text);
}

function collectImports(root: SyntaxNode): RawImport[] {
  return root.namedChildren
    .filter((child) => child.type === 'import_declaration')
    .flatMap((declaration) => {
      const path = declaration.namedChildren.find((child) => child.type === 'identifier');
      if (!path) return [];
      return [{ specifier: path.text.split('.')[0], names: [], line: lineOf(declaration) }];
    });
}

export const swift: LanguageSupport = {
  id: 'swift',
  displayName: 'Swift',
  grammar: 'swift',
  extensions: ['.swift'],
  ecosystem: 'swift',
  extract: extractSwift,
};

const PLATFORM_MODULES = new Set([
  'Foundation',
  'FoundationNetworking',
  'FoundationEssentials',
  'UIKit',
  'SwiftUI',
  'AppKit',
  'Cocoa',
  'Combine',
  'Dispatch',
  'Darwin',
  'Glibc',
  'os',
  'ObjectiveC',
  'Swift',
  'XCTest',
  'Testing',
  'Security',
  'Network',
  'SwiftData',
  'Observation',
  'Accelerate',
  'Metal',
  'Vision',
  'Speech',
  'Photos',
  'Contacts',
  'Intents',
  'UserNotifications',
  'Charts',
  'TipKit',
  'RegexBuilder',
  'AVFoundation',
  'WebKit',
]);
const PLATFORM_FRAMEWORK_NAME = /^Core[A-Z]|Kit$/;

/** Resolves `import Module` to a SwiftPM target or same-named source directory. */
export const swiftResolver: ResolverFactory = (project) => {
  const modules = buildModuleIndex(project);
  return {
    resolve(_fromPath, imported) {
      const dir = modules.get(imported.specifier);
      if (dir !== undefined) return { target: dir };
      const isPlatform = PLATFORM_MODULES.has(imported.specifier) || PLATFORM_FRAMEWORK_NAME.test(imported.specifier);
      return isPlatform ? { builtin: imported.specifier } : { external: imported.specifier };
    },
  };
};

/** SwiftPM targets (`Sources/<Module>` beside a Package.swift) win over directories merely named like the module. */
function buildModuleIndex(project: ProjectContext): Map<string, string> {
  const modules = new Map<string, string>();
  for (const dir of directoriesWithSwiftFiles(project).sort(byDepthThenName)) {
    if (!modules.has(baseName(dir))) modules.set(baseName(dir), dir);
  }
  for (const dir of project.dirs) {
    if (isSwiftPmTarget(dir, project.files)) modules.set(baseName(dir), dir);
  }
  return modules;
}

function directoriesWithSwiftFiles(project: ProjectContext): string[] {
  const dirs = new Set<string>();
  for (const entry of project.entries.values()) {
    if (entry.language !== 'swift') continue;
    for (const dir of ancestorDirs(entry.path)) if (dir !== '') dirs.add(dir);
  }
  return [...dirs];
}

function isSwiftPmTarget(dir: string, files: ReadonlySet<string>): boolean {
  const sources = dirOf(dir);
  if (dir === '' || baseName(sources) !== 'Sources') return false;
  const manifest = joinRepoPath(dirOf(sources), 'Package.swift');
  return manifest !== undefined && files.has(manifest);
}

function byDepthThenName(a: string, b: string): number {
  return a.split('/').length - b.split('/').length || a.localeCompare(b);
}
