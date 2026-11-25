# İqbalnamə: scene tags report

Generated 2026-11-25 from the local `irs_az` database (read-only). Scenes: `data/scenes/xerednama.json` (16 scenes, in chapter order). Tags: `data/tags/xerednama.json`.

The collection is `nizami-xerednama`, but its chapter ids are `Work.slug` `nizami-iqbalname-N`. Scenes were placed by the Ganjoor section headings (`Work.titleFa`), and each was checked against kitabxana's Azerbaijani translation (`Translation`, `AZ_LATIN`, default). Every evidence line is a verbatim line from that translation, and the build script checks that it is there. `Work.body` is the Persian original.

The part split was checked against the Walters manuscript descriptions, which give the folio where the İqbalnamə begins in W604 (281b), W607 (261b), W609 (351b), W610 (325b) and W612 (331b). Every Walters painting tagged here falls after that folio.

## Counts

| | Artworks |
|---|---|
| Tagged entries | 25 |
| From the poem's collection | 12 (every row) |
| Added from Nizami artworks with `collectionId` NULL | 13 |
| With a scene | 25 (high 23, medium 2) |
| Scene `null` | 0 |

By scene (number of artworks):

| Scene | Chapter(s) | Artworks |
|---|---|---|
| seven-sages | 19–28 | 6 |
| drum-talisman | 35 | 6 (one painting, BL Or. 6810 f.225v, and five crops of it) |
| hermes-and-seventy-sages | 14 | 2 |
| iskandar-watches-sirens | 35 | 2 |
| iskandars-coffin | 39 | 2 |
| iskandar-and-wise-shepherd, archimedes-and-chinese-girl, baker-before-the-king, zangi-kills-companion, iskandar-visits-socrates, qandahar-idol-girl, wall-against-gog | | 1 each |
| plato-music, iskandar-made-prophet, city-of-the-righteous, death-of-iskandar | | 0 |

## Added From the NULL-Collection Nizami Artworks

These 13 rows are İqbalnamə paintings and should probably have `collectionId` set to this collection:

- **Walters**:
  - W607-268b «Aristotle teaching his students», 7 folios after the İqbalnamə incipit.
  - W610-338b «The seventy Greek scholars struck dead by the curse of Hermes».
  - W610-345a «Alexander the Great and the seven philosophers».
- **BL Or. 6810, Herat 1494–95**:
  - The seven sages, f.214r: commons-156623833, commons-156623836 and commons-7794427 (Behzad).
  - The drum talisman, f.225v: commons-156623840, commons-156623844, commons-156623845, commons-197311056, commons-197050956 and commons-197050932. The last two are crops of the same painting showing Jami as Balinas with his astrolabe.
- **commons-69887043** «Iskander Watching the Sirens» (Shiraz 1463, David Collection).

Other İqbalnamə items that are not scenes, so were not added:

- commons-4174015 «Beginning of Nizami's Iqbalnamah» and commons-4174091 «First page of Nizami's Iqbalnamah» are text pages. They also belong in this collection.
- walters-W657-304b «Iskandar being handed a letter that describes a dangerous passage through the mountains» falls in W657's second part (from f.280a, which W657 titles «Khirdnāmah»), but I could not find the episode in a chapter. It is not tagged.

## Filed Under the Wrong Poem, or Not a Scene From It

- **No row filed in this collection belongs to the Şərəfnamə**. All 12 are İqbalnamə scenes.
- **walters-W609-364a «An Ethiopian warrior killing another Ethiopian»** looks like a Şərəfnamə Zangi-war scene, but W609 places it in the İqbalnamə (after f.351b), and it does belong here. In the baker's tale (ch. 13), the baker hides in a ruin and watches a Zangi kill his sleeping companion: «Polad qılıncını ona əndərdi». It is filed correctly and tagged medium.

## Doubtful Tags

- **W607-268b «Aristotle teaching his students»** is tagged medium as `archimedes-and-chinese-girl` (ch. 11). That chapter opens with Aristotle teaching a hundred students («Yüz nəfər şagirdə dərs öyrədirdi»), and the folio is early in the İqbalnamə. It could also illustrate Plato's quarrel with Aristotle (ch. 15).
- **W612-339a «Alexander listens to a story about a prince whose wife was sick»** is tagged high as `iskandar-and-wise-shepherd` (ch. 10). In that chapter the «rumi kəmərli, Çin taclı şah» grieves over a girl burning with fever and calls in a shepherd to tell him a story.
- **W612-343b «A rich merchant is summoned before a Greek king and his prime minister»** is tagged high as `baker-before-the-king` (ch. 13). The poor baker grows rich, trades in jewels («İndi alıb-satır ləl ilə gövhər»), and is summoned by the king to explain his wealth. It falls between f.339a (ch. 10) and f.345b (ch. 14).
- **The drum talisman (BL Or. 6810 f.225v)** is ch. 35. In that chapter Iskandar hangs a bronze drum on the talisman and beats it to still the waters («Asdı bir mis təbil onun boynuna», «Təbil ağacını şah alıb ələ»). Behzad gives Iskandar the features of Husayn Bayqara or Nava'i, and Balinas the features of Jami.
- **`death-of-iskandar` and `iskandars-coffin` are both ch. 39**. Iskandar dies, and his body goes into a golden coffin with one hand left outside («Qoyuldu bir əli tabutdan kənar»). The testament is in ch. 38, so `death-of-iskandar` lists both chapters.
- **The sirens and the Qandahar girl are both ch. 35** (Iskandar's second journey to India). The Qandahar «beautiful girl» of W604-310b is the "living idol" of the Qandahar temple, who tells Iskandar the story of the jewel-eyed idol.
- **No Mi'raj chapter**: this part's prologue has no Mi'raj; the Iskandarnama's Mi'raj is in the Şərəfnamə (ch. 4). So the catalogue has no `miraj` scene.
- **Names follow kitabxana's translation**: Ərəstu, Əflatun, Sokrat, Bəlinas, Arşimides. Hermes is «Hürmüz» in this translation (ch. 14, ch. 25), and the scene title follows it.
- **The scene list comes from the standard painted cycle, checked against the scenes these museum titles actually name.** I did not consult a printed catalogue.
