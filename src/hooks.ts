import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative } from 'node:path';

export const AGENTS = ['claude', 'cursor', 'codex'] as const;
export type Agent = (typeof AGENTS)[number];

/** Marks hook commands mfmap owns, so install is idempotent and uninstall removes only ours. */
const HOOK_MARKER = 'MFMAP_HOOK=1';
const HOOK_TIMEOUT_SECONDS = 120;
/** Where `npm run install-skill` links the skill; hooks prefer it so committed files hold no personal paths. */
const INSTALLED_CLI = '.agents/skills/codebase-map/bin/mfmap.mjs';

interface HookTarget {
  /** Settings file, relative to the project root. */
  file: string;
  /** Edit-tool event and matcher, then the end-of-turn event. */
  install(settings: JsonObject, command: string): JsonObject;
}

type JsonObject = Record<string, unknown>;
type HookHandler = { type?: string; command?: string; timeout?: number };
type HookGroup = { matcher?: string; hooks: HookHandler[] };

const TARGETS: Record<Agent, HookTarget> = {
  // Personal and uncommitted, so it may hold absolute paths.
  claude: {
    file: '.claude/settings.local.json',
    install: (settings, command) => withGroups(settings, {
      PostToolUse: { matcher: 'Edit|Write|MultiEdit|NotebookEdit', hooks: [{ type: 'command', command, timeout: HOOK_TIMEOUT_SECONDS }] },
      Stop: { hooks: [{ type: 'command', command, timeout: HOOK_TIMEOUT_SECONDS }] },
    }),
  },
  // Project hooks run from the project root. Cursor's format has flat handler lists per event.
  cursor: {
    file: '.cursor/hooks.json',
    install: (settings, command) => {
      const hooks = (settings.hooks as Record<string, HookHandler[]> | undefined) ?? {};
      const add = (event: string) => [...(hooks[event] ?? []), { command, timeout: HOOK_TIMEOUT_SECONDS }];
      return { version: 1, ...settings, hooks: { ...hooks, afterFileEdit: add('afterFileEdit'), stop: add('stop') } };
    },
  },
  // Codex reports apply_patch edits as apply_patch, Edit, or Write. Repo hooks must be trusted via /hooks.
  codex: {
    file: '.codex/hooks.json',
    install: (settings, command) => withGroups(settings, {
      PostToolUse: { matcher: 'apply_patch|Edit|Write', hooks: [{ type: 'command', command, timeout: HOOK_TIMEOUT_SECONDS }] },
      Stop: { hooks: [{ type: 'command', command, timeout: HOOK_TIMEOUT_SECONDS }] },
    }),
  },
};

export function parseAgents(value: string | undefined): Agent[] {
  const names = (value ?? 'claude').split(',').map((name) => name.trim()).filter(Boolean);
  const agents = names.flatMap((name) => (name === 'all' ? [...AGENTS] : [name]));
  const unknown = agents.filter((name) => !(AGENTS as readonly string[]).includes(name));
  if (unknown.length > 0) throw new Error(`Unknown agent "${unknown.join(', ')}". Use ${AGENTS.join(', ')}, or all.`);
  return [...new Set(agents)] as Agent[];
}

/**
 * Adds hooks that run `mfmap update` after the agent edits a file and when it finishes a turn
 * (which also catches files changed by shell commands). Returns the settings files written.
 */
export function installHooks(projectRoot: string, mapDir: string, agents: Agent[]): string[] {
  return agents.map((agent) => {
    const target = TARGETS[agent];
    const path = join(projectRoot, target.file);
    const command = updateCommand(agent, projectRoot, mapDir);
    writeJson(path, target.install(withoutMfmapHooks(readJson(path)), command));
    return path;
  });
}

/** Removes only mfmap's hooks. Returns the settings files that existed and were cleaned. */
export function uninstallHooks(projectRoot: string, agents: Agent[]): string[] {
  return agents
    .map((agent) => join(projectRoot, TARGETS[agent].file))
    .filter((path) => existsSync(path))
    .map((path) => {
      writeJson(path, withoutMfmapHooks(readJson(path)));
      return path;
    });
}

/**
 * A POSIX shell command that never fails the agent: it runs the update when the CLI exists,
 * discards its output, and prints `{}` because Codex requires JSON from Stop hooks.
 */
export function updateCommand(agent: Agent, projectRoot: string, mapDir: string): string {
  return `${HOOK_MARKER}; [ -f ${cliPath()} ] && node ${cliPath()} update --quiet --map ${mapArgument(agent, projectRoot, mapDir)} >/dev/null 2>&1; echo '{}'`;
}

function cliPath(): string {
  const running = process.argv[1];
  const installed = join(homedir(), INSTALLED_CLI);
  if (existsSync(installed) && realpathSync(installed) === realpathSync(running)) return `"$HOME/${INSTALLED_CLI}"`;
  return shellQuote(running);
}

/** Committed hook files (Cursor, Codex) locate the map relative to the project, not this machine. */
function mapArgument(agent: Agent, projectRoot: string, mapDir: string): string {
  if (agent === 'claude') return shellQuote(mapDir);
  if (agent === 'cursor') return shellQuote(relative(projectRoot, mapDir));
  const gitRoot = gitRootOf(projectRoot);
  if (!gitRoot) return shellQuote(mapDir);
  return `"$(git rev-parse --show-toplevel)"/${shellQuote(relative(gitRoot, realpathSync(mapDir)))}`;
}

function gitRootOf(dir: string): string | undefined {
  try {
    const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return realpathSync(root.trim());
  } catch {
    return undefined;
  }
}

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", `'\\''`)}'`;
}

function withGroups(settings: JsonObject, added: Record<string, HookGroup>): JsonObject {
  const hooks = { ...((settings.hooks as Record<string, HookGroup[]> | undefined) ?? {}) };
  for (const [event, group] of Object.entries(added)) hooks[event] = [...(hooks[event] ?? []), group];
  return { ...settings, hooks };
}

/** Strips mfmap handlers from either format: groups with nested `hooks`, or flat handler lists. */
function withoutMfmapHooks(settings: JsonObject): JsonObject {
  const hooks = settings.hooks as Record<string, Array<HookGroup | HookHandler>> | undefined;
  if (!hooks) return settings;
  const isOurs = (handler: HookHandler) => Boolean(handler.command?.includes(HOOK_MARKER));
  const kept: Record<string, Array<HookGroup | HookHandler>> = {};
  for (const [event, entries] of Object.entries(hooks)) {
    const remaining = entries
      .map((entry) => ('hooks' in entry ? { ...entry, hooks: entry.hooks.filter((h) => !isOurs(h)) } : entry))
      .filter((entry) => ('hooks' in entry ? entry.hooks.length > 0 : !isOurs(entry)));
    if (remaining.length > 0) kept[event] = remaining;
  }
  const { hooks: _removed, ...rest } = settings;
  return Object.keys(kept).length > 0 ? { ...rest, hooks: kept } : rest;
}

function readJson(path: string): JsonObject {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as JsonObject;
  } catch (error) {
    throw new Error(`Cannot update ${path}: it is not valid JSON (${(error as Error).message}). Fix it and retry.`);
  }
}

function writeJson(path: string, value: JsonObject): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}
