#!/usr/bin/env python3
"""Subset the Material Symbols Outlined font down to the icons actually used.

The full variable font shipped by Google Fonts maps ~4,400 glyphs and weighs
~3.8 MB, but this storefront only renders a few dozen icons. Shipping the whole
font is by far the heaviest asset on the site, so this script prunes it to just
the icons referenced from `src/`.

It keeps the variable axes (FILL / GRAD / opsz / wght) and the `rlig` ligature
lookup, so the `<Icon name="home" />` component keeps working unchanged.

Usage:
    python3 scripts/subset-material-symbols.py

Requirements:
    pip install fonttools brotli

Re-run this whenever a new icon name is added to the codebase and commit the
regenerated `src/app/fonts/material-symbols-outlined.woff2`.
"""

from __future__ import annotations

import pathlib
import re
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "app" / "fonts" / "material-symbols-outlined.woff2"
SRC_GLOB = "src/**/*.ts*"

FULL_FONT_URL = (
    "https://fonts.gstatic.com/s/materialsymbolsoutlined/v377/"
    "kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2"
)

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
except ImportError:  # pragma: no cover
    sys.exit("Missing dependency: pip install fonttools brotli")


def _unwrap(subtable):
    """Yield the concrete subtable, unwrapping GSUB extension substitutions."""
    if hasattr(subtable, "ExtSubTable"):
        ext = subtable.ExtSubTable
        return ext if isinstance(ext, list) else [ext]
    return [subtable]


def _component_to_text(name: str) -> str:
    if name == "underscore":
        return "_"
    if name.startswith("digit_"):
        return name[len("digit_"):]
    return name


def ligature_names(font: TTFont) -> set[str]:
    """Map every icon's ligature text (e.g. 'shopping_bag') to its name."""
    names: set[str] = set()
    gsub = font["GSUB"].table
    for lookup in gsub.LookupList.Lookup:
        for subtable in lookup.SubTable:
            for table in _unwrap(subtable):
                for first, ligatures in getattr(table, "ligatures", {}).items():
                    for ligature in ligatures:
                        text = _component_to_text(first) + "".join(
                            _component_to_text(c) for c in ligature.Component
                        )
                        names.add(text)
    return names


def used_icons(available: set[str]) -> set[str]:
    """String literals in src/ that match a real icon name."""
    literals: set[str] = set()
    for path in ROOT.glob(SRC_GLOB):
        text = path.read_text(encoding="utf-8")
        literals.update(re.findall(r'"([A-Za-z0-9_]+)"', text))
        literals.update(re.findall(r"'([A-Za-z0-9_]+)'", text))
        # Also detect bare JSX text children like: <span>swap_vert</span>
        # and simple inline uses of icon ligatures that are not quoted.
        literals.update(re.findall(r">\s*([A-Za-z0-9_]+)\s*<", text))
    # Also consider any icon names exported by a helper dev file (e.g. src/dev/icon-list.ts)
    # which may include explicit lists. They will appear as quoted literals above.
    return literals & available


def main() -> None:
    tmp = pathlib.Path("/tmp/opencode/material-symbols-full.woff2")
    tmp.parent.mkdir(parents=True, exist_ok=True)
    if not tmp.exists():
        print(f"Downloading full font from {FULL_FONT_URL}")
        urllib.request.urlretrieve(FULL_FONT_URL, tmp)  # noqa: S310

    font = TTFont(tmp)
    available = ligature_names(font)
    wanted = used_icons(available)
    if not wanted:
        sys.exit("No icons detected — aborting to avoid shipping an empty font.")
    print(f"{len(wanted)} icons used out of {len(available)} available:")
    print("  " + ", ".join(sorted(wanted)))

    # Drop every ligature we do not need before subsetting.
    gsub = font["GSUB"].table
    keep_targets: set[str] = set()
    components: set[str] = set()
    for lookup in gsub.LookupList.Lookup:
        for subtable in lookup.SubTable:
            for table in _unwrap(subtable):
                if not getattr(table, "ligatures", None):
                    continue
                for first, ligatures in list(table.ligatures.items()):
                    for ligature in list(ligatures):
                        text = _component_to_text(first) + "".join(
                            _component_to_text(c) for c in ligature.Component
                        )
                        if text in wanted:
                            keep_targets.add(ligature.LigGlyph)
                            components.add(first)
                            components.update(ligature.Component)
                        else:
                            ligatures.remove(ligature)
                    if not ligatures:
                        del table.ligatures[first]

    options = subset.Options()
    options.layout_features = ["*"]  # keep rlig (ligatures) and friends
    options.hinting = False
    options.name_IDs = ["*"]
    options.notdef_outline = True
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(glyphs=sorted(keep_targets | components))
    subsetter.subset(font)

    font.flavor = "woff2"
    font.save(OUT)
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
