"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { CategoryMenu } from "./CategoryMenu";
import { CategoryPills } from "./CategoryPills";
import { ALL_CATEGORIES, type CatalogSelection } from "@/lib/store-catalog";
import type { Category } from "@/lib/types";

export interface DesktopCategoryNavProps {
  /** Category tree, each Tier 1 node carrying its Tier 2 collections. */
  categories: Category[];
  /** Selection of the current URL, resolved on the server. */
  selection: CatalogSelection;
}

/**
 * Desktop category navigation: the Tier 1 pill bar plus, for the pill that was
 * clicked, the Tier 2 megamenu that unfolds below it over a dimmed page.
 *
 * On desktop a category pill never filters: it only unfolds that category's
 * collections, and the catalog changes when the shopper clicks a collection (or
 * "Ver todo <category>" inside the panel). That is why the panel can open
 * instantly and for *any* category — the tree travels with the page
 * (`Category.collections`) — and why switching categories never re-folds the
 * panel: there is no navigation in flight for it to wait on.
 *
 * The panel is transient presentation, not a second source of truth: it is open
 * state only, the products behind it stay whatever the URL says, and a shared
 * link never opens a menu nobody asked for.
 */
export function DesktopCategoryNav({ categories, selection }: DesktopCategoryNavProps) {
  /** Category whose panel is open (`null` while none is). */
  const [openId, setOpenId] = useState<Category["id"] | null>(null);

  const activeCategoryId = selection.category?.id ?? ALL_CATEGORIES;
  const menuCategory = openId
    ? (categories.find((category) => category.id === openId) ?? null)
    : null;
  /** No collections means nothing to unfold, so the pill stays a plain link. */
  const isMenuOpen = menuCategory !== null && menuCategory.collections.length > 0;
  const menuCategoryId = isMenuOpen && menuCategory ? menuCategory.id : null;

  // Escape closes the panel and hands focus back to the pill that opened it.
  useEffect(() => {
    if (menuCategoryId === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenId(null);
      document.getElementById(`category-trigger-${menuCategoryId}`)?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuCategoryId]);

  function handleTrigger(category: Category, event: MouseEvent<HTMLAnchorElement>) {
    // Modified clicks keep the link's own behaviour (the href is the category's
    // shareable URL, e.g. "open in a new tab" keeps working).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    // A category with nothing to unfold (`Todos`) stays a plain filter link, but
    // picking it still dismisses an open panel: the bar and the overlay must
    // never show two different categories.
    if (category.collections.length === 0) {
      setOpenId(null);
      return;
    }

    // Left click is only ever "show me this category's collections": filtering
    // is the collection's job, so the pill never lands on products on its own.
    event.preventDefault();
    setOpenId((previous) => (previous === category.id ? null : category.id));
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
            collections={menuCategory.collections}
            activeSlug={selection.slug}
            onClose={() => setOpenId(null)}
          />
        ) : null}
      </div>
    </nav>
  );
}
