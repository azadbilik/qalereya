# Azerbaijani art catalogue: sources, licences, method

A catalogue of Azerbaijani art from prehistory to today (north and south of the Araz, Azerbaijani artists abroad), shown at [azadbilik.org/qalereya/tarix](https://azadbilik.org/qalereya/tarix/). Built 2026-11-26. The Nizami and Fuzuli miniatures stay in the main gallery (`data/artworks.json`); anything already there is left out of this catalogue.

Files: `catalogue.json` (the page reads it), `catalogue.csv` (same rows, flat), `raw/*.json` (what each source returned, before our rules), `artists.json` (registry of Azerbaijani artists with lifespans), `dims.json` (mirrored thumbnail sizes), `.cache/` (HTTP cache, not committed).

## The copyright rule

Azerbaijan protects a work for the author's life plus 70 years, so in 2026 a work is out of copyright when its author died before 1956. An image is stored and shown only when both hold:

1. the image is under a free licence (CC0, CC BY, CC BY-SA, public domain / PD-old, Public Domain Mark), and
2. the work itself is free: the author died before 1956, or the holder waived rights (Met, Cleveland: CC0), or the work is anonymous and dated before 1956.

Everything else is catalogued with full metadata and a link to the holder's own page, and no picture (`imageStatus: "protected"` when the work is in copyright; `"none"` when the source gives no free image). A non-commercial licence would be `"nc"`; none was found, and no NC image is stored.

Authors are matched against the Wikidata registry (`artists.json`, 381 Azerbaijani artists with death years, from `gather-wikidata.mjs`) plus a short list of painters of the 19th and early 20th century by name (Kangarli, Azimzade, Mirza Gadim Iravani, Mir Mohsun Navvab, Usta Gambar, Ali bey Huseynzade). A modern painting, drawing or sculpture on Commons whose maker is not identified is treated as protected unless its licence is explicit public domain and it predates 1956. Commons licences on photographs of in-copyright paintings (CC BY-SA on a photo of a 1990s canvas) do not free the painting.

## Sources

| Source | Licence of what we keep | How fetched | Result |
|---|---|---|---|
| Wikimedia Commons | per file: CC0, CC BY, CC BY-SA, PD-old (licence string stored per item) | `gather-commons.mjs`: 38 category crawls, 59 full-text searches, each registered artist's own category; licence, author, description, categories from `extmetadata` | 8,557 files seen; 1,412 kept after dropping sport, buildings, graves, people, Armenian-held or Artsakh-attributed material (1,204), European paintings in Azerbaijani museums |
| Wikidata | metadata CC0; images via Commons | `gather-wikidata.mjs`: SPARQL for artists (P106 visual artist, Azerbaijani by citizenship or ethnicity) and their works (P170), plus objects with P495/P189/P1071 in Azerbaijan; images get Commons licences through `gather-commons-wd.mjs` | 381 artists, 87 works kept |
| The Met | CC0 (Open Access) | `gather-met.mjs`: v1.1 search on 36 place and culture terms, then object records, kept only when place or culture field names Azerbaijan, Shirvan, Kuba, Karabagh, Tabriz, Shahsevan and so on (Congo's Kuba people and Japanese *baku* excluded); the Nizami and Fuzuli folios already in the gallery excluded | 124 |
| Cleveland Museum of Art | CC0 | `gather-cleveland.mjs`: 23 queries, culture field filtered the same way | 20 |
| Europeana | open reuse only (`reusability=open`: CC0, PDM, CC BY, CC BY-SA) | `gather-europeana.mjs` with the public demo key | 4 (nearly all hits were not Azerbaijani art) |
| Victoria and Albert Museum | metadata only; V&A images are not under a free licence | `gather-vam.mjs`: collections API v2, 13 queries, kept where title or place names Azerbaijan, Shirvan, Kuba, Kazak, Tabriz… | 145, no image stored |

All items link to the holder's record (`url`), and Wikidata items also to the Commons file (`commonsUrl`). Dates the museum gave are kept as written (`dateText`) with parsed years for the timeline; Commons items often have no date, then the period comes from the category (Gobustan petroglyphs → prehistory, Beylagan → medieval, carpets → 19th century) and the item carries `periodGuess`. Photograph dates from Commons are never used as the work's date.

## Counts

Run `node scripts/art/stats.mjs` for the current table. At the first build: 1,792 works; 1,442 with a free image kept in `tarix/`, 144 protected (metadata and link only), 206 with no free image (V&A 145, museum records without a licence).

| Period | works | free image | protected | no free image |
|---|---:|---:|---:|---:|
| Prehistory and rock art (to 3000 BCE) | 168 | 168 | 0 | 0 |
| Bronze and Iron Age | 47 | 47 | 0 | 0 |
| Caucasian Albania and antiquity | 108 | 108 | 0 | 0 |
| Middle Ages (650–1500) | 224 | 213 | 9 | 2 |
| Safavids, Tabriz school, khanates (1500–1800) | 265 | 213 | 6 | 46 |
| 19th century | 616 | 513 | 4 | 99 |
| 20th century | 137 | 50 | 43 | 44 |
| Contemporary (1991–) | 14 | 0 | 8 | 6 |
| Undated | 213 | 130 | 74 | 9 |

## Surveyed, not used

| Source | Why |
|---|---|
| Walters Art Museum | Only manuscripts are open (CC0); its Nizami and Fuzuli folios are already in the main gallery. Object API needs a key. |
| British Museum, Louvre, Hermitage, Tretyakov, State Russian Museum | No open search API; images are rights-reserved or non-commercial. Works from them appear only through Wikidata or Commons when someone has uploaded them freely. |
| LACMA, Brooklyn Museum | Brooklyn's API needs a key; LACMA's open data was not surveyed. Worth a second pass. |
| Smithsonian | Dropped earlier (no key). |
| Art Institute of Chicago | Behind a Cloudflare challenge. |
| Azerbaijan National Museum of Art, National Museum of History, National Carpet Museum, Azerbaijan Museum of Modern Art | Their websites are single-page apps or did not answer from this machine (azcarpetmuseum.az loads an empty shell); no catalogue pages could be fetched. Their objects reach us through Commons (the Carpet Museum and History Museum collections have been photographed by volunteers under CC BY-SA). A data agreement would be the way to the real catalogues. |

## Known gaps

- The 20th century and contemporary art are thin: 151 works against hundreds of known paintings. Sattar Bahlulzade, Tahir Salahov, Togrul Narimanbekov, Mikayil Abdullayev and Javad Mirjavadov all died after 1955 (or live), so their works are metadata-only by rule, and Wikidata knows few of them. Only the national museums can fill this.
- Pre-1955 painters (Kangarli d. 1922, Azimzade d. 1943, Mirza Gadim Iravani, Mir Mohsun Navvab, Usta Gambar) have about a dozen free images between them on Commons. Many more exist in the National Art Museum.
- Ceramics, metalwork and stone of the Middle Ages come almost entirely from volunteers' photographs of the National Museum of History, so their dates are sometimes only approximate.
- Karabakh and Nakhchivan material that Commons files under Armenian or Artsakh categories (carpets of the Shusha museum, khachkars) was left out pending a decision; see the report.
- Tabriz school manuscripts beyond the Nizami and Fuzuli folios: 123 manuscript pages (Met, Cleveland, Commons); Topkapı, British Library and Hermitage albums are not covered.

## Rebuild

```
node scripts/art/gather-wikidata.mjs          # artists.json, wikidata.json
node scripts/art/gather-commons.mjs           # commons.json (slow: ~20 min)
node scripts/art/gather-commons-wd.mjs        # licences for Wikidata's images
node scripts/art/gather-met.mjs
node scripts/art/gather-cleveland.mjs
node scripts/art/gather-vam.mjs
node scripts/art/gather-europeana.mjs
node scripts/art/build.mjs                    # catalogue.json + catalogue.csv
node scripts/art/mirror-art.mjs               # tarix/thumbs, tarix/large (free images only, macOS sips)
node scripts/art/stats.mjs                    # counts for this file
```

Gather scripts cache every response in `data/art/.cache/`; delete it to refetch. The registry for the Commons artist categories comes from `raw/artists.json`, so run the Wikidata script first.
