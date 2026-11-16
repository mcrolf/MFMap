import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rust, rustResolver } from '../../src/languages/rust.ts';
import { extractFrom, outline, projectFrom } from '../helpers.ts';

const SAMPLE = `use std::fmt::{self, Display};
use a::b::{c, d::e as f, g::*};
use a::b;
use a::{b::{c, d}, e};
mod foo;
pub mod bar { pub fn inner() {} }
extern crate serde;
pub struct Foo { x: i32 }
pub(crate) enum E { A }
pub trait Shape: Display + Clone { fn area(&self); fn name(&self) {} }
impl Display for Foo { fn fmt(&self) {} }
impl<T> Foo<T> { pub fn new() -> Self {} fn hidden() {} }
type Alias = i32;
const LIMIT: i32 = 1;
pub static GREETING: &str = "hi";
macro_rules! shout { () => {} }
fn main() { fn local() {} }
`;

test('rust symbols: items, containers, impl blocks, visibility, no locals', async () => {
  const result = await extractFrom(rust, SAMPLE);
  assert.deepEqual(outline(result), [
    '+module bar@6',
    '+method bar.inner@6',
    '+struct Foo@8',
    '+enum E@9',
    '+trait Shape@10',
    '-method Shape.area@10',
    '-method Shape.name@10',
    '-impl Foo@11',
    '-method Foo.fmt@11',
    '-impl Foo@12',
    '+method Foo.new@12',
    '-method Foo.hidden@12',
    '-type Alias@13',
    '-variable LIMIT@14',
    '+variable GREETING@15',
    '-function shout@16',
    '-function main@17',
  ]);
});

test('rust extends: trait impls and supertraits', async () => {
  const result = await extractFrom(rust, SAMPLE);
  const impls = result.symbols.filter((s) => s.kind === 'impl');
  assert.deepEqual(impls[0].extends, ['Display']);
  assert.equal(impls[1].extends, undefined);
  assert.deepEqual(result.symbols.find((s) => s.name === 'Shape')?.extends, ['Display', 'Clone']);
});

test('rust entry point requires a top-level main', async () => {
  assert.equal((await extractFrom(rust, SAMPLE)).entryPoint, true);
  assert.equal((await extractFrom(rust, 'mod m { fn main() {} }\nimpl X { fn main() {} }')).entryPoint, undefined);
});

test('rust imports: use trees expand, mod declarations and extern crates', async () => {
  const result = await extractFrom(rust, SAMPLE);
  assert.deepEqual(
    result.imports.map((i) => `${i.specifier} [${i.names.join(',')}]@${i.line}`),
    [
      'std::fmt [fmt]@1',
      'std::fmt::Display [Display]@1',
      'a::b::c [c]@2',
      'a::b::d::e [e]@2',
      'a::b::g [*]@2',
      'a::b [b]@3',
      'a::b::c [c]@4',
      'a::b::d [d]@4',
      'a::e [e]@4',
      'mod:foo []@5',
      'serde []@7',
    ],
  );
});

const raw = (specifier: string) => ({ specifier, names: [], line: 1 });

const CARGO = '[package]\nname = "my-app"\nversion = "0.1.0"\n';

test('rust resolver: mod declarations find foo.rs and foo/mod.rs', () => {
  const resolver = rustResolver(
    projectFrom({
      'Cargo.toml': CARGO,
      'src/main.rs': '',
      'src/foo.rs': '',
      'src/bar/mod.rs': '',
      'src/foo/nested.rs': '',
      'src/bar/leaf.rs': '',
    }),
  );
  assert.deepEqual(resolver.resolve('src/main.rs', raw('mod:foo')), { target: 'src/foo.rs' });
  assert.deepEqual(resolver.resolve('src/main.rs', raw('mod:bar')), { target: 'src/bar/mod.rs' });
  assert.deepEqual(resolver.resolve('src/foo.rs', raw('mod:nested')), { target: 'src/foo/nested.rs' });
  assert.deepEqual(resolver.resolve('src/bar/mod.rs', raw('mod:leaf')), { target: 'src/bar/leaf.rs' });
  assert.deepEqual(resolver.resolve('src/main.rs', raw('mod:missing')), { unresolved: true });
});

test('rust resolver: crate:: paths use the longest module prefix', () => {
  const resolver = rustResolver(
    projectFrom({
      'Cargo.toml': CARGO,
      'src/lib.rs': '',
      'src/a/mod.rs': '',
      'src/a/b.rs': '',
      'src/c.rs': '',
      'src/util/deep/mod.rs': '',
    }),
  );
  const from = 'src/c.rs';
  assert.deepEqual(resolver.resolve(from, raw('crate::a::b::Thing')), { target: 'src/a/b.rs' });
  assert.deepEqual(resolver.resolve(from, raw('crate::a::Other')), { target: 'src/a/mod.rs' });
  assert.deepEqual(resolver.resolve(from, raw('crate::util::deep::X')), { target: 'src/util/deep/mod.rs' });
  assert.deepEqual(resolver.resolve(from, raw('crate::RootItem')), { target: 'src/lib.rs' });
});

test('rust resolver: self:: and super:: are relative to the current module', () => {
  const resolver = rustResolver(
    projectFrom({
      'Cargo.toml': CARGO,
      'src/lib.rs': '',
      'src/net.rs': '',
      'src/net/client.rs': '',
      'src/net/server.rs': '',
      'src/net/proto/mod.rs': '',
      'src/net/proto/frame.rs': '',
    }),
  );
  assert.deepEqual(resolver.resolve('src/net.rs', raw('self::client::Client')), { target: 'src/net/client.rs' });
  assert.deepEqual(resolver.resolve('src/net/client.rs', raw('super::server::Server')), {
    target: 'src/net/server.rs',
  });
  assert.deepEqual(resolver.resolve('src/net/client.rs', raw('super::NetError')), { target: 'src/net.rs' });
  assert.deepEqual(resolver.resolve('src/net/proto/frame.rs', raw('super::super::server::S')), {
    target: 'src/net/server.rs',
  });
  assert.deepEqual(resolver.resolve('src/net/proto/frame.rs', raw('super::Header')), {
    target: 'src/net/proto/mod.rs',
  });
  assert.deepEqual(resolver.resolve('src/lib.rs', raw('super::X')), { unresolved: true });
});

test('rust resolver: workspace crates resolve inside their own src', () => {
  const resolver = rustResolver(
    projectFrom({
      'Cargo.toml': '[workspace]\nmembers = ["crates/*"]\n',
      'crates/core-lib/Cargo.toml': '[package]\nname = "core-lib"\n',
      'crates/core-lib/src/lib.rs': '',
      'crates/core-lib/src/model.rs': '',
      'crates/cli/Cargo.toml': '[package]\nname = "cli"\n',
      'crates/cli/src/main.rs': '',
    }),
  );
  const from = 'crates/cli/src/main.rs';
  assert.deepEqual(resolver.resolve(from, raw('core_lib::model::Item')), { target: 'crates/core-lib/src/model.rs' });
  assert.deepEqual(resolver.resolve(from, raw('core_lib::Item')), { target: 'crates/core-lib/src/lib.rs' });
  assert.deepEqual(resolver.resolve(from, raw('crate::Local')), { unresolved: true });
});

test('rust resolver: std crates are builtin and unknown crates are external', () => {
  const resolver = rustResolver(projectFrom({ 'Cargo.toml': CARGO, 'src/main.rs': '' }));
  assert.deepEqual(resolver.resolve('src/main.rs', raw('std::collections::HashMap')), { builtin: 'std' });
  assert.deepEqual(resolver.resolve('src/main.rs', raw('core::fmt')), { builtin: 'core' });
  assert.deepEqual(resolver.resolve('src/main.rs', raw('serde::Serialize')), { external: 'serde' });
  assert.deepEqual(resolver.resolve('src/main.rs', raw('serde')), { external: 'serde' });
});

test('rust resolver: a sibling module named without crate:: resolves locally', () => {
  const resolver = rustResolver(
    projectFrom({ 'Cargo.toml': CARGO, 'src/lib.rs': '', 'src/config.rs': '', 'src/run.rs': '' }),
  );
  assert.deepEqual(resolver.resolve('src/run.rs', raw('config::Settings')), { external: 'config' });
  assert.deepEqual(resolver.resolve('src/lib.rs', raw('config::Settings')), { target: 'src/config.rs' });
});
