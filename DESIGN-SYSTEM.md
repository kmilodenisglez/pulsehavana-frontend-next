# Design System — Pulse Havana Center Cell

> **What this is.** The implementation contract for styling this storefront.
> Humans and AI agents MUST follow it when writing or reviewing UI.
>
> **Source of truth for values:** `src/app/globals.css` (`@theme`).
> This file explains **intent + usage rules**; if a value here disagrees with
> `globals.css`, `globals.css` wins — fix this file.

---

## 0. TL;DR rules (read first)

- **Tokens only.** Color, radius, spacing and typography MUST come from the
  design tokens in `src/app/globals.css`. Never hardcode hex values or use raw
  Tailwind palette classes (`bg-emerald-500`, `text-violet-500`, `bg-slate-900`, …).
- **One identity: purple + neutral monochrome.** The brand is a violet signature
  over white/neutral surfaces. Merchandising badges (Nuevo, Oferta, Pro, …) MUST
  stay inside the purple family.
- **Green is functional, never decorative.** `--color-status-success` (`#047857`)
  is reserved for **stock/status only** (in-stock chip, success confirmations).
  It MUST NOT appear on merchandising/product badges.
- **Use the badge helpers.** Product badge colors live in `src/lib/badges.ts`
  (`badgeOverlayTone`, `badgeTintTone`) — do not write badge colors inline.
- **Machine-readable tokens.** `tokens.json` (DTCG) is **generated** from
  `globals.css` — read it for programmatic use; regenerate it, never edit it.

---

## 1. Brand palette (core roles)

| Role | Token | Value | Tailwind |
| --- | --- | --- | --- |
| Primary | `--color-primary` | `#630ed4` | `bg-primary` / `text-primary` |
| Primary container (signature violet) | `--color-primary-container` | `#7c3aed` | `bg-primary-container` |
| Secondary | `--color-secondary` | `#712edd` | `bg-secondary` |
| Tertiary (deep violet) | `--color-tertiary` | `#6129bc` | `bg-tertiary` |
| Neutral ink | `--color-ink-primary` | `#1d1d1f` | `text-ink-primary` |
| Neutral secondary ink | `--color-ink-secondary` | `#6e6e73` | `text-ink-secondary` |
| Hairline border | `--color-border-hairline` | `rgba(0,0,0,0.08)` | `border-border-hairline` |
| Functional success | `--color-status-success` | `#047857` | `text-status-success` |
| Functional danger | `--color-status-danger` | `#b91c1c` | `text-status-danger` |

`LoadingScreen` (the brand moment on a document load) is **light**: it paints with
`bg-surface`, `--color-primary-tint` / `--color-primary-tint-hover` for the bloom
behind the logo, `text-ink-primary` for the wordmark and counter, and
`--color-primary` → `--color-secondary-container` for the progress line — the same
palette as the page it hands over to. Its choreography is a token too
(`--animate-intro-logo`, `--animate-intro-ring`, `--animate-intro-rise`, keyframes
at the bottom of `globals.css`), so the intro is CSS and never depends on an
animation library.

---

## 2. Product badge palette (semantic variant) — added 2026-10

Product state badges (the labels over product imagery and on the detail page)
use a **dedicated semantic layer** so they never drift into off-brand hues
(the previous build used green for "Nuevo", which violated the identity).

| Badge kind (`BadgeKind`) | Semantic token | Value | Brand role | Typical labels |
| --- | --- | --- | --- | --- |
| `success` | `--color-badge-new` | `#7c3aed` | Primary | Nuevo, Grado A+, Eficiencia, Protección |
| `primary` | `--color-badge-promo` | `#5b21b6` | Tertiary (deep violet) | Oferta, Pro, Premium, Garantía, Backup, Reacond. A+ |
| `neutral` | `--color-badge-neutral` | `#1d1d1f` | Neutral ink | Reacond. |

**Rationale:** keeps state badges inside the "purple + monochrome" identity while
still giving three visually distinct tones (bright violet → deep violet → ink).

### Rendering recipes (single source: `src/lib/badges.ts`)

| Context | Helper | Output |
| --- | --- | --- |
| Badge **over product imagery** (`ProductCard`) | `badgeOverlayTone(kind)` | translucent solid fill + white content |
| Badge **on a light surface** (`ProductDetail`) | `badgeTintTone(kind)` | `~10%` brand tint + colored text (matches the Brand Book "tinted pill" rule) |

The **"Destacado"/featured marker** is a light chip with a violet star
(`bg-surface-base/85 text-primary-container`), kept lighter than state badges so
it reads as secondary and never duplicates the primary violet.

---

## 3. Do / Don't

| ✅ Do | ❌ Don't |
| --- | --- |
| Render badges with `badgeOverlayTone` / `badgeTintTone` | Write `bg-emerald-500` / `bg-violet-500` on a badge |
| Keep merch badges purple/neutral | Introduce green, red or amber as a *badge* color |
| Use `--color-status-success` for stock/status | Reuse green for "Nuevo" or any merchandising label |
| Add a new tone as a token + helper | Inline an arbitrary hex in a component |
| Reference tokens (e.g. `bg-primary-container`) | Hardcode `#7c3aed` in JSX |

---

## 4. Adding or changing a token (keep the layers in sync)

1. **Token** — add/update `--color-*` in `src/app/globals.css` (`@theme`).
2. **Design source** — mirror the token in the Brand Book front-matter `colors:` map.
3. **Docs** — document it in the tables above with its role.
4. **Usage** — consume it through a semantic helper/utility, never inline.
5. **Export** — regenerate the machine-readable mirror: `npm run tokens:export`
   (validate with `npm run tokens:check`, e.g. in CI).

---

## 5. Responsive contract

The storefront has exactly two layout families, switched at `lg` (1024px, the
project's "laptop / desktop" step):

| Range | Shell | Categories & subcategories |
| --- | --- | --- |
| `< lg` (mobile & tablet) | `BottomNav` visible, pages clear it with `pb-24` | Two views driven by the bottom navigation. Shop view (`inicio`): no category chrome at all. Categories view (`categorias`): `StoreCategories` (`CategoryRail` + `CollectionExplorer`) fills the screen between the header and the nav. "Categorías" toggles: picked while open, it closes the view and gives the shop back with its filters untouched (only "Inicio" clears them) |
| `≥ lg` (desktop) | `BottomNav` hidden, pages use `lg:pb-8` | `DesktopCategoryNav`: the Tier 1 pills (`CategoryPills`) plus, for the pill that was clicked, the Tier 2 megamenu (`CategoryMenu`) that unfolds directly below the bar with that category's collections as a grid of artwork tiles. A pill that owns a panel only unfolds/folds it (never filters); `Todos`, which has no collections, stays a plain filter link |

- The mobile/tablet view lives in `useStoreView` (`src/lib/store-view.ts`),
  backed by the URL hash (`#categorias`) like the cart is backed by
  localStorage. Desktop ignores the view: the shop view is `hidden lg:flex` while
  the categories view is open and the categories view is `lg:hidden`, so the
  pills never disappear on a wide screen. Switching the view is presentation
  only: the `BottomNav` items `preventDefault()` so it never costs a server read,
  and their `href` still points at the same view for sharing. Anything else that
  closes the explorer must call `setStoreView("inicio")` — the router updates the
  URL outside React's render, so a hash it drops never reaches the view store.
- **The catalog selection is the URL**: `?cat=<slug>` (`catalogHref` in
  `src/lib/store-catalog.ts`), where the slug is a Tier 1 category or a Tier 2
  collection. The server resolves it (`getStoreCatalog` in
  `src/lib/store-catalog.server.ts`, `use cache` + `cacheTag("category:<slug>")`),
  so one URL = one query = one shareable link that renders the same products
  before any JavaScript runs, and going back to a visited category is served from
  cache instead of the database. Pills, rail, collection rows and megamenu tiles
  are `<Link>`s to those URLs (`scroll={false}`): copyable, prefetchable,
  middle-clickable. An unknown slug falls back to the whole catalog instead of an
  error page.
- **The desktop megamenu is presentation, never a second selection**. The whole
  category tree travels in the payload (`Category.collections`), which is why a
  plain left click on a Tier 1 pill never filters: it only unfolds that category's
  collections — the same pill again folds them, and another pill swaps them, always
  with no request and no navigation, so the panel never folds and reopens while
  something loads. A category without collections (`Todos`) keeps its plain filter
  link. Modified clicks (Ctrl/Cmd/Shift/Alt or a non-left button) keep
  following the link to `?cat=<category>`, the category's own shareable URL.
  Filtering is the collection's turn: a tile or "Ver todo \<category\>" costs one
  query. Tiles land on the shop (`setStoreView("inicio")` + close), while
  "Ver todo \<category\>" keeps the view hash exactly like the rail does.
- Closing the megamenu is three ways out and no dead end: the pill again, the
  `bg-scrim` backdrop, or `Escape` (which also returns focus to the trigger).
  Layering is fixed: the header stays at `z-50`, the nav is `z-40` and holds the
  backdrop, so the bar + panel read as one floating card (`bg-surface-base`,
  `rounded-[24px]`, `shadow-2xl`) over everything the page renders below it.
- The URL data streams into the page's static shell through a `Suspense`
  boundary (`StoreFrontSkeleton`), which is what Cache Components asks for;
  without it the whole route would render per request.
- `StoreHero` is the shop's home header: it shows only while the catalog is
  unfiltered (`Todos`, i.e. no `?cat=`), so any active category (parent or
  collection) takes it away and the products keep the screen. The "Inicio" item
  of the `BottomNav` restores that state — its bare `/` path drops the filter, so
  the home tab always lands on the whole catalog with the hero — and the
  categories view takes the hero away with the shop itself.
- A view that owns the screen is sized explicitly — `h-[calc(100dvh-10rem)]`,
  i.e. the page's own `pt-16` + `pb-24` — instead of `flex-1` + `min-h-0`: a
  `0%` flex basis resolves as *content* while the ancestor height is indefinite,
  so the view would grow the page instead of scrolling inside it. Each half then
  opts into `overflow-y-auto` (`CategoryRail`, the `CollectionExplorer` rows), so
  only the list scrolls and the header of the panel stays put.
- Exactly one anchor `id` per target — `id="categorias"` belongs to the
  categories view; variants are toggled with `lg:hidden` / `hidden lg:block`
  and never duplicate an `id`.
- When shell visibility changes, update the matching page padding in the same
  change so no dead space is left behind (e.g. `BottomNav` + `lg:pb-8`).
- Icons are ligatures from a **subset** font: adding an icon name requires
  re-running `python3 scripts/subset-material-symbols.py` and committing the
  regenerated `src/app/fonts/material-symbols-outlined.woff2`. A missing ligature
  silently renders as literal text instead of a glyph (this font names the
  "inventory 2" icon `inventory_two`, not `inventory_2`).

---

## 6. Related files

| File | Responsibility |
| --- | --- |
| `src/app/globals.css` | Design tokens (`@theme`) — **authoritative values** |
| `src/lib/badges.ts` | Badge tone helpers (kind → classes) |
| `src/lib/types.ts` | `BadgeKind` (`"success" \| "primary" \| "neutral"`) |
| `src/components/ProductCard.tsx` | Badges over product imagery |
| `src/components/ProductDetail.tsx` | Badges on light surfaces |
| `src/components/StoreCategories.tsx` | Mobile & tablet categories view (full screen) |
| `src/lib/store-view.ts` | Mobile & tablet view state (`inicio` / `categorias`) |
| `src/lib/store-catalog.ts` | Catalog selection types + `catalogHref` (the `?cat=<slug>` contract) |
| `src/lib/store-catalog.server.ts` | Storefront query: `getStoreCatalog(?cat=)`, cached per category tag |
| `src/app/page.tsx` | Reads `?cat=`, streams the store into the page's static shell |
| `src/components/LoadingScreen.tsx` | Brand intro on document load (light surface + `--animate-intro-*`); takes itself out of the tree, skipped under reduced motion |
| `src/components/StoreFrontSkeleton.tsx` | Streaming fallback for the URL-resolved store body |
| `src/components/CategoryRail.tsx` / `CollectionExplorer.tsx` | Mobile & tablet catalog explorer |
| `src/components/DesktopCategoryNav.tsx` | Desktop nav: Tier 1 pills + Tier 2 megamenu (open state, backdrop, Escape) |
| `src/components/CategoryPills.tsx` / `CategoryMenu.tsx` | Desktop Tier 1 trigger bar / Tier 2 megamenu panel |
| `src/components/CollectionThumb.tsx` | Artwork tile with Material Symbol fallback (rail, explorer rows, megamenu grid) |
| `scripts/subset-material-symbols.py` | Regenerates the self-hosted icon font subset |
| `tokens.json` | Machine-readable token mirror (DTCG) — **generated** |
| `scripts/export-design-tokens.mjs` | Exports `globals.css` → `tokens.json` |
| `data_tmp/…/Design - Brand Book.md` | Visual language reference (git-ignored) |

---

## 7. Note for AI agents

When styling UI in this repo: read this file first, prefer the tokens/helpers it
points to, and reject any change that introduces an off-brand hue into product
badges. If a needed token is missing, add it following section 4 instead of
hardcoding a color.
