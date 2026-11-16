import { isWithin } from '../paths.ts';

/** Directories smaller than this fold into their parent's page instead of getting their own. */
const MIN_AREA_FILES = 12;

/** A slice of the project documented on one page of the map. */
export interface Area {
  /** Directory the area is rooted at ('' for the project root). */
  dir: string;
  /** File name of the area's page inside `modules/`. */
  page: string;
  files: string[];
}

/**
 * Splits the project into area pages of at most `fileLimit` files where possible.
 * A directory over the limit is split: subdirectories big enough become their own areas
 * and the rest (direct files plus small subdirectories) stays on the directory's page.
 */
export function planAreas(paths: string[], fileLimit: number): Area[] {
  const areas: Area[] = [];
  splitDirectory('', [...paths].sort(), fileLimit, areas);
  return areas.sort((a, b) => a.dir.localeCompare(b.dir));
}

function splitDirectory(dir: string, paths: string[], fileLimit: number, areas: Area[]): void {
  const bySubdir = new Map<string, string[]>();
  const kept: string[] = [];
  for (const path of paths) {
    const rest = dir === '' ? path : path.slice(dir.length + 1);
    const slash = rest.indexOf('/');
    if (slash === -1) {
      kept.push(path);
      continue;
    }
    const subdir = dir === '' ? rest.slice(0, slash) : `${dir}/${rest.slice(0, slash)}`;
    bySubdir.set(subdir, [...(bySubdir.get(subdir) ?? []), path]);
  }
  for (const [subdir, files] of bySubdir) {
    if (files.length > fileLimit) splitDirectory(subdir, files, fileLimit, areas);
    else if (files.length >= MIN_AREA_FILES) areas.push(areaFor(subdir, files));
    else kept.push(...files);
  }
  if (kept.length > 0 || dir === '') areas.push(areaFor(dir, kept.sort()));
}

function areaFor(dir: string, files: string[]): Area {
  return { dir, page: dir === '' ? '_root.md' : `${dir.replaceAll('/', '--')}.md`, files };
}

/** Maps each file to its area. */
export function areaIndex(areas: Area[]): Map<string, Area> {
  const index = new Map<string, Area>();
  for (const area of areas) for (const file of area.files) index.set(file, area);
  return index;
}

/** The area that owns a directory path (used for package-level edge targets). */
export function areaOfDir(dir: string, areas: Area[]): Area | undefined {
  return areas
    .filter((area) => isWithin(dir, area.dir))
    .sort((a, b) => b.dir.length - a.dir.length)
    .find((area) => area.files.some((file) => isWithin(file, dir)));
}
