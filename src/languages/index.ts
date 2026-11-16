import { extensionOf } from '../paths.ts';
import { nodeResolver } from './node-resolver.ts';
import { python, pythonResolver } from './python.ts';
import type { Ecosystem, LanguageSupport, ResolverFactory } from './types.ts';
import { javascript, tsx, typescript } from './typescript.ts';

export const LANGUAGES: readonly LanguageSupport[] = [typescript, tsx, javascript, python];

export const RESOLVERS: Partial<Record<Ecosystem, ResolverFactory>> = {
  node: nodeResolver,
  python: pythonResolver,
};

const byExtension = new Map<string, LanguageSupport>(
  LANGUAGES.flatMap((language) => language.extensions.map((ext) => [ext, language] as const)),
);

export function languageForPath(path: string): LanguageSupport | undefined {
  if (path.endsWith('.d.ts')) return typescript;
  return byExtension.get(extensionOf(path));
}
