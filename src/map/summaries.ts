import { createHash } from 'node:crypto';
import type { FileEntry, MapIndex, Summaries } from '../model.ts';
import { ancestorDirs } from '../paths.ts';

export const SUMMARIES_FILE = 'summaries.json';

export interface SummaryText {
  text: string;
  /** The file or directory changed after the summary was written. */
  stale: boolean;
}

export interface PendingSummaries {
  files: Array<{ path: string; reason: 'missing' | 'stale' }>;
  dirs: Array<{ path: string; reason: 'missing' | 'stale' }>;
}

export interface SummaryInput {
  files?: Record<string, string>;
  dirs?: Record<string, string>;
}

export function emptySummaries(): Summaries {
  return { files: {}, dirs: {} };
}

/** Tests, assets, lockfiles, and unparsable files are clear from their path; they get no summary. */
export function needsSummary(entry: FileEntry): boolean {
  if (entry.category === 'test' || entry.category === 'asset') return false;
  return entry.fileType !== 'Lockfile' && entry.skipped !== 'binary';
}

/** Directories in the map, with a signature that changes when their direct children change. */
export function directorySignatures(index: MapIndex): Map<string, string> {
  const children = new Map<string, Set<string>>();
  for (const file of index.files) {
    let child = file.path;
    for (const dir of ancestorDirs(file.path)) {
      if (!children.has(dir)) children.set(dir, new Set());
      children.get(dir)!.add(child);
      child = dir;
    }
  }
  const signatures = new Map<string, string>();
  for (const [dir, names] of children) {
    if (dir === '') continue;
    signatures.set(dir, createHash('sha256').update([...names].sort().join('\n')).digest('hex').slice(0, 16));
  }
  return signatures;
}

export class SummaryBook {
  private readonly data: Summaries;
  private readonly entries: Map<string, FileEntry>;
  private readonly dirSignatures: Map<string, string>;

  constructor(data: Summaries, index: MapIndex) {
    this.data = data;
    this.entries = new Map(index.files.map((entry) => [entry.path, entry]));
    this.dirSignatures = directorySignatures(index);
  }

  fileSummary(path: string): SummaryText | undefined {
    const record = this.data.files[path];
    if (!record) return undefined;
    return { text: record.summary, stale: record.hash !== this.entries.get(path)?.hash };
  }

  dirSummary(dir: string): SummaryText | undefined {
    const record = this.data.dirs[dir];
    if (!record) return undefined;
    return { text: record.summary, stale: record.hash !== this.dirSignatures.get(dir) };
  }

  /** Files and directories without a current summary. Code files come first. */
  pending(): PendingSummaries {
    const files = [...this.entries.values()]
      .filter(needsSummary)
      .sort((a, b) => Number(b.category === 'code') - Number(a.category === 'code') || a.path.localeCompare(b.path))
      .map((entry) => ({ path: entry.path, summary: this.fileSummary(entry.path) }))
      .filter(({ summary }) => !summary || summary.stale)
      .map(({ path, summary }) => ({ path, reason: summary ? ('stale' as const) : ('missing' as const) }));
    const dirs = [...this.dirSignatures.keys()]
      .sort()
      .map((path) => ({ path, summary: this.dirSummary(path) }))
      .filter(({ summary }) => !summary || summary.stale)
      .map(({ path, summary }) => ({ path, reason: summary ? ('stale' as const) : ('missing' as const) }));
    return { files, dirs };
  }

  /** Records summaries against the current file hashes. Returns paths that are not in the map. */
  apply(input: SummaryInput): string[] {
    const unknown: string[] = [];
    for (const [path, summary] of Object.entries(input.files ?? {})) {
      const entry = this.entries.get(path);
      if (!entry) unknown.push(path);
      else this.data.files[path] = { hash: entry.hash, summary: oneLine(summary) };
    }
    for (const [rawDir, summary] of Object.entries(input.dirs ?? {})) {
      const dir = rawDir.replace(/\/+$/, '');
      const signature = this.dirSignatures.get(dir);
      if (!signature) unknown.push(rawDir);
      else this.data.dirs[dir] = { hash: signature, summary: oneLine(summary) };
    }
    return unknown;
  }

  /** Summaries of files and directories that no longer exist, dropped and returned as paths. */
  pruneRemoved(): string[] {
    const removed: string[] = [];
    for (const path of Object.keys(this.data.files)) {
      if (!this.entries.has(path)) {
        delete this.data.files[path];
        removed.push(path);
      }
    }
    for (const dir of Object.keys(this.data.dirs)) {
      if (!this.dirSignatures.has(dir)) {
        delete this.data.dirs[dir];
        removed.push(`${dir}/`);
      }
    }
    return removed;
  }

  /** Sorted copy for stable output on disk. */
  toJSON(): Summaries {
    const sorted = (record: Summaries['files']) =>
      Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
    return { files: sorted(this.data.files), dirs: sorted(this.data.dirs) };
  }
}

function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
