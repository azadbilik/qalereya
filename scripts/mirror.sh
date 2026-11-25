#!/usr/bin/env bash
# Keeps the gallery's own copy of every picture at the two sizes the site shows, so its pages
# load from azadbilik.org alone, not from the museums' servers (the Walters takes ~10 s a scan,
# the Met's originals run to 2 MB):
#   thumbs/<id>.jpg  the grid's thumbnail: the host's own thumbnail, or the scan cut to 900px
#   large/<id>.jpg   the viewer's image, at most 1400px: from the host's screen size where it has
#                    one (Commons 1280px, the Rijksmuseum 1600px), else from the original
# The original stays at the museum, linked from the viewer. Each file is made once; run
# scripts/build.mjs before (it names the sources) and after (it then points at the copies).
# Needs macOS sips.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p thumbs large
export UA="azadbilik-qalereya/0.1 (https://github.com/azadbilik/qalereya)"
export TMPD=$(mktemp -d)
trap 'rm -rf "$TMPD"' EXIT

# fetch <url> <out> <max px> [<backup url>]: download (the backup, the original, when the host has
# no copy at that size: Commons won't make a 1280px copy of a narrower picture), then shrink
# (never enlarge) to <max px> as a JPEG
fetch() {
  url=$1; out=$2; max=$3; backup=${4:-}; f="$TMPD/$(basename "$out")"
  [ -s "$out" ] && return 0
  for try in 1 2 3; do
    curl -sfL --max-time 120 -A "$UA" -o "$f" "$url" && [ -s "$f" ] && break
    rm -f "$f"; sleep $((try * 4))
    if [ "$try" = 2 ] && [ -n "$backup" ]; then url=$backup; fi
  done
  [ -s "$f" ] || { echo "  failed: $out ($url)" >&2; return 0; }
  w=$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/{print $2}'); h=$(sips -g pixelHeight "$f" 2>/dev/null | awk '/pixelHeight/{print $2}')
  if [ "${w:-0}" -gt "$max" ] || [ "${h:-0}" -gt "$max" ]; then
    sips -Z "$max" -s format jpeg -s formatOptions 72 "$f" --out "$out" >/dev/null
  else
    sips -s format jpeg -s formatOptions 80 "$f" --out "$out" >/dev/null
  fi
  rm -f "$f"
  [ -s "$out" ] && echo "$out"
}
export -f fetch

node -e '
const g = require("./data/gallery.json");
for (const x of g.items) {
  if (!x.thumb.startsWith("thumbs/")) console.log([x.thumb, `thumbs/${x.id}.jpg`, 900].join(" "));
  if (!(x.large ?? "").startsWith("large/")) console.log([x.large ?? x.image, `large/${x.id}.jpg`, 1400, x.image].join(" "));
}' | xargs -P 4 -L 1 bash -c 'fetch "$0" "$1" "$2" "${3:-}"' | awk 'END { print NR " files made" }'
echo "thumbs: $(ls thumbs | wc -l | tr -d " ")  large: $(ls large | wc -l | tr -d " ")  ($(du -sh thumbs large | awk "{print \$1}" | paste -sd/ -))"
