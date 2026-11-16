import { watch } from 'node:fs';
import type { MapFolder } from './map/map-folder.ts';
import { type UpdateReport, updateMap } from './map/update-map.ts';

const DEBOUNCE_MS = 400;
const IGNORED_SEGMENTS = /(^|\/)(\.git|node_modules|\.venv|__pycache__|\.next|\.turbo|DerivedData|\.build)(\/|$)/;

/**
 * Re-runs the map update whenever project files change. Bursts of events are debounced
 * and updates never overlap: changes during an update trigger one more pass afterwards.
 */
export function watchProject(folder: MapFolder, onUpdate: (report: UpdateReport) => void, onError: (error: Error) => void): () => void {
  const mapDir = folder.relativeDir;
  let timer: NodeJS.Timeout | undefined;
  let running = false;
  let dirty = false;

  const run = async (): Promise<void> => {
    if (running) {
      dirty = true;
      return;
    }
    running = true;
    try {
      onUpdate(await updateMap(folder));
    } catch (error) {
      onError(error as Error);
    } finally {
      running = false;
      if (dirty) {
        dirty = false;
        void run();
      }
    }
  };

  const watcher = watch(folder.root, { recursive: true }, (_event, filename) => {
    const path = filename?.toString().split('\\').join('/');
    if (!path || IGNORED_SEGMENTS.test(path) || path === mapDir || path.startsWith(`${mapDir}/`)) return;
    clearTimeout(timer);
    timer = setTimeout(() => void run(), DEBOUNCE_MS);
  });
  return () => {
    clearTimeout(timer);
    watcher.close();
  };
}
