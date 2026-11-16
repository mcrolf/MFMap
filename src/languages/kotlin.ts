import type { Extraction, RawImport } from '../model.ts';
import { collectSymbols, lineOf } from './syntax.ts';
import type { Classification, LanguageSupport, SyntaxNode } from './types.ts';

const HIDDEN_VISIBILITIES = new Set(['private', 'internal']);

/** Bodies and initialisers that can hold lambdas or anonymous objects, never declarations of interest. */
const SKIPPED_TYPES = new Set([
  'lambda_literal',
  'anonymous_function',
  'object_literal',
  'secondary_constructor',
  'anonymous_initializer',
  'enum_entry',
]);

function extractKotlin(root: SyntaxNode): Extraction {
  const packageName = root.namedChildren.find((child) => child.type === 'package_header')?.namedChildren[0]?.text;
  return {
    symbols: collectSymbols(root, classify),
    imports: collectImports(root),
    ...(packageName ? { packageName } : {}),
    ...(hasTopLevelMain(root) ? { entryPoint: true } : {}),
  };
}

function classify(node: SyntaxNode): Classification {
  const exported = !HIDDEN_VISIBILITIES.has(visibilityOf(node));
  switch (node.type) {
    case 'class_declaration':
      return classifyClass(node, exported);
    case 'object_declaration':
      return { kind: 'object', name: typeNameOf(node) ?? '', exported, extends: heritage(node) };
    case 'companion_object':
      return { kind: 'object', name: typeNameOf(node) ?? 'Companion', exported };
    case 'function_declaration':
      return { kind: 'function', name: functionNameOf(node), exported };
    case 'type_alias':
      return { kind: 'type', name: typeNameOf(node) ?? '', exported };
    case 'property_declaration':
      return classifyProperty(node, exported);
    default:
      return SKIPPED_TYPES.has(node.type) ? 'skip' : undefined;
  }
}

function classifyClass(node: SyntaxNode, exported: boolean): Classification {
  const name = typeNameOf(node);
  if (!name) return undefined;
  const keywords = new Set(node.children.map((child) => child.type));
  const kind = keywords.has('interface') ? 'interface' : keywords.has('enum') ? 'enum' : 'class';
  return { kind, name, exported, extends: heritage(node) };
}

/** Only file-level properties are listed; member properties are implementation detail. */
function classifyProperty(node: SyntaxNode, exported: boolean): Classification {
  if (node.parent?.type !== 'source_file') return 'skip';
  const name = node.namedChildren.find((child) => child.type === 'variable_declaration')?.namedChildren[0]?.text;
  return name ? { kind: 'variable', name, exported } : 'skip';
}

function typeNameOf(node: SyntaxNode): string | undefined {
  return node.namedChildren.find((child) => child.type === 'type_identifier')?.text;
}

/** Kotlin function nodes have no `name` field; the first plain identifier is the name (after any receiver type). */
function functionNameOf(node: SyntaxNode): string {
  return node.namedChildren.find((child) => child.type === 'simple_identifier')?.text ?? '';
}

function visibilityOf(node: SyntaxNode): string {
  const modifiers = node.namedChildren.find((child) => child.type === 'modifiers');
  return modifiers?.namedChildren.find((child) => child.type === 'visibility_modifier')?.text ?? 'public';
}

function heritage(node: SyntaxNode): string[] {
  return node.namedChildren
    .filter((child) => child.type === 'delegation_specifier')
    .map((specifier) => specifier.namedChildren[0])
    .filter((supertype): supertype is SyntaxNode => supertype !== undefined)
    .map((supertype) => (supertype.type === 'constructor_invocation' ? supertype.namedChildren[0] : supertype).text);
}

function hasTopLevelMain(root: SyntaxNode): boolean {
  return root.namedChildren.some((child) => child.type === 'function_declaration' && functionNameOf(child) === 'main');
}

function collectImports(root: SyntaxNode): RawImport[] {
  const list = root.namedChildren.find((child) => child.type === 'import_list');
  return (list?.namedChildren ?? [])
    .filter((child) => child.type === 'import_header')
    .flatMap((header) => {
      const path = header.namedChildren.find((child) => child.type === 'identifier');
      if (!path) return [];
      const wildcard = header.namedChildren.some((child) => child.type === 'wildcard_import');
      const lastSegment = path.text.slice(path.text.lastIndexOf('.') + 1);
      return [{ specifier: path.text, names: [wildcard ? '*' : lastSegment], line: lineOf(header) }];
    });
}

export const kotlin: LanguageSupport = {
  id: 'kotlin',
  displayName: 'Kotlin',
  grammar: 'kotlin',
  extensions: ['.kt', '.kts'],
  ecosystem: 'jvm',
  extract: extractKotlin,
};
