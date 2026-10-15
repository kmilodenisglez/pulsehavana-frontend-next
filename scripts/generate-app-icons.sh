#!/usr/bin/env bash
#
# Regenerates the app icons consumed by the Next.js App Router file conventions
# (src/app/favicon.ico, src/app/icon.png, src/app/apple-icon.png) from the brand
# master logo. Requires ImageMagick (`convert`).
#
# Usage: ./scripts/generate-app-icons.sh
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
logo="$repo_root/public/brand/pulse-havana-logo.webp"
app_dir="$repo_root/src/app"

if ! command -v convert >/dev/null 2>&1; then
  echo "error: ImageMagick 'convert' is required but was not found in PATH." >&2
  exit 1
fi

# Browser tab icon: multi-resolution ICO, transparent background.
convert "$logo" -background none -define icon:auto-resize=48,32,16 "$app_dir/favicon.ico"

# Modern browsers and bookmarks: PNG icon, transparent background.
convert "$logo" -resize 192x192 -strip -define png:compression-level=9 "$app_dir/icon.png"

# iOS home screen: iOS composites alpha on black, so flatten onto white.
convert "$logo" -resize 180x180 -background white -alpha remove -alpha off "$app_dir/apple-icon.png"

echo "App icons regenerated in src/app: favicon.ico, icon.png, apple-icon.png."
