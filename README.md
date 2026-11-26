# Qalereya

**[azadbilik.org/qalereya](https://azadbilik.org/qalereya/)**: miniatures painted for the poems of Nizami Ganjavi and Fuzuli, from museums' open collections, each linked to the poem on [kitabxana.az](https://kitabxana.az) it illustrates. Part of [Azad Bilik](https://azadbilik.org).

A poem with a scene catalogue reads in story order: each scene (Khusraw sees Shirin bathing, Farhad carries Shirin and her horse…) with every painting of it, from every manuscript, and a link to the chapter where it happens.

| Path | What |
|---|---|
| `data/artworks.json` | kitabxana.az's published artworks, exported by `scripts/export.sh` from its database |
| `data/scenes/<poem>.json` | The illustrated scenes of a poem in story order, each with the kitabxana chapters it happens in |
| `data/tags/<poem>.json` | Artwork id → scene |
| `data/gallery.json` | What the page reads, built by `node scripts/build.mjs` |
| `data/network.json` | What the painters' network reads, built by `node scripts/network.mjs` from `manuscripts.json` and `gallery.json` |
| `rassamlar/` | The painters' network page (`/qalereya/rassamlar/`, az/ru/en), d3-force |
| `data/dims.json` | Each thumbnail's width and height, so the page lays it out before it loads (`node scripts/dims.mjs`) |
| `data/manuscripts.json` | Where and when each manuscript was made, kept by hand; the workshops map reads it |
| `p/<id>/` | One small page per picture with its own link-preview tags (og:/twitter:) that sends a visitor to the gallery with that picture open; the viewer's Share button links here. Made by `scripts/build.mjs`, regenerated on every run |
| `thumbs/`, `large/` | Our copy of every picture at the sizes the site shows: the thumbnail and the viewer's image (at most 1400px), made by `scripts/mirror.sh` |

Adding pictures: `scripts/export.sh` → `node scripts/build.mjs` → `scripts/mirror.sh` → `node scripts/dims.mjs` → `node scripts/build.mjs`.

## Painters' network

[`/qalereya/rassamlar/`](https://azadbilik.org/qalereya/rassamlar/): two graphs from the same catalogue. **Painters and patrons:** the manuscripts of `data/manuscripts.json` that name a painter or a patron (28 of 142), linked to their painters, their patron and their city (or dynasty when the catalogue has no city). "Bihzad (attributed)" and "(ascribed)" are one painter, the link marked probable; "Mirak" and "Aqa Mirak" are not merged (unchecked). Painters "who worked together" are only those named in the same manuscript's entry, not on the same folio. **Scenes that travelled:** scenes (`data/tags`) painted in manuscripts of two or more cities, linked to those cities, with the earliest year per city; only the 407 of 780 pictures whose manuscript has a city count. Rebuild: `node scripts/network.mjs`. Graph: [d3](https://d3js.org) 7.9.0 (ISC) from jsDelivr, force layout settled before paint.

## Images and licences

Every picture is free to reuse: the Metropolitan Museum's, the Walters Art Museum's and the Cleveland Museum of Art's are CC0, the Rijksmuseum's and Wikimedia Commons' public domain, the Chester Beatty's CC BY 4.0 (credited beside the picture). So the gallery keeps its own screen-sized copies in `thumbs/` and `large/` and loads nothing from the museums' servers, which can be slow; the original stays at its source, linked from the viewer with its licence.

The code is MIT. The scene catalogues and tags are CC0.
