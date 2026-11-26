// Prints the catalogue's counts (period × image status, source × image status, medium) as Markdown
import { readFile } from 'node:fs/promises';
import { root } from './lib.mjs';
const c = JSON.parse(await readFile(new URL('data/art/catalogue.json', root), 'utf8'));
const table = (title, key, order) => {
  const m = {};
  for (const x of c.items) { const k = key(x); (m[k] ??= { free: 0, protected: 0, none: 0, nc: 0, n: 0 })[x.imageStatus]++; m[k].n++; }
  const keys = order ?? Object.keys(m).sort((a, b) => m[b].n - m[a].n);
  console.log(`\n| ${title} | works | free image | protected (no image) | no free image |\n|---|---:|---:|---:|---:|`);
  for (const k of keys) if (m[k]) console.log(`| ${k} | ${m[k].n} | ${m[k].free} | ${m[k].protected} | ${m[k].none + m[k].nc} |`);
  const t = Object.values(m).reduce((a, v) => ({ n: a.n + v.n, free: a.free + v.free, protected: a.protected + v.protected, none: a.none + v.none + v.nc }), { n: 0, free: 0, protected: 0, none: 0 });
  console.log(`| **total** | ${t.n} | ${t.free} | ${t.protected} | ${t.none} |`);
};
table('Period', (x) => x.period ?? 'undated', [...c.periods.map((p) => p.id), 'undated']);
table('Source', (x) => x.source);
table('Kind', (x) => x.medium);
table('Holder', (x) => x.institution?.replace(/ \(via .*\)/, '') || '(Commons file, holder not stated)');
