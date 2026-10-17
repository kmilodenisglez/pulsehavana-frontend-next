"use client";

import Link from "next/link";
import { CollectionThumb } from "./CollectionThumb";
import { Icon } from "./Icon";
import { pluralize } from "@/lib/format";
import { catalogHref } from "@/lib/store-catalog";
import { setStoreView, useStoreView } from "@/lib/store-view";
import type { Category, Subcategory } from "@/lib/types";

/** `id` of the megamenu panel, referenced by its trigger's `aria-controls`. */
export const CATEGORY_MENU_ID = "categoryMenu";

export interface CategoryMenuProps {
  /** Category the panel belongs to — the pill the shopper clicked. */
  category: Category;
  /** Tier 2 collections of that category, straight from the tree. */
  collections: Subcategory[];
  /** Slug the URL filters by, so the current collection reads as selected. */
  activeSlug: string | null;
  /** Closes the panel without leaving the catalog. */
  onClose: () => void;
}

/**
 * Desktop megamenu: the Tier 2 collections of a category, as a grid of artwork
 * tiles with the name underneath.
 *
 * It unfolds directly below the navigation bar (`absolute top-full` of the
 * wrapper that holds both) and is anchored to the pill that opened it, so the
 * floating card lines up with the catalog chrome instead of the viewport.
 *
 * Content and URLs follow the same rule as every other catalog link: the grid is
 * the category tree the server sent with the page, so the panel opens with no
 * request; a collection tile lands on the shop (that is the click that changes
 * the catalog), and "Ver todo <category>" keeps the mobile/tablet view hash
 * exactly like the Tier 1 pills do.
 */
export function CategoryMenu({
  category,
  collections,
  activeSlug,
  onClose,
}: CategoryMenuProps) {
  const { view } = useStoreView();

  return (
    <div
      id={CATEGORY_MENU_ID}
      role="group"
      aria-label={`Subcategorías de ${category.label}`}
      className="absolute inset-x-0 top-full z-10 rounded-b-[24px] border-t border-border-hairline bg-surface-base shadow-2xl"
    >
      <div className="px-margin md:px-margin-desktop py-space-md">
        <div className="flex items-center justify-between gap-3 pb-space-sm">
          <div className="flex items-center gap-2 min-w-0">
            <Icon name={category.icon ?? "category"} className="text-[20px] text-primary-container" />
            <h2 className="font-headline text-[16px] font-bold tracking-tight text-ink-primary truncate">
              {category.label}
            </h2>
            <span className="shrink-0 px-2.5 py-1 rounded-full bg-primary-tint text-primary-container font-label-compact text-label-compact font-semibold">
              {collections.length} {pluralize(collections.length, "colección", "colecciones")}
            </span>
          </div>
          <Link
            href={catalogHref(category.id, view)}
            scroll={false}
            onClick={onClose}
            className="group flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-full bg-primary-tint text-primary-container font-label-compact text-label-compact font-semibold transition-colors hover:bg-primary-tint-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <span>Ver todo {category.label}</span>
            <Icon
              name="chevron_right"
              className="text-[16px] transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Real catalogs can carry more collections than a screen holds, so only
            the grid scrolls and the header (with its way out) stays put. */}
        <ul className="grid max-h-[60vh] grid-cols-4 gap-2 overflow-y-auto scrollbar-none">
          {collections.map((collection) => {
            const isActive = activeSlug === collection.slug;

            return (
              <li key={collection.slug}>
                <Link
                  href={catalogHref(collection.slug)}
                  scroll={false}
                  onClick={() => {
                    // Choosing a collection is choosing what to buy: the link
                    // lands on the shop, so the mobile/tablet view must not stay
                    // marked as the explorer (see DESIGN-SYSTEM §5).
                    setStoreView("inicio");
                    onClose();
                  }}
                  aria-current={isActive ? "page" : undefined}
                  data-active={isActive}
                  className={`group flex flex-col items-stretch gap-2 rounded-[18px] p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                    isActive
                      ? "bg-primary-tint ring-1 ring-inset ring-primary-container/25"
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <CollectionThumb
                    image={collection.image}
                    icon={collection.icon}
                    size={160}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    iconClassName="text-[40px] text-primary-container"
                    className="w-full aspect-[4/3] rounded-[14px] bg-surface-muted"
                  />
                  <span className="flex flex-col items-center gap-0.5 px-1 text-center">
                    <span
                      className={`font-callout text-sm font-semibold transition-colors ${
                        isActive
                          ? "text-primary-container"
                          : "text-ink-primary group-hover:text-primary-container"
                      }`}
                    >
                      {collection.name}
                    </span>
                    <span className="font-caption text-[12px] leading-tight text-ink-secondary">
                      {collection.count}{" "}
                      {pluralize(collection.count, "producto", "productos")}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
