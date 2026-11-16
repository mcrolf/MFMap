// Links the built skill into the shared agent skills folder and Claude Code's skills folder,
// following the ~/.agents/skills -> ~/.claude/skills convention. Safe to re-run.
import { existsSync, lstatSync, mkdirSync, readlinkSync, symlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const skillDir = resolve('skill/codebase-map');
if (!existsSync(join(skillDir, 'bin', 'mfmap.mjs'))) {
  console.error('Build first: npm run build');
  process.exit(1);
}

const links = [
  [join(homedir(), '.agents', 'skills', 'codebase-map'), skillDir],
  [join(homedir(), '.claude', 'skills', 'codebase-map'), join(homedir(), '.agents', 'skills', 'codebase-map')],
];
for (const [link, target] of links) {
  mkdirSync(resolve(link, '..'), { recursive: true });
  const current = existsSync(link) || isSymlink(link) ? (isSymlink(link) ? readlinkSync(link) : 'a real folder') : undefined;
  if (current === target) {
    console.log(`ok       ${link} -> ${target}`);
  } else if (current) {
    console.error(`skipped  ${link} already exists (${current}); remove it to relink.`);
  } else {
    symlinkSync(target, link);
    console.log(`linked   ${link} -> ${target}`);
  }
}

function isSymlink(path) {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}
