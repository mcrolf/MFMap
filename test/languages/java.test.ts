import assert from 'node:assert/strict';
import { test } from 'node:test';
import { java } from '../../src/languages/java.ts';
import { jvmResolver } from '../../src/languages/jvm-resolver.ts';
import { kotlin } from '../../src/languages/kotlin.ts';
import { entriesFor, extractFrom, outline, projectFrom } from '../helpers.ts';

const SAMPLE = `package com.example.app;

import java.util.List;
import java.util.*;
import static org.junit.Assert.assertEquals;
import com.foo.Bar;

public class Main extends Base implements Runnable, Comparable<Main> {
    private int x;
    public Main() {}
    public static void main(String[] args) { Runnable r = new Runnable() { public void run() {} }; }
    void helper() {}
    public static class Inner {}
}
interface Svc extends A, B { void go(); }
enum Color { RED { void special() {} }; void m() {} }
record Pt(int x, int y) implements Foo {}
@interface Ann { String value(); }
`;

test('java symbols: types, members, exports, no anonymous classes', async () => {
  const result = await extractFrom(java, SAMPLE);
  assert.deepEqual(outline(result), [
    '+class Main@8',
    '+method Main.Main@10',
    '+method Main.main@11',
    '-method Main.helper@12',
    '+class Main.Inner@13',
    '-interface Svc@15',
    '+method Svc.go@15',
    '-enum Color@16',
    '-method Color.m@16',
    '-record Pt@17',
    '-interface Ann@18',
  ]);
});

test('java heritage, package, and entry point', async () => {
  const result = await extractFrom(java, SAMPLE);
  const extendsOf = (name: string) => result.symbols.find((s) => s.name === name)?.extends;
  assert.deepEqual(extendsOf('Main'), ['Base', 'Runnable', 'Comparable<Main>']);
  assert.deepEqual(extendsOf('Svc'), ['A', 'B']);
  assert.deepEqual(extendsOf('Pt'), ['Foo']);
  assert.equal(result.packageName, 'com.example.app');
  assert.equal(result.entryPoint, true);
});

test('java: no entry point without a static main, no package for the default package', async () => {
  const result = await extractFrom(java, 'class A { void main() {} public static void run() {} }');
  assert.equal(result.entryPoint, undefined);
  assert.equal(result.packageName, undefined);
});

test('java imports: single, wildcard, static', async () => {
  const result = await extractFrom(java, SAMPLE);
  assert.deepEqual(
    result.imports.map((i) => `${i.specifier} [${i.names.join(',')}]@${i.line}`),
    [
      'java.util.List [List]@3',
      'java.util [*]@4',
      'org.junit.Assert.assertEquals [assertEquals]@5',
      'com.foo.Bar [Bar]@6',
    ],
  );
});

const JAVA_FILES = {
  'src/com/acme/model/User.java': 'package com.acme.model;\npublic class User { public static int MAX = 1; public static class Builder {} }',
  'src/com/acme/model/Role.java': 'package com.acme.model;\npublic enum Role { A }',
  'src/com/acme/web/Controller.java': 'package com.acme.web;\npublic class Controller {}',
  'app/Util.kt': 'package com.acme.util\nfun helper() {}\nclass Tool',
  'app/Other.kt': 'package com.acme.util\nclass Other',
};

async function jvmResolverFor() {
  const entries = [...(await entriesFor(java, JAVA_FILES)), ...(await entriesFor(kotlin, JAVA_FILES))];
  return jvmResolver(projectFrom(JAVA_FILES, entries));
}

const importOf = (specifier: string, names: string[] = []) => ({ specifier, names, line: 1 });

test('jvm resolver: internal class, nested class, and static import', async () => {
  const resolver = await jvmResolverFor();
  assert.deepEqual(resolver.resolve('x.java', importOf('com.acme.model.User', ['User'])), {
    target: 'src/com/acme/model/User.java',
  });
  assert.deepEqual(resolver.resolve('x.java', importOf('com.acme.model.User.Builder', ['Builder'])), {
    target: 'src/com/acme/model/User.java',
  });
  assert.deepEqual(resolver.resolve('x.java', importOf('com.acme.model.User.MAX', ['MAX'])), {
    target: 'src/com/acme/model/User.java',
  });
});

test('jvm resolver: wildcard import targets the package directory', async () => {
  const resolver = await jvmResolverFor();
  assert.deepEqual(resolver.resolve('x.java', importOf('com.acme.model', ['*'])), { target: 'src/com/acme/model' });
});

test('jvm resolver: Kotlin importing a Java class and Java importing Kotlin', async () => {
  const resolver = await jvmResolverFor();
  assert.deepEqual(resolver.resolve('app/Util.kt', importOf('com.acme.web.Controller', ['Controller'])), {
    target: 'src/com/acme/web/Controller.java',
  });
  assert.deepEqual(resolver.resolve('x.java', importOf('com.acme.util.Tool', ['Tool'])), { target: 'app/Util.kt' });
  assert.deepEqual(resolver.resolve('x.java', importOf('com.acme.util.helper', ['helper'])), { target: 'app/Util.kt' });
});

test('jvm resolver: missing class in an internal package stays unresolved', async () => {
  const resolver = await jvmResolverFor();
  assert.deepEqual(resolver.resolve('x.java', importOf('com.acme.model.Missing', ['Missing'])), { unresolved: true });
});

test('jvm resolver: platform packages are builtin, everything else external', async () => {
  const resolver = await jvmResolverFor();
  assert.deepEqual(resolver.resolve('x.java', importOf('java.util.List', ['List'])), { builtin: 'java.util' });
  assert.deepEqual(resolver.resolve('x.kt', importOf('kotlin.collections.List', ['List'])), { builtin: 'kotlin.collections' });
  assert.deepEqual(resolver.resolve('x.java', importOf('org.springframework.web.Bean', ['Bean'])), {
    external: 'org.springframework',
  });
  assert.deepEqual(resolver.resolve('x.kt', importOf('kotlinx.coroutines.launch', ['launch'])), {
    external: 'kotlinx.coroutines',
  });
});
