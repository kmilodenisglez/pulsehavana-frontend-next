"use client";

import { useStoreFilters } from "@/lib/store-filters";
import { useStoreView } from "@/lib/store-view";
import { StoreCatalog } from "./StoreCatalog";
import { StoreCategories } from "./StoreCategories";
import { StoreHero } from "./StoreHero";
import { TrustCard } from "./TrustCard";

/**
 * Storefront home body: renders the mobile/tablet categories view and the shop,
 * so the hero, the catalog and the explorer always agree on the selection.
 *
 * The filters live in `useStoreFilters` because the bottom navigation changes
 * them too: "Inicio" clears them (the tab always lands on the whole catalog,
 * with the hero) and the catalog/explorer filter by category or collection.
 *
 * Below `lg` the "Categorías" item of the `BottomNav` swaps the shop for the
 * full-screen categories view (see `useStoreView`). Desktop ignores the view, so
 * both branches are always drawn there and the pills inside `StoreCatalog`
 * handle the two tiers.
 */
export function StoreFront() {
  const {
    activeCategory,
    activeSubcategory,
    isUnfiltered,
    selectCategory,
    selectSubcategory,
  } = useStoreFilters();
  const { view, setView } = useStoreView();
  const isCategoriesView = view === "categorias";

  function openSubcategory(slug: string) {
    selectSubcategory(slug);
    // Choosing a collection is choosing what to buy: leave the categories view
    // so the shop shows those products straight away. Drilling between parent
    // categories stays in the view (that is `selectCategory`), so browsing the
    // tree never bounces the shopper out.
    setView("inicio");
  }

  return (
    <>
      {/* Mobile & tablet only: the categories view takes over the screen (the
          header and the bottom navigation stay put). */}
      {isCategoriesView ? (
        <StoreCategories
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          onSelectCategory={selectCategory}
          onSelectSubcategory={openSubcategory}
        />
      ) : null}

      {/* Shop view. It stays mounted while the categories view is open — that
          keeps the scroll position and the already-loaded product imagery — but
          steps aside below `lg`, where the categories view owns the screen. */}
      <div className={`${isCategoriesView ? "hidden lg:flex" : "flex"} flex-col w-full`}>
        {/* The hero is the shop's home header: it only shows on the unfiltered
            catalog, so any category (parent or collection) takes it away and the
            products keep the screen. The categories view takes it away with the
            shop itself. */}
        {isUnfiltered ? <StoreHero /> : null}
        <StoreCatalog
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          onSelectCategory={selectCategory}
          onSelectSubcategory={openSubcategory}
        />
        <TrustCard />
      </div>
    </>
  );
}
