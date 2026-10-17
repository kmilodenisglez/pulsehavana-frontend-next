import { z } from "zod";

/**
 * Public business configuration of the storefront.
 *
 * Values are resolved with a single precedence chain so the same number/name is
 * never duplicated across components:
 *
 *   1. API — `GET {API_BASE_URL}/config/` reads the Django `StoreSettings`
 *      singleton, editable from the Admin.
 *   2. Environment — the same variable names the backend uses
 *      (`BUSINESS_WHATSAPP`, ...).
 *   3. `defaultStoreConfig` — last-resort values so the UI never renders an
 *      empty phone number or a broken link.
 */

/** `data` object returned by `GET /api/v1/config/` (DRF snake_case payload). */
export const StoreConfigPayloadSchema = z.object({
  whatsapp_number: z.string().optional(),
  store_name: z.string().optional(),
  store_address: z.string().optional(),
  store_hours: z.string().optional(),
  currency: z.string().optional(),
});

export type StoreConfigPayload = z.infer<typeof StoreConfigPayloadSchema>;

/** Storefront-facing configuration (camelCase domain shape). */
export interface StoreConfig {
  /** Business WhatsApp number in international format, e.g. `+5359352209`. */
  whatsappNumber: string;
  storeName: string;
  storeAddress: string;
  storeHours: string;
  currency: string;
}

/**
 * Last-resort values, used only when neither the API nor the environment
 * provides one. `BUSINESS_WHATSAPP`, `STORE_NAME`, `STORE_ADDRESS`,
 * `STORE_HOURS` and `DEFAULT_CURRENCY` mirror the backend settings names.
 */
export const defaultStoreConfig: StoreConfig = {
  whatsappNumber: process.env.BUSINESS_WHATSAPP ?? "+5359352209",
  storeName: process.env.STORE_NAME ?? "Pulse Havana Center Cell",
  storeAddress: process.env.STORE_ADDRESS ?? "Calle 23 esq. L, Vedado, La Habana",
  storeHours: process.env.STORE_HOURS ?? "Lun-Sáb 10:00-19:00",
  currency: process.env.DEFAULT_CURRENCY ?? "USD",
};

/** Treats blank/whitespace-only values as "not configured" so the next fallback applies. */
function configured(value: string | undefined): string | undefined {
  return value !== undefined && value.trim() !== "" ? value : undefined;
}

/**
 * Merges an API payload (`undefined` when the backend is unreachable) with the
 * environment and code defaults, so every field always has a usable value.
 */
export function resolveStoreConfig(payload: StoreConfigPayload = {}): StoreConfig {
  return {
    whatsappNumber: configured(payload.whatsapp_number) ?? defaultStoreConfig.whatsappNumber,
    storeName: configured(payload.store_name) ?? defaultStoreConfig.storeName,
    storeAddress: configured(payload.store_address) ?? defaultStoreConfig.storeAddress,
    storeHours: configured(payload.store_hours) ?? defaultStoreConfig.storeHours,
    currency: configured(payload.currency) ?? defaultStoreConfig.currency,
  };
}
