import type { FileCategory } from '../model.ts';
import { baseName, extensionOf } from '../paths.ts';

/** Display names for file types that are listed but not parsed for symbols. */
const FILE_TYPES: Record<string, string> = {
  '.c': 'C', '.h': 'C header', '.cc': 'C++', '.cpp': 'C++', '.hpp': 'C++ header', '.m': 'Objective-C', '.mm': 'Objective-C++',
  '.rb': 'Ruby', '.php': 'PHP', '.scala': 'Scala', '.dart': 'Dart', '.lua': 'Lua', '.ex': 'Elixir', '.exs': 'Elixir',
  '.sh': 'Shell', '.bash': 'Shell', '.zsh': 'Shell', '.ps1': 'PowerShell', '.sql': 'SQL', '.graphql': 'GraphQL', '.gql': 'GraphQL',
  '.proto': 'Protocol Buffers', '.html': 'HTML', '.htm': 'HTML', '.css': 'CSS', '.scss': 'SCSS', '.sass': 'Sass', '.less': 'Less',
  '.vue': 'Vue', '.svelte': 'Svelte', '.astro': 'Astro', '.json': 'JSON', '.jsonc': 'JSON', '.yaml': 'YAML', '.yml': 'YAML',
  '.toml': 'TOML', '.xml': 'XML', '.ini': 'INI', '.env': 'Env', '.md': 'Markdown', '.mdx': 'MDX', '.rst': 'reStructuredText',
  '.txt': 'Text', '.csv': 'CSV', '.gradle': 'Gradle', '.csproj': 'MSBuild', '.sln': 'Visual Studio solution', '.tf': 'Terraform',
  '.prisma': 'Prisma', '.svg': 'SVG', '.png': 'PNG', '.jpg': 'JPEG', '.jpeg': 'JPEG', '.gif': 'GIF', '.webp': 'WebP',
  '.ico': 'Icon', '.woff': 'Font', '.woff2': 'Font', '.ttf': 'Font', '.otf': 'Font', '.mp3': 'Audio', '.wav': 'Audio',
  '.mp4': 'Video', '.mov': 'Video', '.pdf': 'PDF', '.lock': 'Lockfile', '.storyboard': 'Storyboard', '.xib': 'Interface Builder',
  '.plist': 'Property list', '.xcconfig': 'Xcode config', '.pbxproj': 'Xcode project',
};

const NAMED_TYPES: Record<string, string> = {
  Dockerfile: 'Dockerfile', Makefile: 'Makefile', Procfile: 'Procfile', Gemfile: 'Gemfile', Rakefile: 'Ruby',
  'package-lock.json': 'Lockfile', 'pnpm-lock.yaml': 'Lockfile', 'yarn.lock': 'Lockfile', 'Cargo.lock': 'Lockfile',
  'go.sum': 'Lockfile', 'go.mod': 'Go module', 'Package.resolved': 'Lockfile', 'poetry.lock': 'Lockfile', 'uv.lock': 'Lockfile',
};

const DOC_EXTENSIONS = new Set(['.md', '.mdx', '.rst', '.txt', '.adoc']);
const ASSET_EXTENSIONS = new Set([
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.mp3', '.wav', '.mp4', '.mov', '.pdf',
]);
const CONFIG_EXTENSIONS = new Set([
  '.json', '.jsonc', '.yaml', '.yml', '.toml', '.xml', '.ini', '.env', '.lock', '.gradle', '.csproj', '.sln', '.plist',
  '.xcconfig', '.pbxproj', '.tf',
]);
const CODE_EXTENSIONS = new Set(Object.keys(FILE_TYPES).filter(
  (ext) => !DOC_EXTENSIONS.has(ext) && !ASSET_EXTENSIONS.has(ext) && !CONFIG_EXTENSIONS.has(ext),
));

const TEST_PATH = /(^|\/)(__tests__|__mocks__|tests?|spec|specs|testing|e2e|src\/test)\/|\.(test|spec|e2e)\.[cm]?[jt]sx?$|_test\.(go|py)$|(^|\/)test_[^/]+\.py$|Tests?\.(swift|kt|java|cs)$/;
const CONFIG_NAME = /(^|\/)(\.[^/]+rc(\.\w+)?|[^/]+\.config\.[cm]?[jt]s|Dockerfile[^/]*|Makefile|Procfile|\.env[^/]*|\.gitignore|\.dockerignore|\.editorconfig)$/;

export function fileTypeOf(path: string): string | undefined {
  const name = baseName(path);
  return NAMED_TYPES[name] ?? (name.startsWith('Dockerfile') ? 'Dockerfile' : FILE_TYPES[extensionOf(path)]);
}

/** Categorises a file by path. `isParsedCode` marks files a language extractor handles. */
export function categoryOf(path: string, isParsedCode: boolean): FileCategory {
  const ext = extensionOf(path);
  if ((isParsedCode || CODE_EXTENSIONS.has(ext)) && TEST_PATH.test(path)) return 'test';
  if (CONFIG_NAME.test(path) || CONFIG_EXTENSIONS.has(ext) || NAMED_TYPES[baseName(path)]) return 'config';
  if (isParsedCode || CODE_EXTENSIONS.has(ext)) return 'code';
  if (DOC_EXTENSIONS.has(ext) || /(^|\/)(LICENSE|CHANGELOG|README|CONTRIBUTING)[^/]*$/i.test(path)) return 'docs';
  if (ASSET_EXTENSIONS.has(ext)) return 'asset';
  return 'other';
}
