# Yeddi gözəl: scene tags report

Generated 2026-11-25 from the local `irs_az` database (read-only). Scenes: `data/scenes/heft-peyker.json` (26 scenes, in chapter order). Tags: `data/tags/heft-peyker.json`.

Chapter ids are `Work.slug` (`nizami-yeddi-gozel-N`, 38 chapters in the collection `nizami-heft-peyker`). Scenes were placed by the Ganjoor section headings (`Work.titleFa`), and each was checked against kitabxana's Azerbaijani translation (`Translation`, `AZ_LATIN`, default). Every evidence line is a verbatim line from that translation, and the build script checks that it is there. `Work.body` is the Persian original.

## Counts

| | Artworks |
|---|---|
| Tagged entries | 179 |
| From the poem's collection | 172 (every row) |
| Added from Nizami artworks with `collectionId` NULL | 6 |
| Filed under another poem | 1 (commons-6993339, see below) |
| With a scene | 167 (high 153, medium 12, low 2) |
| Scene `null` (no scene can be named, or not a painting of the poem) | 12, all in the collection |

By scene (number of artworks):

| Scene | Chapter(s) | Artworks |
|---|---|---|
| green-pavilion | 28 | 16 |
| turquoise-pavilion | 30 | 15 |
| black-pavilion | 26 | 14 |
| fitna-hunt | 20 | 13 |
| red-pavilion | 29 | 13 |
| yellow-pavilion | 27 | 12 |
| bahram-kills-dragon | 12 | 11 |
| white-pavilion | 32 | 11 |
| fitna-carries-cow | 21 | 9 |
| sandalwood-pavilion | 31 | 9 |
| crown-between-lions | 18 | 7 |
| shepherd-and-dog | 34 | 7 |
| lion-and-onager-one-arrow | 11 | 6 |
| building-of-khawarnaq | 9 | 4 |
| bahram-enthroned | 19 | 3 |
| turktaz-garden | 26 | 3 |
| bishr-and-malikha | 28 | 3 |
| bahram-hunts-onagers, seven-portraits, vizier-hanged | 11, 13, 36 | 2 each |
| simnar-thrown-from-roof, shida-and-the-pavilions, mahan-and-the-demon, garden-maidens-bathing, bahram-vanishes-in-cave | 9, 25, 30, 32, 37 | 1 each |
| miraj | 3 | 0 |

## Added From the NULL-Collection Nizami Artworks

commons-7830590 (Bahram Gur in the green pavilion, Shaykhi), commons-91011106 (Bahram kills the dragon, Or. 6810), commons-90993834 (Bishr feels for the drowned Malikha, Or. 6810), commons-90993833 (the garden owner sees the maidens bathing, Or. 6810, the Friday tale), commons-8104157 («MakhanEmbracedByAnEfreeti», Bukhara 1648, the Wednesday tale), commons-158965188 («The painting of Khovarnaq Castle», Turkman c. 1470; medium).

These rows should probably have `collectionId` set to the Yeddi gözəl collection.

## Filed Under the Wrong Poem, or Not a Scene From It

- **commons-6993339 «Fitne»** is filed under *Məxzənül-əsrar*. Its Commons description reads "Fitna heaving a bull-calf … Chester Beatty Pers. 276, f. 171, 1668–1671, Bukhara", the same manuscript as commons-103312119 (white pavilion, Per 276.205). It belongs here; tagged `fitna-carries-cow` high, and it should move to this collection.
- **commons-15122086 «Seven Beauties baku»**: a 2010 photograph of a performance of the *Seven Beauties* ballet, not a painting of the poem. Scene `null`.
- **commons-148184218**: a 19th-century Kashan carpet showing all seven pavilions together. Scene `null`; it is a carpet, not a miniature.
- **commons-170192040 «Shah Tahmasp enthroned, as Bahram»**: a detail of *Nighttime in a City* (Mir Sayyid Ali, Sackler 1958.76). Nothing in its title or description ties the painting to a Haft paykar episode; the other details of the same painting sit in NULL. Scene `null` (low). It may not belong to this poem.
- **commons-169354529, commons-194811684** (lithograph colophons) and **met-455054** (the whole c. 1430 manuscript): not scenes. Scene `null`.
- No item from another poem was found in this collection.
- **«Building with painted scenes» (TSM H.762, commons-158966696 and details, NULL)** might show Khawarnaq or the room of the seven portraits, but the title doesn't say so. Not added.

## Doubtful Tags

- **The order of folios was used to decide the scene.**
  - walters-W607-136b «Bahram Gur kills a wild ass» comes after the lions-and-crown folio (134b), so it is read as the Fitna hunt (ch. 20). Tagged medium.
  - walters-W605-137b «Bahram Gur killing a lion» comes just before the dragon (138a), so it is read as the lion and onager killed with one arrow (ch. 11). Tagged medium.
  - met-455056 «Bahram Gur's Skill with the Bow» (f.17v of the c. 1430 Haft paykar) falls between the chase (10r) and the black pavilion (23v). It is read as the Fitna shot (ch. 20). Tagged medium.
  - met-455055 «Bahram Gur on the Chase» (f.10r) is read as the onager hunt of ch. 11. Tagged low.
  - walters-W657-211a «Bahram Gur hunting deer with a lasso» comes after all the pavilions, so it is read as the last hunt before the cave (ch. 37). Tagged low.
  - walters-W657-210b «watching justice being served to a man and a woman» comes after the pavilions (ch. 33–37: complainants or vizier?). Left `null` (low).
- **met-455059 / commons-30574456 «The Eavesdropper»** (f.47r of the c. 1430 manuscript): by folio count this falls around the Wednesday–Friday tales. It might be the Friday tale's youth peering through the hole in his garden wall, but this is a guess. Left `null` (low).
- **Lions «enthroned after killing lions»** (commons-157708007 ex-Binney 1487, commons-158315717 Princeton 77 G): tagged `crown-between-lions` (ch. 18), not `bahram-enthroned` (ch. 19). Medium.
- **Bahram enthroned, H.762**: commons-158256682 and commons-159018998 are f.163v (before Fitna f.167r), so ch. 19. The fragment commons-158256678 is probably the same folio. Tagged medium.
- **Description-based tags**: commons-26297940 (generic title; the description reads "Bakhram Gur in the Yellow Pavillion", Muhammad Mukim) is tagged high. commons-15190918 (title «Bəhram Gur yeddi gözəlin yanında»; the description reads "Bahram in white Pavilion") is tagged medium. commons-10044364 (title "Khamsa of Nezami, Topkapi"; the Commons file is «Bahram_Gur_in_the_Green_Pavilion») is tagged high. commons-4029350 (Freer F1908.271, verso: the black pavilion) is tagged high.
- **Signature details** of the Or. 2265 paintings (commons-61826920 Sultan Muhammad, commons-61832382 Muzaffar Ali) are tagged with their painting's scene. Medium.
- **The pavilion domes** walters-W608-208b (sandalwood) and 213a (white) are illuminated dome pages, not scenes with Bahram. They are tagged to their pavilion, medium.
- **Generic hunts** are left `null` (low): commons-10959448 (Brooklyn), commons-15181556 (Baku M-207). commons-30507190 («Seven Beauties 2», Baku M-207) is also left `null` (low).
- **Princess names**: the translation names the princesses on Saturday (hind), Sunday (Rum), Tuesday (slavyan) and Thursday (Çin). The Monday (Khwarazmian), Wednesday (Maghribi) and Friday (Persian) princesses are not named in the text, so the standard identifications were used. Museum titles differ: H.762 calls the Sunday princess "Moorish" (commons-159019182), and some titles call the Tuesday princess "Russian".
- **Day names** are given only in English. The translation calls both Tuesday's and Wednesday's chapters «çərşənbə», so the Azerbaijani scene names use the colours instead.
- **Data errors**: commons-108939298 and commons-62434703 have `objectDate` "1675 BC" (should be 1675 AD).
- **Defined scenes with no artworks**: `miraj` (ch. 3) has none. A Mi'raj painting whose title doesn't name the poem stays untagged, as for Xosrov və Şirin.
- **The scene list comes from my knowledge of the standard cycle, checked against the scenes these museum titles actually name.** No printed catalogue was consulted. Tales that nothing here illustrates (Sunday, Tuesday and Thursday tales, the seven complainants) have no scene.
