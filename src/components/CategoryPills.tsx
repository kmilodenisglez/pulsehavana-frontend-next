"use client";

import Link from "next/link";
import { CATEGORY_MENU_ID } from "./CategoryMenu";
import { Icon } from "./Icon";
import { PillScroller } from "./PillScroller";
import { catalogHref } from "@/lib/store-catalog";
import { useStoreView } from "@/lib/store-view";
import type { Category } from "@/lib/types";

export interface CategoryPillsProps {
  categories: Category[];
  /** Tier 1 category the URL selection belongs to (or `Todos`). */
  activeCategory: Category["id"];
  /** Category whose megamenu is open, so its trigger can announce the state. */
  openCategory: Category["id"] | null;
  /**
   * Runs on click for every pill: the nav unfolds or folds that category's
   * collections (a category pill never filters on its own) and dismisses the
   * panel when the pill has nothing to unfold.
   */
  onTrigger: (category: Category, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Tier 1 category pills — the desktop navigation bar and megamenu trigger.
 *
 * Horizontally scrollable and keeps the selected pill centered. Every pill is
 * still a `<Link>` to `?cat=<slug>` — the category's own shareable URL, prefetched
 * and openable in a new tab — but a plain left click unfolds that category's
 * collections instead of filtering: on desktop the catalog changes when a
 * collection is picked (see `DesktopCategoryNav`), so the products on screen
 * never jump the moment a category is explored. `Todos` has no collections and
 * keeps working as the plain filter link it is.
 */
export function CategoryPills({
  categories,
  activeCategory,
  openCategory,
  onTrigger,
}: CategoryPillsProps) {
  const { view } = useStoreView();

  return (
    <PillScroller
      activeKey={activeCategory}
      className="flex items-center gap-2 overflow-x-auto px-margin md:px-margin-desktop scrollbar-none no-scrollbar py-0.5"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        const hasMenu = category.collections.length > 0;
        const isOpen = hasMenu && openCategory === category.id;

        return (
          <Link
            key={category.id}
            href={catalogHref(category.id, view)}
            scroll={false}
            id={`category-trigger-${category.id}`}
            aria-current={isActive ? "page" : undefined}
            aria-haspopup={hasMenu ? "true" : undefined}
            aria-expanded={hasMenu ? isOpen : undefined}
            aria-controls={isOpen ? CATEGORY_MENU_ID : undefined}
            data-active={isActive}
            onClick={(event) => onTrigger(category, event)}
            className={`flex items-center justify-center gap-1.5 h-10 px-5 rounded-full font-callout text-sm font-semibold whitespace-nowrap active:scale-[0.97] transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
              isActive
                ? "bg-primary-container text-on-primary shadow-sm"
                : "bg-surface-container-high text-ink-secondary"
            }`}
          >
            {category.label}
            {hasMenu ? (
              <Icon
                name="expand_more"
                className={`text-[18px] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            ) : null}
          </Link>
        );
      })}
    </PillScroller>
  );
}
