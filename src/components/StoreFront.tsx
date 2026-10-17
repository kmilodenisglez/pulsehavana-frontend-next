"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";
import { useStoreView } from "@/lib/store-view";
import { StoreCatalog } from "./StoreCatalog";
import { StoreCategories } from "./StoreCategories";
import { StoreHero } from "./StoreHero";
import { TrustCard } from "./TrustCard";

// Initial active category ('todos' shows the full catalog).
const INITIAL_CATEGORY: Category["id"] = "todos";

/**
 * Storefront home body: owns the catalog filters and the mobile/tablet view, so
 * the hero, the catalog and the categories view always agree on the selection.
 *
 * Below `lg` the "Categorías" item of the `BottomNav` swaps the shop for the
 * full-screen categories view and "Inicio" brings the shop back without any
 * category chrome (see `useStoreView`). Desktop ignores the view, so both
 * branches are always drawn there and the pills inside `StoreCatalog` handle
 * the two tiers.
 */
export function StoreFront() {
  const [activeCategory, setActiveCategory] = useState<Category["id"]>(INITIAL_CATEGORY);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const { view, setView } = useStoreView();
  const isCategoriesView = view === "categorias";

  function selectCategory(categoryId: Category["id"]) {
    setActiveCategory(categoryId);
    // Picking a parent category clears the subcategory filter, i.e. "all of
    // its subcategories". The hero therefore stays on screen until the shopper
    // drills into one specific subcategory (or taps the active pill again).
    setActiveSubcategory(null);
  }

  function selectSubcategory(slug: string) {
    setActiveSubcategory(slug);
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
          onSelectSubcategory={selectSubcategory}
        />
      ) : null}

      {/* Shop view. It stays mounted while the categories view is open — that
          keeps the scroll position and the already-loaded product imagery — but
          steps aside below `lg`, where the categories view owns the screen. */}
      <div className={`${isCategoriesView ? "hidden lg:flex" : "flex"} flex-col w-full`}>
        {/* The hero is storefront-level marketing: it steps aside once the
            shopper drills into a subcategory, leaving the catalog the whole
            screen. */}
        {activeSubcategory === null ? <StoreHero /> : null}
        <StoreCatalog
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          onSelectCategory={selectCategory}
          onSelectSubcategory={selectSubcategory}
        />
        <TrustCard />
      </div>
    </>
  );
}
