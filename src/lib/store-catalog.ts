import type { Category, Product, Subcategory } from "./types";
import type { StoreView } from "./store-view";

/**
 * Catalog data shared by the server and the client, and the URL contract that
 * carries the selection.
 *
 * The filter is **one** node, not a parent + a collection pair: the backend
 * models categories as a single hierarchical tree (`GET /products/?category=<slug>`
 * accepts a parent or one of its collections, see SPEC_BACKEND_DJANGO §4.2), so
 * the parent of a collection is always derivable and never duplicated in the URL.
 * One node also means one shareable link — `/?cat=samsung-galaxy` — and one query
 * for the server to run.
 */

/** Tier 1 sentinel id (and the "no filter" spelling) for the whole catalog. */
export const ALL_CATEGORIES: Category["id"] = "todos";

/** Query parameter carrying the selection, e.g. `/?cat=samsung-galaxy`. */
export const CATEGORY_PARAM = "cat";

export interface CatalogSelection {
  /** Slug the URL filters by, or `null` for the whole catalog. */
  slug: string | null;
  /** Tier 1 category the selection belongs to (`null` while unfiltered). */
  category: Category | null;
  /** Tier 2 collection, when the selection is one (`null` otherwise). */
  collection: Subcategory | null;
  /** Ready-to-render path, e.g. `"Teléfonos → Samsung"` or `"Todos"`. */
  label: string;
}

/** Everything the storefront renders for one URL, resolved on the server. */
export interface StoreCatalogData {
  /** Tier 1 categories, `Todos` first. */
  categories: Category[];
  /** Tier 2 collections of the selected category (empty while unfiltered). */
  collections: Subcategory[];
  products: Product[];
  selection: CatalogSelection;
}

/**
 * Path of the catalog filtered by `node` — the storefront's shareable state.
 *
 * `?cat=<slug>` is the API's own filter, so the URL, the query and the link
 * someone copies all speak the same language, and the product grid a recipient
 * opens is the one the sender was looking at. `view` keeps the mobile/tablet
 * categories view (`#categorias`) attached to the link; desktop ignores it.
 */
export function catalogHref(node: string | null, view: StoreView = "inicio"): string {
  const slug = node && node !== ALL_CATEGORIES ? node : null;
  const query = slug ? `?${CATEGORY_PARAM}=${encodeURIComponent(slug)}` : "";
  const hash = view === "categorias" ? "#categorias" : "";
  return `/${query}${hash}`;
}

/** Path shown in the filter bar: `"Teléfonos → Samsung"`, or the root label. */
export function selectionLabel(category: Category | null, collection: Subcategory | null): string {
  if (collection && category) return `${category.label} → ${collection.name}`;
  if (category) return category.label;
  return "Todos";
}
