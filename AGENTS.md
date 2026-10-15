<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Brand & design tokens (MUST follow)

Styling rules for this storefront are defined in [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md).
The authoritative color/radius/spacing values are the tokens in `src/app/globals.css`.

- **Tokens only.** Never hardcode hex values or raw Tailwind palette classes
  (`bg-emerald-500`, `text-violet-500`, `bg-slate-900`, …). Use the semantic
  tokens from `globals.css`.
- **One identity: purple + neutral monochrome.** Product badges (Nuevo, Oferta,
  Pro, …) MUST stay in the purple family. Render them with the helpers in
  `src/lib/badges.ts` (`badgeOverlayTone`, `badgeTintTone`) — not inline colors.
- **Green is functional, never decorative.** `--color-status-success` (`#047857`)
  is for stock/status only (in-stock chip, success confirmations). It MUST NOT be
  used on merchandising/product badges.
- If a token is missing, add it to `globals.css` (`@theme`) per
  `DESIGN-SYSTEM.md` §4 instead of hardcoding a color.
