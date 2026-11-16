import assert from 'node:assert/strict';
import { test } from 'node:test';
import { javascript, typescript } from '../../src/languages/typescript.ts';
import { extractFrom, outline } from '../helpers.ts';

const SAMPLE = `import def, { a as b, c } from './x';
import * as ns from '@scope/pkg/sub';
export { y } from './y';
export * from './z';
const r = require('fs');
const lazy = () => import('./dyn');
export default class Foo extends Bar implements Baz { m(): void {} private hidden() {} handler = () => 1; }
export interface I extends J { p: string }
export type U = string;
export enum E { A }
export const f = () => 1, g = 2;
const notExported = 3;
function h() { function inner() {} }
namespace N { export function q() {} }
app.get('/', () => { function callback() {} });
`;

test('typescript symbols: top-level, members, exports, no locals', async () => {
  const result = await extractFrom(typescript, SAMPLE);
  assert.deepEqual(outline(result), [
    '-function lazy@6',
    '+class Foo@7',
    '+method Foo.m@7',
    '-method Foo.hidden@7',
    '+method Foo.handler@7',
    '+interface I@8',
    '+type U@9',
    '+enum E@10',
    '+function f@11',
    '+variable g@11',
    '-function h@13',
    '-namespace N@14',
    '+method N.q@14',
  ]);
  assert.deepEqual(result.symbols.find((s) => s.name === 'Foo')?.extends, ['Bar', 'Baz']);
  assert.deepEqual(result.symbols.find((s) => s.name === 'I')?.extends, ['J']);
});

test('typescript imports: static, re-export, require, dynamic', async () => {
  const result = await extractFrom(typescript, SAMPLE);
  assert.deepEqual(
    result.imports.map((i) => `${i.specifier} [${i.names.join(',')}]@${i.line}`),
    ['./x [default,a,c]@1', '@scope/pkg/sub [*]@2', './y [y]@3', './z [*]@4', 'fs []@5', './dyn []@6'],
  );
});

test('javascript: class heritage, CommonJS exports, shebang entry point', async () => {
  const source = '#!/usr/bin/env node\nclass A extends B {}\nmodule.exports.run = function () {};\nexports.VERSION = 1;\n';
  const result = await extractFrom(javascript, source);
  assert.deepEqual(outline(result), ['-class A@2', '+function run@3', '+variable VERSION@4']);
  assert.deepEqual(result.symbols[0].extends, ['B']);
  assert.equal(result.entryPoint, true);
});
