"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { CategoryMenu } from "./CategoryMenu";
import { CategoryPills } from "./CategoryPills";
import { ALL_CATEGORIES, type CatalogSelection } from "@/lib/store-catalog";
import type { Category, Subcategory } from "@/lib/types";

export interface DesktopCategoryNavProps {
  categories: Category[];
  /** Collections of the selected category — the megamenu's grid. */
  collections: Subcategory[];
  /** Selection of the current URL, resolved on the server. */
  selection: CatalogSelection;
}

/**
 * Desktop category navigation: the Tier 1 pill bar plus, for the pill that was
 * clicked, the Tier 2 megamenu that unfolds below it over a dimmed page.
 *
 * Opening the panel is deliberately free of catalog side effects: a pill whose
 * category the server has already resolved — the selected one, or the parent of
 * the selected collection, whose collections travel with the same payload —
 * opens without navigating at all, so browsing siblings never drops the filter
 * the shopper was looking at (and the panel can mark the collection they are in).
 * A pill for any other category still follows its link, which is what makes that
 * category's collections the panel's content: one `?cat=<slug>` query per
 * category change, exactly like a collection tile.
 *
 * The panel is transient presentation, not a second source of truth: it is keyed
 * to the URL selection, so it shows nothing until the clicked category's data
 * arrives, and a shared link never opens a menu nobody asked for.
 */
export function DesktopCategoryNav({
  categories,
  collections,
  selection,
}: DesktopCategoryNavProps) {
  /** Category the user opened, remembered until its data is the URL's. */
  const [openId, setOpenId] = useState<Category["id"] | null>(null);

  const activeCategoryId = selection.category?.id ?? ALL_CATEGORIES;
  const menuCategory =
    openId === activeCategoryId
      ? (categories.find((category) => category.id === openId) ?? null)
      : null;
  /** The selection must have landed *and* brought collections to show a panel. */
  const isMenuOpen = menuCategory !== null && collections.length > 0;
  const menuCategoryId = menuCategory?.id ?? null;

  // Escape closes the panel and hands focus back to the pill that opened it.
  useEffect(() => {
    if (!isMenuOpen || menuCategoryId === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenId(null);
      document.getElementById(`category-trigger-${menuCategoryId}`)?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen, menuCategoryId]);

  function handleTrigger(category: Category, event: MouseEvent<HTMLAnchorElement>) {
    // Second click on the open pill: fold the panel back up and stay where we are.
    if (openId === category.id) {
      event.preventDefault();
      setOpenId(null);
      return;
    }

    // The collections of this category are already in hand (it is the selection,
    // or the parent of the selected collection): open the panel without paying
    // for a navigation that would only move the shopper out of their filter.
    if (category.id === activeCategoryId) event.preventDefault();
    setOpenId(category.id);
  }

  return (
    <nav aria-label="Categorías" className="relative z-40 hidden w-full py-space-sm lg:block">
      {/* Interaction starts the moment the panel does: the backdrop sits above the
          page (which is what dims it) but below the navigation itself, so another
          category stays reachable while the menu is open. */}
      {isMenuOpen ? (
        <button
          type="button"
          aria-label="Cerrar el menú de categorías"
          onClick={() => setOpenId(null)}
          className="fixed inset-0 z-0 cursor-default bg-scrim focus-visible:outline-none"
        />
      ) : null}

      {/* One containing block for the bar and the panel, so the panel's
          `top-full` is the bar's bottom edge and the two read as a single card. */}
      <div className="relative">
        <div className={`relative z-10 ${isMenuOpen ? "rounded-t-[24px] bg-surface-base" : ""}`}>
          <CategoryPills
            categories={categories}
            activeCategory={activeCategoryId}
            openCategory={menuCategoryId}
            onTrigger={handleTrigger}
          />
        </div>

        {isMenuOpen && menuCategory ? (
          <CategoryMenu
            category={menuCategory}
            collections={collections}
            activeSlug={selection.slug}
            onClose={() => setOpenId(null)}
          />
        ) : null}
      </div>
    </nav>
  );
}
