import type { Extraction, RawImport, SymbolKind } from '../model.ts';
import { collectSymbols, forEachNode, lineOf } from './syntax.ts';
import type { Classification, LanguageSupport, SyntaxNode } from './types.ts';

const TYPE_KINDS: Record<string, SymbolKind> = {
  class_declaration: 'class',
  interface_declaration: 'interface',
  annotation_type_declaration: 'interface',
  enum_declaration: 'enum',
  record_declaration: 'record',
};

const METHOD_TYPES = new Set(['method_declaration', 'constructor_declaration']);
const INTERFACE_BODIES = new Set(['interface_body', 'annotation_type_body']);
const HERITAGE_CLAUSES = new Set(['superclass', 'super_interfaces', 'extends_interfaces']);

/** Initialisers and expressions that can hold anonymous classes, never declarations of interest. */
const SKIPPED_TYPES = new Set([
  'field_declaration',
  'enum_constant',
  'static_initializer',
  'block',
  'lambda_expression',
  'object_creation_expression',
]);

function extractJava(root: SyntaxNode): Extraction {
  const packageName = packageOf(root);
  return {
    symbols: collectSymbols(root, classify),
    imports: collectImports(root),
    ...(packageName ? { packageName } : {}),
    ...(hasMainMethod(root) ? { entryPoint: true } : {}),
  };
}

function classify(node: SyntaxNode): Classification {
  const name = node.childForFieldName('name')?.text;
  const typeKind = TYPE_KINDS[node.type];
  if (typeKind) return name ? { kind: typeKind, name, exported: isExported(node), extends: heritage(node) } : undefined;
  if (METHOD_TYPES.has(node.type)) return name ? { kind: 'method', name, exported: isExported(node) } : undefined;
  return SKIPPED_TYPES.has(node.type) ? 'skip' : undefined;
}

/** Keyword modifiers such as `public` and `static`; annotations are left out. */
function modifiersOf(node: SyntaxNode): Set<string> {
  const modifiers = node.namedChildren.find((child) => child.type === 'modifiers');
  return new Set(modifiers?.children.map((child) => child.type));
}

/** Interface members are implicitly public. */
function isExported(node: SyntaxNode): boolean {
  if (node.parent && INTERFACE_BODIES.has(node.parent.type)) return true;
  return modifiersOf(node).has('public');
}

function heritage(node: SyntaxNode): string[] {
  return node.namedChildren
    .filter((child) => HERITAGE_CLAUSES.has(child.type))
    .flatMap((clause) => clause.namedChildren.flatMap((t) => (t.type === 'type_list' ? t.namedChildren : [t])))
    .map((type) => type.text);
}

function packageOf(root: SyntaxNode): string | undefined {
  const declaration = root.namedChildren.find((child) => child.type === 'package_declaration');
  return declaration?.namedChildren[0]?.text;
}

function hasMainMethod(root: SyntaxNode): boolean {
  let found = false;
  forEachNode(root, (node) => {
    if (node.type !== 'method_declaration') return;
    if (node.childForFieldName('name')?.text === 'main' && modifiersOf(node).has('static')) found = true;
    return false;
  });
  return found;
}

function collectImports(root: SyntaxNode): RawImport[] {
  return root.namedChildren
    .filter((child) => child.type === 'import_declaration')
    .flatMap((declaration) => {
      const path = declaration.namedChildren.find((c) => c.type === 'scoped_identifier' || c.type === 'identifier');
      if (!path) return [];
      const wildcard = declaration.namedChildren.some((c) => c.type === 'asterisk');
      const lastSegment = path.text.slice(path.text.lastIndexOf('.') + 1);
      return [{ specifier: path.text, names: [wildcard ? '*' : lastSegment], line: lineOf(declaration) }];
    });
}

export const java: LanguageSupport = {
  id: 'java',
  displayName: 'Java',
  grammar: 'java',
  extensions: ['.java'],
  ecosystem: 'jvm',
  extract: extractJava,
};

