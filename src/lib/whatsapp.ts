/**
 * WhatsApp deep-link helpers.
 *
 * The business number is never hardcoded here: it comes from the store
 * configuration (`GET /api/v1/config/`, see `src/lib/store-config.ts`) and this
 * module only normalizes it into the digits-only format `wa.me` expects.
 */

/** Strips every non-digit character so the number can be embedded in a `wa.me` URL. */
export function toWhatsAppDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Builds a `https://wa.me/<number>` deep link.
 * When `message` is provided it is URL-encoded as the prefilled chat text.
 */
export function buildWhatsAppLink(phone: string, message?: string): string {
  const link = `https://wa.me/${toWhatsAppDigits(phone)}`;
  return message ? `${link}?text=${encodeURIComponent(message)}` : link;
}
