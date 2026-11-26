// Wikimedia Commons: category crawls + full-text searches (+ each Azerbaijani artist's own category)
// → data/art/raw/commons.json, one row per file with its licence as Commons states it.
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { commons, crawl, root, sleep } from './lib.mjs';

// [theme, kind, query, depth|limit]
const SEEDS = [
  ['prehistory', 'cat', 'Petroglyphs in Azerbaijan', 2], ['prehistory', 'cat', 'Rock art in Azerbaijan', 2], ['prehistory', 'cat', 'Prehistoric art in Azerbaijan', 2],
  ['prehistory', 'cat', 'Gobustan Rock Art Cultural Landscape', 2], ['prehistory', 'cat', 'Gobustan National Park', 2], ['prehistory', 'cat', 'Gobustan State Historical-Artistic Preserve', 2], ['prehistory', 'cat', 'Gobustan petroglyphs', 2],
  ['prehistory', 'cat', 'Gemigaya', 2], ['prehistory', 'cat', 'Gamigaya', 2],
  ['antiquity', 'cat', 'Caucasian Albania', 1], ['antiquity', 'cat', 'Archaeological artefacts of Azerbaijan', 2], ['antiquity', 'cat', 'Archaeological artifacts of Azerbaijan', 2], ['antiquity', 'cat', 'Archaeology of Azerbaijan', 1],
  ['antiquity', 'cat', 'Jewelry of Caucasian Albania', 1], ['antiquity', 'cat', 'Necklace from Ovçular tepe', 1], ['medieval', 'cat', 'Jewelry from Palace of Shirvanshahs', 1], ['medieval', 'cat', 'Jewellery of Azerbaijan', 1],
  ['medieval', 'cat', 'Tombstones of Azerbaijan', 1], ['medieval', 'cat', 'Stone horses and rams in Azerbaijan', 1], ['medieval', 'cat', 'Kitabe', 1], ['medieval', 'cat', 'Khurjuns', 1],
  ['textile', 'cat', 'Textiles of Azerbaijan', 2], ['textile', 'cat', 'Rugs and carpets of Azerbaijan', 2], ['textile', 'cat', 'Embroidery of Azerbaijan', 1], ['textile', 'cat', 'Tapestry of Azerbaijan', 1],
  ['modern', 'cat', 'Painting in Azerbaijan', 2], ['modern', 'cat', 'Miniatures of Azerbaijan', 1], ['modern', 'cat', 'Paintings from Azerbaijan', 1], ['modern', 'cat', 'Visual arts of Azerbaijan', 1], ['modern', 'cat', 'Art of Azerbaijan by medium', 2], ['modern', 'cat', 'Art of Azerbaijan by style', 1], ['modern', 'cat', 'Crafts of Azerbaijan', 2], ['modern', 'cat', 'Collections of art of Azerbaijan by museum', 2],
  ['modern', 'cat', 'Azerbaijani art', 1], ['modern', 'cat', 'Azerbaijani paintings', 2], ['modern', 'cat', 'Paintings by Azerbaijani painters', 2],
  ['tabriz', 'cat', 'Tabriz school (miniature)', 1], ['tabriz', 'cat', 'Persian miniatures from Tabriz', 1],
  ['prehistory', 'q', 'Gobustan petroglyphs', 250], ['prehistory', 'q', 'Gobustan rock art Azerbaijan', 200], ['prehistory', 'q', 'Qobustan qayaüstü rəsmlər', 150], ['prehistory', 'q', 'Gamigaya Nakhchivan petroglyphs', 100], ['prehistory', 'q', 'Kura-Araxes pottery Azerbaijan', 100], ['prehistory', 'q', 'Khojaly-Gadabay culture', 100], ['prehistory', 'q', 'Bronze Age Azerbaijan artefact museum', 100], ['prehistory', 'q', 'Azykh cave Azerbaijan', 60], ['prehistory', 'q', 'Mingachevir archaeological', 100],
  ['antiquity', 'q', 'Caucasian Albania artifact', 100], ['antiquity', 'q', 'Albanian Azerbaijan ancient museum exhibit', 100], ['antiquity', 'q', 'Nakhchivan State History Museum', 100], ['antiquity', 'q', 'Azerbaijan National Museum of History exhibit', 150], ['antiquity', 'q', 'Qabala archaeological Azerbaijan', 80],
  ['medieval', 'q', 'Shirvanshahs Palace stone carving', 150], ['medieval', 'q', 'Azerbaijan medieval ceramics Beylagan', 80], ['medieval', 'q', 'Ganja ceramics medieval glazed Azerbaijan', 80], ['medieval', 'q', 'Azerbaijan medieval stone carving inscription', 100], ['medieval', 'q', 'Momine Khatun mausoleum Nakhchivan', 80], ['medieval', 'q', 'Garabaghlar mausoleum', 40], ['medieval', 'q', 'Azerbaijan medieval metalwork bronze', 80], ['medieval', 'q', 'Barda Azerbaijan medieval', 60], ['medieval', 'q', 'Sheki Khan\'s Palace shebeke murals', 100], ['medieval', 'q', 'Lahij copper', 80],
  ['textile', 'q', 'Shirvan rug', 150], ['textile', 'q', 'Karabakh carpet', 200], ['textile', 'q', 'Guba carpet', 150], ['textile', 'q', 'Gazakh carpet', 100], ['textile', 'q', 'Tabriz carpet', 150], ['textile', 'q', 'Azerbaijani carpet museum', 250], ['textile', 'q', 'Azerbaijani rug', 250], ['textile', 'q', 'Ganja carpet Azerbaijan', 60], ['textile', 'q', 'Baku carpet Azerbaijan', 80], ['textile', 'q', 'kelaghayi Azerbaijan', 60], ['textile', 'q', 'Azerbaijani embroidery', 60], ['textile', 'q', 'Azerbaijan National Carpet Museum', 200],
  ['tabriz', 'q', 'Tabriz school miniature', 100], ['tabriz', 'q', 'Jalayirid painting Tabriz', 60], ['tabriz', 'q', 'Safavid Tabriz painting', 100],
  ['modern', 'q', 'Mir Mohsun Navvab', 60], ['modern', 'q', 'Usta Gambar Garabaghi', 40], ['modern', 'q', 'Mirza Gadim Iravani', 60], ['modern', 'q', 'Bahruz Kangarli', 60], ['modern', 'q', 'Azim Azimzade', 100], ['modern', 'q', 'Sattar Bahlulzade', 80], ['modern', 'q', 'Javad Mirjavadov', 60], ['modern', 'q', 'Tahir Salahov', 60], ['modern', 'q', 'Togrul Narimanbekov', 60], ['modern', 'q', 'Mikayil Abdullayev', 60], ['modern', 'q', 'Azerbaijan National Art Museum painting', 200], ['modern', 'q', 'Azerbaijani painter oil on canvas', 250], ['modern', 'q', 'Azerbaijani sculpture', 100], ['modern', 'q', 'Azerbaijan Soviet poster', 100], ['modern', 'q', 'Shusha painting 19th century Karabakh', 60], ['modern', 'q', 'Azerbaijani contemporary art', 150], ['modern', 'q', 'Heydar Aliyev Center exhibition art', 40], ['modern', 'q', 'Yarat contemporary art Baku', 60], ['modern', 'q', 'Azerbaijani graphic art', 60], ['modern', 'q', 'Azerbaijani miniature art', 80],
];
const HIT = /azerbaij|tabriz|tebriz|shirvan|şirvan|karabakh|karabagh|qarabağ|garabagh|gobustan|qobustan|gamigaya|qamıqaya|nakhchivan|nakhichevan|naxçıvan|baku|bakı|ganja|gəncə|genje|shusha|şuşa|guba|quba|gazakh|qazax|kazak|sheki|şəki|lahij|lahıc|mingachevir|mingəçevir|beylagan|beyləqan|barda|bərdə|caucasian albania|albania|kura-araxes|khojaly|navvab|kangarli|kəngərli|azimzade|bahlulzade|bəhlulzadə|mirjavadov|salahov|narimanbe|abdullayev|iravani|garabaghi|kelaghayi|kəlağayı|shamakhi|şamaxı|kitabe|shebeke|şəbəkə/i;
const SKIP_CAT = (c) => /Heydar Aliyev|Ilham Aliyev|Flag|Coat of arms|Stamps|Banknote|Coins|Football|Eurovision|Presidents|Politics|Military|Armed forces|Elections|Railway|Airport|Road|Hospital|Parliament|Sport|Soldier|Disasters|Events in|People of|Buildings in|Streets|Mosques|Churches|Hotels|Schools|University|Companies|Transport|Cityscape|Panoram|Night|Aerial/i.test(c);

const files = new Map(); // title -> {themes:Set, cats:Set}
const add = (t, theme, cat) => { if (!/\.(jpe?g|png|tiff?|webp|gif)$/i.test(t)) return; const e = files.get(t) ?? { themes: new Set(), seeds: new Set() }; e.themes.add(theme); e.seeds.add(cat); files.set(t, e); };

for (const [theme, kind, q, n] of SEEDS) {
  if (kind === 'cat') {
    const r = await crawl(q, n, { maxCats: 60, skip: SKIP_CAT });
    for (const [t, cs] of r.files) add(t, theme, 'cat:' + cs[0]);
    console.error('cat', q, r.files.size);
  } else {
    let got = 0, off = 0;
    while (got < n) {
      const r = await commons({ action: 'query', list: 'search', srsearch: q, srnamespace: 6, srlimit: 50, sroffset: off });
      const hits = r?.query?.search ?? [];
      for (const h of hits) add(h.title, theme, 'q:' + q);
      got += hits.length; off += hits.length;
      if (!r?.continue) break;
    }
    console.error('q', q, got);
  }
}
// Each registered artist's own Commons category
try {
  const artists = JSON.parse(await readFile(new URL('data/art/raw/artists.json', root), 'utf8'));
  for (const a of artists) if (a.commonsCat) {
    const r = await crawl(a.commonsCat, 1, { maxCats: 8 });
    for (const [t] of r.files) add(t, 'modern', 'artist:' + a.id);
  }
} catch (e) { console.error('no artists.json yet', e.message); }

console.error('files', files.size);
const titles = [...files.keys()];
const out = [];
for (let i = 0; i < titles.length; i += 50) {
  const r = await commons({ action: 'query', prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiextmetadatafilter: 'LicenseShortName|License|UsageTerms|Artist|Credit|ImageDescription|ObjectName|DateTimeOriginal|DateTime|Categories|Copyrighted|AttributionRequired|Restrictions|Permission', iiurlwidth: 900, titles: titles.slice(i, i + 50).join('|') });
  for (const p of r?.query?.pages ?? []) {
    const ii = p.imageinfo?.[0]; if (!ii) continue;
    const m = ii.extmetadata ?? {}; const v = (k) => m[k]?.value;
    const strip = (s) => (s ?? '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim();
    const e = files.get(p.title);
    const blob = [p.title, strip(v('ImageDescription')), v('Categories')].join(' ');
    out.push({ title: p.title, themes: [...e.themes], seeds: [...e.seeds].slice(0, 3), license: v('LicenseShortName'), copyrighted: v('Copyrighted'), terms: strip(v('UsageTerms')), artist: strip(v('Artist')), credit: strip(v('Credit')).slice(0, 200), description: strip(v('ImageDescription')).slice(0, 500), objectName: strip(v('ObjectName')), date: strip(v('DateTimeOriginal') || v('DateTime')), cats: (v('Categories') ?? '').split('|').slice(0, 25), url: ii.url, thumb: ii.thumburl, width: ii.width, height: ii.height, mime: ii.mime, hit: HIT.test(blob) || [...e.seeds].some((s) => s.startsWith('cat:') || s.startsWith('artist:')) });
  }
  if (i % 500 === 0) console.error('info', i);
}
await mkdir(new URL('data/art/raw/', root), { recursive: true });
await writeFile(new URL('data/art/raw/commons.json', root), JSON.stringify(out));
console.error('commons rows', out.length, 'hit', out.filter((x) => x.hit).length);
