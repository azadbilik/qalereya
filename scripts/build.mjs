// Builds data/gallery.json from data/artworks.json (kitabxana's artworks, scripts/export.sh)
// and the scene catalogues: data/scenes/<poem>.json (scenes in story order, each with the
// kitabxana chapters it happens in) and data/tags/<poem>.json (artwork id → scene).
//
//   node scripts/build.mjs
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const root = new URL('../data/', import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const list = async (dir) => (await readdir(new URL(dir, root)).catch(() => [])).filter((f) => f.endsWith('.json'));

const artworks = await read('artworks.json');
// Where and when each manuscript was made (data/manuscripts.json, kept by hand): its catalogue
// name replaces the label guessed from a title, and the workshops map reads it
const catalogue = await read('manuscripts.json').catch(() => ({ manuscripts: [], items: {} }));
const msById = new Map(catalogue.manuscripts.map((m) => [m.id, m]));

// Poems in the order Nizami wrote the Khamsa, then Fuzuli; an artwork with no poem goes last
const POEMS = [
  ['nizami-mexzenul-esrar', 'Sirlər xəzinəsi', 'The Treasury of Mysteries'],
  ['nizami-xosrov-va-sirin', 'Xosrov və Şirin', 'Khusraw and Shirin'],
  ['nizami-leyli-va-macnun', 'Leyli və Məcnun', 'Layla and Majnun'],
  ['nizami-heft-peyker', 'Yeddi gözəl', 'The Seven Beauties'],
  ['nizami-serefname', 'Şərəfnamə', 'Iskandarnama: Sharafnama'],
  ['nizami-xerednama', 'İqbalnamə', 'Iskandarnama: Iqbalnama'],
  ['fuzuli-leyli-ve-mecnun', 'Füzuli: Leyli və Məcnun', 'Fuzuli: Layla and Majnun'],
  ['fuzuli-hediqetus-sueda', 'Hədiqətüs-süəda', 'Fuzuli: Garden of the Blessed'],
];

const scenes = {};
for (const f of await list('scenes/')) scenes[f.replace(/\.json$/, '')] = await read(`scenes/${f}`);
// A tag file is named after its poem: an artwork kitabxana hasn't filed under a poem joins the
// poem its scene belongs to
const tags = {};
for (const f of await list('tags/')) {
  const key = f.replace(/\.json$/, '');
  const poem = POEMS.find(([slug]) => slug === key || slug === `nizami-${key}`)?.[0];
  for (const [id, t] of Object.entries(await read(`tags/${f}`))) tags[id] = { ...t, poem };
}

// Commons titles sometimes arrive as raw template text: title QS:P1476,en:"…"
const cleanTitle = (t) => {
  const qs = t.match(/QS:\w+,(?:\w+:)?"([^"]+)"/);
  return (qs ? qs[1] : t.replace(/\s*(?:label|title)?\s*QS:.*$/, '')).replace(/^"([^"]+)"/, '$1').replace(/\s+/g, ' ').trim();
};

// The manuscript a page comes from, where its title or source says so
const MANUSCRIPTS = [
  [/Walters Ms\.? ?(W\.\d+)/i, (m) => `Walters ${m[1]}`],
  [/(?:British (?:Library|Museum)|\bBL\b)[ ,_]*(?:MS\.? )?Or\.?[ _]?(\d+)/i, (m) => `British Library Or. ${m[1]}`],
  [/\b(?:BL )?Add\.? ?MS\.? ?(\d{4,6})/i, (m) => `British Library Add. ${m[1]}`],
  [/Topkap[ıi][^)]*?H\.? ?(\d+)/i, (m) => `Topkapı H. ${m[1]}`],
  [/Bodleian[^)]*?MS\.? ([A-Za-z]+\.? ?\d+)/i, (m) => `Bodleian ${m[1]}`],
  [/Staatsbibliothek[^)]*?Ms\.? or\.? (quart|fol)\.? ?(\d+)/i, (m) => `Berlin Ms. or. ${m[1]}. ${m[2]}`],
];
const manuscript = (x) => {
  const text = `${x.title} ${x.source ?? ''} ${x.credit ?? ''}`;
  for (const [rx, label] of MANUSCRIPTS) { const m = text.match(rx); if (m) return label(m); }
  return null;
};

// Commons originals are large: the grid takes a 500px thumbnail, the viewer the original
const commonsThumb = (url, w) => url.replace(/\?.*$/, '').replace(/\/commons\/(.\/..\/)([^/]+)$/, `/commons/thumb/$1$2/${w}px-$2`);
// The Walters serves only full scans (~600 KB) and 117px thumbnails: those are resized once into
// thumbs/<id>.jpg (CC0, scripts/thumbs.sh) and served from here
const local = (x) => existsSync(new URL(`../thumbs/${x.id}.jpg`, import.meta.url)) ? `thumbs/${x.id}.jpg` : null;
const thumb = (x) => {
  if (local(x)) return local(x);
  if (/upload\.wikimedia\.org\/wikipedia\/commons\/(?!thumb)/.test(x.image)) return commonsThumb(x.image, 500);
  if (/images\.metmuseum\.org/.test(x.thumb)) return x.thumb;
  return x.thumb ?? x.image;
};
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
// A short Common-era date: "1481", "1539–1543", or "XVI əsr" for a whole-century estimate
const when = (x) => {
  const [a, b] = [x.yearStart, x.yearEnd ?? x.yearStart];
  if (!a) return null;
  if (b - a >= 90) return `${ROMAN[Math.floor((a - 1) / 100) + 1]} əsr`;
  return a === b ? String(a) : `${a}–${b}`;
};
const century = (x) => {
  const y = x.yearStart ?? x.yearEnd;
  return y ? Math.floor((y - 1) / 100) + 1 : null;
};

const items = artworks.map((x) => ({
  id: x.id,
  title: cleanTitle(x.title),
  date: x.date && !/^\d{4}-\d\d-\d\d$/.test(x.date) ? x.date : (x.yearStart ? String(x.yearStart) : null),
  century: century(x),
  year: x.yearStart ?? x.yearEnd ?? null,
  when: when(x),
  artists: x.artists,
  medium: x.medium,
  manuscript: (() => { const m = msById.get(catalogue.items[x.id]); return m && !m.single && !m.kind ? m.label : manuscript(x); })(),
  ms: catalogue.items[x.id] ?? null,
  // Where it was painted, for the viewer: "Təbriz, 1539–1543"
  place: (() => { const m = msById.get(catalogue.items[x.id]); return m?.place ? { city: m.place, dynasty: m.dynasty ?? null } : null; })(),
  museum: x.museum,
  license: x.license,
  // Free to reuse for anything; CC BY asks for the credit line, shown with the picture
  free: /^(CC0|Public domain|CC BY [\d.]+)$/i.test(x.license),
  credit: /^CC BY/.test(x.license) ? x.credit : undefined,
  source: x.source,
  image: x.image.replace(/\?.*$/, ''),
  thumb: thumb(x),
  author: x.author,
  poem: x.poem ?? (tags[x.id]?.scene ? tags[x.id].poem : null),
  chapter: x.chapter,
  scene: tags[x.id]?.scene ?? null,
}));

// Nizami's poems in order, then Fuzuli's, then the rest; within a poem, oldest first
const rank = (x) => { const i = POEMS.findIndex(([slug]) => slug === x.poem); return i < 0 ? POEMS.length : i; };
items.sort((a, b) => rank(a) - rank(b) || (a.year ?? 9999) - (b.year ?? 9999) || (a.manuscript ?? '~').localeCompare(b.manuscript ?? '~'));

const poems = POEMS.map(([slug, az, en]) => ({
  slug, az, en,
  count: items.filter((x) => x.poem === slug).length,
  scenes: (scenes[slug.replace(/^nizami-/, '')] ?? scenes[slug] ?? []).map((s) => ({
    id: s.id, az: s.az, en: s.en, chapters: s.chapters ?? [],
    count: items.filter((x) => x.poem === slug && x.scene === s.id).length,
  })),
})).filter((p) => p.count > 1); // a poem with a single picture is shown among the others, not as a tab

await writeFile(new URL('gallery.json', root), JSON.stringify({ poems, items }) + '\n');
const n = (f) => items.filter(f).length;
console.log(`${items.length} artworks · ${n((x) => x.poem)} in a poem · ${n((x) => x.scene)} with a scene · ${n((x) => x.manuscript)} with a manuscript · ${n((x) => x.free)} free to reuse`);
