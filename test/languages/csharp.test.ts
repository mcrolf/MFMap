import assert from 'node:assert/strict';
import { test } from 'node:test';
import { csharp, dotnetResolver } from '../../src/languages/csharp.ts';
import { entriesFor, extractFrom, outline, projectFrom } from '../helpers.ts';

const SAMPLE = `using System;
using System.Collections.Generic;
using static System.Math;
using Alias = Foo.Bar.Baz;
global using Newtonsoft.Json;

namespace Acme.Tools
{
    public class Program : Base, IDisposable
    {
        public static void Main(string[] args) { var f = () => 1; }
        public Program() {}
        public int Prop { get; set; }
        private int field;
        void Helper() {}
        public class Inner {}
    }
    internal struct S {}
    public interface IFoo : IBar { void Go(); }
    public enum E { A }
    public record R(int X);
    public delegate void Handler(int x);
}
`;

test('csharp symbols: namespace container, types, methods, exports', async () => {
  const result = await extractFrom(csharp, SAMPLE);
  assert.deepEqual(outline(result), [
    '+namespace Acme.Tools@7',
    '+class Acme.Tools.Program@9',
    '+method Acme.Tools.Program.Main@11',
    '+method Acme.Tools.Program.Program@12',
    '-method Acme.Tools.Program.Helper@15',
    '+class Acme.Tools.Program.Inner@16',
    '-struct Acme.Tools.S@18',
    '+interface Acme.Tools.IFoo@19',
    '+method Acme.Tools.IFoo.Go@19',
    '+enum Acme.Tools.E@20',
    '+record Acme.Tools.R@21',
    '+type Acme.Tools.Handler@22',
  ]);
});

test('csharp base types, namespace, and static Main entry point', async () => {
  const result = await extractFrom(csharp, SAMPLE);
  const extendsOf = (name: string) => result.symbols.find((s) => s.name === name)?.extends;
  assert.deepEqual(extendsOf('Program'), ['Base', 'IDisposable']);
  assert.deepEqual(extendsOf('IFoo'), ['IBar']);
  assert.equal(result.packageName, 'Acme.Tools');
  assert.equal(result.entryPoint, true);
});

test('csharp file-scoped namespace is the package; first namespace wins', async () => {
  const fileScoped = await extractFrom(csharp, 'namespace Acme.File;\npublic class C { }\n');
  assert.equal(fileScoped.packageName, 'Acme.File');
  assert.deepEqual(outline(fileScoped), ['+namespace Acme.File@1', '+class Acme.File.C@2']);
  const several = await extractFrom(csharp, 'namespace One { class A {} }\nnamespace Two { class B {} }');
  assert.equal(several.packageName, 'One');
});

test('csharp top-level statements are an entry point', async () => {
  const result = await extractFrom(csharp, 'using System;\nConsole.WriteLine("hi");\nclass C {}\n');
  assert.equal(result.entryPoint, true);
  const library = await extractFrom(csharp, 'namespace N { class C { void Main() {} } }');
  assert.equal(library.entryPoint, undefined);
});

test('csharp usings: plain, static, alias, global', async () => {
  const result = await extractFrom(csharp, SAMPLE);
  assert.deepEqual(
    result.imports.map((i) => `${i.specifier} [${i.names.join(',')}]@${i.line}`),
    [
      'System []@1',
      'System.Collections.Generic []@2',
      'System.Math []@3',
      'Foo.Bar.Baz [Alias]@4',
      'Newtonsoft.Json []@5',
    ],
  );
});

const FILES = {
  'src/Core/Models/User.cs': 'namespace Acme.Core.Models;\npublic class User {}',
  'src/Core/Models/Deep/Role.cs': 'namespace Acme.Core.Models { public class Role {} }',
  'src/Web/Controller.cs': 'namespace Acme.Web { public class Controller {} }',
  'src/Other/Shallow.cs': 'namespace Acme.Core.Models { public class Shallow {} }',
};

async function resolverFor() {
  return dotnetResolver(projectFrom(FILES, await entriesFor(csharp, FILES)));
}

const using = (specifier: string, names: string[] = []) => ({ specifier, names, line: 1 });

test('dotnet resolver: namespace maps to the shallowest declaring directory', async () => {
  const resolver = await resolverFor();
  assert.deepEqual(resolver.resolve('x.cs', using('Acme.Web')), { target: 'src/Web' });
  assert.deepEqual(resolver.resolve('x.cs', using('Acme.Core.Models')), { target: 'src/Other' });
});

test('dotnet resolver: static usings and aliases fall back to the enclosing namespace', async () => {
  const resolver = await resolverFor();
  assert.deepEqual(resolver.resolve('x.cs', using('Acme.Web.Controller')), { target: 'src/Web' });
  assert.deepEqual(resolver.resolve('x.cs', using('Acme.Web.Controller', ['Alias'])), { target: 'src/Web' });
});

test('dotnet resolver: System and Microsoft are builtin, the rest external', async () => {
  const resolver = await resolverFor();
  assert.deepEqual(resolver.resolve('x.cs', using('System.Collections.Generic')), { builtin: 'System.Collections' });
  assert.deepEqual(resolver.resolve('x.cs', using('System')), { builtin: 'System' });
  assert.deepEqual(resolver.resolve('x.cs', using('Microsoft.Extensions.Logging')), { builtin: 'Microsoft.Extensions' });
  assert.deepEqual(resolver.resolve('x.cs', using('Newtonsoft.Json')), { external: 'Newtonsoft.Json' });
  assert.deepEqual(resolver.resolve('x.cs', using('Xunit')), { external: 'Xunit' });
});
