// Commons licence/info for the images Wikidata attaches (P18) that gather-commons.mjs did not see
// → appended to data/art/raw/commons.json (themes: ['wikidata'])
import { readFile, writeFile } from 'node:fs/promises';
import { commons, root } from './lib.mjs';
const rd = async (n) => JSON.parse(await readFile(new URL('data/art/raw/' + n, root), 'utf8'));
const rows = await rd('commons.json'), wd = await rd('wikidata.json');
const have = new Set(rows.map((r) => r.title));
const want = [...new Set(wd.flatMap((w) => w.images.map((i) => 'File:' + i.replace(/_/g, ' '))))].filter((t) => !have.has(t));
console.error('missing', want.length);
const strip = (s) => (s ?? '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim();
for (let i = 0; i < want.length; i += 50) {
  const r = await commons({ action: 'query', prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiextmetadatafilter: 'LicenseShortName|UsageTerms|Artist|Credit|ImageDescription|ObjectName|DateTimeOriginal|DateTime|Categories|Copyrighted', iiurlwidth: 900, titles: want.slice(i, i + 50).join('|') });
  for (const p of r?.query?.pages ?? []) {
    const ii = p.imageinfo?.[0]; if (!ii) continue;
    const m = ii.extmetadata ?? {}; const v = (k) => m[k]?.value;
    rows.push({ title: p.title, themes: ['wikidata'], seeds: ['wikidata'], license: v('LicenseShortName'), copyrighted: v('Copyrighted'), terms: strip(v('UsageTerms')), artist: strip(v('Artist')), credit: strip(v('Credit')).slice(0, 200), description: strip(v('ImageDescription')).slice(0, 500), objectName: strip(v('ObjectName')), date: strip(v('DateTimeOriginal') || v('DateTime')), cats: (v('Categories') ?? '').split('|').slice(0, 25), url: ii.url, thumb: ii.thumburl, width: ii.width, height: ii.height, mime: ii.mime, hit: true });
  }
}
await writeFile(new URL('data/art/raw/commons.json', root), JSON.stringify(rows));
console.error('commons rows', rows.length);
