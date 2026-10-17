"use client";

import { PillScroller } from "./PillScroller";
import type { Category } from "@/lib/types";

export interface CategoryPillsProps {
  categories: Category[];
  activeCategory: Category["id"];
  onSelect: (categoryId: Category["id"]) => void;
}

/**
 * Tier 1 category pills — desktop variant of the catalog filter.
 * Horizontally scrollable and keeps the selected pill centered.
 */
export function CategoryPills({ categories, activeCategory, onSelect }: CategoryPillsProps) {
  return (
    <PillScroller
      activeKey={activeCategory}
      className="flex items-center gap-2 overflow-x-auto px-margin md:px-margin-desktop scrollbar-none no-scrollbar py-0.5"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={isActive}
            data-active={isActive}
            onClick={() => onSelect(category.id)}
            className={`flex items-center justify-center h-10 px-5 rounded-full font-callout text-sm font-semibold whitespace-nowrap active:scale-[0.97] transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
              isActive
                ? "bg-primary-container text-on-primary shadow-sm"
                : "bg-surface-container-high text-ink-secondary"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </PillScroller>
  );
}
