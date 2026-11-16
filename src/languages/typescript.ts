import type { Extraction, RawImport } from '../model.ts';
import { collectSymbols, forEachNode, lineOf, unquote } from './syntax.ts';
import type { Classification, LanguageSupport, SyntaxNode } from './types.ts';

/** TypeScript, TSX, and JavaScript share one extractor; their grammars use the same node names. */
function extractScript(root: SyntaxNode, source: string): Extraction {
  return {
    symbols: collectSymbols(root, classify),
    imports: collectImports(root),
    ...(source.startsWith('#!') ? { entryPoint: true } : {}),
  };
}

const FUNCTION_VALUES = new Set(['arrow_function', 'function_expression', 'function', 'generator_function']);
const SKIPPED_EXPRESSIONS = FUNCTION_VALUES;

function classify(node: SyntaxNode): Classification {
  const exported = node.parent?.type === 'export_statement';
  const name = node.childForFieldName('name')?.text;
  switch (node.type) {
    case 'class_declaration':
    case 'abstract_class_declaration':
      return name ? { kind: 'class', name, exported, extends: classHeritage(node) } : undefined;
    case 'interface_declaration':
      return name ? { kind: 'interface', name, exported, extends: interfaceHeritage(node) } : undefined;
    case 'type_alias_declaration':
      return name ? { kind: 'type', name, exported } : undefined;
    case 'enum_declaration':
      return name ? { kind: 'enum', name, exported } : undefined;
    case 'function_declaration':
    case 'generator_function_declaration':
    case 'function_signature':
      return name ? { kind: 'function', name, exported } : undefined;
    case 'method_definition':
    case 'abstract_method_signature':
      return name ? { kind: 'method', name, exported: !isPrivateMember(node) } : undefined;
    case 'public_field_definition':
      return classifyField(node, name);
    case 'internal_module':
    case 'module':
      return name ? { kind: 'namespace', name: unquote(name), exported } : undefined;
    case 'variable_declarator':
      return classifyDeclarator(node, name);
    case 'assignment_expression':
      return classifyCommonJsExport(node);
    default:
      return SKIPPED_EXPRESSIONS.has(node.type) ? 'skip' : undefined;
  }
}

function classifyField(node: SyntaxNode, name: string | undefined): Classification {
  const value = node.childForFieldName('value');
  if (!name || !value || !FUNCTION_VALUES.has(value.type)) return 'skip';
  return { kind: 'method', name, exported: !isPrivateMember(node) };
}

/** Top-level `const f = () => {}` is a function; other top-level bindings count only when exported. */
function classifyDeclarator(node: SyntaxNode, name: string | undefined): Classification {
  const declaration = node.parent;
  const exported = declaration?.parent?.type === 'export_statement';
  const value = node.childForFieldName('value');
  if (!name || node.childForFieldName('name')?.type !== 'identifier') return 'skip';
  if (value && FUNCTION_VALUES.has(value.type)) return { kind: 'function', name, exported };
  if (exported) return { kind: 'variable', name, exported };
  return 'skip';
}

/** `module.exports.name = ...` and `exports.name = ...`. */
function classifyCommonJsExport(node: SyntaxNode): Classification {
  const target = node.childForFieldName('left');
  if (target?.type !== 'member_expression') return 'skip';
  const owner = target.childForFieldName('object')?.text;
  const name = target.childForFieldName('property')?.text;
  if (!name || (owner !== 'exports' && owner !== 'module.exports')) return 'skip';
  const value = node.childForFieldName('right');
  const kind = value && FUNCTION_VALUES.has(value.type) ? 'function' : 'variable';
  return { kind, name, exported: true };
}

function isPrivateMember(node: SyntaxNode): boolean {
  const nameNode = node.childForFieldName('name');
  if (nameNode?.type === 'private_property_identifier') return true;
  return node.children.some(
    (child) => child.type === 'accessibility_modifier' && child.text !== 'public',
  );
}

function classHeritage(node: SyntaxNode): string[] {
  const heritage = node.namedChildren.find((child) => child.type === 'class_heritage');
  if (!heritage) return [];
  return heritage.namedChildren.flatMap((clause) => {
    if (clause.type === 'extends_clause') return clause.childrenForFieldName('value').map((v) => v.text);
    if (clause.type === 'implements_clause') return clause.namedChildren.map((t) => t.text);
    return [clause.text];
  });
}

function interfaceHeritage(node: SyntaxNode): string[] {
  const clause = node.namedChildren.find((child) => child.type === 'extends_type_clause');
  return clause ? clause.namedChildren.map((t) => t.text) : [];
}

function collectImports(root: SyntaxNode): RawImport[] {
  const imports: RawImport[] = [];
  forEachNode(root, (node) => {
    const found = importOf(node);
    if (found) imports.push(found);
  });
  return imports;
}

function importOf(node: SyntaxNode): RawImport | undefined {
  if (node.type === 'import_statement' || node.type === 'export_statement') {
    const source = node.childForFieldName('source');
    if (!source) return undefined;
    return { specifier: unquote(source.text), names: importedNames(node), line: lineOf(node) };
  }
  if (node.type === 'call_expression') {
    const callee = node.childForFieldName('function');
    const isLoader = callee?.type === 'import' || (callee?.type === 'identifier' && callee.text === 'require');
    const first = node.childForFieldName('arguments')?.namedChildren[0];
    if (!isLoader || first?.type !== 'string') return undefined;
    return { specifier: unquote(first.text), names: [], line: lineOf(node) };
  }
  return undefined;
}

function importedNames(statement: SyntaxNode): string[] {
  const names: string[] = [];
  forEachNode(statement, (node) => {
    if (node.type === 'import_specifier' || node.type === 'export_specifier') {
      const name = node.childForFieldName('name')?.text;
      if (name) names.push(name);
      return false;
    }
    if (node.type === 'namespace_import' || node.type === 'namespace_export') {
      names.push('*');
      return false;
    }
    if (node.type === 'identifier' && node.parent?.type === 'import_clause') names.push('default');
    return node.type !== 'string';
  });
  if (statement.type === 'export_statement' && names.length === 0) names.push('*');
  return names;
}

export const typescript: LanguageSupport = {
  id: 'typescript',
  displayName: 'TypeScript',
  grammar: 'typescript',
  extensions: ['.ts', '.mts', '.cts'],
  ecosystem: 'node',
  extract: extractScript,
};

export const tsx: LanguageSupport = {
  id: 'tsx',
  displayName: 'TSX',
  grammar: 'tsx',
  extensions: ['.tsx'],
  ecosystem: 'node',
  extract: extractScript,
};

export const javascript: LanguageSupport = {
  id: 'javascript',
  displayName: 'JavaScript',
  grammar: 'javascript',
  extensions: ['.js', '.mjs', '.cjs', '.jsx'],
  ecosystem: 'node',
  extract: extractScript,
};
