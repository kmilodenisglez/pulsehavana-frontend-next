import { cacheLife, cacheTag } from "next/cache";
import { getMockCategories, getMockProducts, getMockSubcategories } from "./mockApi";
import {
  ALL_CATEGORIES,
  selectionLabel,
  type CatalogSelection,
  type StoreCatalogData,
} from "./store-catalog";
import type { Category } from "./types";

/**
 * Server-side access to the catalog: **the** query of the storefront.
 *
 * The selection lives in the URL (`?cat=<slug>`), so `getStoreCatalog(cat)` is
 * called once per distinct filter and the page is rendered — products included —
 * for that URL. That is what makes a shared link show the right catalog to its
 * recipient before any JavaScript runs, and it is why the client never fetches
 * products of its own.
 *
 * Caching: one entry per node (`cacheTag` + `categoryCacheTag`), so browsing back
 * and forth between categories is served from cache instead of hitting the
 * database again, and an Admin edit invalidates exactly what changed with
 * `revalidateTag(CATALOG_CACHE_TAG)`.
 *
 * Import this module only from Server Components (the store page does).
 *
 * Backend wiring: the two `mockApi` reads below are the seam. Replace them with
 * `GET /api/v1/categories/` and `GET /api/v1/products/?category=<slug>` when the
 * Django API answers; the shapes (`StoreCatalogData`) stay as they are. The
 * category list has to carry each category's collection count
 * (`Category.collectionCount`): the explorer captions and the megamenu trigger
 * both read it to know which categories have a Tier 2 level.
 */

/** Cache tag for `revalidateTag(CATALOG_CACHE_TAG)` when the catalog changes. */
export const CATALOG_CACHE_TAG = "store-catalog";

/** Per-node tag, so an edit only invalidates the categories it touched. */
export function categoryCacheTag(slug: string | null): string {
  return `category:${slug ?? ALL_CATEGORIES}`;
}

/**
 * Turn the URL's `?cat=` value into the selection the UI renders.
 *
 * A Tier 1 slug selects a whole category, a Tier 2 slug selects one collection
 * and its parent is looked up in the tree, and anything else (unknown slug,
 * empty value, someone editing the URL by hand) falls back to the whole catalog
 * instead of an error page: the link still works and shows something.
 */
function resolveSelection(slug: string | undefined, categories: Category[]): CatalogSelection {
  const category = slug
    ? categories.find((candidate) => candidate.id === slug && candidate.id !== ALL_CATEGORIES)
    : undefined;

  if (category) {
    return {
      slug: category.id,
      category,
      collection: null,
      label: selectionLabel(category, null),
    };
  }

  for (const parent of categories) {
    if (parent.id === ALL_CATEGORIES) continue;
    const collection = getMockSubcategories(parent.id).find((sub) => sub.slug === slug);
    if (collection) {
      return {
        slug: collection.slug,
        category: parent,
        collection,
        label: selectionLabel(parent, collection),
      };
    }
  }

  return { slug: null, category: null, collection: null, label: selectionLabel(null, null) };
}

/** Everything the storefront renders for `?cat=<slug>` (or the whole catalog). */
export async function getStoreCatalog(cat?: string): Promise<StoreCatalogData> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_CACHE_TAG, categoryCacheTag(cat ?? null));

  const categories = getMockCategories();
  const selection = resolveSelection(cat, categories);

  const products = getMockProducts({
    category_slug: selection.collection ? undefined : selection.category?.id,
    subcategory_slug: selection.collection?.slug,
  }).data;

  const collections = selection.category ? getMockSubcategories(selection.category.id) : [];

  return { categories, collections, products, selection };
}
