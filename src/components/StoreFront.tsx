"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";
import { StoreCatalog } from "./StoreCatalog";
import { StoreHero } from "./StoreHero";

// Initial active category ('todos' shows the full catalog).
const INITIAL_CATEGORY: Category["id"] = "todos";

/**
 * Storefront home body: owns the catalog filters so the hero and the catalog
 * always agree on the visible selection.
 */
export function StoreFront() {
  const [activeCategory, setActiveCategory] = useState<Category["id"]>(INITIAL_CATEGORY);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  function selectCategory(categoryId: Category["id"]) {
    setActiveCategory(categoryId);
    // Picking a parent category clears the subcategory filter, i.e. "all of
    // its subcategories". The hero therefore stays on screen until the shopper
    // drills into one specific subcategory (or taps the active pill again).
    setActiveSubcategory(null);
  }

  return (
    <>
      {/* The hero is storefront-level marketing: it steps aside once the shopper
          drills into a subcategory, leaving the catalog the whole screen. */}
      {activeSubcategory === null ? <StoreHero /> : null}
      <StoreCatalog
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onSelectCategory={selectCategory}
        onSelectSubcategory={setActiveSubcategory}
      />
    </>
  );
}
