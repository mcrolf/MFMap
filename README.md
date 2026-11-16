# mfmap

Builds and maintains an agent-readable map of a codebase: where every file and symbol is, what imports what, how areas depend on each other, and which third-party packages are used. Parsing uses tree-sitter (WASM), so the structure is deterministic and costs no tokens. Agents add one-line summaries, which are tied to each file's content hash and flagged when the file changes.

Parsed languages: TypeScript, TSX, JavaScript, Python, Go, Rust, Java, Kotlin, C#, Swift. Every other file is still listed with its type and size.

## Build and install

```bash
npm install
npm run build          # bundles skill/codebase-map/bin/mfmap.mjs plus the grammars it needs
npm run install-skill  # links the skill into ~/.agents/skills and ~/.claude/skills
npm test
```

The skill (`skill/codebase-map/SKILL.md`) is the agent workflow: it asks for the map folder name, runs `init`, writes summaries, and sets up automatic updates.

## CLI

Run `node skill/codebase-map/bin/mfmap.mjs --help` for the full list.

| Command | What it does |
| --- | --- |
| `mfmap init <folder>` | Creates the map folder, builds the map, and adds a pointer to the top of `AGENTS.md` when it exists |
| `mfmap update` | Re-parses only files whose content changed and rewrites only map files that changed |
| `mfmap watch` | Updates the map as files change |
| `mfmap summaries pending` / `set` | Lists missing or stale summaries; records new ones from JSON |
| `mfmap hooks install` / `uninstall` | Claude Code hooks in `.claude/settings.local.json` that update after edits and when the agent stops |
| `mfmap agents-md` | Adds or refreshes the `AGENTS.md` pointer |

## Map folder

| File | Purpose |
| --- | --- |
| `MAP.md` | Entry point: layout with directory summaries, entry points, most-imported files, area dependencies, external packages, search recipes |
| `modules/<area>.md` | Per area: each file's summary, symbols with line numbers, imports with names, importers |
| `symbols.tsv`, `files.tsv`, `edges.tsv` | One record per line, for grep |
| `index.json` | Full model, one file per line |
| `summaries.json` | Agent-written summaries keyed by content hash |
| `mfmap.json` | Settings: `exclude` (gitignore-style patterns) and `areaFileLimit` |

## Development

`src/languages/` holds one plugin per language (an extractor over the tree-sitter syntax tree) and one resolver per ecosystem. `scripts/dump-tree.mjs <grammar> <file>` prints a grammar's node types when writing an extractor.
