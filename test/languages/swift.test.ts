import assert from 'node:assert/strict';
import { test } from 'node:test';
import { swift, swiftResolver } from '../../src/languages/swift.ts';
import { entriesFor, extractFrom, outline, projectFrom } from '../helpers.ts';

const SAMPLE = `import Foundation
import struct Acme.Tools
@testable import MyModule

public protocol P: Q, R { func req() }
public class Base: NSObject, P {
    public var x: Int = 1
    public init() {}
    public func go() { let c = { 1 }; func local() {} }
    private func hid() {}
    deinit {}
    subscript(i: Int) -> Int { 0 }
    open class Inner {}
}
struct S { let a = 1; static func make() -> S { S() } }
enum E: String, CaseIterable { case a, b; func f() {} }
extension Base: Equatable { func ext() {} }
public extension Array { func shown() {} }
actor Act { func run() {} }
typealias Alias = [Int]
let topLevel = 1
public var topVar: Int { 1 }
func freeFunc() {}
`;

test('swift symbols: declarations, members, extensions, and access', async () => {
  const result = await extractFrom(swift, SAMPLE);
  assert.deepEqual(outline(result), [
    '+protocol P@5',
    '+method P.req@5',
    '+class Base@6',
    '+method Base.init@8',
    '+method Base.go@9',
    '-method Base.hid@10',
    '+class Base.Inner@13',
    '-struct S@15',
    '-method S.make@15',
    '-enum E@16',
    '-method E.f@16',
    '-extension Base@17',
    '-method Base.ext@17',
    '+extension Array@18',
    '+method Array.shown@18',
    '-class Act@19',
    '-method Act.run@19',
    '-type Alias@20',
    '-variable topLevel@21',
    '+variable topVar@22',
    '-function freeFunc@23',
  ]);
});

test('swift inheritance and conformances are listed as extends', async () => {
  const result = await extractFrom(swift, SAMPLE);
  const extendsOf = (name: string, kind: string) => result.symbols.find((s) => s.name === name && s.kind === kind)?.extends;
  assert.deepEqual(extendsOf('P', 'protocol'), ['Q', 'R']);
  assert.deepEqual(extendsOf('Base', 'class'), ['NSObject', 'P']);
  assert.deepEqual(extendsOf('E', 'enum'), ['String', 'CaseIterable']);
  assert.deepEqual(extendsOf('Base', 'extension'), ['Equatable']);
});

test('swift imports name the module only', async () => {
  const result = await extractFrom(swift, SAMPLE);
  assert.deepEqual(
    result.imports.map((i) => `${i.specifier} [${i.names.join(',')}]@${i.line}`),
    ['Foundation []@1', 'Acme []@2', 'MyModule []@3'],
  );
});

test('swift: @main marks an entry point', async () => {
  const main = await extractFrom(swift, '@main\nstruct App { static func main() {} }\n');
  assert.equal(main.entryPoint, true);
  assert.deepEqual(outline(main), ['-struct App@1', '-method App.main@2']);
  const library = await extractFrom(swift, '// @main is documented here\nstruct Lib {}\n');
  assert.equal(library.entryPoint, undefined);
});

const FILES = {
  'Package.swift': '// swift-tools-version:5.9',
  'Sources/Core/Core.swift': 'public struct Core {}',
  'Sources/Core/Deep/Helper.swift': 'struct Helper {}',
  'Tests/CoreTests/CoreTests.swift': '@testable import Core',
  'App/Features/Features.swift': 'struct Feature {}',
};

async function resolverFor() {
  return swiftResolver(projectFrom(FILES, await entriesFor(swift, FILES)));
}

const importOf = (specifier: string) => ({ specifier, names: [], line: 1 });

test('swift resolver: SwiftPM target and same-named source directory', async () => {
  const resolver = await resolverFor();
  assert.deepEqual(resolver.resolve('Tests/CoreTests/CoreTests.swift', importOf('Core')), { target: 'Sources/Core' });
  assert.deepEqual(resolver.resolve('x.swift', importOf('Features')), { target: 'App/Features' });
});

test('swift resolver: Apple modules are builtin, the rest external', async () => {
  const resolver = await resolverFor();
  for (const module of ['Foundation', 'SwiftUI', 'XCTest', 'CoreLocation', 'MapKit', 'WidgetKit', 'CryptoKit', 'os']) {
    assert.deepEqual(resolver.resolve('x.swift', importOf(module)), { builtin: module });
  }
  assert.deepEqual(resolver.resolve('x.swift', importOf('Alamofire')), { external: 'Alamofire' });
  assert.deepEqual(resolver.resolve('x.swift', importOf('SwiftSyntax')), { external: 'SwiftSyntax' });
});
