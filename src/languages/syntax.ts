import type { CodeSymbol, SymbolKind } from '../model.ts';
import type { Classification, SyntaxNode } from './types.ts';

const CONTAINER_KINDS: ReadonlySet<SymbolKind> = new Set([
  'class',
  'interface',
  'struct',
  'trait',
  'impl',
  'module',
  'namespace',
  'protocol',
  'extension',
  'object',
  'enum',
  'record',
]);

/**
 * Collects definitions at file level and inside containers (classes, modules, ...).
 * Functions found inside a container become methods. Function bodies are never entered,
 * so local helpers and variables stay out of the map.
 */
export function collectSymbols(
  root: SyntaxNode,
  classify: (node: SyntaxNode) => Classification,
): CodeSymbol[] {
  const symbols: CodeSymbol[] = [];

  const visit = (node: SyntaxNode, container: string | undefined): void => {
    const found = classify(node);
    if (found === 'skip') return;
    if (found === undefined) {
      for (const child of node.namedChildren) visit(child, container);
      return;
    }
    const span = found.span ?? node;
    const kind = found.kind === 'function' && container ? 'method' : found.kind;
    symbols.push({
      name: found.name,
      kind,
      line: span.startPosition.row + 1,
      endLine: span.endPosition.row + 1,
      exported: found.exported,
      ...(container ? { container } : {}),
      ...(found.extends?.length ? { extends: found.extends } : {}),
    });
    if (CONTAINER_KINDS.has(kind)) {
      const qualified = container ? `${container}.${found.name}` : found.name;
      for (const child of node.namedChildren) visit(child, qualified);
    }
  };

  visit(root, undefined);
  return symbols;
}

/** Visits every named node depth-first. Return `false` from `enter` to skip a subtree. */
export function forEachNode(root: SyntaxNode, enter: (node: SyntaxNode) => boolean | void): void {
  const stack: SyntaxNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (enter(node) === false) continue;
    const children = node.namedChildren;
    for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
  }
}

export function lineOf(node: SyntaxNode): number {
  return node.startPosition.row + 1;
}

/** Text of a string literal node without its quotes. */
export function unquote(text: string): string {
  return text.replace(/^[rbuf]*(['"`]{1,3})([\s\S]*)\1$/i, '$2');
}

export function fieldText(node: SyntaxNode, field: string): string | undefined {
  return node.childForFieldName(field)?.text;
}
