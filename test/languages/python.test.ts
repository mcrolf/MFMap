import assert from 'node:assert/strict';
import { test } from 'node:test';
import { python, pythonResolver } from '../../src/languages/python.ts';
import { entriesFor, extractFrom, outline, projectFrom } from '../helpers.ts';

const SAMPLE = `import os, a.b as ab
from . import sib
from ..pkg.mod import X, Y as Z
from m import *
@decorator
class C(Base, metaclass=M):
    LIMIT = 3
    def m(self): pass
    @property
    async def p(self): pass
def _private():
    import inner
    def local(): pass
VALUE: int = 1
__all__ = ['C']
if __name__ == "__main__":
    main()
`;

test('python symbols: classes, methods, decorated spans, module variables', async () => {
  const result = await extractFrom(python, SAMPLE);
  assert.deepEqual(outline(result), [
    '+class C@5',
    '+method C.m@8',
    '+method C.p@9',
    '-function _private@11',
    '+variable VALUE@14',
  ]);
  assert.deepEqual(result.symbols[0].extends, ['Base']);
  assert.equal(result.entryPoint, true);
});

test('python imports: plain, aliased, relative, wildcard, nested', async () => {
  const result = await extractFrom(python, SAMPLE);
  assert.deepEqual(
    result.imports.map((i) => `${i.specifier} [${i.names.join(',')}]`),
    ['os []', 'a.b []', '. [sib]', '..pkg.mod [X,Y]', 'm [*]', 'inner []'],
  );
});

test('python resolver: absolute, src layout, relative, submodule names, stdlib, external', async () => {
  const files = {
    'src/app/__init__.py': '',
    'src/app/models.py': '',
    'src/app/api/__init__.py': '',
    'src/app/api/routes.py': '',
    'src/app/api/views.py': '',
    'scripts/run.py': '',
  };
  const project = projectFrom(files, await entriesFor(python, files));
  const resolver = pythonResolver(project);
  const resolve = (from: string, specifier: string, names: string[] = []) =>
    resolver.resolve(from, { specifier, names, line: 1 });

  assert.deepEqual(resolve('scripts/run.py', 'app.models'), { target: 'src/app/models.py' });
  assert.deepEqual(resolve('scripts/run.py', 'app.api', ['routes']), { target: 'src/app/api/routes.py' });
  assert.deepEqual(resolve('scripts/run.py', 'app.api', ['something']), { target: 'src/app/api/__init__.py' });
  assert.deepEqual(resolve('src/app/api/routes.py', '.', ['views']), { target: 'src/app/api/views.py' });
  assert.deepEqual(resolve('src/app/api/routes.py', '..models', ['User']), { target: 'src/app/models.py' });
  assert.deepEqual(resolve('src/app/api/routes.py', '.', ['helper']), { target: 'src/app/api/__init__.py' });
  assert.deepEqual(resolve('scripts/run.py', 'os.path'), { builtin: 'os' });
  assert.deepEqual(resolve('scripts/run.py', 'requests.adapters'), { external: 'requests' });
});
