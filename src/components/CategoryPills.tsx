"use client";

import Link from "next/link";
import { PillScroller } from "./PillScroller";
import { catalogHref } from "@/lib/store-catalog";
import { useStoreView } from "@/lib/store-view";
import type { Category } from "@/lib/types";

export interface CategoryPillsProps {
  categories: Category[];
  activeCategory: Category["id"];
}

/**
 * Tier 1 category pills — desktop variant of the catalog filter.
 *
 * Horizontally scrollable, keeps the selected pill centered, and each pill links
 * to `?cat=<slug>`: the filter is the URL, so it can be copied, shared and
 * prefetched, and the product grid always matches the address bar.
 */
export function CategoryPills({ categories, activeCategory }: CategoryPillsProps) {
  const { view } = useStoreView();

  return (
    <PillScroller
      activeKey={activeCategory}
      className="flex items-center gap-2 overflow-x-auto px-margin md:px-margin-desktop scrollbar-none no-scrollbar py-0.5"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <Link
            key={category.id}
            href={catalogHref(category.id, view)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            data-active={isActive}
            className={`flex items-center justify-center h-10 px-5 rounded-full font-callout text-sm font-semibold whitespace-nowrap active:scale-[0.97] transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
              isActive
                ? "bg-primary-container text-on-primary shadow-sm"
                : "bg-surface-container-high text-ink-secondary"
            }`}
          >
            {category.label}
          </Link>
        );
      })}
    </PillScroller>
  );
}
