import assert from 'node:assert/strict';
import { test } from 'node:test';
import { go, goResolver } from '../../src/languages/go.ts';
import { extractFrom, outline, projectFrom } from '../helpers.ts';

const SAMPLE = `package main

import (
	"fmt"
	str "strings"
	_ "embed"
	. "math"
	"github.com/x/y/z"
)

import "os"

type Server struct {
	Base
	*Other
	name string
}

type Reader interface {
	io.Reader
	Read(p []byte) int
}

type ID int
type Alias = string
type Generic[T any] struct{}

const Max = 1

const (
	A = 1
	b = 2
)

var Global, other = 1, 2

func (s *Server) Start() {}
func (g Generic[T]) get() {}
func main() { local := 1 }
func Helper() {}
`;

test('go symbols: types, methods with receiver container, variables, no locals', async () => {
  const result = await extractFrom(go, SAMPLE);
  assert.deepEqual(outline(result), [
    '+struct Server@13',
    '+interface Reader@19',
    '+method Reader.Read@21',
    '+type ID@24',
    '+type Alias@25',
    '+struct Generic@26',
    '+variable Max@28',
    '+variable A@31',
    '-variable b@32',
    '+variable Global@35',
    '-variable other@35',
    '+method Server.Start@37',
    '-method Generic.get@38',
    '-function main@39',
    '+function Helper@40',
  ]);
});

test('go embedded fields and interfaces are recorded as extends', async () => {
  const result = await extractFrom(go, SAMPLE);
  assert.deepEqual(result.symbols.find((s) => s.name === 'Server')?.extends, ['Base', 'Other']);
  assert.deepEqual(result.symbols.find((s) => s.name === 'Reader')?.extends, ['io.Reader']);
});

test('go package name and entry point', async () => {
  const result = await extractFrom(go, SAMPLE);
  assert.equal(result.packageName, 'main');
  assert.equal(result.entryPoint, true);

  const library = await extractFrom(go, 'package util\nfunc main() {}\n');
  assert.equal(library.packageName, 'util');
  assert.equal(library.entryPoint, undefined);

  const noMain = await extractFrom(go, 'package main\nfunc Run() {}\n');
  assert.equal(noMain.entryPoint, undefined);
});

test('go imports: grouped, aliased, blank, dot, and single', async () => {
  const result = await extractFrom(go, SAMPLE);
  assert.deepEqual(
    result.imports.map((i) => `${i.specifier} [${i.names.join(',')}]@${i.line}`),
    ['fmt []@4', 'strings [str]@5', 'embed [_]@6', 'math [.]@7', 'github.com/x/y/z []@8', 'os []@11'],
  );
});

const raw = (specifier: string) => ({ specifier, names: [], line: 1 });

test('go resolver: internal package, stdlib, required and unlisted external modules', () => {
  const project = projectFrom({
    'go.mod': `module example.com/app

go 1.22

require (
	github.com/gin-gonic/gin v1.9.0 // indirect
	golang.org/x/text v0.14.0
)

require github.com/spf13/cobra v1.8.0
`,
    'cmd/app/main.go': 'package main',
    'internal/store/store.go': 'package store',
  });
  const resolver = goResolver(project);
  const from = 'cmd/app/main.go';
  assert.deepEqual(resolver.resolve(from, raw('example.com/app/internal/store')), { target: 'internal/store' });
  assert.deepEqual(resolver.resolve(from, raw('example.com/app/internal/missing')), { unresolved: true });
  assert.deepEqual(resolver.resolve(from, raw('fmt')), { builtin: 'fmt' });
  assert.deepEqual(resolver.resolve(from, raw('net/http')), { builtin: 'net/http' });
  assert.deepEqual(resolver.resolve(from, raw('github.com/gin-gonic/gin/binding')), {
    external: 'github.com/gin-gonic/gin',
  });
  assert.deepEqual(resolver.resolve(from, raw('golang.org/x/text/language')), { external: 'golang.org/x/text' });
  assert.deepEqual(resolver.resolve(from, raw('github.com/spf13/cobra')), { external: 'github.com/spf13/cobra' });
  assert.deepEqual(resolver.resolve(from, raw('github.com/other/lib/sub/pkg')), {
    external: 'github.com/other/lib',
  });
});

test('go resolver: multiple modules resolve against their own directory', () => {
  const project = projectFrom({
    'go.mod': 'module example.com/root\n',
    'tools/go.mod': 'module example.com/tools\n',
    'tools/lint/lint.go': 'package lint',
    'pkg/a.go': 'package pkg',
  });
  const resolver = goResolver(project);
  assert.deepEqual(resolver.resolve('pkg/a.go', raw('example.com/tools/lint')), { target: 'tools/lint' });
  assert.deepEqual(resolver.resolve('pkg/a.go', raw('example.com/root/pkg')), { target: 'pkg' });
  assert.deepEqual(resolver.resolve('pkg/a.go', raw('example.com/root')), { target: '' });
});
