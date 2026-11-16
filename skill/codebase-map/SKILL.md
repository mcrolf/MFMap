---
name: codebase-map
description: Builds and maintains a map of where everything is in a codebase (files, symbols with line numbers, imports, importers, area dependencies, external packages, and one-line summaries) in a folder the user names, links it from the top of AGENTS.md and CLAUDE.md, and keeps it current after files are added, removed, or changed. Use when the user asks to map a codebase, create, refresh, or update a codebase map, set up map hooks or a watcher, or when a project has an mfmap map (a folder with mfmap.json and MAP.md) and you changed files in it.
---

# Codebase Map

The map is built by the bundled `mfmap` CLI. The CLI does all parsing (tree-sitter, so results are deterministic and cost no tokens). Your job is the parts a parser cannot do: asking the user for decisions, writing summaries, and keeping the map current.

Run the CLI as `node <this skill's directory>/bin/mfmap.mjs <command>`. Below, `mfmap` means that full command. If `bin/mfmap.mjs` is missing, tell the user to run `npm install && npm run build` in the MFMap repository; do not try to rebuild it yourself from another location.

## Creating a map

1. Check for an existing map first: `mfmap summaries pending --limit 1` succeeds when one exists. If one exists, go to **Updating a map**.
2. Ask the user what to name the map folder. Suggest `codebase-map` and say it will be created at the project root (a nested path such as `docs/codebase-map` also works). Wait for the answer. Do not pick a name yourself.
3. From the project root, run `mfmap init <folder>`. It builds the map and adds a pointer block at the very top of `AGENTS.md` and `CLAUDE.md`, whichever exist, telling agents to use the map for locating anything. A `CLAUDE.md` that only imports `AGENTS.md` (`@AGENTS.md`) is left alone, since it already sees the pointer. It never creates either file; if neither exists, ask the user whether to create `AGENTS.md`, then run `mfmap pointer`.
4. Write summaries (below).
5. Offer automatic updates (below).
6. Report: map location, file count, languages, summaries written, and which update mode is on.

## Writing summaries

Summaries are one line each, stored in `summaries.json` against the file's content hash. When a file changes, its summary is flagged "(summary may be outdated)" until it is rewritten.

1. `mfmap summaries pending --json --limit 40` lists files (code first) and directories still missing a current summary, with each file's type, size, and top-level symbols.
2. For each file, read enough of it to say what it is for. Usually the top of the file and its exported symbols are enough; read the whole file when they are not.
3. Write the summaries as JSON and pipe them in:
   ```bash
   mfmap summaries set <<'JSON'
   {"files": {"src/auth/session.ts": "Creates, refreshes, and revokes user sessions stored in Redis."},
    "dirs": {"src/auth": "Authentication: sessions, password hashing, and OAuth providers."}}
   JSON
   ```
4. Repeat until nothing is pending. Do files before directories, since a directory summary is built from its files.

A good summary:
- Says what the file does or holds in the project's own domain terms, in at most about 20 words.
- Adds what the path and symbol names do not already say. "Express routes for checkout: cart totals, coupon validation, and Stripe payment intents" beats "Checkout routes file".
- Names notable side effects or integrations (writes to S3, calls the billing API, runs on a cron).
- Is a plain sentence with no markdown, no em dashes, and no line breaks.

Large projects: if more than 300 files are pending, tell the user the count and ask whether to summarize everything now, only directories plus entry points and key files (listed in MAP.md), or later. Independent batches of files can be summarized in parallel by subagents on a fast, inexpensive model; give each batch a disjoint list of paths and have each subagent run `mfmap summaries set` for its own batch.

## Updating a map

- `mfmap update` re-scans the project, re-parses only files whose content changed, re-resolves all imports, drops summaries of deleted files, and rewrites only the map files whose content changed. A no-op run takes well under a second.
- After you add, remove, rename, or change files in a mapped project, run `mfmap update`, then write summaries for anything `mfmap summaries pending` lists that you touched.
- `mfmap update --map <folder>` targets a map explicitly; otherwise the CLI finds the map folder from the current directory.

## Automatic updates

Ask the user which they want, then set it up:
- **Agent hooks:** ask which agents they use, then run `mfmap hooks install --agent <claude,cursor,codex|all>`. Each hook runs `mfmap update --quiet` after the agent edits a file and when it finishes a turn (which also catches files changed through shell commands). Hooks never fail the agent: they do nothing when the CLI is not installed and always print `{}`.
  - claude: `.claude/settings.local.json`, personal and not committed.
  - cursor: `.cursor/hooks.json`, project file meant to be committed; it locates the map relative to the project root and the CLI under `$HOME/.agents/skills` when installed there.
  - codex: `.codex/hooks.json`, project file meant to be committed. Tell the user to run `/hooks` in Codex once to review and trust the new hooks, or they will not run.
  - `mfmap hooks uninstall --agent ...` removes only mfmap's hooks and keeps everything else in those files.
  - The hook commands use POSIX shell syntax (macOS, Linux, WSL).
- **File watcher:** `mfmap watch` keeps the map current while anyone edits, for example in an IDE. It runs until stopped, so the user starts it in their own terminal or you start it as a background task if they ask.

Hooks and the watcher keep structure current. Summaries still need an agent, so after a hook-driven update `MAP.md` reports how many summaries are pending.

## Using a map

Read `<folder>/MAP.md` first. It explains the other files:
- `MAP.md`: layout tree with directory summaries, entry points, most-imported files, area-to-area dependencies, external packages per manifest, and how to search.
- `modules/<area>.md`: per area, each file's summary, symbols with line numbers, imports (with imported names), and importers.
- `symbols.tsv`, `files.tsv`, `edges.tsv`: one record per line for grep (`grep -P '^SessionStore\t' <folder>/symbols.tsv`).
- `index.json`: everything, one file per line; `summaries.json`: the summaries; `mfmap.json`: settings (`exclude` patterns, `areaFileLimit`).

Never edit generated map files by hand; change `mfmap.json` or summaries and run `mfmap update`.
