# Füzuli, Leyli və Məcnun: scene tags report

Generated 2026-11-25 from the local `irs_az` database (read-only). Scenes: `data/scenes/fuzuli-leyli-ve-mecnun.json` (24 scenes, in chapter order). Tags: `data/tags/fuzuli-leyli-ve-mecnun.json`.

Chapter ids are `Work.slug` (`fuzuli-leyli-ve-mecnun-N`, 72 chapters). The poem is in Azerbaijani Turkic, so `Work.body` is the text itself; this poem has no default `AZ_LATIN` translation rows. Scenes were placed by Fuzuli's own chapter headings (`Work.titleAz`, «Bu, …dır»), and every evidence line is a verbatim line of `Work.body`; the build script checks that it is there. The body keeps some OCR slips (e.g. «Düşdüyü», «dədü dam»); evidence lines were chosen to avoid them where possible.

## Counts

| | Artworks |
|---|---|
| Tagged entries | 32 |
| From the poem's collection | 32 (every row) |
| Added from Fuzuli artworks with `collectionId` NULL | 0 (there are none; Fuzuli has 33 artworks, the other is in «Hədiqətüs-süəda») |
| With a scene | 31 (high 23, medium 4, low 4) |
| Scene `null` | 1: commons-49978128, the text-only title page of the 1856 lithograph |

By scene (number of artworks):

| Scene | Chapter(s) | Artworks |
|---|---|---|
| leyli-and-qeys-at-school | 16–17 | 4 |
| father-asks-for-leyli | 24 | 3 |
| majnun-among-animals | 27, 56 | 3 |
| birth-of-qeys, father-finds-majnun, majnun-at-kaaba, majnun-frees-gazelle, majnun-dies-on-grave | | 2 each |
| leylis-mother-reproaches, leyli-in-garden, ibn-salam-sees-leyli, majnun-meets-nofel, nofel-battle, majnun-in-chains, majnun-at-leylis-tent, wedding-night, zeyd-brings-news, rider-comes-for-leyli, zeyds-dream | | 1 each |
| miraj, meeting-on-the-way, majnun-at-fathers-grave, leyli-finds-majnun, death-of-leyli | | 0 |

Sources:

- 18 rows are from BnF Supplément turc 316 (16th c.). Their Commons titles are Azerbaijani or Turkish scene names.
- 2 are from BL Or. 405.
- 5 are from «Füzuli dünyası şəkillərdə», including Baku Institute of Manuscripts pages.
- 5 are from 19th-century Iranian Azerbaijani lithographs (1815, and 1856 by Askar ibn Husayn).
- 1 is an 18th-century painting from the *Kratkaya literaturnaya entsiklopediya*.

## Filed Under the Wrong Poem, or Not a Scene From It

- None of the 32 is misfiled. The Nizami «Leyli və Məcnun» collection (92 rows) has no item whose title or source names Fuzuli, so nothing moves in either direction. Paintings titled only "Layla and Majnun" stay with Nizami.
- commons-49978128 is the bismillah title page of the 1856 lithograph, text only. It is kept as `null`.
- No Mi'raj painting names Fuzuli. The `miraj` scene (ch. 8) has no artworks.

## Doubtful Tags

Thumbnails were checked for every row whose title doesn't name a scene.

- **commons-21457738** (18th c., «Miniature for Leyli and Majnun poem by Fuzuli») shows Majnun handing his clothes to an armed hunter, with a gazelle at their feet. This is ch. 29: «Məcnun ona verdi cümlə rəxtin». Tagged high.
- **commons-61482790** (1815 lithograph): its Commons description says «Elçilik». It shows a seated assembly of elders, so it is the father's proposal (ch. 24). Tagged high.
- **commons-61464448** (1856) shows a young man and an older man before the Ka'ba. Tagged high.
- **commons-61464449** (1856) shows a bearded man and a youth facing each other under an arch, with a marginal caption that seems to mention a teacher (معلم). Tagged medium as school.
- **commons-61464415** (1856) shows two veiled women seated together, read as Leyli and her mother (ch. 18). Tagged low.
- **commons-62011639** (BnF Turc 316 f.1v) is the opening page, a headpiece above Majnun seated among animals with a visitor. It is a frontispiece, not placed in the text. Tagged low as `majnun-among-animals`.
- **commons-62355596 «Mejnun in the desert»** shows Majnun among animals, with a horseman and two women riders talking to a man. The riders aren't explained (Növfəl? Leyli's household?). Tagged low as `majnun-among-animals`.
- **commons-62011642 «Məcnun və Leylinin qarşılaşması»**: the image shows a woman seated under a canopy in a garden with female attendants and musicians, and Majnun is not visible. Tagged low as `leyli-in-garden` (ch. 36). The Commons title calls it a meeting of the lovers, so the image should be checked.
- **commons-62012526 «Məcnunun Leyli ilə qarşılaşması»** shows tents, women inside a tent and a seated figure. Tagged medium as Majnun before Leyli's tent (ch. 47). It could also be the desert meeting (ch. 60–64).
- **commons-62012528 «Karvan keşikçisinin Leyli üçün gəlməsi»** is placed at ch. 65, where a camel rider comes to fetch Leyli from Majnun: «Bir naqənişin göründü nagah». Tagged medium.
- **commons-62012523 «Məcnunun Zeydlə görüşü»**: Zeyd comes to Majnun twice, with news of Leyli's marriage (ch. 50) and later of her death (ch. 69). Tagged medium as ch. 50.
- **`father-finds-majnun` covers two visits**, ch. 21 and ch. 53, which can't be told apart from the titles.
- **`majnun-among-animals` lists ch. 27 and ch. 56**. Chapter 27's heading names his companionship with the beasts, but the text is in ch. 56: «Xeyli-dədü dam onun sipahı».
- **Names follow the text**: Qeys, Leyli, Məcnun, Növfəl, İbni Səlam, Zeyd. Fuzuli's story differs from Nizami's in places, so the chapter list was built from his own headings, not from Nizami's.
