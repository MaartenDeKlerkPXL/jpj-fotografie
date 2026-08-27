#!/bin/bash
# =============================================================================
# compress-images.sh — comprimeert nieuwe foto's in images/ en genereert
# responsive breedtes (480/800/1200px) + WebP-varianten naast elke JPG.
#
# Gebruik: voeg nieuwe foto's toe aan images/<categorie>/, run dit script
# vanuit de projectmap. Al verwerkte foto's (met een bestaande .webp) worden
# overgeslagen, dus het is veilig om steeds opnieuw te draaien na nieuwe
# uploads — bestaande foto's worden niet nog een keer gecomprimeerd.
#
# Vereist: ImageMagick (`brew install imagemagick`).
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

JPG_OPTS=(-strip -interlace Plane -sampling-factor 4:2:0 -quality 82)
WEBP_OPTS=(-strip -quality 80 -define webp:method=6)

find images -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) \
  ! -name "*-480.*" ! -name "*-800.*" ! -name "*-1200.*" | sort | while IFS= read -r f; do
  dir=$(dirname "$f")
  base=$(basename "$f")
  name="${base%.*}"

  if [ -f "$dir/$name.webp" ]; then
    echo "skip (al verwerkt): $f"
    continue
  fi

  # Basisbestand: overschrijf op dezelfde plek, max. 1800px breed/hoog.
  # Dit pad blijft ongewijzigd, dus data.js hoeft niet aangepast te worden.
  magick "$f" -auto-orient -resize '1800x1800>' "${JPG_OPTS[@]}" "$f"
  magick "$f" "${WEBP_OPTS[@]}" "$dir/$name.webp"

  for w in 480 800 1200; do
    magick "$f" -resize "${w}x${w}>" "${JPG_OPTS[@]}" "$dir/$name-$w.jpg"
    magick "$f" -resize "${w}x${w}>" "${WEBP_OPTS[@]}" "$dir/$name-$w.webp"
  done

  echo "verwerkt: $f"
done

echo "Klaar."
