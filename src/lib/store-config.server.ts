import { cacheLife, cacheTag } from "next/cache";
import {
  resolveStoreConfig,
  StoreConfigPayloadSchema,
  type StoreConfig,
  type StoreConfigPayload,
} from "./store-config";

/**
 * Server-side access to the store configuration.
 *
 * Import this module only from Server Components (the root layout does): it is
 * the only place that knows the backend URL and the cache policy.
 */

/** Cache tag for `revalidateTag(STORE_CONFIG_CACHE_TAG)` once the Admin edits settings. */
export const STORE_CONFIG_CACHE_TAG = "store-config";

const CONFIG_PATH = "/config/";

/** Keeps the storefront rendering fast when the backend is slow or unreachable. */
const CONFIG_REQUEST_TIMEOUT_MS = 3000;

/**
 * Base URL of the Django API.
 *
 * Server-only runtime configuration on purpose: the container unit passes it as
 * an environment variable, so pointing the storefront at another backend never
 * requires rebuilding the client bundle. Public `NEXT_PUBLIC_*` values would be
 * baked at build time instead.
 */
function storeApiBaseUrl(): string {
  return (process.env.API_BASE_URL ?? "http://localhost:8000/api/v1").replace(/\/+$/, "");
}

/**
 * Reads `GET /api/v1/config/` and validates its contract.
 * Returns `undefined` for every failure mode (unreachable, timeout, HTTP error,
 * invalid JSON or unexpected shape) so callers can fall back gracefully.
 */
async function fetchStoreConfigPayload(): Promise<StoreConfigPayload | undefined> {
  try {
    const response = await fetch(`${storeApiBaseUrl()}${CONFIG_PATH}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(CONFIG_REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return undefined;

    const body: unknown = await response.json();
    const parsed = StoreConfigPayloadSchema.safeParse(
      (body as { data?: unknown } | null)?.data,
    );
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Public business configuration shared by the whole storefront.
 *
 * The API is the source of truth; when it is unreachable the environment
 * variables (and finally the code defaults) keep the app working. The result is
 * cached for a minute, which is short enough for Admin edits to show up quickly.
 */
export async function getStoreConfig(): Promise<StoreConfig> {
  "use cache";
  cacheLife("minutes");
  cacheTag(STORE_CONFIG_CACHE_TAG);

  return resolveStoreConfig(await fetchStoreConfigPayload());
}
