import type { CodeSymbol, Extraction, RawImport } from '../model.ts';
import { dirOf, joinRepoPath } from '../paths.ts';
import { collectSymbols, forEachNode, lineOf, unquote } from './syntax.ts';
import type {
  Classification,
  LanguageSupport,
  ProjectContext,
  Resolution,
  ResolverFactory,
  SyntaxNode,
} from './types.ts';

function extract(root: SyntaxNode): Extraction {
  const packageName = packageNameOf(root);
  const symbols = [...collectSymbols(root, classify), ...collectDeclarations(root)].sort(
    (a, b) => a.line - b.line,
  );
  const hasMain = symbols.some((s) => s.kind === 'function' && s.name === 'main');
  return {
    symbols,
    imports: collectImports(root),
    ...(packageName ? { packageName } : {}),
    ...(packageName === 'main' && hasMain ? { entryPoint: true } : {}),
  };
}

function packageNameOf(root: SyntaxNode): string | undefined {
  const clause = root.namedChildren.find((child) => child.type === 'package_clause');
  return clause?.namedChildren[0]?.text;
}

function isExported(name: string): boolean {
  return /^\p{Lu}/u.test(name);
}

function classify(node: SyntaxNode): Classification {
  const name = node.childForFieldName('name')?.text;
  switch (node.type) {
    case 'function_declaration':
      return name ? { kind: 'function', name, exported: isExported(name) } : undefined;
    case 'type_spec':
      return name ? classifyTypeSpec(node, name) : undefined;
    case 'type_alias':
      return name ? { kind: 'type', name, exported: isExported(name) } : undefined;
    case 'method_spec':
      return name ? { kind: 'method', name, exported: isExported(name) } : undefined;
    case 'method_declaration':
    case 'const_declaration':
    case 'var_declaration':
      return 'skip';
    default:
      return undefined;
  }
}

function classifyTypeSpec(node: SyntaxNode, name: string): Classification {
  const exported = isExported(name);
  const body = node.childForFieldName('type');
  if (body?.type === 'struct_type') return { kind: 'struct', name, exported, extends: embeddedFields(body) };
  if (body?.type === 'interface_type') return { kind: 'interface', name, exported, extends: embeddedInterfaces(body) };
  return { kind: 'type', name, exported };
}

function embeddedFields(struct: SyntaxNode): string[] {
  const fields = struct.namedChildren.find((child) => child.type === 'field_declaration_list');
  const embedded = (fields?.namedChildren ?? []).filter(
    (field) => field.type === 'field_declaration' && !field.childForFieldName('name'),
  );
  return embedded.flatMap((field) => field.childForFieldName('type')?.text ?? []);
}

const EMBEDDABLE_TYPES = new Set(['type_identifier', 'qualified_type', 'generic_type']);

/** Embedded interfaces only; type-set unions such as `~int | string` are constraints, not parents. */
function embeddedInterfaces(contract: SyntaxNode): string[] {
  return contract.namedChildren.flatMap((element) => {
    if (element.type !== 'constraint_elem' && element.type !== 'type_elem') return [];
    const [only, ...rest] = element.namedChildren;
    return only && rest.length === 0 && EMBEDDABLE_TYPES.has(only.type) ? [only.text] : [];
  });
}

/** Methods and const/var specs, which `collectSymbols` cannot express (receiver container, several names per spec). */
function collectDeclarations(root: SyntaxNode): CodeSymbol[] {
  return root.namedChildren.flatMap((node) => {
    if (node.type === 'method_declaration') return methodOf(node);
    if (node.type === 'const_declaration' || node.type === 'var_declaration') return variablesOf(node);
    return [];
  });
}

function methodOf(node: SyntaxNode): CodeSymbol[] {
  const name = node.childForFieldName('name')?.text;
  const receiver = receiverTypeName(node);
  if (!name) return [];
  return [
    {
      name,
      kind: 'method',
      line: lineOf(node),
      endLine: node.endPosition.row + 1,
      exported: isExported(name),
      ...(receiver ? { container: receiver } : {}),
    },
  ];
}

function receiverTypeName(method: SyntaxNode): string | undefined {
  const parameter = method.childForFieldName('receiver')?.namedChildren[0];
  const type = parameter?.childForFieldName('type');
  return type ? baseTypeName(type) : undefined;
}

/** `*Server` and `Generic[T]` both name the type `Server` / `Generic`. */
function baseTypeName(type: SyntaxNode): string {
  if (type.type === 'pointer_type' && type.namedChildren[0]) return baseTypeName(type.namedChildren[0]);
  if (type.type === 'generic_type') {
    const generic = type.childForFieldName('type');
    if (generic) return baseTypeName(generic);
  }
  return type.text;
}

function variablesOf(declaration: SyntaxNode): CodeSymbol[] {
  const symbols: CodeSymbol[] = [];
  forEachNode(declaration, (node) => {
    if (node.type !== 'const_spec' && node.type !== 'var_spec') return true;
    for (const nameNode of node.childrenForFieldName('name').filter((child) => child.isNamed)) {
      if (nameNode.text === '_') continue;
      symbols.push({
        name: nameNode.text,
        kind: 'variable',
        line: lineOf(node),
        endLine: node.endPosition.row + 1,
        exported: isExported(nameNode.text),
      });
    }
    return false;
  });
  return symbols;
}

function collectImports(root: SyntaxNode): RawImport[] {
  const imports: RawImport[] = [];
  forEachNode(root, (node) => {
    if (node.type !== 'import_spec') return true;
    const path = node.childForFieldName('path');
    const alias = node.childForFieldName('name')?.text;
    if (path) imports.push({ specifier: unquote(path.text), names: alias ? [alias] : [], line: lineOf(node) });
    return false;
  });
  return imports;
}

export const go: LanguageSupport = {
  id: 'go',
  displayName: 'Go',
  grammar: 'go',
  extensions: ['.go'],
  ecosystem: 'go',
  extract,
};

interface GoModule {
  /** Repo directory holding the go.mod. */
  dir: string;
  path: string;
  required: string[];
}

/** Standard library paths have no dot in their first segment; module paths do (`github.com/...`). */
const EXTERNAL_PATH_SEGMENTS = 3;

export const goResolver: ResolverFactory = (project) => {
  const modules = readModules(project).sort((a, b) => b.path.length - a.path.length);
  const required = modules.flatMap((module) => module.required).sort((a, b) => b.length - a.length);
  return {
    resolve: (_fromPath, imported) => resolveImport(imported.specifier, modules, required, project),
  };
};

function resolveImport(
  importPath: string,
  modules: GoModule[],
  required: string[],
  project: ProjectContext,
): Resolution {
  const own = modules.find((module) => isPathUnder(importPath, module.path));
  if (own) return resolveInModule(importPath, own, project);
  if (!importPath.split('/')[0].includes('.')) return { builtin: importPath };
  const dependency = required.find((module) => isPathUnder(importPath, module));
  return { external: dependency ?? importPath.split('/').slice(0, EXTERNAL_PATH_SEGMENTS).join('/') };
}

function resolveInModule(importPath: string, module: GoModule, project: ProjectContext): Resolution {
  const remainder = importPath.slice(module.path.length + 1);
  const dir = joinRepoPath(module.dir, remainder);
  return dir !== undefined && project.dirs.has(dir) ? { target: dir } : { unresolved: true };
}

function isPathUnder(importPath: string, modulePath: string): boolean {
  return importPath === modulePath || importPath.startsWith(`${modulePath}/`);
}

function readModules(project: ProjectContext): GoModule[] {
  const modules: GoModule[] = [];
  for (const file of project.files) {
    if (file !== 'go.mod' && !file.endsWith('/go.mod')) continue;
    const parsed = parseGoMod(project.readText(file) ?? '');
    if (parsed.path) modules.push({ dir: dirOf(file), path: parsed.path, required: parsed.required });
  }
  return modules;
}

function parseGoMod(text: string): { path?: string; required: string[] } {
  let path: string | undefined;
  const required: string[] = [];
  let inRequireBlock = false;
  for (const rawLine of text.split('\n')) {
    const line = rawLine.replace(/\/\/.*$/, '').trim();
    if (inRequireBlock) {
      if (line === ')') inRequireBlock = false;
      else if (line) required.push(unquote(line.split(/\s+/)[0]));
      continue;
    }
    const moduleLine = /^module\s+(\S+)/.exec(line);
    if (moduleLine) path = unquote(moduleLine[1]);
    if (/^require\s*\($/.test(line)) inRequireBlock = true;
    const single = /^require\s+(\S+)/.exec(line);
    if (single && !single[1].startsWith('(')) required.push(unquote(single[1]));
  }
  return { path, required };
}
