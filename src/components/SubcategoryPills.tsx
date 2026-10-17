"use client";

import Link from "next/link";
import { Icon } from "./Icon";
import { PillScroller } from "./PillScroller";
import { pluralize } from "@/lib/format";
import { catalogHref } from "@/lib/store-catalog";
import { useStoreView } from "@/lib/store-view";
import type { Subcategory } from "@/lib/types";

export interface SubcategoryPillsProps {
  /** Name of the selected parent category, shown in the card header. */
  parentLabel: string;
  subcategories: Subcategory[];
  activeSubcategory: string | null;
}

/**
 * Tier 2 subcategory pills — desktop variant of the catalog filter, grouped
 * inside a card so the two levels stay visually distinct. Each pill links to
 * that collection's `?cat=<slug>` URL, so the whole filter is shareable.
 */
export function SubcategoryPills({
  parentLabel,
  subcategories,
  activeSubcategory,
}: SubcategoryPillsProps) {
  const { view } = useStoreView();

  return (
    <div className="bg-surface-container-low/70 border border-border-hairline rounded-[20px] p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name={"account_tree"} className="text-[16px] text-primary-container" />
          <span className="font-label-compact text-[11px] text-ink-primary font-bold uppercase tracking-wider">
            Subcategorías de
            <span className="ml-1 text-primary-container" id="currentParentLabel">
              {parentLabel}
            </span>
          </span>
        </div>
        <span
          className="font-label-compact text-[11px] text-ink-secondary font-medium"
          id="subcategorySummary"
        >
          {subcategories.length} {pluralize(subcategories.length, "subcategoría", "subcategorías")}
        </span>
      </div>
      <PillScroller
        activeKey={activeSubcategory}
        id="subcategoriesContainer"
        className="flex items-center gap-2 overflow-x-auto scrollbar-none no-scrollbar py-0.5"
      >
        {subcategories.map((sub) => {
          const isActive = activeSubcategory === sub.slug;
          const pillClass = isActive
            ? "subcat-pill active flex items-center gap-2 h-9 px-3 rounded-full bg-primary-container text-on-primary font-callout text-xs font-semibold whitespace-nowrap shadow-sm active:scale-[0.97] transition-all"
            : "subcat-pill flex items-center gap-2 h-9 px-3 rounded-full bg-surface-base border border-border-hairline text-ink-primary font-callout text-xs font-semibold whitespace-nowrap active:scale-[0.97] transition-all";

          return (
            <Link
              key={sub.slug}
              href={catalogHref(sub.slug, view)}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              data-active={isActive}
              className={pillClass}
            >
              <Icon
                name={sub.icon}
                className={isActive ? "text-[16px] text-on-primary" : "text-[16px] text-ink-secondary"}
              />
              <span>{sub.name}</span>
              <span
                className={
                  isActive
                    ? "px-1.5 py-0.2 bg-white/20 rounded-full font-label-compact text-[10px] leading-tight font-bold text-on-primary"
                    : "px-1.5 py-0.2 bg-surface-container-high text-ink-secondary rounded-full font-label-compact text-[10px] leading-tight font-bold"
                }
              >
                {sub.count} disp.
              </span>
            </Link>
          );
        })}
      </PillScroller>
    </div>
  );
}
