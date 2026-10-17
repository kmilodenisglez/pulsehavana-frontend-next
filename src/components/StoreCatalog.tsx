"use client";

import { useMemo } from "react";
import { CategoryPills } from "./CategoryPills";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";
import { SubcategoryPills } from "./SubcategoryPills";
import type { Category } from "@/lib/types";
import { getMockCategories, getMockProducts, getMockSubcategories } from "@/lib/mockApi";

export interface StoreCatalogProps {
  activeCategory: Category["id"];
  activeSubcategory: string | null;
  onSelectCategory: (categoryId: Category["id"]) => void;
  onSelectSubcategory: (slug: string) => void;
}

// The filter state lives in `StoreFront`, which also decides whether the hero
// is still visible; the catalog stays a presentational consumer of that state.
//
// Category chrome here is desktop-only: from `lg` up both tiers are pill rows
// (`CategoryPills` + `SubcategoryPills`). Below `lg` the categories are a view
// of their own (`StoreCategories`), opened from the bottom navigation, so the
// shop itself renders without them at those widths.
export function StoreCatalog({
  activeCategory,
  activeSubcategory,
  onSelectCategory,
  onSelectSubcategory,
}: StoreCatalogProps) {
  // The mock data layer is synchronous, so every derived value is computed
  // during render. Keeping this out of effects means the server and client
  // render identical markup (no hydration mismatch, no empty-state flash).
  const categories = useMemo(() => getMockCategories(), []);

  const products = useMemo(
    () =>
      getMockProducts({
        category_slug: activeCategory === "todos" ? undefined : activeCategory,
        subcategory_slug: activeSubcategory ?? undefined,
      }).data,
    [activeCategory, activeSubcategory],
  );

  const subcategories = useMemo(
    () => (activeCategory === "todos" ? [] : getMockSubcategories(activeCategory)),
    [activeCategory],
  );

  const isAllCategories = activeCategory === "todos";
  const parentLabel =
    categories.find((category) => category.id === activeCategory)?.label ?? activeCategory;
  const activeSub = subcategories.find((sub) => sub.slug === activeSubcategory) ?? null;

  // The product count already is the supporting line below, so the breadcrumb
  // keeps just the path — it is the only filter indicator the mobile shop view
  // has, and it has to fit one line there.
  const breadcrumb = activeSub ? `${parentLabel} → ${activeSub.name}` : parentLabel;

  return (
    <>
      {/* Tier 1 + Tier 2: categories and subcategories (desktop only) */}
      <section className="hidden lg:block w-full py-space-sm">
        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onSelect={onSelectCategory}
        />
        {!isAllCategories && subcategories.length > 0 && (
          <div className="px-margin pt-1">
            <SubcategoryPills
              parentLabel={parentLabel}
              subcategories={subcategories}
              activeSubcategory={activeSubcategory}
              onSelect={onSelectSubcategory}
            />
          </div>
        )}
      </section>

      {/* Barra de Contexto y Filtros (ProductFilterSet) */}
      <section className="px-margin pt-space-sm pb-1">
        <div className="flex items-center justify-between bg-surface-container-lowest border border-border-hairline rounded-[16px] px-3.5 py-2.5 shadow-sm">
          <div className="flex items-center gap-1.5 min-w-0">
            <Icon name={"filter_alt"} className="text-[18px] text-primary-container shrink-0" />
            <div className="flex flex-col min-w-0">
              <span
                className="font-callout text-[13px] font-semibold text-ink-primary truncate"
                id="activeFilterBreadcrumb"
              >
                {breadcrumb}
              </span>
              <span className="font-caption text-[11px] text-ink-secondary leading-none">
                {products.length} productos sincronizados
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
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
