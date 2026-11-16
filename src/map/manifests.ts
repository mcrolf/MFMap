import { parse as parseToml } from 'smol-toml';
import { parseJsonc } from '../jsonc.ts';
import type { DeclaredDependency, Manifest } from '../model.ts';
import { baseName, dirOf, joinRepoPath } from '../paths.ts';

type ManifestReader = (path: string, text: string) => Omit<Manifest, 'path'> | undefined;

/** Reads dependency manifests (package.json, pyproject.toml, go.mod, Cargo.toml, ...). */
export function readManifests(paths: string[], readText: (path: string) => string | undefined): Manifest[] {
  const manifests: Manifest[] = [];
  for (const path of paths) {
    const reader = readerFor(path);
    const text = reader && readText(path);
    if (!reader || text === undefined) continue;
    try {
      const manifest = reader(path, text);
      if (manifest) manifests.push({ path, ...manifest });
    } catch {
      // A malformed manifest is listed as a plain file; the rest of the map still builds.
    }
  }
  return manifests;
}

function readerFor(path: string): ManifestReader | undefined {
  const name = baseName(path);
  if (name === 'package.json') return readPackageJson;
  if (name === 'pyproject.toml') return readPyproject;
  if (/^requirements[\w.-]*\.txt$/.test(name)) return readRequirements;
  if (name === 'go.mod') return readGoMod;
  if (name === 'Cargo.toml') return readCargo;
  if (name === 'Package.swift') return readSwiftPackage;
  if (name === 'build.gradle' || name === 'build.gradle.kts') return readGradle;
  if (name === 'pom.xml') return readPom;
  if (name.endsWith('.csproj')) return readCsproj;
  return undefined;
}

const readPackageJson: ManifestReader = (path, text) => {
  const json = parseJsonc(text) as Record<string, unknown> | undefined;
  if (!json) return undefined;
  const dir = dirOf(path);
  const dependencies = [
    ...fromRecord(json.dependencies),
    ...fromRecord(json.peerDependencies),
    ...fromRecord(json.optionalDependencies),
    ...fromRecord(json.devDependencies, true),
  ];
  const bin = typeof json.bin === 'string' ? [json.bin] : Object.values((json.bin as Record<string, string>) ?? {});
  const entries = [json.main, json.module, ...bin].filter((e): e is string => typeof e === 'string');
  return {
    ecosystem: 'npm',
    name: typeof json.name === 'string' ? json.name : undefined,
    dependencies,
    entryPoints: entries.map((entry) => joinRepoPath(dir, entry)).filter((e): e is string => e !== undefined),
  };
};

function fromRecord(record: unknown, dev = false): DeclaredDependency[] {
  if (!record || typeof record !== 'object') return [];
  return Object.entries(record as Record<string, unknown>).map(([name, version]) => ({
    name,
    ...(typeof version === 'string' ? { version } : {}),
    ...(dev ? { dev: true } : {}),
  }));
}

/** `requests>=2.0; python_version<"3.8"` -> requests, >=2.0 */
function pep508(spec: string): DeclaredDependency | undefined {
  const match = spec.trim().match(/^([A-Za-z0-9][A-Za-z0-9._-]*)(?:\[[^\]]*\])?\s*([^;]*)/);
  if (!match) return undefined;
  const version = match[2].trim();
  return { name: match[1], ...(version ? { version } : {}) };
}

const readPyproject: ManifestReader = (_path, text) => {
  const toml = parseToml(text) as Record<string, any>;
  const project = toml.project ?? {};
  const poetry = toml.tool?.poetry ?? {};
  const dependencies: DeclaredDependency[] = [
    ...((project.dependencies as string[] | undefined) ?? []).map(pep508),
    ...Object.values((project['optional-dependencies'] as Record<string, string[]>) ?? {}).flat().map(pep508),
    ...(toml['dependency-groups'] ? Object.values(toml['dependency-groups'] as Record<string, unknown[]>).flat()
      .filter((d): d is string => typeof d === 'string').map((d) => ({ ...pep508(d)!, dev: true })) : []),
    ...fromRecord(poetry.dependencies).filter((d) => d.name !== 'python'),
    ...fromRecord(poetry.group?.dev?.dependencies ?? poetry['dev-dependencies'], true),
  ].filter((d): d is DeclaredDependency => d !== undefined);
  return {
    ecosystem: 'python',
    name: project.name ?? poetry.name,
    dependencies,
    // Console scripts name modules (`pkg.cli:main`), not files; `__main__` detection covers them.
    entryPoints: [],
  };
};

const readRequirements: ManifestReader = (_path, text) => ({
  ecosystem: 'python',
  dependencies: text
    .split('\n')
    .map((line) => line.replace(/#.*/, '').trim())
    .filter((line) => line && !line.startsWith('-'))
    .map(pep508)
    .filter((d): d is DeclaredDependency => d !== undefined),
  entryPoints: [],
});

const readGoMod: ManifestReader = (_path, text) => {
  const name = text.match(/^module\s+(\S+)/m)?.[1];
  const dependencies: DeclaredDependency[] = [];
  const requireLine = /^\s*(?:require\s+)?([\w.-]+\.[\w.-]+\/\S+)\s+(v\S+)(\s*\/\/\s*indirect)?/gm;
  for (const match of text.matchAll(requireLine)) {
    if (!match[3]) dependencies.push({ name: match[1], version: match[2] });
  }
  return { ecosystem: 'go', name, dependencies, entryPoints: [] };
};

const readCargo: ManifestReader = (path, text) => {
  const toml = parseToml(text) as Record<string, any>;
  const dir = dirOf(path);
  const cargoDeps = (table: unknown, dev = false): DeclaredDependency[] =>
    Object.entries((table as Record<string, unknown>) ?? {}).map(([name, spec]) => {
      const version = typeof spec === 'string' ? spec : (spec as { version?: string })?.version;
      return { name, ...(version ? { version } : {}), ...(dev ? { dev: true } : {}) };
    });
  const bins = ((toml.bin as Array<{ path?: string }>) ?? []).map((bin) => bin.path).filter(Boolean) as string[];
  return {
    ecosystem: 'cargo',
    name: toml.package?.name,
    dependencies: [
      ...cargoDeps(toml.dependencies),
      ...cargoDeps(toml['dev-dependencies'], true),
      ...cargoDeps(toml.workspace?.dependencies),
    ],
    entryPoints: bins.map((bin) => joinRepoPath(dir, bin)).filter((e): e is string => e !== undefined),
  };
};

const readSwiftPackage: ManifestReader = (_path, text) => ({
  ecosystem: 'swiftpm',
  name: text.match(/name:\s*"([^"]+)"/)?.[1],
  dependencies: [...text.matchAll(/\.package\(\s*(?:name:\s*"[^"]*",\s*)?(?:url|path):\s*"([^"]+)"(?:[^)]*?(?:from|exact|branch|revision):\s*"([^"]+)")?/g)].map(
    (match) => ({ name: match[1].replace(/\.git$/, '').split('/').pop()!, ...(match[2] ? { version: match[2] } : {}) }),
  ),
  entryPoints: [],
});

const readGradle: ManifestReader = (_path, text) => ({
  ecosystem: 'gradle',
  dependencies: [
    ...text.matchAll(/\b(implementation|api|compileOnly|runtimeOnly|kapt|ksp|testImplementation|androidTestImplementation)\s*\(?\s*["']([^"':]+:[^"':]+)(?::([^"']+))?["']/g),
  ].map((match) => ({
    name: match[2],
    ...(match[3] ? { version: match[3] } : {}),
    ...(/^(test|androidTest)/.test(match[1]) ? { dev: true } : {}),
  })),
  entryPoints: [],
});

const readPom: ManifestReader = (_path, text) => {
  const body = text.replace(/<!--[\s\S]*?-->/g, '');
  const dependencies = [...body.matchAll(/<dependency>([\s\S]*?)<\/dependency>/g)].map((match) => {
    const tag = (name: string) => match[1].match(new RegExp(`<${name}>([^<]+)</${name}>`))?.[1]?.trim();
    const version = tag('version');
    return {
      name: `${tag('groupId')}:${tag('artifactId')}`,
      ...(version ? { version } : {}),
      ...(tag('scope') === 'test' ? { dev: true } : {}),
    };
  });
  const withoutDependencies = body.replace(/<(dependencies|parent|build|dependencyManagement)>[\s\S]*?<\/\1>/g, '');
  return {
    ecosystem: 'maven',
    name: withoutDependencies.match(/<artifactId>([^<]+)<\/artifactId>/)?.[1],
    dependencies,
    entryPoints: [],
  };
};

const readCsproj: ManifestReader = (path, text) => ({
  ecosystem: 'nuget',
  name: baseName(path).replace(/\.csproj$/, ''),
  dependencies: [...text.matchAll(/<PackageReference\s+Include="([^"]+)"(?:\s+Version="([^"]+)")?/g)].map((match) => ({
    name: match[1],
    ...(match[2] ? { version: match[2] } : {}),
  })),
  entryPoints: [],
});
