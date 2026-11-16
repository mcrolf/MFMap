import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** Marks hook commands mfmap owns, so install is idempotent and uninstall removes only ours. */
const HOOK_MARKER = 'MFMAP_HOOK=1';
const EDIT_TOOLS = 'Edit|Write|MultiEdit|NotebookEdit';
const HOOK_TIMEOUT_SECONDS = 120;

interface HookCommand {
  type: 'command';
  command: string;
  timeout?: number;
}

interface HookGroup {
  matcher?: string;
  hooks: HookCommand[];
}

type Settings = { hooks?: Record<string, HookGroup[]> } & Record<string, unknown>;

/**
 * The shell command that runs this same mfmap CLI. It uses `node` from PATH rather than the
 * absolute binary, which changes path on every Node upgrade.
 */
export function updateCommand(mapDir: string): string {
  const quote = (value: string) => `'${value.replaceAll("'", `'\\''`)}'`;
  const node = ['node', ...process.execArgv].map(quote).join(' ');
  return `${HOOK_MARKER} ${node} ${quote(process.argv[1])} update --quiet --map ${quote(mapDir)} || true`;
}

/**
 * Adds Claude Code hooks to `.claude/settings.local.json` (personal, not committed, because the
 * command holds absolute paths): update after each file-editing tool, and once when the agent
 * stops, which also catches files changed by shell commands.
 */
export function installClaudeHooks(projectRoot: string, mapDir: string): string {
  const path = join(projectRoot, '.claude', 'settings.local.json');
  const settings = withoutMfmapHooks(readSettings(path));
  const command: HookCommand = { type: 'command', command: updateCommand(mapDir), timeout: HOOK_TIMEOUT_SECONDS };
  const hooks = settings.hooks ?? {};
  hooks.PostToolUse = [...(hooks.PostToolUse ?? []), { matcher: EDIT_TOOLS, hooks: [command] }];
  hooks.Stop = [...(hooks.Stop ?? []), { hooks: [command] }];
  writeSettings(path, { ...settings, hooks });
  return path;
}

export function uninstallClaudeHooks(projectRoot: string): string | undefined {
  const path = join(projectRoot, '.claude', 'settings.local.json');
  if (!existsSync(path)) return undefined;
  writeSettings(path, withoutMfmapHooks(readSettings(path)));
  return path;
}

function withoutMfmapHooks(settings: Settings): Settings {
  if (!settings.hooks) return settings;
  const hooks: Record<string, HookGroup[]> = {};
  for (const [event, groups] of Object.entries(settings.hooks)) {
    const kept = groups
      .map((group) => ({ ...group, hooks: group.hooks.filter((hook) => !hook.command?.includes(HOOK_MARKER)) }))
      .filter((group) => group.hooks.length > 0);
    if (kept.length > 0) hooks[event] = kept;
  }
  const { hooks: _removed, ...rest } = settings;
  return Object.keys(hooks).length > 0 ? { ...rest, hooks } : rest;
}

function readSettings(path: string): Settings {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Settings;
  } catch (error) {
    throw new Error(`Cannot update ${path}: it is not valid JSON (${(error as Error).message}). Fix it and retry.`);
  }
}

function writeSettings(path: string, settings: Settings): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(settings, null, 2)}\n`);
}
