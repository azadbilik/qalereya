# Xosrov və Şirin: scene tags report

Generated 2026-11-25 from the local `irs_az` database (read-only). Scenes: `data/scenes/xosrov-va-sirin.json` (44 scenes, in chapter order). Tags: `data/tags/xosrov-va-sirin.json`.

Chapter ids are `Work.slug` (`nizami-xosrov-ve-sirin-N`). Scenes were placed by the Ganjoor section headings (`Work.titleFa`), and each was checked against kitabxana's Azerbaijani translation (`Translation`, `AZ_LATIN`, default). Every evidence line is a verbatim line from that translation, and the build script checks that it is there. `Work.body` is the Persian original.

## Counts

| | Artworks |
|---|---|
| Tagged entries | 190 |
| From the poem's collection | 174 (every row) |
| Added from Nizami artworks with `collectionId` NULL | 16 |
| With a scene | 167 (high 136, medium 27, low 4) |
| Scene `null` (no scene can be named from the title) | 23, all in the collection |

By scene (number of artworks):

| Scene | Chapter(s) | Artworks |
|---|---|---|
| khusraw-sees-shirin-bathing | 25 | 24 |
| khusraw-at-shirins-castle | 67–68 | 17 |
| battle-with-bahram-chubin | 43 | 10 |
| farhad-before-khusraw | 56–57 | 10 |
| farhad-carries-shirin | 59 | 10 |
| shapur-shows-portrait | 20–22 | 8 |
| khusraw-enthroned | 32, 44 | 8 |
| khusraw-kills-lion | 38 | 7 |
| meeting-at-the-hunt | 35 | 5 |
| farhad-before-shirin | 53 | 5 |
| khusraw-begs-hormuz-pardon | 16 | 4 |
| polo-game | 36 | 4 |
| milk-channel | 53 | 4 |
| shirin-visits-farhad | 59 | 4 |
| wedding | 89–90 | 4 |
| shiruya-murders-khusraw | 112 | 4 |
| maidens-tell-stories | 39–40 | 3 |
| barbad-plays | 49–50 | 3 |
| khusraw-and-shakar | 65 | 3 |
| khusraw-and-shirin-enthroned | 91 | 3 |
| shapur-fetches-shirin, farhad-carves-bisutun, death-of-farhad, barbad-nakisa-contest, shirin-suicide | | 2 each |
| atabak-enthroned, shapur-reveals-himself, shirin-arrives-at-madain, khusraw-at-mahin-banu, shapur-returns-to-khusraw, khusraw-at-caesars-court, shirin-laments, death-of-bahram-announced, khusraw-learns-of-farhad, khusraw-leaves-castle, shirin-rides-to-khusraw, shirin-comes-out-of-tent, shirin-brought-to-madain, buzurg-umid-advises, khusraws-funeral, khusraw-tears-prophets-letter, qizil-arslan-welcomes-nizami | | 1 each |
| shirin-flees-on-shabdiz, miraj | | 0 |

## Added From the NULL-Collection Nizami Artworks

commons-48651190 and commons-8711643 (Barbad plays the lute), commons-48651199 and commons-179832234 (Khusraw enthroned, Aqa Mirak), commons-48651200 (Farhad faints), commons-48651202 (the milk channel), commons-48651203 (Khusraw and Farhad), commons-48651207 (Farhad rescues Shirin), commons-61608937 (Shapur returns to Khusraw), commons-7822103 (battle with Bahram Chubin), commons-7826901 (Farhad carries Shirin), commons-8711846 (Shirin and the portrait, Or. 6810), commons-90993819 (suicide of Farhad), commons-159022546 and commons-159022547 ("Scene of warfare", TSM H.762 f.51b, the same folio as the Bahram Chubin battle).

These rows should probably have `collectionId` set to the Xosrov və Şirin collection.

## Filed Under the Wrong Poem, or Not a Scene From It

- **commons-23613305 «Shirin Entertains Khusraw»**: from Amir Khusraw Dihlavi's *Shirin u Khusraw* (Mughal, 1597–98), not from Nizami. It should move out of this collection.
- **commons-116525142**: the colophon of the whole Khamsa (TSM H.762, f.316a), not part of this poem.
- **commons-123931108**: a Kirman pictorial carpet, c. 1870. Its scene is unknown, and it is a carpet, not a miniature.
- **walters-W607-37a** («Abū Jaʿfar Muḥammad Atābak enthroned») and **walters-W604-94b** («Qizil Arslan welcomes Nizami»): these belong to this poem's prologue (ch. 8) and epilogue (ch. 120), so they are filed correctly. The catalogue has a scene for each so they can be linked.
- **Mi'raj paintings with NULL `collectionId`** (commons-4137203, 62473598, 4949760, 7792381, 159179483): left untagged. Each Khamsa poem has a Mi'raj in its prologue, and in this poem the Mi'raj is ch. 118. These titles don't say which poem the painting illustrates. The Tahmasp (Or. 2265) Mi'raj by Sultan Muhammad is usually placed in *Makhzan al-Asrar*. The `miraj` scene is defined but has no artworks yet.
- Humayun Khamsa folios (commons-156992150 and others), "Building with painted scenes" (TSM H.762), and the Or. 2265 Mirza Ali pages that are only labelled as decoration: no scene can be named from the title, so they were not added.

## Doubtful Tags

- **The order of Walters folios was used to decide the chapter.**
  - W604-40b «Khusraw and Shīrīn with Mahīn Bānū» falls between the bathing scene (f.39a) and Khusraw's enthronement (f.44a), which puts it at ch. 28, before Shirin is present. Tagged medium.
  - W604-43a «Shapur asks Shirin to marry Khusraw» is placed at ch. 30. Tagged medium.
  - W604-45a «at rest from the hunt» is placed at the hunt meeting. Tagged medium.
  - W604-74a, the forgiveness scene, is placed at the castle dialogues (ch. 68–77). Tagged medium.
  - W604-78b «Shapur and Shirin» is placed at ch. 79. Tagged medium.
- **Walters W605**: the folio numbers are out of story order (f.90a, f.173b, then f.257a–292a). Its tags 257a, 277a and 292a are medium or low.
- **Walters W607-68a and W605-257a, «Khusraw and Shirin enthroned»**: in W607 this folio falls before the Farhad episodes, so it may actually show Shirin crowned in Armenia (ch. 47). Tagged low or medium as `khusraw-and-shirin-enthroned` (ch. 91).
- **«A woman offers wine to Khusraw»** (W604-70a, W612-98b): read as the Shakar episode (ch. 65) from where it falls between the folios. Tagged medium.
- **`khusraw-enthroned` covers two chapters**, ch. 32 (first accession) and ch. 44 (return to Mada'in). Generic "Khusraw enthroned" titles can't be told apart.
- **The wedding is split across two chapters**: the marriage contract is in ch. 89 («Möbid qaydasıyla kəsildi kəbin»), and the wedding night with the old woman is in ch. 90. Both chapters are listed. The palanquin procession is its own scene, `shirin-brought-to-madain` (ch. 89).
- **commons-10044330** (Commons file «Ferhad_ve_Shirin», Shaykhi, H.762): tagged `farhad-carries-shirin` medium because of the painter and the manuscript. It could be another Farhad scene.
- **Left as null (low) but worth a look at the image**: commons-12146311 (Khusraw cared for by Shirin), commons-19107170 (Hyderabad, Shirin praying, possibly not Nizami), met-453191 (a night conversation, possibly ch. 88 or ch. 39), commons-7178918 (Khusraw hunting), and the various feast scenes (commons-29665394, 29665681, 97490587, 158379086). Those feasts are possibly Barbad (ch. 50) or Shakar (ch. 65).
- **The scene list comes from my knowledge of the standard cycle, checked against the scenes these museum titles actually name.** I did not consult Chelkowski or any other printed catalogue for this pass.
- **Name spellings follow kitabxana's translation**: Barbəd, Nikisa (not Nəkisa), Büzürgümid, Şiruyə, Bisütun, Gülgün. Two names are not written out in their chapters, so standard Azerbaijani forms were used: «Qızıl Arslan» (ch. 120) and «Atabəy Məhəmməd Cahan Pəhləvan» (ch. 8).
