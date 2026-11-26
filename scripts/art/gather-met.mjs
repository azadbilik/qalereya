// Met Open Access (CC0): objects whose place/culture/title/tags point to historical Azerbaijan
//   node scripts/art/gather-met.mjs   → data/art/raw/met.json
import { writeFile, mkdir } from 'node:fs/promises';
import { getJson, sleep, root } from './lib.mjs';
const API = 'https://collectionapi.metmuseum.org/public/collection/v1';
const QUERIES = ['Azerbaijan', 'Azerbaijani', 'Tabriz', 'Shirvan', 'Karabagh', 'Karabakh', 'Kazak rug', 'Genje', 'Ganja', 'Baku', 'Shusha', 'Kuba rug', 'Quba', 'Seychour', 'Talish', 'Moghan', 'Nakhchivan', 'Nakhichevan', 'Gobustan', 'Ardabil', 'Maragha', 'Urmia', 'Caucasian rug', 'Caucasus carpet', 'Sumak Caucasus', 'Kuba', 'Gazakh', 'Shamakhi', 'Derbend', 'Agstafa', 'Lenkoran', 'Sheki', 'Barda', 'Qabala', 'Mingachevir', 'Garabagh'];
const HIT = /azerbaij|tabriz|tebriz|shirvan|şirvan|karabagh|karabakh|qarabag|\bkazak\b|\bgazakh|\bgenje\b|\bganja\b|gandja|\bbaku\b|shusha|\bkuba\b|\bquba\b|seychour|seichour|talish|moghan|nakhchivan|nakhichevan|nakhitchevan|gobustan|ardabil|ardebil|maragha|maragheh|urmia|shamakhi|shemakha|lenkoran|sheki|shaki|\bbarda\b|mingachevir|caucas|derbend|aghstafa|agstafa|jalayir|shaddadid|atabeg|eldiguzid|shirvanshah|qara ?qoyunlu|aq ?qoyunlu|kara koyunlu|ak koyunlu|qizilbash/i;
const STRICT = /azerbaij|tabriz|tebriz|shirvan|karabagh|karabakh|qarabag|\bgenje\b|\bganja\b|gandja|\bbaku\b|shusha|\bkuba\b|seychour|talish|moghan|nakhchivan|nakhichevan|gobustan|ardabil|maragha|urmia|shamakhi|sheki|mingachevir|kazak|caucas|jalayir|shirvanshah/i;
const ids = new Set();
for (const q of QUERIES) {
  const r = await getJson(`${API}/search?q=${encodeURIComponent(q)}&hasImages=true`.replace('/v1/', '/v1.1/'));
  for (const id of r?.objectIDs ?? []) ids.add(id);
  console.error(q, r?.total);
}
console.error('candidates', ids.size);
const out = [];
const list = [...ids];
let i = 0;
async function worker() {
  while (i < list.length) {
    const id = list[i++];
    const o = await getJson(`${API}/objects/${id}`);
    await sleep(120);
    if (!o?.objectID) continue;
    const place = [o.country, o.city, o.state, o.region, o.subregion, o.locale, o.locus, o.county, o.river, o.culture, o.period, o.dynasty, o.title, o.objectName, o.excavation, ...(o.tags ?? []).map((t) => t.term)].filter(Boolean).join(' | ');
    if (!HIT.test(place)) continue;
    out.push({
      source: 'met', sourceId: 'met-' + o.objectID, title: o.title, artist: o.artistDisplayName || '', artistBegin: o.artistBeginDate, artistEnd: o.artistEndDate,
      dateText: o.objectDate, yearStart: o.objectBeginDate, yearEnd: o.objectEndDate, medium: o.medium, objectName: o.objectName, classification: o.classification, department: o.department,
      culture: o.culture, place: [o.city, o.region, o.country, o.locale].filter(Boolean).join(', '), hitText: place,
      institution: 'The Metropolitan Museum of Art', accession: o.accessionNumber, sourceUrl: o.objectURL,
      publicDomain: !!o.isPublicDomain, license: o.isPublicDomain ? 'CC0' : 'rights reserved', image: o.isPublicDomain ? o.primaryImage : '', imageSmall: o.primaryImageSmall, strict: STRICT.test(place),
    });
  }
}
await Promise.all([1, 2, 3].map(worker));
await mkdir(new URL('data/art/raw/', root), { recursive: true });
out.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
await writeFile(new URL('data/art/raw/met.json', root), JSON.stringify(out, null, 1));
console.error('kept', out.length);
