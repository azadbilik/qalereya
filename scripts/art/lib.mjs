// Shared helpers for the art catalogue scripts: polite fetch with retry + on-disk cache.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
export const UA = 'azadbilik-qalereya/0.1 (https://github.com/azadbilik/qalereya)';
export const root = new URL('../../', import.meta.url);
const cacheDir = new URL('data/art/.cache/', root);
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getJson(url, { cache = true, headers = {}, tries = 4 } = {}) {
  const key = createHash('sha1').update(url).digest('hex');
  const f = new URL(key + '.json', cacheDir);
  if (cache) { try { return JSON.parse(await readFile(f, 'utf8')); } catch {} }
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json', ...headers } });
      if (r.ok) {
        const j = await r.json();
        if (cache) { await mkdir(cacheDir, { recursive: true }); await writeFile(f, JSON.stringify(j)); }
        return j;
      }
      if (r.status === 404) return null;
    } catch {}
    await sleep(3000 * (i + 1));
  }
  return null;
}

export const commons = (p) => getJson('https://commons.wikimedia.org/w/api.php?format=json&formatversion=2&' + new URLSearchParams(p));

// Walk a Commons category tree (BFS) → { cats: [{name, files, depth}], files: Map(title -> [cats]) }
export async function crawl(seed, depth = 2, { maxCats = 120, skip = () => false } = {}) {
  const seen = new Set(), q = [[seed, 0]], cats = [], files = new Map();
  while (q.length && cats.length < maxCats) {
    const [c, d] = q.shift();
    if (seen.has(c) || skip(c)) continue;
    seen.add(c);
    let cont = {}, n = 0;
    do {
      const r = await commons({ action: 'query', list: 'categorymembers', cmtitle: 'Category:' + c, cmtype: 'file|subcat', cmlimit: 500, ...cont });
      if (!r) break;
      for (const m of r.query.categorymembers) {
        if (m.ns === 14) { if (d < depth) q.push([m.title.replace(/^Category:/, ''), d + 1]); }
        else { n++; if (!files.has(m.title)) files.set(m.title, []); files.get(m.title).push(c); }
      }
      cont = r.continue ?? null;
    } while (cont);
    cats.push({ name: c, files: n, depth: d });
  }
  return { cats, files };
}
