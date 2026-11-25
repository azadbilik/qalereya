# Şərəfnamə: scene tags report

Generated 2026-11-25 from the local `irs_az` database (read-only). Scenes: `data/scenes/serefname.json` (32 scenes, in chapter order). Tags: `data/tags/serefname.json`.

Chapter ids are `Work.slug` (`nizami-serefname-N`, collection `nizami-serefname`). Scenes were placed by the Ganjoor section headings (`Work.titleFa`), and each was checked against kitabxana's Azerbaijani translation (`Translation`, `AZ_LATIN`, default). Every evidence line is a verbatim line from that translation, and the build script checks that it is there. `Work.body` is the Persian original.

The Şərəfnamə/İqbalnamə split was checked folio by folio against the Walters manuscript descriptions, which give the folio where the İqbalnamə begins in W604 (281b), W607 (261b), W608 (307b), W609 (351b), W610 (325b) and W612 (331b). Every painting tagged here falls before that folio.

## Counts

| | Artworks |
|---|---|
| Tagged entries | 76 |
| From the poem's collection | 20 (every row) |
| Added from Nizami artworks with `collectionId` NULL | 56 |
| With a scene | 74 (high 61, medium 12, low 1) |
| Scene `null` | 2, both in the collection: met-454083 and met-454084, pages of calligraphy |

By scene (number of artworks):

| Scene | Chapter(s) | Artworks |
|---|---|---|
| war-with-zangis | 16–17 | 12 |
| khizr-at-fountain | 60 | 6 |
| battle-with-dara | 25 | 5 |
| death-of-dara | 26 | 5 |
| darband-hermit | 36 | 5 |
| iskandar-meets-nushaba | 33 | 4 |
| hunt-on-way-to-china | 42 | 4 |
| war-with-rus | 49–56 | 4 |
| nushaba-feast | 34 | 3 |
| iskandar-lassoes-the-div | 55 | 3 |
| birth-of-iskandar, nushaba-shows-portrait, khaqan-feast, iskandar-and-chinese-girl | | 2 each |
| iskandar-enthroned, egyptians-plead, invention-of-mirror, dara-demands-tribute, fire-temples-destroyed, marriage-to-rawshanak, iskandar-at-kaaba, nushaba-jewel-banquet, siege-of-darband, kay-khusraw-cave, kayds-daughter, khaqan-comes-as-envoy, painting-contest, weighing-the-stone, city-without-death | | 1 each |
| miraj, iskandar-at-school, nushaba-freed | | 0 |

The Nüşabə episode (Bərdə, ch. 33–34 and her release in ch. 57) has five scenes and 10 artworks.

## Added From the NULL-Collection Nizami Artworks

These 56 rows are Şərəfnamə paintings and should probably have `collectionId` set to the Şərəfnamə collection:

- **Walters, 36 folios**: W604-212b, 215a, 218b, 229b, 232a, 237b, 244a, 245b, 248a, 255a, 261a, 267b, 271a, 272a, 276a; W607-193b, 197b, 210b, 223b, 258b; W609-276b, 291a, 305b, 320a, 338b; W610-249a, 256b, 270a, 284a, 295b, 320a; W611-192b, 204b, 232b, 237a; W657-227a.
- **Commons, 20 rows**:
  - Battles: commons-158379090 (Princeton 77 G, battle with Dara) and commons-91011108 (BL Add. 25900, battle with Dara); commons-4029486 and commons-167289885 (Zangi battle).
  - Nüşabə: commons-193763735 (Nüşabə, Tehran 1318) and commons-62304231 (Nüşabə, LACMA); commons-84733299 (Bengal Sharafnama, Iskandar sharing his throne with Nüşabə).
  - Other single scenes: commons-15209741 (fire temples), commons-7178943 (Ka'ba, TSM H.760), commons-88865028 (the mirror, Walters W.613 by Nanha), commons-31453110 (Iskandar lassoes the Rus "demon"), commons-6993764 (Iskandar hunting, RNL PNS 66).
  - Fountain of Life: commons-122096320, commons-27307527, commons-10528273 and commons-2079924.
  - The Darband hermit: commons-52924645, commons-52924827, commons-38339466 and commons-156623841.

## Filed Under the Wrong Poem, or Not a Scene From It

- **No row filed in this collection belongs to the İqbalnamə**. The folio check found nothing to move. W612-328a (the stone weighed) and W612-329a (the city without death) look like late scenes, but both are Şərəfnamə ch. 61, before the İqbalnamə incipit at W612-331b.
- **commons-12222461 «Eskandar fighting the enemy»** (Czartoryski Museum, 1489): its Commons categories put it under Amir Khusraw, so it probably illustrates his *Ā'īna-yi Iskandarī*, not Nizami. It was not tagged. Its author should be checked.
- **commons-167150950 «Eskander talks to Khazer»**: a page of met-443199, a 1790–91 «Iskandarnama» at the Met. That manuscript may be a prose Alexander romance rather than Nizami's poem. Neither row was tagged.
- **Unfiled Iskandar rows where no scene can be named from the title**, so they were not added:
  - met-446612 «Alexander at a Banquet» (f.321b of the same 1524–25 manuscript as met-446611). It could be the Nüşabə, Khaqan or Chinese-girl feast.
  - commons-186678755 «Alexander the Great with attendants».
  - commons-4174143, a Library of Congress Iskandarnama fragment showing an enthroned couple.
  - commons-112293730, Iskandar at a hunting camp with a large round object, its source page titled "death of Alex".
- **Mi'raj paintings with NULL `collectionId`**: left untagged, as for the other poems. The `miraj` scene (ch. 4) is defined but has no artworks.

## Doubtful Tags

- **The order of Walters folios was used to decide the chapter.**
  - W612-253a «Alexander the Great enthroned» is placed at his accession (ch. 14), because it falls before the Zangi war. Tagged medium. `iskandar-enthroned` also lists ch. 27 (Dara's throne) and ch. 30 (Istakhr).
  - W612-307b «meets the king of China» is placed at the Khaqan coming to Iskandar disguised as his own envoy (ch. 43). Tagged medium.
  - W611-232b «received by the Khāqān» is placed at the Khaqan's feast (ch. 45). Tagged medium.
  - W609-320a «hunting deer» falls between the Nüşabə portrait and the Rus war, so it is the hunt on the way to China (ch. 42). Tagged medium.
  - W604-248a «attack a fortress» falls after Bərdə and before Kayd, so it is the siege of Darband (ch. 36). Tagged medium.
- **W604-244a and W604-245b, the two Bərdə folios**:
  - W604-244a «entertained by the ruler of Bardaʿ» is read as Nüşabə's tray of jewels (ch. 33).
  - W604-245b «enthroned during the New Year celebrations» is read as Iskandar's feast for Nüşabə (ch. 34). That chapter opens «Firidun şənliyi, Cəmin novruzu … İskəndər şövkətli taxta oturdu».
  - Both are tagged medium.
- **W604-272a «drinks in the company of a Russian girl playing the harp»** is tagged medium as `iskandar-and-chinese-girl` (ch. 58). In Nizami the girl taken by the Rus "div" and freed in ch. 55 is the Khaqan's Chinese slave girl, and in ch. 58 she plays and sings for Iskandar. The Walters title calls her Russian.
- **W604-215a «The Ethiopians attack the castle of the Egyptians»** is tagged medium as `egyptians-plead` (ch. 15). That chapter tells of the Zangi invasion of Egypt as the Egyptians' complaint.
- **W604-232a «The tomb of Darius»** is tagged medium as `death-of-dara`. Dara's tomb is built at the end of the same chapter: «Türbəsi bitincə bitdi hər zəhmət».
- **The Darband hermit (BL Or. 6810, f.273r, Behzad)** is tagged high from the image: a night scene with a crescent moon, a lantern-bearer, a fortress with defenders, and the hermit in a cave. This matches ch. 36, where Iskandar goes at night by torchlight to the hermit's «köhül». Or. 6810 puts this folio after the İqbalnamə paintings (f.214r, the seven sages; f.225v, the drum). That order is not explained.
- **commons-2079924 «Al-khidr»**: its description says Khizr and Alexander marvel at the revived fish. In Nizami the fish revives for Khizr and Ilyas (ch. 60). Tagged medium.
- **commons-6993764 «Iskender on a hunt»** (RNL PNS 66, f.372): Iskandar hunts more than once in the poem. Tagged low as the China hunt.
- **commons-84733299 (Bengal Sharafnama)**: «Alexander sharing his throne with Queen Nushabah» is read as the feast in ch. 34. Tagged medium.
- **W604-267b «A Russian warrior pursues the Persian warrior Zarīrvand»**: the name doesn't occur in the Azerbaijani translation. It is tagged by its subject, the Rus war (ch. 49–56).
- **Names follow kitabxana's translation**: İskəndər, Dara, Rövşənək, Nüşabə, Keyd, Xaqan, Keyxosrov, Xızır, İlyas, Ərəstu. The scene ids use the usual English forms. The hermit's cave is «köhül» in this translation.
- **The scene list comes from the standard painted cycle, checked against the scenes these museum titles actually name.** I did not consult Chelkowski or any printed catalogue.
