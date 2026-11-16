import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groupOf, prefixChain } from '../src/render/graph-data.ts';

test('grouping descends through wrapper directories into the one holding most of the code', () => {
  const code = [
    ...Array.from({ length: 9 }, (_, i) => `app/src/main/java/com/acme/${i % 2 ? 'billing' : 'auth'}/F${i}.java`),
    'app/src/main/java/vendor/Lib.java',
  ];
  assert.deepEqual(prefixChain('app', code), ['app', 'app/src', 'app/src/main', 'app/src/main/java', 'app/src/main/java/com', 'app/src/main/java/com/acme']);
  assert.deepEqual(prefixChain('', ['src/a/x.ts', 'src/b/y.ts']), ['', 'src']);
  assert.deepEqual(prefixChain('', ['a/x.ts', 'b/y.ts']), ['']);
});

test('files outside the dominant directory keep their own group', () => {
  const chain = ['app', 'app/src', 'app/src/main', 'app/src/main/java', 'app/src/main/java/com', 'app/src/main/java/com/acme'];
  assert.equal(groupOf('app/src/main/java/com/acme/billing/A.java', chain), 'billing');
  assert.equal(groupOf('app/src/main/java/com/acme/App.java', chain), '(root)');
  assert.equal(groupOf('app/src/main/java/vendor/Lib.java', chain), 'vendor');
  assert.equal(groupOf('app/src/test/java/com/acme/ATest.java', chain), 'test');
});
