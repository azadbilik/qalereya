// Builds data/art/catalogue.json (+ .csv) from data/art/raw/*.json (the gather-*.mjs scripts).
//   node scripts/art/build.mjs
// Image policy (see data/art/sources.md): an image is kept only when it is free to reuse AND the work
// itself is out of copyright (Azerbaijan: author's life + 70 years, so authors who died after 1955
// stay metadata-only) or the holder has waived rights (Met, Cleveland CC0). Everything else is
// listed with a link to where it is held, with no picture.
import { readFile, writeFile } from 'node:fs/promises';
import { root } from './lib.mjs';
const rd = async (n, d = []) => { try { return JSON.parse(await readFile(new URL('data/art/raw/' + n, root), 'utf8')); } catch { return d; } };
const [met, cle, eur, vam, wd, artists, commons] = await Promise.all(['met', 'cleveland', 'europeana', 'vam', 'wikidata', 'artists', 'commons'].map((n) => rd(n + '.json')));
const existing = JSON.parse(await readFile(new URL('data/artworks.json', root), 'utf8'));
const exIds = new Set(existing.map((x) => x.id));
const exCommons = new Set(existing.filter((x) => /commons\.wikimedia/.test(x.source ?? '')).map((x) => decodeURIComponent((x.source ?? '').split('/wiki/').pop()).replace(/_/g, ' ')));
const exSrc = new Set(existing.map((x) => x.source));

// ---------- periods ----------
export const PERIODS = [
  { id: 'prehistory', from: -Infinity, to: -3000, az: 'Qədim dövr və qayaüstü rəsmlər', ru: 'Первобытность и наскальное искусство', en: 'Prehistory and rock art', span: 'to 3000 BCE' },
  { id: 'bronze-iron', from: -3000, to: -330, az: 'Tunc və dəmir dövrü', ru: 'Бронзовый и железный век', en: 'Bronze and Iron Age', span: '3000–330 BCE' },
  { id: 'antiquity', from: -330, to: 650, az: 'Qafqaz Albaniyası və antik dövr', ru: 'Кавказская Албания и античность', en: 'Caucasian Albania and antiquity', span: '330 BCE–650 CE' },
  { id: 'medieval', from: 650, to: 1500, az: 'Orta əsrlər: Şirvanşahlar, Elxanilər, Cəlairilər', ru: 'Средневековье: Ширваншахи, Хулагуиды, Джалаириды', en: 'Middle Ages: Shirvanshahs, Ilkhanids, Jalayirids', span: '650–1500' },
  { id: 'early-modern', from: 1500, to: 1800, az: 'Səfəvilər, Təbriz məktəbi və xanlıqlar', ru: 'Сефевиды, тебризская школа и ханства', en: 'Safavids, the Tabriz school and the khanates', span: '1500–1800' },
  { id: 'c19', from: 1800, to: 1900, az: 'XIX əsr', ru: 'XIX век', en: 'The 19th century', span: '1800–1900' },
  { id: 'c20', from: 1900, to: 1991, az: 'XX əsr', ru: 'XX век', en: 'The 20th century', span: '1900–1991' },
  { id: 'contemporary', from: 1991, to: Infinity, az: 'Müasir dövr', ru: 'Современность', en: 'Contemporary', span: 'since 1991' },
];
const THEME_PERIOD = { prehistory: 'prehistory', antiquity: 'antiquity', medieval: 'medieval', tabriz: 'early-modern', textile: 'c19', modern: 'c20' };
const periodOf = (y0, y1) => {
  const y = y0 != null && y1 != null ? (y0 + y1) / 2 : (y0 ?? y1);
  if (y == null) return null;
  return PERIODS.find((p) => y >= p.from && y < p.to)?.id ?? 'contemporary';
};
const ROM = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10, xi: 11, xii: 12, xiii: 13, xiv: 14, xv: 15, xvi: 16, xvii: 17, xviii: 18, xix: 19, xx: 20, xxi: 21 };
// "1880", "ca. 1850–75", "18th century", "XIX əsr", "7th century BC"
function parseYears(s) {
  if (!s) return [null, null];
  const bc = /\bB\.?C\.?E?\b|\bBCE\b|e\.ə|до н/i.test(s);
  const c = s.match(/(\d{1,2})(?:st|nd|rd|th)[\s-]+(?:to[\s-]+(\d{1,2})(?:st|nd|rd|th)[\s-]+)?century/i) || s.match(/\b(X{0,2}I{1,3}|X{0,2}IV|X{0,2}VI{0,3}|XX?|XIX)\s*(?:əsr|век|c\.)/i);
  if (c) {
    const n = /^\d/.test(c[1]) ? +c[1] : ROM[c[1].toLowerCase()];
    const m = c[2] ? +c[2] : n;
    return bc ? [-(m * 100), -((n - 1) * 100)] : [(n - 1) * 100, m * 100];
  }
  const ys = [...s.matchAll(/(?<!\d)(\d{3,4})(?!\d)/g)].map((m) => +m[1]).filter((y) => (bc ? y >= 100 : y >= 600) && y <= 2030);
  if (!ys.length) return [null, null];
  const a = Math.min(...ys), b = Math.max(...ys);
  return bc ? [-b, -a] : [a, b];
}

// ---------- media ----------
const MEDIA = [
  ['rock-art', /petroglyph|rock art|rock engraving|rock carving|qayaüstü|qaya rəsm|boyukdash|böyükdaş|gamigaya|qamıqaya|kichikdash|cave painting/i],
  ['manuscript', /manuscript|folio|codex|shahnam|khamsa|miniature|illuminat|illustrat.* (?:folio|page)|album page|qur.?an|calligraph|miniatür/i],
  ['carpet', /tapijt|perkenkleed|carpet|\brug\b|\brugs\b|kilim|palas|\bjejim|jajim|halı|xalça|gəbə|pile|prayer rug|namazlıq|sumak|zili|verni|\bkhorjin|saddle ?bag|bedding bag|khurjun|xurcun|mafrash|chuval/i],
  ['textile', /textile|embroider|kəlağayı|kelaghayi|shawl|costume|dress|garment|brocade|silk|tapestry|cloth|tablecloth|curtain|mütəkkə|zərxara|təkəlduz|mahud|tiraz|cap\b|headdress|velvet/i],
  ['ceramics', /ceramic|pottery|\bpot\b|bowl|vase|jug|ewer|glazed|faience|tile|earthenware|dish\b|plate|kuzə|saxsı|qab\b|vessel|amphora|jar\b/i],
  ['metalwork', /metal|bronze|copper|brass|silver|gold|iron|dagger|sword|helmet|armou?r|belt|mirror|lahij|lahıc|jewel|jewell|necklace|bracelet|pendant|ring\b|earring|bead|brooch|torque|axe\b|spear|buckle|ornament|diadem|kub ?\b/i],
  ['stone', /stone|tombstone|gravestone|sarcophag|carved|relief|stele|inscription|kitabe|kitabə|epitaph|capital\b|column|mausoleum.*(?:decor|carv)|ram figure|sheep figure|stone horse|qoç|baba|balbal|khachkar|ossuary/i],
  ['painting', /painting|oil on|canvas|gouache|tempera|watercolou?r|mural|fresco|portrait|landscape|still life|rəsm|tablo|poster/i],
  ['graphics', /drawing|print|lithograph|etching|engraving|woodcut|sketch|graphic|illustration|poster|ex libris/i],
  ['sculpture', /sculpt|statue|\bbust\b|bronze figure|heykəl|figurine/i],
  ['wood', /woodwork|wooden|wood carving|furniture|casket|coffret|shebeke|şəbəkə|door|chest\b/i],
  ['instrument', /instrument|\btar\b|tār|kamancha|saz\b|zurna|daf\b|daira|balaban|bālābān|lute|drum|ney\b|santur|qaval/i],
  ['photo', /photograph|photo\b/i],
  ['architecture', /palace|mosque|tower|castle|fortress|caravanserai|bath\b|mausoleum|türbə|minaret|madrasa|khan's|tomb\b|architecture/i],
];
const MEDIUM_LABEL = {
  'rock-art': { az: 'Qayaüstü rəsmlər', ru: 'Наскальные изображения', en: 'Rock art' }, manuscript: { az: 'Əlyazma və miniatür', ru: 'Рукописи и миниатюры', en: 'Manuscripts and miniatures' },
  carpet: { az: 'Xalça', ru: 'Ковры', en: 'Carpets' }, textile: { az: 'Toxuma və geyim', ru: 'Ткани и одежда', en: 'Textiles and dress' }, ceramics: { az: 'Keramika', ru: 'Керамика', en: 'Ceramics' },
  metalwork: { az: 'Metal və zərgərlik', ru: 'Металл и ювелирное дело', en: 'Metalwork and jewellery' }, stone: { az: 'Daş və kitabə', ru: 'Камень и эпиграфика', en: 'Stone and inscriptions' },
  painting: { az: 'Rəngkarlıq', ru: 'Живопись', en: 'Painting' }, graphics: { az: 'Qrafika', ru: 'Графика', en: 'Graphic art' }, sculpture: { az: 'Heykəltəraşlıq', ru: 'Скульптура', en: 'Sculpture' },
  wood: { az: 'Ağac', ru: 'Дерево', en: 'Woodwork' }, instrument: { az: 'Musiqi alətləri', ru: 'Музыкальные инструменты', en: 'Musical instruments' }, photo: { az: 'Fotoqrafiya', ru: 'Фотография', en: 'Photography' },
  architecture: { az: 'Memarlıq təfərrüatı', ru: 'Архитектура', en: 'Architecture' }, other: { az: 'Digər', ru: 'Другое', en: 'Other' },
};
const mediumOf = (...parts) => { const s = parts.filter(Boolean).join(' | '); return MEDIA.find(([, re]) => re.test(s))?.[0]; };

// ---------- places ----------
const PLACES = [
  ['Gobustan', /gobustan|qobustan|boyukdash|böyükdaş|kichikdash|yazılıtəpə|yazylytepe/i], ['Nakhchivan', /nakh[ci]+van|naxçıvan|gamigaya|gemigaya|qamıqaya/i], ['Shirvan', /shirvan|şirvan|shamakhi|şamaxı|shemakha|shemakhi/i],
  ['Quba', /\bq?kuba\b|\bquba\b|guba\b/i], ['Karabakh', /kara?bagh|karabakh|qarabağ|garabagh|shusha|şuşa|agdam|ağdam|fuzuli/i], ['Ganja', /\bganja\b|gəncə|genje|gandja|kirovabad/i], ['Baku', /\bbaku\b|bakı|absheron|abşeron|apsheron/i],
  ['Tabriz', /tabriz|təbriz|tebriz/i], ['Sheki', /\bsheki\b|şəki|shaki|nukha/i], ['Gazakh', /\bkazak\b|gazakh|qazax/i], ['Mingachevir', /mingachevir|mingəçevir/i], ['Beylagan', /beylagan|beyləqan/i], ['Barda', /\bbarda\b|bərdə/i],
  ['Lahij', /lahij|lahıc/i], ['Gabala', /gabala|qəbələ|kabala/i], ['Shahsevan / Mughan', /shahsevan|shahseven|mughan|moghan|muğan/i], ['Ardabil', /ardabil|ardebil/i], ['Lankaran / Talysh', /lankaran|lənkəran|talish|talysh|talış/i], ['Zangezur / Karabakh-Iravan', /iravan|yerevan|erivan|irəvan|zangezur/i],
];
const placeOf = (...parts) => { const s = parts.filter(Boolean).join(' | '); return PLACES.find(([, re]) => re.test(s))?.[0]; };

// ---------- helpers ----------
const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
const artistById = new Map(artists.map((a) => [a.id, a]));
const normName = (s) => slug(s ?? '');
const artistByName = new Map(artists.flatMap((a) => [[normName(a.name), a], ...(a.nameAz ? [[normName(a.nameAz), a]] : [])]));
// A work is protected unless its author died before 1956 (life + 70 in 2026), or the holder waived rights
const LIMIT = 1955;
function protectedBy(item) {
  if (item.waived) return null;
  if (item.unknownModernMaker) return 'maker unknown, modern work';
  if (item.artistId) { const a = artistById.get(item.artistId); if (a?.died) return +a.died > LIMIT ? `author d. ${a.died}` : null; if (a) return a.born && +a.born < 1860 ? null : 'author living or death unknown'; }
  if (item.artist && item.artistDied != null) return item.artistDied > LIMIT ? `author d. ${item.artistDied}` : null;
  if (item.artist && !/unknown|anonym|n\.?n\.?|workshop|school|atelier/i.test(item.artist)) { if ((item.yearEnd ?? 0) > 1900) return 'named author, dates unknown'; }
  if ((item.yearEnd ?? item.yearStart ?? 0) > LIMIT && !item.artist) return 'made after 1955';
  if (item.yearStart == null && item.period && ['c20', 'contemporary'].includes(item.period) && item.period !== 'c20') return 'contemporary';
  return null;
}
const FREE_LIC = /^(cc0|cc[- ]by(?!-nc|-nd)|cc[- ]by[- ]sa|public domain|pd[- ]|pdm|no known|attribution(?!.*noncomm)|gfdl.*cc|cc-zero)/i;
const NC_LIC = /-nc|noncommercial|-nd\b|non-commercial/i;
const licFree = (l) => !!l && FREE_LIC.test(l.trim()) && !NC_LIC.test(l);

const items = [];
const push = (it) => {
  it.period ||= periodOf(it.yearStart, it.yearEnd) || (it.theme && it.theme !== 'modern' ? THEME_PERIOD[it.theme] : null) || null;
  it.medium ||= 'other';
  if (it.medium === 'rock-art' && it.source === 'commons') { it.period = 'prehistory'; it.yearStart = it.yearEnd = undefined; }
  it.protectedReason = protectedBy(it);
  const lic = it.license;
  if (!it.image) it.imageStatus = 'none';
  else if (NC_LIC.test(lic ?? '')) it.imageStatus = 'nc';
  else if (!licFree(lic) && !it.waived) it.imageStatus = 'none';
  else if (it.protectedReason) it.imageStatus = 'protected';
  else it.imageStatus = 'free';
  if (it.imageStatus !== 'free') { it.imageSrc = null; } else it.imageSrc = it.image;
  delete it.image; delete it.theme; delete it.waived; delete it.artistDied; delete it.unknownModernMaker;
  items.push(it);
};

// ---------- Met ----------
const MET_OK = /azerbaij|tabriz|shirvan|karabagh|karabakh|\bgenje\b|\bganja\b|\bbaku\b|shusha|\bkuba\b|\bquba\b|seychour|talish|moghan|mughan|nakh|gobustan|ardabil|maragha|urmia|shamakhi|sheki|\bkazak\b|shahsevan|shahseven/i;
for (const x of met) {
  if (exIds.has(x.sourceId)) continue;
  const where = [x.place, x.culture].join(' | ');
  if (!MET_OK.test(where + ' ' + (/\bkazak rug|\bkazak carpet/i.test(x.title) ? 'kazak' : ''))) continue;
  if (/Congo|Japan|Kuba peoples|\[Azerbaijan, Armenia\]/i.test(where) || /^Photographs$/.test(x.classification) || /netsuke|inr[oō]/i.test(x.objectName + x.classification)) continue;
  const [y0, y1] = x.yearStart != null ? [x.yearStart, x.yearEnd] : parseYears(x.dateText);
  const med = /Codices|Manuscript/i.test(x.classification) || /folio/i.test(x.title) ? 'manuscript' : /Rugs|^Rug$/.test(x.classification) ? 'carpet' : /Textile/.test(x.classification) ? mediumOf(x.title, x.classification) === 'carpet' ? 'carpet' : 'textile' : mediumOf(x.classification, x.objectName, x.title, x.medium);
  push({ id: x.sourceId, source: 'met', title: { en: clean(x.title) }, artist: x.artist, dateText: x.dateText, yearStart: y0, yearEnd: y1, medium: med, mediumText: clean(x.medium), place: placeOf(where, x.title) ?? clean(x.place), placeText: clean(x.place),
    institution: x.institution, accession: x.accession, url: x.sourceUrl, license: x.publicDomain ? 'CC0' : null, image: x.imageSmall || x.image, imageOriginal: x.image || undefined, waived: true });
}
// ---------- Cleveland ----------
for (const x of cle) {
  if (exIds.has(x.sourceId) || exSrc.has(x.sourceUrl)) continue;
  const where = [x.culture, x.place].join(' | ');
  if (!MET_OK.test(where) || /Congo|Kuba peoples|Africa|Japan/i.test(where)) continue;
  const [y0, y1] = x.yearStart != null ? [x.yearStart, x.yearEnd] : parseYears(x.dateText);
  push({ id: x.sourceId, source: 'cleveland', title: { en: clean(x.title) }, artist: x.artist, dateText: x.dateText, yearStart: y0, yearEnd: y1, medium: /manuscript/i.test(x.objectName) ? 'manuscript' : mediumOf(x.objectName, x.medium, x.title), mediumText: clean(x.medium),
    place: placeOf(where) ?? clean(x.culture), placeText: clean(x.culture), institution: x.institution, accession: x.accession, url: x.sourceUrl, license: x.publicDomain ? 'CC0' : null, image: x.publicDomain ? x.imageSmall || x.image : '', imageOriginal: x.image || undefined, waived: true });
}
// ---------- Europeana ----------
const EUR_OK = /\bazerbaij|\btabriz|\bshirvan\b|\bshirwan\b|\bkara?bagh|\bkarabakh|\bgobustan|\bbaku\b|\bgan[jd]a\b|\bgenje\b|\bkuba\b|\bquba\b|\bkazak\b|seychour|shemakha|shamakhi|shusha|nakhchivan|\bmoghan\b|\bsheki\b/i;
for (const x of eur) {
  if (exSrc.has(x.sourceUrl)) continue;
  if (!EUR_OK.test([x.title, x.place].join(' ')) || /botan|specimen|herbarium|Müll\.|Kew\b|stamp|postcard|tobacco|cigar/i.test(x.title + x.institution)) continue;
  if (/Chester Beatty/i.test(x.institution) && !/tabriz|azerbaij/i.test(x.title + x.place)) continue;
  const [y0, y1] = parseYears(x.dateText);
  if (!mediumOf(x.objectName, x.title) || /theatre|theater|building|interior/i.test(x.title)) continue;
  push({ id: x.sourceId, source: 'europeana', title: { en: clean(x.title) }, artist: clean(x.artist), dateText: x.dateText, yearStart: y0, yearEnd: y1, medium: mediumOf(x.objectName, x.title, x.hitText), place: placeOf(x.place, x.hitText, x.title) ?? clean(x.place), placeText: x.place,
    institution: x.institution + (x.provider && x.provider !== x.institution ? ` (via ${x.provider})` : ''), accession: x.accession, url: x.sourceUrl, license: x.license, image: x.image });
}
// ---------- V&A (metadata only) ----------
for (const x of vam) {
  const [y0, y1] = parseYears(x.dateText);
  push({ id: x.sourceId, source: 'vam', title: { en: clean(x.title) }, artist: x.artist, dateText: x.dateText, yearStart: y0, yearEnd: y1, medium: mediumOf(x.objectName, x.title), place: placeOf(x.place, x.title) ?? clean(x.place), placeText: x.place,
    institution: x.institution, accession: x.accession, url: x.sourceUrl, license: null, image: '' });
}

// ---------- Commons + Wikidata ----------
const PLACE_AZ = { Gobustan: 'Qobustan', Nakhchivan: 'Naxçıvan', Shirvan: 'Şirvan', Quba: 'Quba', Karabakh: 'Qarabağ', Ganja: 'Gəncə', Baku: 'Bakı', Tabriz: 'Təbriz', Sheki: 'Şəki', Gazakh: 'Qazax', Mingachevir: 'Mingəçevir', Beylagan: 'Beyləqan', Barda: 'Bərdə', Lahij: 'Lahıc', Gabala: 'Qəbələ' };
const KIND_AZ = { khachkar: 'Xaçdaş', gravestone: 'Məzar daşı' };
const looksFile = (t) => /^(?:file:)?(?:img|dsc|dscn|p\d|_dsc|screenshot|photo|image|pict|dscf|\d{6,})/i.test(t.replace(/^File:/, ''));
const titleFrom = (c) => { const base = c.title.replace(/^File:/, '').replace(/\.\w+$/, '').replace(/_/g, ' '); const d = c.objectName || (looksFile(c.title) ? c.description.slice(0, 120) : ''); return clean(d || base); };
const byTitle = new Map(commons.map((c) => [c.title, c]));
const used = new Set();
const SPORT = /mosque|məscid|karvansaray|caravanserai|pəncərə|binası|stained glass|plaque|lövhə|xatirə|memorial|monument to|games|basketball|judo|wrestling|football|volleyball|taekwondo|fencing|weightlift|gymnast|boxing|chess|athlet|marathon|formula|eurovision|festival|concert|conference|congress|forum|summit|meeting|visit|inaugur|ceremony|parade|election|president|minister|military|soldier|army|war\b|conflict|panorama|aerial|skyline|cityscape|stadium|hospital|airport|highway|hotel|metro|railway|station|bridge|supermarket|restaurant|screenshot|wikimania|wikipedia|wikidata|logo|stamp|banknote|\bcoin|flag\b|map of|portrait of (?:president|ilham)|footballer|actor|actress|singer|politician/i;
const FOREIGN = /armenia|yerevan|artsakh|nagorno|stepanakert|zangezur|syunik|kapan\b|shushi\b|karabakh republic|republic of artsakh|[԰-֏]/i;
const TERRITORY = /kara?bagh|karabakh|qarabağ|garabagh|\bshusha\b|\bshushi\b|şuşa|\bagdam\b|ağdam|aghdam|nakh[ci]+van|naxçıvan|ordubad|julfa|djulfa|jugha|culfa|\bganja\b|gəncə|gandzasar|kirovabad|shamkir|şəmkir|gazakh|qazax|tovuz|lachin|kalbajar|kəlbəcər|jabrayil|cəbrayıl|zangilan|qubadli|khojaly|xocalı|khojavend|hadrut|askeran|khankendi|\bstepanakert\b/i;
const OUTSIDE = /yerevan|syunik|kapan\b|gyumri|vayots|ararat province|armavir|tavush|\blori\b|shirak|gegharkunik|aragatsotn|kotayk|etchmiadzin|echmiadzin|sevan\b|dilijan|noravank|tatev/i;
const ART_CATS = /khachkar|shusha carpet|carpets of nagorno|petroglyph|gobustan|qobustan|gamigaya|gemigaya|carpet|\brugs?\b|khurjun|jewel|archaeolog|mingəçevir|mingachevir|beylagan|ceramic|pottery|kitabe|stone (?:horses?|rams?|number)|metalwork|textile|embroider|kəlağayı|kelaghayi|collections of the museum|national museum of art|museum of history|museum of azerbaijan|paintings by|miniatur|tabriz school|murals?|shebeke|lahij|lahic|copper|caucasian albania|shirvanshah|exhibits|sculptures? (?:of|by|in) azerbaijan|azerbaijani (?:painting|art|artists)/i;
const NOT_ART_CATS = /wiki loves monuments|cultural heritage monuments|mosques?\b|churches|cemeter|graves|gravestones? (?:in|around)|tombstones? (?:in|around)|mausoleum|türbə|castles?|palaces?|fortress|caravanserai|towers?\b|bridge|city|streets?|villages?|districts?|national parks?|reserve|nature|mountains?|rivers?|lakes?|buildings?|houses?|architecture|geography|landscape|mud volcano/i;
const AZ_NAMES = ['mirza kadym irevani', 'mirza gadim iravani', 'mirzə qədim irəvani', 'mirze qedim irevani', 'kangarli', 'kəngərli', 'azimzade', 'əzimzadə', 'azim azimzade', 'bahlulzade', 'bəhlulzadə', 'navvab', 'nəvvab', 'usta gambar', 'üstad qəmbər', 'ali bey huseynzade', 'əli bəy hüseynzadə', 'mirjavadov', 'mircavadov', 'salahov', 'narimanbekov', 'nərimanbəyov', 'telman abdinov', 'azerbaijani painter', 'azərbaycan rəssam', 'unknown azerbaijani'];
const azNames = new Set([...AZ_NAMES, ...artists.flatMap((a) => [a.name, a.nameAz]).filter((n) => n && n.includes(' ')).map((n) => n.toLowerCase())]);
const hasAzName = (hay) => [...azNames].some((n) => hay.includes(n));
// Default period from what a thing is, when no date is given
const CAT_PERIOD = [[/petroglyph|gobustan|gamigaya|gemigaya|stone number|rock art|qaya/i, 'prehistory'], [/caucasian albania|albanian|kish\b/i, 'antiquity'], [/mingəçevir|mingachevir|ovçular|ovcular|kura-araxes|khojaly|gadabay|bronze age|iron age/i, 'bronze-iron'],
  [/atropaten|albania|albanian/i, 'antiquity'], [/beylagan|shirvanshah|kitabe|medieval|13th|14th|15th|atabeg|ilkhan|jalayir/i, 'medieval'], [/khachkar/i, 'medieval'], [/stone (?:horses?|rams?)|qoç/i, 'early-modern'], [/lahij|lahic|carpet|\brugs?\b|khurjun|kəlağayı|kelaghayi|embroider|textile|shebeke/i, 'c19']];
const MILL = /(\d)(?:st|nd|rd|th)?[\s-]*(?:millennium|тысячелетие)[\s-]*(?:BC|BCE|до н)/i;
function commonsYears(c) {
  const mm = (c.title + ' ' + c.description).match(MILL);
  if (mm) return [-(+mm[1] * 1000), -((+mm[1] - 1) * 1000)];
  let r = parseYears(c.title + ' ' + c.description.slice(0, 200));
  if (r[0] != null && r[0] > 1990 && !/(?:19|20)\d\d\s*(?:paintings?|rəsm|il)/i.test(c.title)) r = [null, null]; // a photo's year, not the work's
  if (r[0] == null) for (const k of c.cats) { const m = k.match(/^(\d{3,4}) (?:paintings|works|textiles)/) || k.match(/^(\d{1,2})(?:st|nd|rd|th)[- ]century/); if (m) { r = parseYears(m[0]); break; } }
  return r;
}
const okLicenceHint = (c) => licFree(c.license);

const wdWorks = wd.filter((w) => !w.creator || artistById.has(w.creator) || w.origin);
for (const w of wdWorks) {
  const imgs = w.images.map((i) => byTitle.get('File:' + i.replace(/_/g, ' '))).filter(Boolean);
  const c = imgs[0];
  if (c && exCommons.has(c.title)) continue;
  for (const i of imgs) used.add(i.title);
  const a = artistById.get(w.creator);
  const date = w.inception ? w.inception.slice(0, 4) : '';
  const [y0, y1] = date ? [+date, +date] : c ? commonsYears(c) : [null, null];
  if (!c && !w.collection && !w.inventory && !a) continue;
  const noise = /film|coin|journal|song|book|album|single|musical|disambig|human|newspaper|magazine|website|television|literary|video game|fictional|dish|food|drink|breed|variety|rug style|type of|dance|organization|stamp|banknote|medal/i.test(w.type ?? '');
  if (noise && !a) continue;
  if (/^Q\d+$/.test(w.title) && !c) continue;
  if (!a && !mediumOf(w.type, w.material, w.title, c?.description)) continue;
  if (c && FOREIGN.test(c.title + c.cats.join(' '))) continue;
  push({ id: 'wd-' + w.id, source: 'wikidata', title: { en: clean(w.title), az: w.titleAz && w.titleAz !== w.title ? clean(w.titleAz) : undefined }, artist: a?.name ?? '', artistId: a?.id, artistDied: a?.died ? +a.died : undefined,
    dateText: date || '', yearStart: y0, yearEnd: y1, medium: mediumOf(w.type, w.material, w.title, c?.description) ?? (a ? 'painting' : undefined), mediumText: clean([w.type, w.material].filter(Boolean).join(', ')), place: placeOf(w.location, w.collection, c?.description) ?? '',
    institution: clean(w.collection ?? w.location ?? ''), accession: w.inventory ?? '', url: 'https://www.wikidata.org/wiki/' + w.id, commonsUrl: c ? 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(c.title.replace(/ /g, '_')) : undefined,
    license: c?.license, credit: c ? [c.artist, c.credit].filter(Boolean)[0]?.slice(0, 160) : undefined, image: c?.mime?.startsWith('image/') ? c.thumb || c.url : '', imageOriginal: c?.url, width: c?.width, height: c?.height, theme: 'modern' });
}
const registered = new Set(artists.map((a) => a.id));
// Painters the registry lacks or gives no death year for; died well before 1955
const ALIAS_DIED = { 'kangarli': 1922, 'kəngərli': 1922, 'azimzade': 1943, 'əzimzadə': 1943, 'irevani': 1875, 'irəvani': 1875, 'iravani': 1875, 'navvab': 1918, 'nəvvab': 1918, 'usta gambar': 1883, 'üstad qəmbər': 1883, 'ali bey huseynzade': 1940, 'əli bəy hüseynzadə': 1940 };
const regNames = artists.flatMap((a) => [[a.name, a], ...(a.nameAz ? [[a.nameAz, a]] : [])]).filter(([n]) => n && n.includes(' ')).map(([n, a]) => [n.toLowerCase(), a]).sort((x, y) => y[0].length - x[0].length);
function matchArtist(hay) {
  const h = hay.toLowerCase();
  const r = regNames.find(([n]) => h.includes(n));
  if (r) return { name: r[1].name, id: r[1].id, died: r[1].died ? +r[1].died : undefined };
  const al = Object.keys(ALIAS_DIED).find((k) => h.includes(k));
  if (al) return { name: al, died: ALIAS_DIED[al] };
  return null;
}
const dropped = { foreign: 0, notArt: 0, noise: 0, painterUnknown: 0 };
for (const c of commons) {
  if (used.has(c.title) || exCommons.has(c.title) || !c.hit) continue;
  const catsText = c.cats.join(' | ');
  const text = [c.title, c.description, c.objectName, catsText].join(' | ');
  if (!/^image\/(jpeg|png|tiff|webp)/.test(c.mime ?? '') || (c.width ?? 0) < 300) continue;
  const foreignHit = FOREIGN.test(text);
  const territory = TERRITORY.test(text) && !OUTSIDE.test(text);
  if (foreignHit && !territory) { dropped.foreign++; continue; }
  if (SPORT.test(c.title + ' ' + c.objectName + ' ' + catsText)) { dropped.noise++; continue; }
  const fromArtistSeed = c.seeds.some((s) => s.startsWith('artist:') && registered.has(s.slice(7)));
  const stoneNo = /stone number|\d+ (?:nömrəli|saylı) daş/i.test(text);
  const artCat = ART_CATS.test(catsText) || stoneNo || (fromArtistSeed && /paintings?\b|sculpture|works? by|artworks?|drawings?|graphics|mural|poster|ceramics? by|exhibition of works|rəsm|kətan|yağlı boya|oil on/i.test(catsText + ' ' + c.title + ' ' + c.description));
  if (!artCat) { dropped.notArt++; continue; }
  if (NOT_ART_CATS.test(catsText) && !/kitabe|stone (?:horses?|rams?)|petroglyph|carpet|\brugs?\b|jewel|collections of the museum|paintings by|exhibits|archaeolog/i.test(catsText) && !stoneNo) { dropped.notArt++; continue; }
  let med = stoneNo || /petroglyph|gobustan|gamigaya|gemigaya/i.test(catsText + c.title) ? 'rock-art' : mediumOf(c.objectName, c.title, c.description, ...c.cats.slice(0, 8));
  if (/carpets?\b|\brugs?\b|khurjun/i.test(catsText + c.title)) med = 'carpet';
  if (/kitabe|stone (?:horses?|rams?)/i.test(catsText)) med = 'stone';
  if (!med || med === 'architecture' || med === 'photo') { dropped.notArt++; continue; }
  // Painting, drawing and sculpture only when the maker is Azerbaijani: the National Museum of Art also holds European works
  if (['painting', 'graphics', 'sculpture'].includes(med) && !hasAzName(slugless(text)) && !fromArtistSeed) { dropped.painterUnknown++; continue; }
  const [y0, y1] = commonsYears(c);
  const ma = matchArtist(c.title + ' ' + catsText + ' ' + c.description);
  // A flat or figural modern work needs a known maker who died before 1956; otherwise it stays metadata-only
  const gated = ['painting', 'graphics', 'sculpture'].includes(med);
  const place = placeOf(text, c.seeds.join(' '));
  if (foreignHit && med === 'manuscript') { dropped.notArt++; continue; }
  const dflt = CAT_PERIOD.find(([re]) => re.test(catsText + ' ' + c.title))?.[1];
  const artistName = c.artist && c.artist.length < 80 ? c.artist : '';
  push({ id: 'commons-' + slug(c.title.replace(/^File:/, '').replace(/\.\w+$/, '')) + '-' + hash(c.title), source: 'commons', title: foreignHit ? neutralTitle(c, med, place, y0) : { en: titleFrom(c) }, artist: ma && !/^[a-zəıöüçşğ]+$/.test(ma.name) ? ma.name : '', artistId: ma?.id, artistDied: ma?.died, unknownModernMaker: gated && !ma?.died && (y1 == null || y1 > LIMIT) && !/^(public domain|pd)/i.test(c.license ?? '') || undefined, credit: foreignHit && /^(public domain|pd)/i.test(c.license ?? '') ? undefined : artistName || 'Wikimedia Commons contributors', dateText: '', yearStart: y0, yearEnd: y1, medium: med, place: place ?? '',
    period: y0 == null ? dflt : undefined, periodGuess: y0 == null || undefined, institution: collectionOf(catsText), accession: '', url: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(c.title.replace(/ /g, '_')), license: c.license, image: c.thumb || c.url, imageOriginal: c.url, width: c.width, height: c.height, theme: dflt ? undefined : c.themes[0] });
}
// A title for an object whose own file title is a catalogue label or in another script: what it is and where, from the file's own data
function neutralTitle(c, med, place, y0) {
  const t = [c.title, c.objectName, c.description].join(' ');
  const kind = /khachkar/i.test(t) ? 'khachkar' : /tombstone|gravestone|headstone/i.test(t) ? 'gravestone' : null;
  const en = kind === 'khachkar' ? 'Khachkar' : kind === 'gravestone' ? 'Gravestone' : (MEDIUM_LABEL[med] ?? MEDIUM_LABEL.other).en.replace(/ and .*$/, '').replace(/s$/, '');
  const az = KIND_AZ[kind] ?? (MEDIUM_LABEL[med] ?? MEDIUM_LABEL.other).az;
  const yr = y0 != null && y0 > 0 ? ` (${y0})` : '';
  return { en: en + (place ? ', ' + place : '') + yr, az: az + (place ? ', ' + (PLACE_AZ[place] ?? place) : '') + yr };
}
function slugless(s) { return s.toLowerCase(); }
function collectionOf(cats) {
  if (/museum of azerbaijan|carpet museum/i.test(cats)) return 'Azerbaijan National Carpet Museum';
  if (/national museum of art/i.test(cats)) return 'Azerbaijan National Museum of Art';
  if (/museum of history/i.test(cats)) return 'National Museum of History of Azerbaijan';
  if (/shirvanshah/i.test(cats)) return 'Palace of the Shirvanshahs';
  if (/mingəçevir|mingachevir/i.test(cats)) return 'Mingachevir (archaeological complex)';
  return '';
}
function hash(s) { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h.toString(36); }
console.error('commons dropped', dropped);

// ---------- finish ----------
// Identical generated titles ("Carpet, Karabakh") get a running number so cards can be told apart
{ const seenT = {}; for (const x of items) if (x.source === 'commons' && x.title.az && /^[A-Z][\w ]+(, [\w ]+)?( \(\d+\))?$/.test(x.title.en)) { const k = x.title.en; seenT[k] = (seenT[k] ?? 0) + 1; }
  const idx = {}; for (const x of items) if (x.source === 'commons' && x.title.az && seenT[x.title.en] > 1) { idx[x.title.en] = (idx[x.title.en] ?? 0) + 1; x.title = { en: `${x.title.en} · ${idx[x.title.en]}`, az: `${x.title.az} · ${idx[x.title.en]}` }; } }
const seen = new Set();
const out = items.filter((x) => (seen.has(x.id) ? false : seen.add(x.id)));
for (const x of out) for (const k of Object.keys(x)) if (x[k] == null || x[k] === '' || (Array.isArray(x[k]) && !x[k].length)) delete x[k];
out.sort((a, b) => (a.yearStart ?? 9999) - (b.yearStart ?? 9999) || a.id.localeCompare(b.id));
await writeFile(new URL('data/art/catalogue.json', root), JSON.stringify({ built: new Date().toISOString().slice(0, 10), periods: PERIODS, media: MEDIUM_LABEL, items: out }, null, 1));
const perArtist = {};
for (const x of out) if (x.artistId) perArtist[x.artistId] = (perArtist[x.artistId] ?? 0) + 1;
await writeFile(new URL('data/art/artists.json', root), JSON.stringify(artists.map((a) => ({ id: a.id, name: a.name, nameAz: a.nameAz, born: a.born, died: a.died, birthplace: a.birthplace, workRights: a.died && +a.died <= LIMIT ? 'public domain in Azerbaijan' : 'protected', works: perArtist[a.id] ?? 0 })).sort((a, b) => b.works - a.works || a.name.localeCompare(b.name)), null, 1));
const cols = ['id', 'source', 'title', 'titleAz', 'artist', 'dateText', 'yearStart', 'yearEnd', 'period', 'medium', 'place', 'institution', 'accession', 'url', 'license', 'imageStatus', 'protectedReason'];
const q = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
await writeFile(new URL('data/art/catalogue.csv', root), [cols.join(','), ...out.map((x) => cols.map((c) => q(c === 'title' ? x.title.en : c === 'titleAz' ? x.title.az : x[c])).join(','))].join('\n') + '\n');
const cnt = (f) => out.reduce((m, x) => ((m[f(x)] = (m[f(x)] ?? 0) + 1), m), {});
console.log('items', out.length, '\nperiod', cnt((x) => x.period), '\nsource', cnt((x) => x.source), '\nimage', cnt((x) => x.imageStatus), '\nmedium', cnt((x) => x.medium));
