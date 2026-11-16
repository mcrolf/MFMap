import { extensionOf } from '../paths.ts';
import { csharp, dotnetResolver } from './csharp.ts';
import { go, goResolver } from './go.ts';
import { java } from './java.ts';
import { jvmResolver } from './jvm-resolver.ts';
import { kotlin } from './kotlin.ts';
import { nodeResolver } from './node-resolver.ts';
import { python, pythonResolver } from './python.ts';
import { rust, rustResolver } from './rust.ts';
import { swift, swiftResolver } from './swift.ts';
import type { Ecosystem, LanguageSupport, ResolverFactory } from './types.ts';
import { javascript, tsx, typescript } from './typescript.ts';

export const LANGUAGES: readonly LanguageSupport[] = [
  typescript, tsx, javascript, python, go, rust, java, kotlin, csharp, swift,
];

export const RESOLVERS: Record<Ecosystem, ResolverFactory> = {
  node: nodeResolver,
  python: pythonResolver,
  go: goResolver,
  rust: rustResolver,
  jvm: jvmResolver,
  dotnet: dotnetResolver,
  swift: swiftResolver,
};

const byExtension = new Map<string, LanguageSupport>(
  LANGUAGES.flatMap((language) => language.extensions.map((ext) => [ext, language] as const)),
);

export function languageForPath(path: string): LanguageSupport | undefined {
  if (path.endsWith('.d.ts')) return typescript;
  return byExtension.get(extensionOf(path));
}
