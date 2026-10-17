"use client";

import { CollectionThumb } from "./CollectionThumb";
import type { Category } from "@/lib/types";

export interface CategoryRailProps {
  categories: Category[];
  activeCategory: Category["id"];
  onSelect: (categoryId: Category["id"]) => void;
}

/**
 * Tier 1 category rail — master half of the mobile/tablet catalog explorer.
 *
 * A fixed-width column of artwork tiles; the selected one borrows the white of
 * the detail panel (`rounded-l-2xl`) and gets the brand violet edge pill, so it
 * reads as connected to the panel it filters. Desktop renders `CategoryPills`
 * instead.
 *
 * The rail spans the full height of the explorer and scrolls on its own, so a
 * long list of categories never pushes the detail panel around.
 */
export function CategoryRail({ categories, activeCategory, onSelect }: CategoryRailProps) {
  return (
    <div
      role="group"
      aria-label="Categorías"
      className="w-[98px] shrink-0 bg-surface-muted flex flex-col items-center gap-1.5 py-2 overflow-y-auto"
    >
      {categories.map((category) => {
        const isActive = category.id === activeCategory;

        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={isActive}
            data-active={isActive}
            onClick={() => onSelect(category.id)}
            className={`group relative w-full flex flex-col items-center gap-1.5 py-3 px-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
              isActive
                ? "bg-surface-base rounded-l-2xl shadow-sm"
                : "rounded-xl hover:bg-surface-container/60"
            }`}
          >
            {/* Selection marker: violet pill anchored to the rail edge. */}
            {isActive ? (
              <span
                aria-hidden="true"
                className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary-container"
              />
            ) : null}
            <CollectionThumb
              image={category.image}
              icon={category.icon}
              className={`w-12 h-12 rounded-[12px] p-1 ${
                isActive
                  ? "bg-surface-muted"
                  : "bg-surface-base shadow-sm group-active:scale-95 transition-transform"
              }`}
            />
            <span
              className={`font-label-compact text-label-compact leading-tight px-1 ${
                isActive
                  ? "text-primary-container font-bold"
                  : "text-ink-secondary font-medium group-hover:text-ink-primary"
              }`}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
