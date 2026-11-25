# Qalereya

**[azadbilik.org/qalereya](https://azadbilik.org/qalereya/)**: miniatures painted for the poems of Nizami Ganjavi and Fuzuli, from museums' open collections, each linked to the poem on [kitabxana.az](https://kitabxana.az) it illustrates. Part of [Azad Bilik](https://azadbilik.org).

A poem with a scene catalogue reads in story order: each scene (Khusraw sees Shirin bathing, Farhad carries Shirin and her horse…) with every painting of it, from every manuscript, and a link to the chapter where it happens.

| Path | What |
|---|---|
| `data/artworks.json` | kitabxana.az's published artworks, exported by `scripts/export.sh` from its database |
| `data/scenes/<poem>.json` | The illustrated scenes of a poem in story order, each with the kitabxana chapters it happens in |
| `data/tags/<poem>.json` | Artwork id → scene |
| `data/gallery.json` | What the page reads, built by `node scripts/build.mjs` |
| `data/dims.json` | Each thumbnail's width and height, so the page lays it out before it loads (`node scripts/dims.mjs`) |
| `data/manuscripts.json` | Where and when each manuscript was made, kept by hand; the workshops map reads it |
| `thumbs/`, `large/` | Our copy of every picture at the sizes the site shows: the thumbnail and the viewer's image (at most 1400px), made by `scripts/mirror.sh` |

Adding pictures: `scripts/export.sh` → `node scripts/build.mjs` → `scripts/mirror.sh` → `node scripts/dims.mjs` → `node scripts/build.mjs`.

## Images and licences

Every picture is free to reuse: the Metropolitan Museum's, the Walters Art Museum's and the Cleveland Museum of Art's are CC0, the Rijksmuseum's and Wikimedia Commons' public domain, the Chester Beatty's CC BY 4.0 (credited beside the picture). So the gallery keeps its own screen-sized copies in `thumbs/` and `large/` and loads nothing from the museums' servers, which can be slow; the original stays at its source, linked from the viewer with its licence.

The code is MIT. The scene catalogues and tags are CC0.
