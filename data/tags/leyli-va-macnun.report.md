# Leyli və Məcnun: scene tags report

Generated 2026-11-25 from the local `irs_az` database (read-only). Scenes: `data/scenes/leyli-va-macnun.json` (24 scenes, in chapter order). Tags: `data/tags/leyli-va-macnun.json`.

Chapter ids are `Work.slug` (`nizami-leyli-ve-mecnun-N`; the collection slug is `nizami-leyli-va-macnun`). Scenes were placed by the Ganjoor section headings (`Work.titleFa`), and each was checked against kitabxana's Azerbaijani translation (`Translation`, `AZ_LATIN`, default). Every evidence line is a verbatim line from it, and the build script checks that it is there.

The translation is longer than the Ganjoor text in places. Ch. 42 also holds «Zeyd and Zeynəb», and ch. 43 holds the death of Ibn Salam, Zayd's news, Layla's prayer and the lovers' meeting, at which both faint while the animals stand guard. The fainting scene is placed in ch. 43 because that is where this text tells it.

## Counts

| | Artworks |
|---|---|
| Tagged entries | 103 |
| From the poem's collection | 92 (every row) |
| Added from Nizami artworks with `collectionId` NULL | 11 |
| With a scene | 95 (high 78, medium 15, low 2) |
| Scene `null` | 8 (3 high: text and illumination pages; 5 low: scene not identifiable), all in the collection |

By scene (number of artworks):

| Scene | Chapter(s) | Artworks |
|---|---|---|
| school | 11–12 | 12 |
| majnun-with-animals | 33 | 12 |
| nawfal-battle | 22, 24 | 10 |
| palm-grove-meeting | 40–41 | 9 |
| lovers-faint | 43 | 8 |
| old-woman-leads-majnun | 27 | 7 |
| nizami-advises-son | 9 | 6 |
| majnun-at-the-kaaba | 16 | 6 |
| salim-visits-majnun | 37 | 4 |
| father-visits-majnun | 30–31 | 3 |
| layla-in-the-palm-grove (19), majnun-at-fathers-grave (32), mother-visits-majnun (37–38), death-of-ibn-salam (43), majnun-at-laylas-grave (44), death-of-majnun (45) | | 2 each |
| father-finds-majnun (16–17), nawfal-meets-majnun (21), layla-strikes-ibn-salam (28), old-man-fetches-majnun (40), zayd-brings-news (43), death-of-layla (44) | | 1 each |
| majnun-frees-gazelles (25), salam-of-baghdad (42) | | 0 |

## Added From the NULL-Collection Nizami Artworks

commons-156623837 (Majnun at the Ka'ba, Or. 6810), commons-91011111 (Majnun at the Ka'bah, Add. 25900), commons-91011110 (battle of the tribes, Add. 25900), commons-186678565 (Nawfal visits Majnun, Tehran 1318/c.1380), commons-90993821 (Salim visits Majnun), commons-90993822 (school), commons-90993823 (fainting), commons-90993829 (death of Majnun on Layla's grave), commons-90993839 (mourning Ibn Salam), all from Or. 6810. Also commons-25297927 «ای چهارده ساله» (Behzad, Geneva 1482: the opening words of Nizami's address to his fourteen-year-old son), and commons-157660124 «Lesson Assembly (105b–106a)», TSM H.761, tagged `school` medium because the title doesn't name the poem.

These rows should probably have `collectionId` set to the Leyli və Məcnun collection.

## Filed Under the Wrong Poem, or Wrongly Titled

- No item in the collection belongs to another poem.
- **commons-854582 «Shaykh Zadeh - Majnun funeral»** (Or. 6810): the Commons description says it shows «Mourning the death of Laylā's husband, Ibn Salām». It is tagged `death-of-ibn-salam`, high, and the title should be fixed.
- Not scenes (null, high): commons-62400484 (Or. 2265 text page in Mahmud Nishapuri's hand), met-455039 and met-455040 (illuminated opening pages).

## Doubtful Tags

- **The order of Walters folios was used to decide the chapter.**
  - W605-68b «Majnun visited by his father» falls between the Ka'ba (f.66b) and Nawfal (f.75a), so it shows the father finding Majnun in ch. 16–17, not the later visit (ch. 30). Tagged `father-finds-majnun`, medium.
  - W605-97b «Salīm, a youth from Baghdad, visiting Majnūn» comes just before the mother scene, W605-98a. In the text, Salim Amiri, Majnun's uncle, is the one who brings the mother (ch. 37: «Evdən anasını gətirdi ona.»). Salam of Baghdad only comes in ch. 42. Tagged `salim-visits-majnun`, medium, so `salam-of-baghdad` has no artwork yet.
  - W605-78b and W605-83b «Majnun playing with wild animals» fall between the Nawfal battle (f.75a) and the father's visit (f.85a), that is in ch. 25–29, not ch. 33. 78b may be the freeing of the gazelles (ch. 25). Both are tagged `majnun-with-animals`, low.
  - W611-92b «Majnūn visits Laylá in the company of wild animals» comes before the Nawfal battle (f.100a), which matches no scene in the text. Left null, low.
  - W657-152a «Sick woman in bed with her attendants» is read as Layla's death (ch. 44). Tagged medium. W657-153a «King enthroned in a landscape receiving gifts» may be the closing dedication to the Shirvanshah (ch. 46) or the start of the next poem. Left null, low.
- **Two meetings of the lovers**: the palm-grove meeting (ch. 40–41: the old man fetches Majnun and Layla listens to his ghazal) and the meeting after Ibn Salam's death, where both faint (ch. 43). Titles saying «faint» go to `lovers-faint`. Generic titles («meet in the wilderness», «meet in the desert», «reunited», «Layla visits Majnun in the wilderness») go to `palm-grove-meeting` as medium (W605-100a, W608-147b, W611-123a, W612-160b, W657-138a, commons-121082778). A few may show the ch. 43 meeting instead.
- **commons-8388743 «Madschnun Laila»** (Hermitage VP-1000): the title names no scene, but the Commons description does: the lovers faint, an old man revives them and a lion attacks an intruder, which is ch. 43. Tagged high.
- **«Majnun in the wilderness / in the desert»** (commons-116855593, 97490400, 158315718): tagged `majnun-with-animals`, medium. Majnun is in the desert through most of the poem.
- **commons-159156843 «Majnun and Salim in the Palm Grove»** (TSM 1462): could be Salim Amiri (ch. 37) or Salam of Baghdad (ch. 42). Tagged `salim-visits-majnun`, medium.
- **commons-27307456 «Layla Standing in the Palm Grove»** (LACMA): read as Layla's outing with her companions (ch. 19). Tagged medium.
- **Left as null (low) but worth a look at the image**: commons-7855509 (Muzaffar Ali, Golestan Palace, with animals), commons-22650016 (17th-century «Illustration», Doha), commons-7686244 (frontispiece of the 1836 English translation). Commons rate-limited further lookups.
- **Not catalogued, with no artwork**: Majnun and the raven (ch. 26), Layla's letter (ch. 35), Ibn Salam's suit (ch. 20).
- **Name spellings follow kitabxana's translation**: Nofəl, İbn-Səlam, Səlim Amiri, Bağdadlı Səlam, Zeyd, Kəbə.
