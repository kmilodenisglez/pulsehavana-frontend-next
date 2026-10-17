"use client";

import { DesktopCategoryNav } from "./DesktopCategoryNav";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";
import { type StoreCatalogData } from "@/lib/store-catalog";

export interface StoreCatalogProps {
  /** Catalog of the current URL: the filter never becomes component state. */
  data: StoreCatalogData;
}

// The selection lives in the URL and is resolved by the server; the catalog only
// renders it. Picking a category is a navigation (the pills and the megamenu are
// links), so the grid always shows the products of the URL on screen.
//
// Category chrome here is desktop-only: from `lg` up the Tier 1 pills open a
// megamenu with the Tier 2 collections (`DesktopCategoryNav`). Below `lg` the
// categories are a view of their own (`StoreCategories`), opened from the bottom
// navigation, so the shop itself renders without them at those widths.
export function StoreCatalog({ data }: StoreCatalogProps) {
  const { categories, products, selection } = data;

  return (
    <>
      {/* Tier 1 + Tier 2: category bar and megamenu (desktop only) */}
      <DesktopCategoryNav categories={categories} selection={selection} />

      {/* Context & quick-filter bar (ProductFilterSet) */}
      <section className="px-margin pt-space-sm pb-1">
        {/* Phones stack the quick filters under the breadcrumb: on one row they
            took the width the context needs, which truncated it to
            "Teléfonos → Sam…" and left the filter unreadable. */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-surface-container-lowest border border-border-hairline rounded-[16px] px-3.5 py-2.5 shadow-sm">
          <div className="flex items-center gap-1.5 min-w-0">
            <Icon name={"filter_alt"} className="text-[18px] text-primary-container shrink-0" />
            <div className="flex flex-col min-w-0">
              <span
                className="font-callout text-[13px] font-semibold text-ink-primary truncate"
                id="activeFilterBreadcrumb"
              >
                {selection.label}
              </span>
              <span className="font-caption text-[11px] text-ink-secondary leading-none">
                {products.length} productos sincronizados
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-tint text-primary-container font-label-compact text-[11px] font-semibold active:scale-[0.97] transition-all">
              <Icon name={"star"} className="text-[14px]" />
              <span>Destacados</span>
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-ink-secondary font-label-compact text-[11px] font-semibold active:scale-[0.97] transition-all">
              <Icon name={"swap_vert"} className="text-[14px]" />
              <span>Precio</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid de Productos ALINEADO AL ProductListSerializer */}
      <section className="px-margin py-space-sm">
        <div className="flex items-center justify-between pb-space-xs">
          <h2 className="font-headline text-[18px] text-ink-primary font-bold tracking-tight">
            Resultados de Catálogo
          </h2>
          <span className="font-caption text-caption text-ink-secondary font-medium">
            {products.length} modelos en local
          </span>
        </div>

        {products.length === 0 ? (
          <div className="col-span-full pt-8 text-center">
            <Icon name={"inventory_two"} className="text-[48px] text-primary-container" />
            <p className="font-callout text-callout text-ink-primary mt-2">
              Sin equipos en esta categoría
            </p>
            <p className="font-caption text-caption text-ink-secondary">
              Escríbenos por WhatsApp y te avisamos cuando llegue nuevo stock.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-space-xs sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
