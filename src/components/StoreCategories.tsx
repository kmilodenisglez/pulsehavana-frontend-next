"use client";

import { CategoryRail } from "./CategoryRail";
import { CollectionExplorer, type CollectionItem } from "./CollectionExplorer";
import { pluralize } from "@/lib/format";
import { ALL_CATEGORIES, catalogHref, type StoreCatalogData } from "@/lib/store-catalog";
import { useStoreView } from "@/lib/store-view";

export interface StoreCategoriesProps {
  /** Catalog of the current URL, resolved on the server. */
  data: StoreCatalogData;
}

/**
 * Categories view for mobile & tablet: the master-detail explorer filling the
 * screen between the header and the bottom navigation.
 *
 * It is a view of its own — opened from the "Categorías" item of the
 * `BottomNav` (see `useStoreView`) — so at these widths the shop itself stays
 * free of category chrome. Desktop ignores the view: from `lg` up the pills in
 * `StoreCatalog` cover both tiers inline.
 *
 * The rail and the panel scroll independently (`min-h-0` + `overflow-y-auto`),
 * which is what keeps the rail on screen while a long list of collections
 * scrolls next to it.
 *
 * Browsing the tree and filtering the shop are the same action: the rail and the
 * index rows link to `?cat=<slug>` with the view kept (the explorer stays), while
 * a collection row lands on the shop, so the address bar always holds the
 * category the shopper is looking at.
 */
export function StoreCategories({ data }: StoreCategoriesProps) {
  const { view, setView } = useStoreView();
  const { categories, selection } = data;
  /** Tier 2 collections of the selected category, straight from the tree. */
  const collections = selection.category?.collections ?? [];

  const isAllCategories = selection.slug === null;
  const parentLabel = selection.category?.label ?? "";

  /*
    Tier 2 rows. While "Todos" is selected there is no parent to drill into, so
    the panel lists the parent categories themselves and doubles as an index of
    every collection in the store.
  */
  const rows: CollectionItem[] = isAllCategories
    ? categories
        .filter((category) => category.id !== ALL_CATEGORIES)
        .map((category) => {
          const count = category.collections.length;
          return {
            key: category.id,
            title: category.label,
            caption: `${count} ${pluralize(count, "colección", "colecciones")}`,
            icon: category.icon,
            image: category.image,
            isActive: false,
            href: catalogHref(category.id, view),
          };
        })
    : collections.map((sub) => ({
        key: sub.slug,
        title: sub.name,
        caption: `${sub.count} ${pluralize(sub.count, "producto", "productos")}`,
        icon: sub.icon,
        image: sub.image,
        isActive: selection.collection?.slug === sub.slug,
        // Choosing a collection is choosing what to buy, so the link lands on the
        // shop (no view hash) and closes the explorer right away with the view
        // store: the router's own URL update happens outside React's render, so
        // dropping the hash cannot close the view on its own.
        href: catalogHref(sub.slug),
        onSelect: () => setView("inicio"),
      }));

  const title = isAllCategories ? "Todo el catálogo" : parentLabel;
  const countLabel = isAllCategories
    ? `${rows.length} ${pluralize(rows.length, "categoría", "categorías")}`
    : `${collections.length} ${pluralize(collections.length, "colección", "colecciones")}`;

  return (
    <section
      id="categorias"
      aria-label="Categorías y colecciones"
      /* Screen-filling view: the height is explicit because neither `flex-1`
         (a `0%` basis resolves as content when the parent's height is
         indefinite) nor `min-h-0` on its own can bound how much the rail
         contributes. `100dvh - 10rem` is the page's own header/link padding
         (`pt-16` + `pb-24`), so the view lands exactly between them.
         Grid, not a flex row, keeps the rail at its 98px and lets both halves
         scroll inside the bounded height instead of growing the page. */
      className="lg:hidden grid grid-cols-[98px_minmax(0,1fr)] grid-rows-[minmax(0,1fr)] h-[calc(100dvh-10rem)] w-full bg-surface-base"
    >
      <CategoryRail
        categories={categories}
        activeCategory={selection.category?.id ?? ALL_CATEGORIES}
      />
      <CollectionExplorer title={title} countLabel={countLabel} items={rows} />
    </section>
  );
}
