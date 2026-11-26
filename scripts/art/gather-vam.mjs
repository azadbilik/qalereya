// V&A collections API: objects made in / found in / titled for Azerbaijan. Metadata only —
// V&A images are not under a free licence (non-commercial terms), so nothing is mirrored.
import { writeFile, mkdir } from 'node:fs/promises';
import { getJson, root } from './lib.mjs';
const QUERIES = ['Azerbaijan', 'Tabriz', 'Shirvan', 'Karabagh', 'Karabakh', 'Baku', 'Ganja', 'Kuba rug', 'Kazak rug', 'Caucasian rug', 'Shemakha', 'Genje', 'Seychour'];
const HIT = /azerbaij|tabriz|shirvan|karabagh|karabakh|baku|ganja|genje|kuba|kazak|shemakha|shamakhi|seychour|caucas|sheki|nakhchivan/i;
const seen = new Map();
for (const q of QUERIES) {
  for (let page = 1; page <= 10; page++) {
    const r = await getJson(`https://api.vam.ac.uk/v2/objects/search?q=${encodeURIComponent(q)}&page_size=100&page=${page}`);
    for (const o of r?.records ?? []) seen.set(o.systemNumber, o);
    if (!r || page >= r.info.pages) break;
  }
}
const out = [];
for (const o of seen.values()) {
  const blob = [o._primaryTitle, o._primaryPlace, o.objectType].join(' | ');
  if (!HIT.test(blob)) continue;
  out.push({ source: 'vam', sourceId: 'vam-' + o.systemNumber, title: o._primaryTitle || o.objectType, artist: o._primaryMaker?.name && o._primaryMaker.name !== 'Unknown' ? o._primaryMaker.name : '',
    dateText: o._primaryDate, objectName: o.objectType, place: o._primaryPlace, hitText: blob, institution: 'Victoria and Albert Museum', accession: o.accessionNumber,
    sourceUrl: 'https://collections.vam.ac.uk/item/' + o.systemNumber + '/', publicDomain: false, license: 'V&A terms (not free)', image: '', imageSmall: '', strict: true });
}
await mkdir(new URL('data/art/raw/', root), { recursive: true });
out.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
await writeFile(new URL('data/art/raw/vam.json', root), JSON.stringify(out, null, 1));
console.error('vam candidates', seen.size, 'kept', out.length);
