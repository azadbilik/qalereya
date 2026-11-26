// Cleveland Museum of Art Open Access (CC0) → data/art/raw/cleveland.json
import { writeFile, mkdir } from 'node:fs/promises';
import { getJson, root } from './lib.mjs';
const QUERIES = ['Azerbaijan', 'Tabriz', 'Shirvan', 'Karabagh', 'Karabakh', 'Genje', 'Ganja', 'Baku', 'Kazak', 'Kuba', 'Caucasus', 'Caucasian', 'Nakhchivan', 'Ardabil', 'Maragha', 'Shamakhi', 'Seychour', 'Talish', 'Jalayirid', 'Gobustan', 'Sheki', 'Barda', 'Qazvin Tabriz'];
const HIT = /azerbaij|tabriz|shirvan|karabagh|karabakh|\bkazak\b|\bgenje\b|\bganja\b|\bbaku\b|shusha|\bkuba\b|seychour|talish|moghan|nakhchivan|nakhichevan|gobustan|ardabil|maragha|urmia|shamakhi|sheki|mingachevir|caucas|jalayir|shirvanshah|derbend/i;
const seen = new Map();
for (const q of QUERIES) {
  for (let skip = 0; ; skip += 500) {
    const r = await getJson(`https://openaccess-api.clevelandart.org/api/artworks/?q=${encodeURIComponent(q)}&has_image=1&limit=500&skip=${skip}`);
    for (const o of r?.data ?? []) seen.set(o.id, o);
    if (!r || skip + 500 >= r.info.total) break;
  }
}
const out = [];
for (const o of seen.values()) {
  const blob = [o.title, ...(o.culture ?? []), o.find_spot, o.technique, o.type, o.tombstone && o.tombstone.split('. ').slice(1, 3).join(' ')].filter(Boolean).join(' | ');
  if (!HIT.test(blob)) continue;
  const free = o.share_license_status === 'CC0';
  out.push({
    source: 'cleveland', sourceId: 'cleveland-' + o.accession_number, title: o.title, artist: (o.creators ?? []).map((c) => c.description?.split('(')[0].trim()).filter(Boolean).join('; '),
    dateText: o.creation_date, yearStart: o.creation_date_earliest, yearEnd: o.creation_date_latest, medium: o.technique, objectName: o.type, department: o.department,
    culture: (o.culture ?? []).join('; '), place: o.find_spot || '', hitText: blob, institution: 'Cleveland Museum of Art', accession: o.accession_number, sourceUrl: o.url,
    publicDomain: free, license: free ? 'CC0' : 'rights reserved', image: free ? o.images?.print?.url || o.images?.web?.url : '', imageSmall: o.images?.web?.url,
    strict: true,
  });
}
await mkdir(new URL('data/art/raw/', root), { recursive: true });
out.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
await writeFile(new URL('data/art/raw/cleveland.json', root), JSON.stringify(out, null, 1));
console.error('cleveland candidates', seen.size, 'kept', out.length);
