#!/usr/bin/env bash
# The viewer's image: a 1400px copy (large/<id>.jpg, ~200 KB) of each picture whose host offers
# nothing between its thumbnail and its original (the Met's originals run to 2 MB and 5 s, the
# Walters' scans take ~10 s, Cleveland's print files several MB). Commons and the Rijksmuseum
# serve sizes of their own (scripts/build.mjs). Once each; needs macOS sips. Then build.mjs.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p large
tmp=$(mktemp -d)
one() {
  id=$1; url=$2; tmp=$3
  [ -s "large/$id.jpg" ] && return 0
  for try in 1 2 3; do
    curl -sf --max-time 90 -A "azadbilik-qalereya/0.1 (https://github.com/azadbilik/qalereya)" -o "$tmp/$id" "$url" && break
    sleep $((try * 5))
  done
  [ -s "$tmp/$id" ] || { echo "  $id: not fetched" >&2; return 0; }
  sips -Z 1400 -s format jpeg -s formatOptions 72 "$tmp/$id" --out "large/$id.jpg" >/dev/null && echo "$id"
  rm -f "$tmp/$id"
}
export -f one
node -e 'for (const x of require("./data/artworks.json")) if (/metmuseum|thedigitalwalters|clevelandart/.test(x.image)) console.log(x.id + " " + x.image)' |
  xargs -P 4 -L 1 bash -c 'one "$0" "$1" '"$tmp"
rm -rf "$tmp"
