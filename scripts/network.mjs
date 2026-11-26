// Builds data/network.json for /rassamlar/: who painted in which manuscript, for whom and where
// (the "people" graph), and which scenes were painted in more than one workshop city (the
// "scenes" graph). Reads data/manuscripts.json (kept by hand) and data/gallery.json.
//
//   node scripts/network.mjs
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../data/', import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const cat = await read('manuscripts.json');
const gal = await read('gallery.json');
const ms = new Map(cat.manuscripts.map((m) => [m.id, m]));

// "Bihzad (attributed)" and "Bihzad (ascribed)" are one painter, the attribution marked on the link
const person = (s) => {
  const m = s.match(/^(.*?)\s*\((attributed|ascribed)\)$/);
  return { name: m ? m[1] : s, probable: !!m };
};
const short = (s) => s.replace(/\s*\(.*\)$/, '');
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Pictures per manuscript, and the scenes among them
const pics = new Map();
for (const x of gal.items) {
  const r = pics.get(x.ms) ?? { n: 0, scenes: new Set() };
  r.n++; if (x.scene) r.scenes.add(x.scene);
  pics.set(x.ms, r);
}

// People graph: a manuscript enters when it names a painter or a patron
const nodes = new Map(), links = [];
const add = (id, type, label, extra = {}) => { if (!nodes.has(id)) nodes.set(id, { id, type, label, ...extra }); return nodes.get(id); };
for (const m of cat.manuscripts) {
  if (!m.painters.length && !m.patron) continue;
  const place = m.place ?? null;
  add(`m:${m.id}`, 'ms', m.label, { ms: m.id, title: m.title, year: m.yearStart, yearEnd: m.yearEnd, place, dynasty: m.dynasty, holding: m.holding, confidence: m.confidence, n: pics.get(m.id)?.n ?? 0, sources: m.sources ?? [] });
  // The workshop: its city, or, where the catalogue has none, its dynasty (a Mughal court atelier)
  const wk = place ? `w:${place}` : m.dynasty ? `d:${m.dynasty}` : null;
  if (wk) { add(wk, 'place', place ?? m.dynasty, { city: !!place }); links.push({ source: `m:${m.id}`, target: wk, kind: 'place' }); }
  if (m.patron) { add(`p:${slug(short(m.patron))}`, 'patron', short(m.patron), { full: m.patron }); links.push({ source: `m:${m.id}`, target: `p:${slug(short(m.patron))}`, kind: 'patron' }); }
  for (const raw of m.painters) {
    const { name, probable } = person(raw);
    const n = add(`a:${slug(name)}`, 'painter', name);
    links.push({ source: `a:${slug(name)}`, target: `m:${m.id}`, kind: 'painted', probable });
  }
}
// Painters who share a manuscript, with the manuscripts they share (listed in the manuscript's catalogue entry; not necessarily the same folio)
const co = new Map();
for (const m of cat.manuscripts) {
  const ps = [...new Set(m.painters.map((p) => person(p).name))];
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
    const k = [ps[i], ps[j]].sort().join(' | ');
    co.set(k, [...(co.get(k) ?? []), m.id]);
  }
}
const together = [...co].map(([k, v]) => ({ a: k.split(' | ')[0], b: k.split(' | ')[1], ms: v })).sort((x, y) => y.ms.length - x.ms.length);

// Scenes graph: a scene painted in manuscripts of two or more cities, by the city's earliest manuscript with it
const by = new Map();
for (const x of gal.items) {
  const m = ms.get(x.ms);
  if (!x.scene || !m?.place) continue;
  const k = `${x.poem}/${x.scene}`;
  const r = by.get(k) ?? { poem: x.poem, scene: x.scene, cities: new Map() };
  const c = r.cities.get(m.place) ?? { city: m.place, year: m.yearStart, n: 0, ms: new Set() };
  c.n++; c.year = Math.min(c.year ?? 9999, m.yearStart ?? 9999); c.ms.add(m.id);
  r.cities.set(m.place, c);
  by.set(k, r);
}
const names = new Map();
for (const p of gal.poems) for (const s of p.scenes) names.set(`${p.slug}/${s.id}`, { poemName: { az: p.az, en: p.en, ru: p.ru }, az: s.az, en: s.en, ru: s.ru });
const scenes = [...by.values()].filter((r) => r.cities.size >= 2 && names.has(`${r.poem}/${r.scene}`)).map((r) => ({
  id: `${r.poem}/${r.scene}`, poem: r.poem, ...names.get(`${r.poem}/${r.scene}`),
  cities: [...r.cities.values()].map((c) => ({ city: c.city, year: c.year, n: c.n, ms: [...c.ms] })).sort((a, b) => a.year - b.year),
})).sort((a, b) => b.cities.length - a.cities.length || b.cities.reduce((s, c) => s + c.n, 0) - a.cities.reduce((s, c) => s + c.n, 0));

const out = {
  built: new Date().toISOString().slice(0, 10),
  names: gal.names, nodes: [...nodes.values()], links, together, scenes,
  stats: { manuscripts: cat.manuscripts.length, inGraph: [...nodes.values()].filter((n) => n.type === 'ms').length, painters: [...nodes.values()].filter((n) => n.type === 'painter').length, pictures: gal.items.length, withCity: gal.items.filter((x) => ms.get(x.ms)?.place).length },
};
await writeFile(new URL('network.json', root), JSON.stringify(out) + '\n');
console.log(out.stats, 'scenes in 2+ cities:', scenes.length, 'painter pairs:', together.length);
for (const t of together.slice(0, 8)) console.log(t.a, '+', t.b, t.ms.join(','));
