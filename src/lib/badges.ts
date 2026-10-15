import type { BadgeKind } from "./types";

/**
 * Badge color recipes, aligned with the Brand Book palette.
 *
 * The Brand Book restricts the identity to the purple family (Primary/Tertiary)
 * plus neutral ink ("purple and muted monochrome language"), so product badges
 * never introduce off-brand hues. Green stays reserved for functional stock
 * status, not for merchandising labels.
 *
 * - `success` → brand Primary  (default positive state, e.g. "Nuevo")
 * - `primary` → brand Tertiary (deeper violet for promotional emphasis)
 * - `neutral` → neutral ink    (grading / low-emphasis labels)
 */

/** Badge laid over product photography: translucent fill with white content. */
export function badgeOverlayTone(kind: BadgeKind): string {
  switch (kind) {
    case "success":
      return "bg-badge-new/90 text-white border border-white/20 shadow-sm backdrop-blur-sm";
    case "primary":
      return "bg-badge-promo/90 text-white border border-white/20 shadow-sm backdrop-blur-sm";
    default:
      return "bg-badge-neutral/75 text-white border border-white/15 shadow-sm backdrop-blur-sm";
  }
}

/** Badge on light surfaces (e.g. product detail): brand tint fill + colored text. */
export function badgeTintTone(kind: BadgeKind): string {
  switch (kind) {
    case "success":
      return "bg-badge-new/10 text-badge-new";
    case "primary":
      return "bg-badge-promo/10 text-badge-promo";
    default:
      return "bg-surface-container-highest text-ink-secondary";
  }
}
