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
   * Runs on click for the pills that own a megamenu. The nav decides between
   * opening the panel and navigating (`preventDefault` when the catalog on
   * screen already is the pill's).
   */
  onTrigger: (category: Category, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Tier 1 category pills — the desktop navigation bar and megamenu trigger.
 *
 * Horizontally scrollable, keeps the selected pill centered, and each pill links
 * to `?cat=<slug>`: the filter is the URL, so it can be copied, shared and
 * prefetched, and the product grid always matches the address bar.
 *
 * A pill whose category has collections is also the trigger of that category's
 * megamenu (see `CategoryMenu`); the click still follows the link, which is what
 * makes the panel list the collections of the catalog on screen.
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
        const hasMenu = (category.collectionCount ?? 0) > 0;
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
            onClick={hasMenu ? (event) => onTrigger(category, event) : undefined}
            className={`flex items-center justify-center gap-1.5 h-10 px-5 rounded-full font-callout text-sm font-semibold whitespace-nowrap active:scale-[0.97] transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
              isActive
                ? "bg-primary-container text-on-primary shadow-sm"
                : "bg-surface-container-high text-ink-secondary"
            }`}
          >
            {category.label}
            {hasMenu ? (
              /* The curated icon subset has no `expand_more`, so the right
                 chevron is turned a quarter turn to point at the panel. */
              <Icon
                name="chevron_right"
                className={`text-[18px] transition-transform duration-200 ${
                  isOpen ? "-rotate-90" : "rotate-90"
                }`}
              />
            ) : null}
          </Link>
        );
      })}
    </PillScroller>
  );
}
