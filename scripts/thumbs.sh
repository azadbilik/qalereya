#!/usr/bin/env bash
# Resizes the Walters' full scans (no usable thumbnail) to 900px into thumbs/<id>.jpg, once each.
# Needs macOS sips. Run after scripts/export.sh, then node scripts/build.mjs.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p thumbs
tmp=$(mktemp -d)
node -e 'for (const x of require("./data/artworks.json")) if (/thedigitalwalters/.test(x.image)) console.log(x.id + " " + x.image)' |
while read -r id url; do
  [ -s "thumbs/$id.jpg" ] && continue
  curl -sf -A "azadbilik-qalereya/0.1 (https://github.com/azadbilik/qalereya)" -o "$tmp/$id.jpg" "$url" &&
    sips -Z 900 -s formatOptions 72 "$tmp/$id.jpg" --out "thumbs/$id.jpg" >/dev/null && echo "$id"
done
rm -rf "$tmp"
