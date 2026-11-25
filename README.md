# Qalereya

**[azadbilik.org/qalereya](https://azadbilik.org/qalereya/)**: miniatures painted for the poems of Nizami Ganjavi and Fuzuli, from museums' open collections, each linked to the poem on [kitabxana.az](https://kitabxana.az) it illustrates. Part of [Azad Bilik](https://azadbilik.org).

A poem with a scene catalogue reads in story order: each scene (Khusraw sees Shirin bathing, Farhad carries Shirin and her horse…) with every painting of it, from every manuscript, and a link to the chapter where it happens.

| Path | What |
|---|---|
| `data/artworks.json` | kitabxana.az's published artworks, exported by `scripts/export.sh` from its database |
| `data/scenes/<poem>.json` | The illustrated scenes of a poem in story order, each with the kitabxana chapters it happens in |
| `data/tags/<poem>.json` | Artwork id → scene |
| `data/gallery.json` | What the page reads, built by `node scripts/build.mjs` |

## Images and licences

Images are shown from the museums' and Wikimedia Commons' own servers, never copied here. Each one's source and licence are on its page: the Metropolitan Museum's and the Walters Art Museum's are CC0, Wikimedia Commons' public domain. Sources under a non-commercial licence (the Bodleian, the BnF) will be labelled as such.

The code is MIT. The scene catalogues and tags are CC0.
