#!/usr/bin/env bash
# Exports kitabxana.az's published artworks (miniatures, manuscript pages) with the poem and
# chapter each belongs to, into data/artworks.json. Run against the kitabxana database:
#   DATABASE_URL=postgresql://…/irs_az scripts/export.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB="${DATABASE_URL:-postgresql://localhost:5432/irs_az}"
DB="${DB%%\?*}"
psql "$DB" -v ON_ERROR_STOP=1 -At -c "
select coalesce(json_agg(row_to_json(t) order by t.author, t.poem nulls last, t.\"yearStart\" nulls last, t.id), '[]') from (
  select x.\"sourceId\" as id, x.title, x.\"objectDate\" as date, x.\"yearStart\", x.\"yearEnd\", x.medium, x.artists,
    x.\"imageUrl\" as image, coalesce(x.\"imageSmallUrl\", x.\"imageUrl\") as thumb,
    x.museum, x.\"sourceUrl\" as source, x.\"creditLine\" as credit, x.license,
    a.slug as author, a.\"nameAz\" as \"authorAz\",
    c.slug as poem, c.\"titleAz\" as \"poemAz\", c.\"titleEn\" as \"poemEn\",
    w.slug as chapter, w.\"titleAz\" as \"chapterAz\"
  from \"Artwork\" x
  join \"Author\" a on a.id = x.\"authorId\"
  left join \"Collection\" c on c.id = x.\"collectionId\"
  left join \"Work\" w on w.id = x.\"workId\"
  where x.status = 'PUBLISHED' and a.status = 'PUBLISHED'
) t" > data/artworks.json
node -e 'const a=require("./data/artworks.json"); console.log(a.length, "artworks")'
