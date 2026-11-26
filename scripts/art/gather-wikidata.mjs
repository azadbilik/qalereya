// Wikidata: (1) registry of Azerbaijani visual artists with lifespans (drives the copyright rule),
// (2) their artworks and artworks of Azerbaijani origin → data/art/raw/artists.json, wikidata.json
import { writeFile, mkdir } from 'node:fs/promises';
import { sparql } from './wd.mjs';
import { root } from './lib.mjs';
const qid = (u) => u?.value.split('/').pop();
const OCC = 'wd:Q1028181 wd:Q1281618 wd:Q483501 wd:Q1925963 wd:Q15296811 wd:Q644687 wd:Q329439 wd:Q33231 wd:Q1115958 wd:Q3391743 wd:Q1631111 wd:Q2515073 wd:Q11569986 wd:Q42973';
// Historical figures the occupation query misses: ensured by name search below
const ORIGIN = `{ ?c wdt:P27 wd:Q227 } UNION { ?c wdt:P19/wdt:P131* wd:Q227 } UNION { ?c wdt:P19/wdt:P131* wd:Q43762 } UNION { ?c wdt:P19/wdt:P131* wd:Q5974 } UNION { ?c wdt:P19/wdt:P131* wd:Q5976 } UNION { ?c wdt:P172 wd:Q211841 } UNION { ?c wdt:P27 wd:Q2184 . ?c wdt:P19/wdt:P131* wd:Q227 }`;
const reg = new Map();
const rows = await sparql(`SELECT DISTINCT ?c ?cLabel ?cAz ?b ?d ?cat ?cit ?eth ?pob ?pobLabel WHERE {
 VALUES ?occ { ${OCC} } ?c wdt:P106 ?occ . ${ORIGIN}
 OPTIONAL{?c wdt:P569 ?b} OPTIONAL{?c wdt:P570 ?d} OPTIONAL{?c wdt:P373 ?cat} OPTIONAL{?c wdt:P19 ?pob} OPTIONAL{?c wdt:P27 ?cit} OPTIONAL{?c wdt:P172 ?eth}
 OPTIONAL{?c rdfs:label ?cAz FILTER(lang(?cAz)='az')}
 SERVICE wikibase:label { bd:serviceParam wikibase:language "en,az,ru". } }`);
for (const x of rows) {
  const id = qid(x.c);
  const r = reg.get(id) ?? { id, name: x.cLabel.value, nameAz: x.cAz?.value, born: x.b?.value.slice(0, 4), died: x.d?.value.slice(0, 4), commonsCat: x.cat?.value, birthplace: x.pobLabel?.value };
  r.cit = [...new Set([...(r.cit ?? []), ...(x.cit ? [qid(x.cit)] : [])])];
  r.eth = [...new Set([...(r.eth ?? []), ...(x.eth ? [qid(x.eth)] : [])])];
  reg.set(id, r);
}
// Azerbaijani by citizenship (Q227) or ethnicity (Q211841); the rest born in these lands but of
// another nation (Armenian Q399/Q79797, Georgian Q230, Russian-only…) stay out of the registry
for (const [id, r] of reg) {
  const az = r.cit.includes('Q227') || r.eth.includes('Q211841');
  const other = r.cit.some((c) => ['Q399', 'Q230'].includes(c)) || r.eth.some((e) => ['Q79797', 'Q160894'].includes(e));
  r.azerbaijani = az || (!other && r.cit.some((c) => ['Q2184', 'Q15180', 'Q794', 'Q34266'].includes(c)) && /Azerbaijan|Baku|Tabriz|Ganja|Shusha|Nakhchivan|Sumqayit|Lankaran|Shaki|Sheki|Quba|Ardabil|Urmia/i.test(r.birthplace ?? ''));
  if (!r.azerbaijani) reg.delete(id);
}
// Named historical artists (wbsearchentities → check they are people with these names)
const NAMED = ['Mir Mohsun Navvab', 'Usta Gambar Garabaghi', 'Mirza Gadim Iravani', 'Bahruz Kangarli', 'Azim Azimzade', 'Sattar Bahlulzade', 'Javad Mirjavadov', 'Mikayil Abdullayev', 'Tahir Salahov', 'Togrul Narimanbekov', 'Gazanfar Khalykov', 'Rustam Mustafayev', 'Maral Rahmanzade', 'Ali Shamsi', 'Sadiqi Beg Afshar', 'Soltan Mohammad', 'Mir Sayyid Ali', 'Kamal ud-Din Behzad', 'Ostad Mohammad Siyah Qalam', 'Mir Musavvir', 'Ahmad Musa', 'Shams al-Din (Tabriz painter)', 'Abdulhay Tabrizi', 'Haji Muhammad Naqqash', 'Hajji Mohammad Naqqash', 'Mirza Mohammad Ali Naqqash', 'Sattar Bahlulzade', 'Elmira Shahtakhtinskaya', 'Zeynal Abdin Abdinov', 'Mir-Mohsun Navvab', 'Khanlar Mirzoyev', 'Ismayil Sheikhov'];
export const named = NAMED;
await mkdir(new URL('data/art/raw/', root), { recursive: true });
await writeFile(new URL('data/art/raw/artists.json', root), JSON.stringify([...reg.values()], null, 1));
console.error('artists', reg.size);

// Artworks by those artists, with their Commons image and holder
const ids = [...reg.keys()];
const works = new Map();
for (let i = 0; i < ids.length; i += 60) {
  const vals = ids.slice(i, i + 60).map((x) => 'wd:' + x).join(' ');
  const r = await sparql(`SELECT ?a ?aLabel ?aAz ?c ?img ?coll ?collLabel ?inv ?inc ?typeLabel ?matLabel ?locLabel WHERE {
    VALUES ?c { ${vals} } ?a wdt:P170 ?c .
    OPTIONAL{?a wdt:P18 ?img} OPTIONAL{?a wdt:P195 ?coll} OPTIONAL{?a wdt:P217 ?inv} OPTIONAL{?a wdt:P571 ?inc} OPTIONAL{?a wdt:P31 ?type} OPTIONAL{?a wdt:P186 ?mat} OPTIONAL{?a wdt:P276 ?loc}
    OPTIONAL{?a rdfs:label ?aAz FILTER(lang(?aAz)='az')}
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,az,ru". } }`);
  for (const x of r) {
    const id = qid(x.a);
    const w = works.get(id) ?? { id, title: x.aLabel.value, titleAz: x.aAz?.value, creator: qid(x.c), images: new Set(), collection: x.collLabel?.value, inventory: x.inv?.value, inception: x.inc?.value, type: x.typeLabel?.value, material: x.matLabel?.value, location: x.locLabel?.value };
    if (x.img) w.images.add(decodeURIComponent(x.img.value.split('/Special:FilePath/').pop()));
    works.set(id, w);
  }
  console.error('works', works.size);
}
// Objects of Azerbaijani origin / find spot / creation place that are art or crafts (not films, coins types…)
const origin = await sparql(`SELECT ?a ?aLabel ?aAz ?img ?coll ?collLabel ?inv ?inc ?typeLabel ?locLabel WHERE {
  { ?a wdt:P495 wd:Q227 } UNION { ?a wdt:P189/wdt:P131* wd:Q227 } UNION { ?a wdt:P1071/wdt:P131* wd:Q227 } UNION { ?a wdt:P495 wd:Q1034623 }
  ?a wdt:P18 ?img . OPTIONAL{?a wdt:P195 ?coll} OPTIONAL{?a wdt:P217 ?inv} OPTIONAL{?a wdt:P571 ?inc} OPTIONAL{?a wdt:P31 ?type} OPTIONAL{?a wdt:P276 ?loc}
  OPTIONAL{?a rdfs:label ?aAz FILTER(lang(?aAz)='az')}
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,az,ru". } }`);
for (const x of origin) {
  const id = qid(x.a);
  const w = works.get(id) ?? { id, title: x.aLabel.value, titleAz: x.aAz?.value, images: new Set(), collection: x.collLabel?.value, inventory: x.inv?.value, inception: x.inc?.value, type: x.typeLabel?.value, location: x.locLabel?.value, origin: true };
  w.images.add(decodeURIComponent(x.img.value.split('/Special:FilePath/').pop()));
  works.set(id, w);
}
const out = [...works.values()].map((w) => ({ ...w, images: [...w.images] }));
await writeFile(new URL('data/art/raw/wikidata.json', root), JSON.stringify(out, null, 1));
console.error('wikidata works', out.length, 'with image', out.filter((w) => w.images.length).length);
