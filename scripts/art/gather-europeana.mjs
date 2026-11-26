// Europeana (open-reusability images only: CC0, PDM, CC BY, CC BY-SA) → data/art/raw/europeana.json
// EUROPEANA_KEY or the public demo key.
import { writeFile, mkdir } from 'node:fs/promises';
import { getJson, root } from './lib.mjs';
const KEY = process.env.EUROPEANA_KEY ?? 'api2demo';
const QUERIES = ['Azerbaijan carpet', 'Azerbaijan painting', 'Azerbaijan rug', 'Azerbaijan ceramic', 'Azerbaijan embroidery', 'Azerbaijan miniature', 'Azerbaijani', 'Shirvan rug', 'Tabriz', 'Karabakh rug', 'Kuba rug', 'Kazak rug', 'Gobustan', 'Caucasian Albania', 'Baku painting', 'Ganja', 'Shusha', 'Nakhchivan', 'Azerbaijan sculpture', 'Azerbaijan metalwork', 'Seychour', 'Shemakha', 'Genje', 'Karabagh', 'Shirwan', 'Kasak tapijt', 'Kuba tapijt', 'Bakoe', 'Tebris', 'Aserbaidschan', 'Aserbeidschan', 'Azerbaïdjan', 'Azerbaigian', 'Azerbaiyán', 'Kaukasisch tapijt', 'Kaukasischer Teppich', 'tapis du Caucase', 'Karabagh tapijt', 'Tabriz miniature', 'Tabriz manuscript', 'Safavid Tabriz', 'Ilkhanid Tabriz', 'Azerbaijan manuscript', 'Azerbaijan textile', 'Azerbaijan photograph art'];
const HIT = /azerbaij|tabriz|shirvan|karabagh|karabakh|gobustan|baku|ganja|genje|kuba|kazak|shemakha|shamakhi|seychour|shusha|nakhchivan|albania/i;
const ART = /rug|carpet|paint|miniature|ceramic|embroider|sculpt|metal|textile|drawing|print|manuscript|vase|bowl|plate|jewel|tile|relief|petroglyph|statue|dish|jug|weav|kilim|painting|watercolo|etching|engrav/i;
const seen = new Map();
for (const q of QUERIES) {
  for (let start = 1; start <= 401; start += 100) {
    const r = await getJson(`https://api.europeana.eu/record/v2/search.json?wskey=${KEY}&query=${encodeURIComponent(q)}&reusability=open&media=true&qf=TYPE:IMAGE&rows=100&start=${start}&profile=rich`);
    for (const o of r?.items ?? []) seen.set(o.id, o);
    if (!r || start + 100 > (r.totalResults ?? 0)) break;
  }
}
const lic = (u) => /publicdomain\/zero/.test(u) ? 'CC0' : /publicdomain\/mark/.test(u) ? 'Public Domain Mark' : /licenses\/by-sa/.test(u) ? 'CC BY-SA' : /licenses\/by\//.test(u) ? 'CC BY' : u;
const out = [];
for (const o of seen.values()) {
  const title = (o.title ?? [])[0] ?? '';
  const desc = (o.dcDescription ?? []).join(' ');
  const blob = [title, desc, ...(o.dcSubject ?? []), ...(o.edmPlaceLabel ?? []).map((p) => p.def ?? p), ...(o.dcCoverage ?? []), ...(o.dctermsSpatial ?? [])].join(' | ');
  if (!HIT.test(blob) || !ART.test(blob + ' ' + (o.dcType ?? []).join(' '))) continue;
  const rights = (o.rights ?? [])[0] ?? '';
  const l = lic(rights);
  const free = ['CC0', 'Public Domain Mark', 'CC BY', 'CC BY-SA'].includes(l);
  out.push({ source: 'europeana', sourceId: 'europeana-' + o.id.replace(/\//g, '_'), title, artist: (o.dcCreator ?? []).join('; '), dateText: (o.year ?? [])[0] ?? '', objectName: (o.dcType ?? [])[0] ?? '',
    place: (o.edmPlaceLabel ?? []).map((p) => p.def ?? p).slice(0, 2).join(', '), hitText: blob.slice(0, 400), institution: (o.dataProvider ?? [])[0] ?? '', accession: '', sourceUrl: (o.edmIsShownAt ?? [])[0] ?? o.guid,
    publicDomain: free, license: l, image: free ? (o.edmIsShownBy ?? [])[0] ?? '' : '', imageSmall: (o.edmPreview ?? [])[0] ?? '', strict: true, provider: (o.provider ?? [])[0] });
}
await mkdir(new URL('data/art/raw/', root), { recursive: true });
out.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
await writeFile(new URL('data/art/raw/europeana.json', root), JSON.stringify(out, null, 1));
console.error('europeana candidates', seen.size, 'kept', out.length);
