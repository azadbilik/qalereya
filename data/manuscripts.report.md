# Manuscripts Catalogue: Report

Built 2026-11-25 from `gallery.json` (782 items; it grew from 771 during the run), the artwork `.md` files in irs-az, the Met and Cleveland open APIs, Wikimedia Commons file metadata and categories, Walters TEI descriptions (thedigitalwalters.org), and spot checks (BL, Fihrist). City coordinates come from Wikidata P625. Gaur comes from enwiki and Wikidata Q1496277.

## Counts

- Items assigned: 779 of 782. Excluded: a 2010 ballet photo (`commons-15122086`) and two images with no source data (`commons-112293729`, `commons-112293730`).
- Items placed in a city: 442.
- Manuscript and object entries: 142. Of these, 79 have a city and 76 are `single: true`.
- Confidence of the placed items: 334 high, 72 medium, 36 low.

### Placed Items by City

Herat 138 · Tabriz 121 · Shiraz 95 · Bukhara 22 · Isfahan 16 · Abarkuh 10 · Kabul 9 · Baghdad 8 · Tehran 8 · Lahore 3 · Kashan 2 · Hyderabad 2 · Golconda 2 · Qazvin 1 · Istanbul 1 · Ahmedabad 1 · Gaur 1 · Kerman 1 · London 1

### Placed Entries by City

Shiraz 34 · Herat 13 · Tabriz 8 · Bukhara 3 · Isfahan 3 · Baghdad 2 · Kashan 2 · Lahore 2 · Hyderabad 2 · one each for Abarkuh, Istanbul, Gaur, Kabul, Qazvin, Ahmedabad, Golconda, London, Kerman and Tehran.

### Placed Items and Entries by Century (from yearStart)

| Century | Items | Entries |
|---|---|---|
| 14th | 12 | 3 |
| 15th | 177 | 28 |
| 16th | 202 | 33 |
| 17th | 35 | 7 |
| 18th | 4 | 3 |
| 19th | 12 | 5 |

## Splits

- **Topkapı H.762:** `tsm-h762-1481` (Tabriz, Aq Qoyunlu, 34 items) and `tsm-h762-1501` (Tabriz, Safavid, 24 items). Items were split by credit line or title ("1501-1510 additions" or 1505). `commons-10044284` is dated 1481 in its file, but its Commons category and subject (Khusraw spies Shirin, f.38v) put it in the 1501 campaign.
- **Keir Collection detached leaves:** these were assigned to H.762. The 1478–90 "Khusraw at Shirin's palace" leaf, K.1.2014.738, went to 1481. The c.1505 leaves (Mi'raj III.207, Shirin's suicide K.1.2014.739) went to 1501. Their link to H.762 rests on Commons ("commissioned by Yaqub Beg, 1505 addition by Shah Ismail"). It is not confirmed from a museum record.
- **BL Or. 2265:** `bl-or-2265` (Tabriz, 1539–43) and `bl-or-2265-1675` (Muhammad Zaman's additions, Isfahan, 1675–76).
- **BL Add. 25900:** `bl-add-25900-1442` (Herat frontispiece) and `bl-add-25900-1493` (paintings added in the 1490s, ascribed to Bihzad).
- **Lithographs:** Tehran 1883 and Tabriz 1847–48 both carry `lithograph: true`.

## Doubts

- **Walters codices with no city:** W.604, W.605, W.607, W.608, W.611, W.612 and W.657 are 227 items, and Walters gives their origin only as "Iran" (W.657: "India or Safavid Iran"). This is the biggest unplaced block.
  - W.607 and W.609 were repainted in India in the 18th century. W.608's paintings are mostly Qajar.
  - W.609 is placed at Herat with low confidence ("present-day Afghanistan (?)", scribe al-Haravi). Its 35 paintings are Indian repaints, so the map dot is misleading. Consider nulling it.
  - W.610 is placed at Shiraz, medium ("Shiraz school" paintings).
- **Hermitage VP-1000 (1431):** placed at Herat only on the strength of the Commons category.
- **Tehran Univ. 5179:** placed at Shiraz, medium. The only evidence is the "south provincial style" (Titley). The text is dated 1318 and the paintings c.1380.
- **Gaur:** used for the Bengal Sharafnama (Or. 13836). BL says only "Bengal".
- **BL Or. 405 (Fuzuli):** BL dates it 1664 (scribe Mehmet Reza-yi Ardabili). The gallery says 16th century, so the gallery date needs fixing.
- **BnF Turc 316 (Fuzuli, 19 items):** copy date and place are unknown in the literature (Boydak 2022). No Fuzuli manuscript has a city.
- **Baku M-156:** sources conflict ("Tabriz school, 16th c." vs "1636, Bukhara"), so place is null.
- **Two 1648 Baku-labelled miniatures** (`unknown-1648`) are probably reproductions from RNL PNS 66.
- **Grouped by inference, not confirmed as one manuscript:** `rijks-ak-mak-1253`, `rijks-ak-mak-1250`, `christies-17c-khusraw`, `loc-single`, `brooklyn-1997-108` (the mid-18th-century Sanjar file included), `fuzuli-world-book`.
- **AHT LTS1995.2.120:** the Muhammad Zaman 1676 Layla and Majnun leaves are kept separate from Or. 2265, although they may come from it. Harvard 1958.76 ("Nighttime in a City") is also kept single, although it is often linked to Or. 2265.
- **Unverified holdings:** Chester Beatty Per 162 (1481–82) has no place; the CBL viewer returned 403. Keir K.1.2014.18 (Mughal, 1585–90) has no city.
- **Non-manuscript entries:** these are marked with `kind` (carpet, textile, painting, calligraphy, printed book). They include the Kashan velvet, the Kashan and Kerman carpets, the London 1836 book and the Hyderabad paintings. Filter them out if the map should show manuscripts only.
