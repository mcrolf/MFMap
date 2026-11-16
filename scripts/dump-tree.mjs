// Dev aid: prints the syntax tree of a file. Usage: node scripts/dump-tree.mjs <grammar> <file>
import Parser from 'web-tree-sitter';
import { readFileSync } from 'node:fs';
const [grammar, file] = process.argv.slice(2);
await Parser.init();
const language = await Parser.Language.load(`node_modules/tree-sitter-wasms/out/tree-sitter-${grammar}.wasm`);
const parser = new Parser();
parser.setLanguage(language);
const tree = parser.parse(readFileSync(file, 'utf8'));
const print = (node, depth, field) => {
  if (!node.isNamed) return;
  const text = node.childCount === 0 ? ` "${node.text.slice(0, 40)}"` : '';
  console.log(`${'  '.repeat(depth)}${field ? field + ': ' : ''}${node.type}${text}`);
  node.children.forEach((child, i) => print(child, depth + 1, node.fieldNameForChild(i)));
};
print(tree.rootNode, 0);
