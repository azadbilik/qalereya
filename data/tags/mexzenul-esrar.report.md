# Sirlər xəzinəsi: scene tags report

Generated 2026-11-25 from the local `irs_az` database (read-only). Scenes: `data/scenes/mexzenul-esrar.json` (21 scenes, in chapter order). Tags: `data/tags/mexzenul-esrar.json`.

Chapter ids are `Work.slug` (`nizami-sirler-xezinesi-N`; the collection slug is `nizami-mexzenul-esrar`). Scenes were placed by the Ganjoor section headings (`Work.titleFa`): the poem is the prologue (ch. 1–19, Mi'raj in ch. 5) and twenty discourses (*maqalat*, even chapters 20–58), each followed by its parable (odd chapters 21–59). Every evidence line is a verbatim line from kitabxana's Azerbaijani translation (`Translation`, `AZ_LATIN`, default), and the build script checks that it is there.

## Counts

| | Artworks |
|---|---|
| Tagged entries | 71 |
| From the poem's collection | 55 (every row) |
| Added from Nizami artworks with `collectionId` NULL | 16 |
| With a scene | 59 (high 52, medium 5, low 2) |
| Scene `null` | 12 (all high, all in the collection: not scenes, or not this poem) |

By scene (number of artworks):

| Scene | Chapter | Artworks |
|---|---|---|
| sanjar-and-the-old-woman | 27 | 30 |
| nushirvan-and-the-owls | 23 | 6 |
| physicians-duel | 43 | 6 |
| tyrant-and-truthful-man | 47 | 6 |
| faridun-and-the-gazelle | 33 | 4 |
| jamshid-and-his-confidant | 55 | 3 |
| miraj | 5 | 2 |
| fruit-seller-fox-thief | 35 | 1 |
| harun-and-the-barber | 57 | 1 |
| despairing-king-forgiven (21), solomon-and-the-farmer (25), old-brickmaker (29), hunter-dog-fox (31), repentant-ascetic (37), jesus-and-the-dead-dog (39), mobad-and-the-garden (41), pilgrim-and-sufi (45), prince-of-marv (49), injured-child (51), pir-and-disciple (53), nightingale-and-falcon (59) | | 0 |

The catalogue has one scene per parable. Illustrated copies usually give each discourse one painting, so all twenty parables are listed, even though twelve have no artwork in the library yet. "Nizami in retreat" (the *khalwat* chapters 16–19) was left out: no artwork shows it, and the translation has no line that names the scene.

## Added From the NULL-Collection Nizami Artworks

- Nushirvan and the owls: commons-45125187, 88723063 (Or. 2265, Mir Musavvir), 89035697 (BnF Supp. persan 985).
- Faridun and the gazelle: commons-122122885 (TSM H.781), 186628713 (Or. 13297).
- The unjust king and the condemned wise man: commons-158615629, 158615630, 158615631, 158615634 (Berlin Ms. or. quart. 1665, f.24v). commons-158648739, «Portrait of a ruler, in folio 24v», is the same folio and is tagged medium.
- Jamshid's confidant and the old woman: commons-159091472 (Or. 13297, f.28v).
- The physicians' duel: commons-170239946 (Or. 2265, Shah Tahmasp detail).
- Harun al-Rashid and the barber: commons-90993840 (Or. 6810).
- Sultan Sanjar: commons-159560640, «Ruler figure (folio 16a)», Princeton Ms. 77 G, tagged medium. f.16a is the Sanjar folio (commons-158379091). commons-159302943 and 159303153 (Bodleian Elliott 192, f.17a, «Ruler on horse») are tagged low. The folio falls where Sanjar comes in other copies, but the title names no scene.

These rows should probably have `collectionId` set to the Sirlər xəzinəsi collection.

## Filed Under the Wrong Poem, or Not a Scene From It

- **commons-167779454, 167779456, 167779463, 167779464, 167779468, 167779475** («Makhzan al-asrar, 1478, Tabriz (in Chaghatai)»): this is Haydar Khwarazmi's Chaghatai poem *Makhzan al-asrar*, which shares the title but is not Nizami's work (the Commons description: «"Makhzan al-asrar" by Haydar… In Chaghatai»). All six should leave this collection, and probably leave Nizami altogether.
- **commons-6993339 «Fitne»**: «Fitna heaving a bull-calf», Chester Beatty Pers. 276, f.171. This scene is from *Haft Peykar* (Bahram Gur and Fitna), not this poem. Commons files it under «Treasury of Mysteries», which is wrong. It should move to the Haft Peykar collection.
- Not scenes (null, high): commons-115058479 and 123921313 (Christie's folios with illuminated and illustrated margins), commons-163591944 (the Makhzan colophon of Or. 2265, fol. 35a, which is filed correctly), commons-194810998 (title page of the 1883 lithograph), and commons-22006844 («First Pages of a Manuscript», 1540).
- **Mi'raj paintings with NULL `collectionId`** (commons-4137203 and 62473598, the Or. 2265 Mi'raj by Sultan Muhammad; commons-4949760 and 7792381, Or. 6810; commons-159179483, Keir): left untagged, because no title names the poem. The Or. 2265 Mi'raj is usually placed in *Makhzan al-Asrar*, between the Makhzan opening and its colophon at fol. 35a, so it is the strongest candidate to attach to `miraj`.

## Doubtful Tags

- **walters-W607-4b «The Prophet Muhammad's ascension»**: the title doesn't name the poem. It is filed in this collection, and f.4b in a Khamsa can only be the Makhzan prologue, so it is tagged `miraj`, medium.
- **walters-W605-40a «An old man speaking with a king's confidant»**: in Nizami's story the adviser is an old woman (ch. 55: «O cavana yol tapdı bir gün bir qoca qarı»). Folio order puts it after Nushirvan (f.21b, ch. 23) and Faridun (f.27b, ch. 33), where Jamshid falls in W607. Tagged `jamshid-and-his-confidant`, medium.
- **walters-W611-15b «A fox and a robber»**: tagged `fruit-seller-fox-thief` (ch. 35, the fox that guards the shop and the pickpocket). The other fox parable (ch. 31, the hunter and his dog) has no robber.
- **commons-200215189 «Horseman», BnF Supp. persan 985**: the Commons description ties it to the double-page «Sultan Sanjar and the old woman» of the same manuscript. Tagged medium.
- **commons-48672989 «İki rəqib alimin hekayəti»** and the Walters «Two scholars quarreling»: these are the two physicians of ch. 43 (in the translation, «İki həkim»), so the scene is called `physicians-duel` and «two scholars» is listed as an alias.
- **Name spellings follow kitabxana's translation**: Fridun (not Fəridun), Nuşirəvan, Səncər, Cəmşid, Harun. «Mö'bid» in the scene name uses a plain apostrophe. The translation writes «mö’bid».
