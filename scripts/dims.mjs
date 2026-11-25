// Records each thumbnail's width and height in data/dims.json, so the page can lay out every
// picture's box before it arrives (no strip jumping sideways as images load). Reads only the
// image header; pictures already measured are skipped. Run after build.mjs, then build again.
//
//   node scripts/dims.mjs
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const gallery = JSON.parse(await readFile(new URL('data/gallery.json', root), 'utf8'));
const dimsUrl = new URL('data/dims.json', root);
const dims = JSON.parse(await readFile(dimsUrl, 'utf8').catch(() => '{}'));
const UA = 'azadbilik-qalereya/0.1 (https://github.com/azadbilik/qalereya)';

// Width and height from a JPEG, PNG, GIF or WebP header
function size(b) {
  if (b[0] === 0x89 && b[1] === 0x50) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b.toString('ascii', 0, 3) === 'GIF') return [b.readUInt16LE(6), b.readUInt16LE(8)];
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16);
    if (kind === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (kind === 'VP8L') { const n = b.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1]; }
    if (kind === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      // Start-of-frame markers (not DHT, JPG, DAC) carry the size
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

async function head(src) {
  if (src.startsWith('thumbs/')) return readFile(new URL(src, root));
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(src, { headers: { 'User-Agent': UA, Range: 'bytes=0-131071' } }).catch(() => null);
    if (res?.ok) return Buffer.from(await res.arrayBuffer());
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
  }
  return null;
}

const todo = gallery.items.filter((x) => !dims[x.id] || dims[x.id].src !== x.thumb);
console.log(`${todo.length} of ${gallery.items.length} to measure`);
let done = 0, failed = 0;
// A few at a time: polite to Wikimedia and the museums
for (let i = 0; i < todo.length; i += 4) {
  await Promise.all(todo.slice(i, i + 4).map(async (x) => {
    const b = await head(x.thumb);
    const wh = b && size(b);
    if (wh) { dims[x.id] = { w: wh[0], h: wh[1], src: x.thumb }; done++; } else { failed++; console.warn(`  ${x.id}: no size (${x.thumb})`); }
  }));
  if (i % 100 === 0) await writeFile(dimsUrl, JSON.stringify(dims, null, 1) + '\n');
}
await writeFile(dimsUrl, JSON.stringify(Object.fromEntries(Object.entries(dims).sort(([a], [b]) => a.localeCompare(b))), null, 1) + '\n');
console.log(`${done} measured, ${failed} without a size`);
