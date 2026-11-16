import assert from 'node:assert/strict';
import { test } from 'node:test';
import { kotlin } from '../../src/languages/kotlin.ts';
import { extractFrom, outline } from '../helpers.ts';

const SAMPLE = `package com.example.app

import java.util.List
import com.foo.*
import com.foo.Bar as Baz

typealias Handler = (Int) -> Unit
val top = 1
private val hidden = 2
val callback = { x: Int -> x }

fun main(args: Array<String>) { val f = { x: Int -> x }; fun local() {} }
private fun priv() {}
internal fun intern() {}
fun String.ext(): Int = 1

open class Base(val a: Int) : Parent(), Runnable, Comparable<Base> {
    val prop = 1
    fun m() {}
    private fun p() {}
    constructor(x: String) : this(1)
    companion object { fun make() = Base(1) }
    object Inner
    class Nested
}
data class D(val x: Int)
sealed class S
enum class E { A, B; fun z() {} }
interface I : J { fun go() }
object Single : Base(1)
val anonymous = object : Runnable { override fun run() {} }
`;

test('kotlin symbols: top-level declarations, members, and visibility', async () => {
  const result = await extractFrom(kotlin, SAMPLE);
  assert.deepEqual(outline(result), [
    '+type Handler@7',
    '+variable top@8',
    '-variable hidden@9',
    '+variable callback@10',
    '+function main@12',
    '-function priv@13',
    '-function intern@14',
    '+function ext@15',
    '+class Base@17',
    '+method Base.m@19',
    '-method Base.p@20',
    '+object Base.Companion@22',
    '+method Base.Companion.make@22',
    '+object Base.Inner@23',
    '+class Base.Nested@24',
    '+class D@26',
    '+class S@27',
    '+enum E@28',
    '+method E.z@28',
    '+interface I@29',
    '+method I.go@29',
    '+object Single@30',
    '+variable anonymous@31',
  ]);
});

test('kotlin supertypes, package, and entry point', async () => {
  const result = await extractFrom(kotlin, SAMPLE);
  const extendsOf = (name: string) => result.symbols.find((s) => s.name === name)?.extends;
  assert.deepEqual(extendsOf('Base'), ['Parent', 'Runnable', 'Comparable<Base>']);
  assert.deepEqual(extendsOf('I'), ['J']);
  assert.deepEqual(extendsOf('Single'), ['Base']);
  assert.equal(result.packageName, 'com.example.app');
  assert.equal(result.entryPoint, true);
});

test('kotlin: a member named main is not an entry point; file without package has none', async () => {
  const result = await extractFrom(kotlin, 'class A { fun main() {} }');
  assert.equal(result.entryPoint, undefined);
  assert.equal(result.packageName, undefined);
});

test('kotlin imports: single, wildcard, alias keeps the original name', async () => {
  const result = await extractFrom(kotlin, SAMPLE);
  assert.deepEqual(
    result.imports.map((i) => `${i.specifier} [${i.names.join(',')}]@${i.line}`),
    ['java.util.List [List]@3', 'com.foo [*]@4', 'com.foo.Bar [Bar]@5'],
  );
});
