import type { Extraction, RawImport } from '../model.ts';
import { ancestorDirs, dirOf, joinRepoPath } from '../paths.ts';
import { collectSymbols, forEachNode, lineOf } from './syntax.ts';
import type { Classification, LanguageSupport, ResolverFactory, Resolution, SyntaxNode } from './types.ts';

function extractPython(root: SyntaxNode, source: string): Extraction {
  return {
    symbols: collectSymbols(root, classify),
    imports: collectImports(root),
    ...(/^if\s+__name__\s*==\s*['"]__main__['"]\s*:/m.test(source) ? { entryPoint: true } : {}),
  };
}

const isPublic = (name: string): boolean => !name.startsWith('_') || /^__\w+__$/.test(name);

function classify(node: SyntaxNode): Classification {
  const name = node.childForFieldName('name')?.text;
  switch (node.type) {
    case 'class_definition':
      return name
        ? { kind: 'class', name, exported: isPublic(name), extends: superclasses(node), span: decoratedSpan(node) }
        : undefined;
    case 'function_definition':
      return name ? { kind: 'function', name, exported: isPublic(name), span: decoratedSpan(node) } : undefined;
    case 'assignment':
      return classifyModuleVariable(node);
    case 'lambda':
      return 'skip';
    default:
      return undefined;
  }
}

/** Line ranges start at the first decorator so `@app.route(...)` lines belong to the definition. */
function decoratedSpan(node: SyntaxNode): SyntaxNode {
  return node.parent?.type === 'decorated_definition' ? node.parent : node;
}

function superclasses(node: SyntaxNode): string[] {
  const list = node.childForFieldName('superclasses');
  if (!list) return [];
  return list.namedChildren.filter((arg) => arg.type !== 'keyword_argument').map((arg) => arg.text);
}

/** Module-level `NAME = ...`. Class attributes and dunders such as `__all__` are left out. */
function classifyModuleVariable(node: SyntaxNode): Classification {
  const target = node.childForFieldName('left');
  const isModuleLevel = node.parent?.type === 'expression_statement' && node.parent.parent?.type === 'module';
  if (!isModuleLevel || target?.type !== 'identifier' || /^__\w+__$/.test(target.text)) return 'skip';
  return { kind: 'variable', name: target.text, exported: isPublic(target.text) };
}

function collectImports(root: SyntaxNode): RawImport[] {
  const imports: RawImport[] = [];
  forEachNode(root, (node) => {
    if (node.type === 'import_statement') {
      for (const name of node.childrenForFieldName('name')) {
        const module = name.type === 'aliased_import' ? name.childForFieldName('name') : name;
        if (module) imports.push({ specifier: module.text, names: [], line: lineOf(node) });
      }
      return false;
    }
    if (node.type === 'import_from_statement') {
      const module = node.childForFieldName('module_name');
      if (module) imports.push({ specifier: module.text.replace(/\s+/g, ''), names: fromNames(node), line: lineOf(node) });
      return false;
    }
    return true;
  });
  return imports;
}

function fromNames(node: SyntaxNode): string[] {
  if (node.namedChildren.some((child) => child.type === 'wildcard_import')) return ['*'];
  return node.childrenForFieldName('name').map((name) =>
    name.type === 'aliased_import' ? (name.childForFieldName('name')?.text ?? name.text) : name.text,
  );
}

export const python: LanguageSupport = {
  id: 'python',
  displayName: 'Python',
  grammar: 'python',
  extensions: ['.py', '.pyi'],
  ecosystem: 'python',
  extract: extractPython,
};

/**
 * Maps dotted module names to files. A file is indexed under every plausible source root:
 * the repo root, `src/`, and the first ancestor directory without `__init__.py`.
 */
export const pythonResolver: ResolverFactory = (project) => {
  const modules = new Map<string, string>();
  const addModule = (name: string, path: string): void => {
    if (name && !modules.has(name)) modules.set(name, path);
  };
  for (const path of project.files) {
    if (!/\.pyi?$/.test(path)) continue;
    const dotted = path.replace(/\.pyi?$/, '').replace(/\/__init__$/, '').replace(/^__init__$/, '');
    for (const root of sourceRootsOf(path, project.files)) {
      const relative = root === '' ? dotted : dotted.startsWith(`${root}/`) ? dotted.slice(root.length + 1) : undefined;
      if (relative !== undefined) addModule(relative.replaceAll('/', '.'), path);
    }
  }

  const lookup = (dotted: string): string | undefined => {
    const parts = dotted.split('.');
    for (let length = parts.length; length > 0; length--) {
      const found = modules.get(parts.slice(0, length).join('.'));
      if (found) return found;
    }
    return undefined;
  };

  return {
    resolve(fromPath, imported): Resolution {
      if (imported.specifier.startsWith('.')) return resolveRelative(fromPath, imported, project.files);
      const candidates = imported.names.filter((n) => n !== '*').map((n) => `${imported.specifier}.${n}`);
      const target = candidates.map((c) => modules.get(c)).find(Boolean) ?? lookup(imported.specifier);
      if (target) return { target };
      const top = imported.specifier.split('.')[0];
      return PYTHON_STDLIB.has(top) ? { builtin: top } : { external: top };
    },
  };
};

function sourceRootsOf(path: string, files: ReadonlySet<string>): string[] {
  const roots = new Set<string>(['']);
  if (path.startsWith('src/')) roots.add('src');
  const packageRoot = ancestorDirs(path).find((dir) => dir === '' || !files.has(`${dir}/__init__.py`));
  if (packageRoot !== undefined) roots.add(packageRoot);
  return [...roots];
}

function resolveRelative(fromPath: string, imported: RawImport, files: ReadonlySet<string>): Resolution {
  const dots = imported.specifier.match(/^\.+/)![0].length;
  const modulePath = imported.specifier.slice(dots).replaceAll('.', '/');
  let base: string | undefined = dirOf(fromPath);
  for (let level = 1; level < dots && base !== undefined; level++) base = base === '' ? undefined : dirOf(base);
  if (base === undefined) return { unresolved: true };

  const moduleDir = joinRepoPath(base, modulePath);
  if (moduleDir === undefined) return { unresolved: true };
  const asFile = (dir: string, name?: string): string | undefined => {
    const stem = name ? joinRepoPath(dir, name) : dir;
    const options = [`${stem}.py`, `${stem}.pyi`, `${stem}/__init__.py`];
    return options.find((option) => files.has(option));
  };
  const named = imported.names.filter((n) => n !== '*').map((n) => asFile(moduleDir, n)).find(Boolean);
  const target = named ?? (modulePath ? asFile(moduleDir) : asFile(base, '__init__'));
  return target ? { target } : { unresolved: true };
}

/** Top-level standard library modules (CPython 3.13). */
const PYTHON_STDLIB = new Set(
  `__future__ _thread abc aifc argparse array ast asyncio atexit base64 bdb binascii bisect builtins bz2
  calendar cmath cmd code codecs codeop collections colorsys compileall concurrent configparser contextlib
  contextvars copy copyreg cProfile csv ctypes curses dataclasses datetime dbm decimal difflib dis doctest
  email encodings ensurepip enum errno faulthandler fcntl filecmp fileinput fnmatch fractions ftplib functools
  gc getopt getpass gettext glob graphlib grp gzip hashlib heapq hmac html http idlelib imaplib importlib
  inspect io ipaddress itertools json keyword linecache locale logging lzma mailbox marshal math mimetypes
  mmap modulefinder msvcrt multiprocessing netrc numbers operator optparse os pathlib pdb pickle pickletools
  pkgutil platform plistlib poplib posix pprint profile pstats pty pwd py_compile pyclbr pydoc queue quopri
  random re readline reprlib resource rlcompleter runpy sched secrets select selectors shelve shlex shutil
  signal site smtplib socket socketserver sqlite3 ssl stat statistics string stringprep struct subprocess
  symtable sys sysconfig syslog tabnanny tarfile tempfile termios textwrap threading time timeit tkinter
  token tokenize tomllib trace traceback tracemalloc tty turtle types typing unicodedata unittest urllib
  uuid venv warnings wave weakref webbrowser winreg winsound wsgiref xml xmlrpc zipapp zipfile zipimport zlib
  zoneinfo`.split(/\s+/),
);
