export type CategoryId =
  | "todos"
  | "telefonos"
  | "energia"
  | "accesorios"
  | "apple-iphone"
  | "samsung-galaxy"
  | "xiaomi"
  | "panel-solar"
  | "estacion-energia";

export interface Category {
  id: CategoryId;
  label: string;
  /** Material Symbol used as the category tile when it has no artwork. */
  icon?: string;
  /** Optional category artwork (remote URL). */
  image?: string;
}

/**
 * Tier 2 collection inside a category.
 * Mirrors `GET /categories/{slug}/subcategories/`.
 */
export interface Subcategory {
  name: string;
  slug: string;
  /** Products currently available in the collection. */
  count: number;
  /** Material Symbol used as the collection tile when it has no artwork. */
  icon: string;
  /** Optional collection artwork (remote URL). */
  image?: string;
}

export type BadgeKind = "success" | "primary" | "neutral";

export interface ProductBadge {
  label: string;
  kind: BadgeKind;
  /** Renders the small status dot before the label. */
  dot?: boolean;
  /** Optional Material Symbol rendered before the label. */
  icon?: string;
  /** Render the optional icon filled. */
  iconFilled?: boolean;
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface ProductStock {
  status: StockStatus;
  /** Human readable stock label, e.g. "En stock (3 unid.)". */
  label: string;
  units?: number;
}

export interface ProductColor {
  name: string;
  /** Swatch hex used by the selector pill. */
  hex: string;
}

export interface ProductStorage {
  label: string;
  price: number;
}

export interface ProductSpec {
  icon: string;
  label: string;
  title: string;
  subtitle: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  /** Optional caption overlaid on the carousel slide. */
  label?: string;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: CategoryId;
  /** Compact spec line shown on the catalog card, e.g. "256GB • Titanio". */
  shortSpec: string;
  /** Base price (first storage option). */
  price: number;
  /** Thumbnail / cart image. */
  image: string;
  stock: ProductStock;
  badge: ProductBadge;
  seriesTag: string;
  /** Condition label used in cart subtitles, e.g. "Libre de Fábrica". */
  condition: string;
  colorLabel: string;
  subcategory_name?: string;
  description: string;
  gallery: ProductImage[];
  colors: ProductColor[];
  storages: ProductStorage[];
  specs: ProductSpec[];
  /** Detail-page badges. */
  detailBadges: ProductBadge[];
  /** Included in the storefront grid. */
  featured: boolean;
}

export interface CartLine {
  /** Stable identity: `slug|storage|color`. */
  id: string;
  slug: string;
  name: string;
  /** Variant summary shown under the name, e.g. "Titanio Natural · Libre de Fábrica". */
  subtitle: string;
  unitPrice: number;
  qty: number;
  image: string;
}
