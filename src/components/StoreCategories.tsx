"use client";

import { useMemo } from "react";
import { CategoryRail } from "./CategoryRail";
import { CollectionExplorer, type CollectionItem } from "./CollectionExplorer";
import { pluralize } from "@/lib/format";
import { getMockCategories, getMockSubcategories } from "@/lib/mockApi";
import type { Category } from "@/lib/types";

export interface StoreCategoriesProps {
  activeCategory: Category["id"];
  activeSubcategory: string | null;
  onSelectCategory: (categoryId: Category["id"]) => void;
  onSelectSubcategory: (slug: string) => void;
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
 */
export function StoreCategories({
  activeCategory,
  activeSubcategory,
  onSelectCategory,
  onSelectSubcategory,
}: StoreCategoriesProps) {
  // The mock data layer is synchronous, so every derived value is computed
  // during render. Keeping this out of effects means the server and client
  // render identical markup (no hydration mismatch, no empty-state flash).
  const categories = useMemo(() => getMockCategories(), []);

  const subcategories = useMemo(
    () => (activeCategory === "todos" ? [] : getMockSubcategories(activeCategory)),
    [activeCategory],
  );

  const isAllCategories = activeCategory === "todos";
  const parentLabel =
    categories.find((category) => category.id === activeCategory)?.label ?? activeCategory;

  /*
    Tier 2 rows. While "Todos" is selected there is no parent to drill into, so
    the panel lists the parent categories themselves and doubles as an index of
    every collection in the store.
  */
  const rows: CollectionItem[] = isAllCategories
    ? categories
        .filter((category) => category.id !== "todos")
        .map((category) => {
          const count = getMockSubcategories(category.id).length;
          return {
            key: category.id,
            title: category.label,
            caption: `${count} ${pluralize(count, "colección", "colecciones")}`,
            icon: category.icon,
            image: category.image,
            isActive: false,
            onSelect: () => onSelectCategory(category.id),
          };
        })
    : subcategories.map((sub) => ({
        key: sub.slug,
        title: sub.name,
        caption: `${sub.count} ${pluralize(sub.count, "producto", "productos")}`,
        icon: sub.icon,
        image: sub.image,
        isActive: activeSubcategory === sub.slug,
        onSelect: () => onSelectSubcategory(sub.slug),
      }));

  const title = isAllCategories ? "Todo el catálogo" : parentLabel;
  const countLabel = isAllCategories
    ? `${rows.length} ${pluralize(rows.length, "categoría", "categorías")}`
    : `${subcategories.length} ${pluralize(subcategories.length, "colección", "colecciones")}`;

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
        activeCategory={activeCategory}
        onSelect={onSelectCategory}
      />
      <CollectionExplorer title={title} countLabel={countLabel} items={rows} />
    </section>
  );
}
