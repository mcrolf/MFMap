import type { Extraction, RawImport, SymbolKind } from '../model.ts';
import { dirOf } from '../paths.ts';
import { collectSymbols, forEachNode, lineOf } from './syntax.ts';
import type { Classification, LanguageSupport, ResolverFactory, SyntaxNode } from './types.ts';

const TYPE_KINDS: Record<string, SymbolKind> = {
  class_declaration: 'class',
  struct_declaration: 'struct',
  interface_declaration: 'interface',
  enum_declaration: 'enum',
  record_declaration: 'record',
  record_struct_declaration: 'record',
  delegate_declaration: 'type',
};

const NAMESPACE_TYPES = new Set(['namespace_declaration', 'file_scoped_namespace_declaration']);
const METHOD_TYPES = new Set(['method_declaration', 'constructor_declaration']);

/** Members and statements that hold no declarations worth listing. */
const SKIPPED_TYPES = new Set([
  'property_declaration',
  'field_declaration',
  'event_field_declaration',
  'event_declaration',
  'indexer_declaration',
  'operator_declaration',
  'conversion_operator_declaration',
  'destructor_declaration',
  'global_statement',
]);

function extractCSharp(root: SyntaxNode): Extraction {
  const packageName = namespaceOf(root);
  return {
    symbols: collectSymbols(root, classify),
    imports: collectImports(root),
    ...(packageName ? { packageName } : {}),
    ...(isEntryPoint(root) ? { entryPoint: true } : {}),
  };
}

function classify(node: SyntaxNode): Classification {
  const name = node.childForFieldName('name')?.text;
  if (NAMESPACE_TYPES.has(node.type)) return name ? { kind: 'namespace', name, exported: true } : undefined;
  const typeKind = TYPE_KINDS[node.type];
  if (typeKind) return name ? { kind: typeKind, name, exported: isPublic(node), extends: heritage(node) } : undefined;
  if (METHOD_TYPES.has(node.type)) return name ? { kind: 'method', name, exported: isPublic(node) } : undefined;
  return SKIPPED_TYPES.has(node.type) ? 'skip' : undefined;
}

function modifiersOf(node: SyntaxNode): Set<string> {
  return new Set(node.namedChildren.filter((child) => child.type === 'modifier').map((child) => child.text));
}

/** Interface members are implicitly public. */
function isPublic(node: SyntaxNode): boolean {
  if (node.parent?.parent?.type === 'interface_declaration') return true;
  return modifiersOf(node).has('public');
}

function heritage(node: SyntaxNode): string[] {
  const bases = node.namedChildren.find((child) => child.type === 'base_list');
  return (bases?.namedChildren ?? []).map((base) =>
    base.type === 'primary_constructor_base_type' ? (base.namedChildren[0]?.text ?? base.text) : base.text,
  );
}

/** First namespace declared in the file, block or file-scoped. */
function namespaceOf(root: SyntaxNode): string | undefined {
  let first: string | undefined;
  forEachNode(root, (node) => {
    if (NAMESPACE_TYPES.has(node.type)) first ??= node.childForFieldName('name')?.text;
  });
  return first;
}

function isEntryPoint(root: SyntaxNode): boolean {
  if (root.namedChildren.some((child) => child.type === 'global_statement')) return true;
  let found = false;
  forEachNode(root, (node) => {
    if (node.type !== 'method_declaration') return;
    if (node.childForFieldName('name')?.text === 'Main' && modifiersOf(node).has('static')) found = true;
    return false;
  });
  return found;
}

function collectImports(root: SyntaxNode): RawImport[] {
  const imports: RawImport[] = [];
  forEachNode(root, (node) => {
    if (node.type !== 'using_directive') return;
    const namespace = node.namedChildren.filter((child) => child.type !== 'name_equals').at(-1);
    if (!namespace) return false;
    const alias = node.namedChildren.find((child) => child.type === 'name_equals')?.namedChildren[0]?.text;
    imports.push({ specifier: namespace.text, names: alias ? [alias] : [], line: lineOf(node) });
    return false;
  });
  return imports;
}

export const csharp: LanguageSupport = {
  id: 'csharp',
  displayName: 'C#',
  grammar: 'c_sharp',
  extensions: ['.cs'],
  ecosystem: 'dotnet',
  extract: extractCSharp,
};

const PLATFORM_ROOTS = new Set(['System', 'Microsoft']);

/** Resolves `using` directives to the directory of the files declaring the namespace. */
export const dotnetResolver: ResolverFactory = (project) => {
  const dirsByNamespace = new Map<string, Set<string>>();
  for (const entry of project.entries.values()) {
    if (entry.language !== 'csharp' || !entry.packageName) continue;
    const dirs = dirsByNamespace.get(entry.packageName) ?? new Set<string>();
    dirsByNamespace.set(entry.packageName, dirs.add(dirOf(entry.path)));
  }
  const shallowest = (dirs: Set<string>): string =>
    [...dirs].sort((a, b) => depthOf(a) - depthOf(b) || a.localeCompare(b))[0];

  return {
    resolve(_fromPath, imported) {
      // `using static A.B.C` and aliases name a type, so retry with its enclosing namespace.
      const namespaces = [imported.specifier, imported.specifier.slice(0, imported.specifier.lastIndexOf('.'))];
      for (const namespace of namespaces) {
        const dirs = dirsByNamespace.get(namespace);
        if (dirs) return { target: shallowest(dirs) };
      }
      const segments = imported.specifier.split('.');
      const root = segments.slice(0, 2).join('.');
      return PLATFORM_ROOTS.has(segments[0]) ? { builtin: root } : { external: root };
    },
  };
};

function depthOf(dir: string): number {
  return dir === '' ? 0 : dir.split('/').length;
}
