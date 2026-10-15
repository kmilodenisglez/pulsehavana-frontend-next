# Pulse Havana Center Cell — Frontend

Mobile-first phone store built with **Next.js 16**, **React 19** and **Tailwind CSS v4**.
It is a 1:1 replica of the four mobile screens under
`data_tmp/PULSE HAVANA CELL - Design/` (`1.store`, `2.detail-product`, `3.checkout`, `4.confim`).

## Requirements

- **Node.js 20.9+** (LTS)
- **npm** (bundled with Node)
- Internet access — product/store images are served from the `lh3.googleusercontent.com` CDN

## Install

```bash
npm install
```

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server at <http://localhost:3000> (hot reload) |
| `npm run build` | Create the production build (`.next/`) |
| `npm run start` | Serve the production build (run `npm run build` first) |
| `npm run lint` | Run ESLint (expected: **0 problems**) |
| `npm run tokens:export` | Regenerate `tokens.json` from `globals.css` (`@theme`) |
| `npm run tokens:check` | Verify `tokens.json` is up to date (use in CI) |

Start the production server on a custom port:

```bash
npm run build
PORT=3210 npm run start   # http://localhost:3210
```

Quick smoke test in the terminal:

```bash
npm run build && npm run start &   # start on :3000
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/            # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/checkout    # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/confirmation # 200
```

## Routes

| Route | Screen | Notes |
| --- | --- | --- |
| `/` | `1.store` | Hero, categories, product grid, trust + store info, bottom nav, WhatsApp FAB |
| `/product/[slug]` | `2.detail-product` | Gallery, storage/color options, quantity, sticky "add to cart" bar |
| `/checkout` | `3.checkout` | Cart lines (qty / remove), customer form, order summary |
| `/confirmation` | `4.confim` | Order reference, total, WhatsApp CTA, store info |
| anything else | — | Custom `not-found` page |

Available product slugs: `iphone-15-pro`, `iphone-15-pro-max`, `iphone-14`,
`galaxy-s24-ultra`, `iphone-13`, `adaptador-usb-c-20w-apple`.

## User flow (manual test / golden path)

The app seeds the cart with **2 items** (iPhone 15 Pro + USB-C adapter = **USD 968**)
so the checkout and confirmation screens match the designs out of the box.

1. **Store** — open <http://localhost:3000>. You should see the hero, the two
   categories, the product grid, trust/stores sections, the bottom nav and the
   WhatsApp floating button.
2. **Add from the grid** — tap **“Añadir”** on a card. The cart badge (top-right and in
   the bottom nav) increases from `2`.
3. **Open a product** — tap a card to go to `/product/<slug>`. Change storage/color,
   adjust quantity, use the gallery arrows, then tap **“Añadir al Carrito”**.
4. **Go to checkout** — tap the cart icon (header or bottom nav) → `/checkout`.
   Update quantities with **+ / −**, remove a line with the trash icon, and fill in the
   form (**name, phone, address** are required; notes optional).
5. **Submit** — press the submit button. It validates, shows a “processing → done”
   state, saves the order and redirects to `/confirmation`.
6. **Confirmation** — shows your reference, total, customer and store details.
   Use **“Enviar pedido por WhatsApp”** and **“Copiar resumen del pedido”**.

### Persistence and reset

State is stored in the browser:

- `phc.cart.v1` — the cart (localStorage)
- `phc.order.v1` — the last submitted order (localStorage)

To reset to the designed defaults: open DevTools → **Application → Storage → Clear site data**
(or run `localStorage.clear()` in the console) and reload. If no order exists, the
confirmation screen falls back to the design defaults (`PHC-7842`, USD 968.00).

## Project structure

```
DESIGN-SYSTEM.md       Brand + design-token contract (humans + AI agents)
AGENTS.md              Agent instructions (Next.js rules + design-token rules)
tokens.json            Generated DTCG mirror of the design tokens (do not edit)
src/
  app/                 App Router routes + globals.css (design tokens) + layout.tsx
    fonts/             Self-hosted Material Symbols (next/font/local)
    favicon.ico        App icons (Next.js file conventions, generated from the brand logo)
    icon.png
    apple-icon.png
  components/          UI: header, catalog, detail, checkout, confirmation, nav, FAB, icon, pill scroller
  lib/
    assets.ts          CDN image/logo URLs
    badges.ts          Brand-aligned product badge color helpers
    catalog.ts         Products, categories, seed cart
    cart.tsx           Cart context (localStorage-backed, useSyncExternalStore)
    order.ts           Order read/write + WhatsApp helpers
    format.ts          Currency/number formatting
    types.ts           Shared types
scripts/
  generate-app-icons.sh  Regenerates the src/app app icons from the brand logo master
  export-design-tokens.mjs  Generates tokens.json from globals.css (@theme)
  subset-material-symbols.py
data_tmp/              Reference designs (not part of the build)
```

## Design fidelity notes

- Design tokens (colors, Inter type scale, radii, shadows, spacing) are ported from the
  designs' Tailwind CDN config into `src/app/globals.css` (`@theme`). A machine-readable
  copy is generated as `tokens.json` (`npm run tokens:export`, validated by
  `npm run tokens:check`).
- Product badges use a brand-aligned semantic palette (purple family + neutral ink; green
  is reserved for functional stock/status). See `DESIGN-SYSTEM.md` and `src/lib/badges.ts`.
- Images use `<Image unoptimized />`: the designs serve the original CDN URLs in a plain
  `<img>` and let the browser scale them. Disabling the optimizer is what makes the
  rendering match 1:1.
- Icons use **Material Symbols Outlined**, self-hosted with `next/font/local`, so no
  Google Fonts stylesheet can override Tailwind's layered `text-[Npx]` utilities.
- Verified against the reference screenshots at 390×844 @2x: all four screens match at
  ~0.01% pixel difference (sub-threshold anti-aliasing, no real divergent regions).
- App icons (`favicon.ico`, `icon.png`, `apple-icon.png`) are generated from
  `public/brand/pulse-havana-logo.webp` via `scripts/generate-app-icons.sh` (requires
  ImageMagick). Re-run it if the brand logo changes.

## Optional: visual verification against the designs

The reference screenshots live next to each design (`data_tmp/.../<n>.<screen>/screen.png`)
and the HTML sources are `<n>.<screen>/code.html`. A quick way to compare is to render the
built site with headless Chrome at the same size and diff the PNGs:

```bash
google-chrome --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=390,844 \
  --screenshot=/tmp/site.png http://localhost:3210/
```

## Tech stack

- Next.js 16 (App Router, Turbopack, `cacheComponents`, `partialPrefetching`)
- React 19, TypeScript
- Tailwind CSS v4 via `@tailwindcss/turbopack`
- `next/font` (Inter via Google, Material Symbols self-hosted)
