import { parse } from 'smol-toml';
import type { Extraction, RawImport } from '../model.ts';
import { baseName, dirOf, isWithin, joinRepoPath, stemOf, ancestorDirs } from '../paths.ts';
import { collectSymbols, forEachNode, lineOf } from './syntax.ts';
import type {
  Classification,
  ImportResolver,
  LanguageSupport,
  ProjectContext,
  Resolution,
  ResolverFactory,
  SyntaxNode,
} from './types.ts';

function extract(root: SyntaxNode): Extraction {
  const symbols = collectSymbols(root, classify);
  const hasMain = symbols.some((s) => s.kind === 'function' && s.name === 'main' && !s.container);
  return { symbols, imports: collectImports(root), ...(hasMain ? { entryPoint: true } : {}) };
}

function classify(node: SyntaxNode): Classification {
  const name = node.childForFieldName('name')?.text;
  const exported = isPublic(node);
  switch (node.type) {
    case 'function_item':
    case 'function_signature_item':
    case 'macro_definition':
      return name ? { kind: 'function', name, exported } : undefined;
    case 'struct_item':
    case 'union_item':
      return name ? { kind: 'struct', name, exported } : undefined;
    case 'enum_item':
      return name ? { kind: 'enum', name, exported } : undefined;
    case 'trait_item':
      return name ? { kind: 'trait', name, exported, extends: traitBounds(node) } : undefined;
    case 'type_item':
      return name ? { kind: 'type', name, exported } : undefined;
    case 'const_item':
    case 'static_item':
      return name ? { kind: 'variable', name, exported } : undefined;
    case 'mod_item':
      return name && node.childForFieldName('body') ? { kind: 'module', name, exported } : undefined;
    case 'impl_item':
      return classifyImpl(node);
    default:
      return undefined;
  }
}

function isPublic(node: SyntaxNode): boolean {
  return node.namedChildren.some((child) => child.type === 'visibility_modifier');
}

/** `trait A: B + C` lists its supertraits in a `bounds` field. */
function traitBounds(node: SyntaxNode): string[] {
  const bounds = node.childForFieldName('bounds');
  return (bounds?.namedChildren ?? []).filter((bound) => bound.type !== 'lifetime').map((bound) => bound.text);
}

/** `impl Display for Foo` is recorded as `Foo`, extending `Display`. */
function classifyImpl(node: SyntaxNode): Classification {
  const type = node.childForFieldName('type');
  if (!type) return undefined;
  const trait = node.childForFieldName('trait');
  return {
    kind: 'impl',
    name: implementedTypeName(type),
    exported: false,
    ...(trait ? { extends: [trait.text] } : {}),
  };
}

/** `Foo<T>` and `a::Foo` both name the type `Foo`. */
function implementedTypeName(type: SyntaxNode): string {
  if (type.type === 'generic_type') {
    const generic = type.childForFieldName('type');
    if (generic) return implementedTypeName(generic);
  }
  if (type.type === 'scoped_type_identifier') return type.childForFieldName('name')?.text ?? type.text;
  return type.text;
}

function collectImports(root: SyntaxNode): RawImport[] {
  const imports: RawImport[] = [];
  forEachNode(root, (node) => {
    const line = lineOf(node);
    if (node.type === 'use_declaration') {
      const argument = node.childForFieldName('argument');
      if (argument) {
        for (const leaf of expandUseTree(argument, [])) imports.push({ ...leaf, line });
      }
    } else if (node.type === 'mod_item' && !node.childForFieldName('body')) {
      const name = node.childForFieldName('name')?.text;
      if (name) imports.push({ specifier: `mod:${name}`, names: [], line });
    } else if (node.type === 'extern_crate_declaration') {
      const name = node.childForFieldName('name')?.text;
      if (name) imports.push({ specifier: name, names: [], line });
    }
  });
  return imports;
}

type UseLeaf = Pick<RawImport, 'specifier' | 'names'>;

/** Flattens `a::{b, c::d as e, f::*}` into one leaf per imported path. */
function expandUseTree(node: SyntaxNode, prefix: string[]): UseLeaf[] {
  switch (node.type) {
    case 'scoped_use_list':
      return expandUseList(node, [...prefix, ...pathSegments(node.childForFieldName('path'))]);
    case 'use_list':
      return expandUseList(node, prefix);
    case 'use_as_clause':
      return expandUseTree(node.childForFieldName('path') ?? node, prefix);
    case 'use_wildcard':
      return [{ specifier: [...prefix, ...pathSegments(node.namedChildren[0])].join('::'), names: ['*'] }];
    case 'self':
      return prefix.length > 0 ? [leafOf(prefix)] : [];
    default:
      return [leafOf([...prefix, ...pathSegments(node)])];
  }
}

function expandUseList(node: SyntaxNode, prefix: string[]): UseLeaf[] {
  const list = node.type === 'use_list' ? node : node.childForFieldName('list');
  return (list?.namedChildren ?? []).flatMap((child) => expandUseTree(child, prefix));
}

function leafOf(segments: string[]): UseLeaf {
  return { specifier: segments.join('::'), names: [segments[segments.length - 1]] };
}

function pathSegments(node: SyntaxNode | null | undefined): string[] {
  if (!node) return [];
  if (node.type !== 'scoped_identifier') return [node.text];
  const name = node.childForFieldName('name');
  return [...pathSegments(node.childForFieldName('path')), ...(name ? [name.text] : [])];
}

export const rust: LanguageSupport = {
  id: 'rust',
  displayName: 'Rust',
  grammar: 'rust',
  extensions: ['.rs'],
  ecosystem: 'rust',
  extract,
};

interface Crate {
  dir: string;
  /** Directory of the crate's root module. */
  srcDir: string;
  /** `src/lib.rs`, else `src/main.rs`. */
  root?: string;
}

const BUILTIN_CRATES: ReadonlySet<string> = new Set(['std', 'core', 'alloc', 'proc_macro', 'test']);
const MODULE_ROOT_FILES: ReadonlySet<string> = new Set(['mod.rs', 'lib.rs', 'main.rs']);

export const rustResolver: ResolverFactory = (project) => new RustResolver(project);

class RustResolver implements ImportResolver {
  private readonly project: ProjectContext;
  private readonly cratesByDir = new Map<string, Crate>();
  private readonly cratesByName = new Map<string, Crate>();

  constructor(project: ProjectContext) {
    this.project = project;
    for (const file of project.files) {
      if (baseName(file) !== 'Cargo.toml') continue;
      const name = packageNameOf(project.readText(file));
      if (!name) continue;
      const crate = this.crateAt(dirOf(file));
      this.cratesByDir.set(crate.dir, crate);
      this.cratesByName.set(name.replace(/-/g, '_'), crate);
    }
  }

  resolve(fromPath: string, imported: { specifier: string }): Resolution {
    const { specifier } = imported;
    if (specifier.startsWith('mod:')) return this.resolveModDeclaration(fromPath, specifier.slice('mod:'.length));
    const [first, ...rest] = specifier.split('::');
    if (BUILTIN_CRATES.has(first)) return { builtin: first };
    const crate = this.crateOf(fromPath);
    if (first === 'crate') return crate ? this.resolveFrom(crate, crate.srcDir, rest, fromPath) : { unresolved: true };
    if (first === 'self') return this.resolveFrom(crate, moduleDirOf(fromPath), rest, fromPath);
    if (first === 'super') return this.resolveSuper(crate, fromPath, rest);
    const named = this.cratesByName.get(first);
    if (named) return this.resolveFrom(named, named.srcDir, rest, fromPath);
    const siblingDir = moduleDirOf(fromPath);
    if (this.findModuleFile(siblingDir, first)) return this.resolveFrom(crate, siblingDir, [first, ...rest], fromPath);
    return { external: first };
  }

  private crateAt(dir: string): Crate {
    const srcDir = joinRepoPath(dir, 'src') ?? 'src';
    const root = [`${srcDir}/lib.rs`, `${srcDir}/main.rs`].find((candidate) => this.project.files.has(candidate));
    return { dir, srcDir, root };
  }

  private crateOf(file: string): Crate | undefined {
    for (const dir of ancestorDirs(file)) {
      const crate = this.cratesByDir.get(dir);
      if (crate) return crate;
    }
    return undefined;
  }

  private resolveModDeclaration(fromPath: string, name: string): Resolution {
    const file = this.findModuleFile(moduleDirOf(fromPath), name);
    return file ? { target: file } : { unresolved: true };
  }

  /** `super::` climbs one module per segment; a module's children live in its own directory. */
  private resolveSuper(crate: Crate | undefined, fromPath: string, segments: string[]): Resolution {
    let dir = moduleDirOf(fromPath);
    let rest = segments;
    while (true) {
      dir = dirOf(dir);
      if (rest[0] !== 'super') break;
      rest = rest.slice(1);
    }
    if (crate && !isWithin(dir, crate.srcDir)) return { unresolved: true };
    return this.resolveFrom(crate, dir, rest, fromPath);
  }

  /** Longest module path wins; with no module file the items live in the module at `baseDir` itself. */
  private resolveFrom(crate: Crate | undefined, baseDir: string, segments: string[], fromPath: string): Resolution {
    const file = this.findLongestModulePath(baseDir, segments) ?? this.moduleFileOf(crate, baseDir);
    return file && file !== fromPath ? { target: file } : { unresolved: true };
  }

  private findLongestModulePath(baseDir: string, segments: string[]): string | undefined {
    for (let length = segments.length; length >= 1; length--) {
      const parentDir = joinRepoPath(baseDir, ...segments.slice(0, length - 1));
      const file = parentDir === undefined ? undefined : this.findModuleFile(parentDir, segments[length - 1]);
      if (file) return file;
    }
    return undefined;
  }

  private findModuleFile(parentDir: string, name: string): string | undefined {
    const candidates = [joinRepoPath(parentDir, `${name}.rs`), joinRepoPath(parentDir, name, 'mod.rs')];
    return candidates.find((candidate) => candidate !== undefined && this.project.files.has(candidate));
  }

  /** The file defining the module whose children live in `dir`. */
  private moduleFileOf(crate: Crate | undefined, dir: string): string | undefined {
    if (!crate) return undefined;
    if (dir === crate.srcDir) return crate.root;
    return [`${dir}.rs`, `${dir}/mod.rs`].find((candidate) => this.project.files.has(candidate));
  }
}

/** Directory where `mod x;` and `self::` children of this file live. */
function moduleDirOf(file: string): string {
  const dir = dirOf(file);
  const isModuleRoot = MODULE_ROOT_FILES.has(baseName(file)) || /(^|\/)src\/bin$/.test(dir);
  return isModuleRoot ? dir : (joinRepoPath(dir, stemOf(file)) ?? dir);
}

function packageNameOf(cargoToml: string | undefined): string | undefined {
  if (cargoToml === undefined) return undefined;
  try {
    const pkg = parse(cargoToml).package;
    return pkg && typeof pkg === 'object' && 'name' in pkg && typeof pkg.name === 'string' ? pkg.name : undefined;
  } catch {
    return undefined;
  }
}
