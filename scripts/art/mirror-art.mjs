// Keeps our own copy of every FREE image of the catalogue: tarix/thumbs/<id>.jpg (≤440px) and
// tarix/large/<id>.jpg (≤800px). Only items with imageStatus "free" are touched; protected,
// non-commercial and unlicensed items never get a file. Each file is made once. Needs macOS sips.
//   node scripts/art/mirror-art.mjs [--limit N]
import { readFile, writeFile, mkdir, stat, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { UA, root, sleep } from './lib.mjs';
const cat = JSON.parse(await readFile(new URL('data/art/catalogue.json', root), 'utf8'));
const li = process.argv.indexOf('--limit'); const limit = li > 0 ? +process.argv[li + 1] : Infinity;
const dir = (p) => new URL('tarix/' + p, root).pathname;
await mkdir(dir('thumbs'), { recursive: true }); await mkdir(dir('large'), { recursive: true });
const tmp = join(tmpdir(), 'art-mirror-' + process.pid); await mkdir(tmp, { recursive: true });
const exists = async (f) => { try { return (await stat(f)).size > 0; } catch { return false; } };
const dimsFile = new URL('data/art/dims.json', root);
let dims = {}; try { dims = JSON.parse(await readFile(dimsFile, 'utf8')); } catch {}
const sips = (...a) => execFileSync('sips', a, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
const todo = cat.items.filter((x) => x.imageStatus === 'free' && x.imageSrc);
let made = 0, failed = 0, i = 0;
async function one(x) {
  const th = dir(`thumbs/${x.id}.jpg`), lg = dir(`large/${x.id}.jpg`);
  if ((await exists(th)) && (await exists(lg)) && dims[x.id]) return;
  let src = x.imageSrc;
  if (/upload\.wikimedia\.org.*\/\d+px-/.test(src)) src = src.replace(/\/\d+px-/, '/960px-').replace(/(\.(?:tiff?|png))$/i, '$1.jpg');
  const raw = join(tmp, String(process.pid) + '-' + (i++) + '.img');
  let ok = false;
  for (let t = 0; t < 4 && !ok; t++) {
    try {
      const r = await fetch(src, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(120000) });
      if (r.ok) { await writeFile(raw, Buffer.from(await r.arrayBuffer())); ok = true; } else if (r.status === 404 && src !== x.imageOriginal && x.imageOriginal) src = x.imageOriginal; else await sleep(4000 * (t + 1));
    } catch { await sleep(4000 * (t + 1)); }
  }
  if (!ok) { failed++; console.error('failed', x.id, src); return; }
  try {
    sips('-Z', '800', '-s', 'format', 'jpeg', '-s', 'formatOptions', '55', raw, '--out', lg);
    sips('-Z', '440', '-s', 'format', 'jpeg', '-s', 'formatOptions', '62', lg, '--out', th);
    const o = sips('-g', 'pixelWidth', '-g', 'pixelHeight', th); dims[x.id] = [+o.match(/pixelWidth: (\d+)/)[1], +o.match(/pixelHeight: (\d+)/)[1]];
    made++;
  } catch { failed++; await rm(th, { force: true }); await rm(lg, { force: true }); console.error('sips failed', x.id); }
  await rm(raw, { force: true });
}
const queue = todo.slice(0, limit);
await Promise.all([1, 2, 3, 4].map(async () => { while (queue.length) { await one(queue.shift()); if (made % 50 === 0) await writeFile(dimsFile, JSON.stringify(dims)); await sleep(150); } }));
await writeFile(dimsFile, JSON.stringify(dims));
await rm(tmp, { recursive: true, force: true });
console.error(`free items ${todo.length}, made ${made}, failed ${failed}`);
