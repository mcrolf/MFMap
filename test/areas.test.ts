import assert from 'node:assert/strict';
import { test } from 'node:test';
import { planAreas } from '../src/map/areas.ts';

const filesIn = (dir: string, count: number) => Array.from({ length: count }, (_, i) => `${dir}/f${i}.ts`);

test('small projects get one root page', () => {
  const areas = planAreas(['a.ts', ...filesIn('src', 5)], 80);
  assert.deepEqual(areas.map((a) => [a.dir, a.page, a.files.length]), [['', '_root.md', 6]]);
});

test('directories over the limit split; small subdirectories fold into the parent page', () => {
  const paths = ['README.md', ...filesIn('src/api', 20), ...filesIn('src/util', 3), ...filesIn('src', 60), ...filesIn('docs', 15)];
  const areas = planAreas(paths, 80);
  assert.deepEqual(
    areas.map((a) => [a.dir, a.page, a.files.length]),
    [
      ['', '_root.md', 1],
      ['docs', 'docs.md', 15],
      ['src', 'src.md', 63],
      ['src/api', 'src--api.md', 20],
    ],
  );
  assert.equal(new Set(areas.flatMap((a) => a.files)).size, paths.length, 'every file is on exactly one page');
});
