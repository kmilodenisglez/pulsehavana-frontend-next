"use client";

import { useMemo, useState } from "react";
import { Icon } from "./Icon";
import { PillScroller } from "./PillScroller";
import { ProductCard } from "./ProductCard";
import type { Category } from "@/lib/types";
import { getMockCategories, getMockProducts, getMockSubcategories } from "@/lib/mockApi";

// --- Mock configuration ---
// Initial active category ('todos' shows the full catalog).
const MOCK_ACTIVE_CATEGORY: Category["id"] = "todos";

// Human-readable labels for the parent categories.
const CATEGORY_LABELS: Record<Category["id"], string> = {
  todos: "Todos",
  telefonos: "Teléfonos",
  energia: "Energía & Respaldo",
  accesorios: "Audio & Accesorios",
  "apple-iphone": "Apple iPhone",
  "samsung-galaxy": "Samsung Galaxy",
  xiaomi: "Xiaomi",
  "panel-solar": "Panel Solar",
  "estacion-energia": "Estación de Energía",
};

export function StoreCatalog() {
  const [activeCategory, setActiveCategory] = useState<Category["id"]>(MOCK_ACTIVE_CATEGORY);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

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

  const parentLabel = CATEGORY_LABELS[activeCategory];
  const activeSub = subcategories.find((sub) => sub.slug === activeSubcategory) ?? null;

  const breadcrumb = activeSub
    ? `${parentLabel} → ${activeSub.name} (${activeSub.count} productos sincronizados)`
    : parentLabel;

  return (
    <>
      {/* Level 1: Categorías Principales */}
      <section id="categories" className="w-full py-space-sm">
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
                onClick={() => {
                  setActiveCategory(category.id);
                  // A newly selected category opens on its first subcategory (index 0);
                  // categories without subcategories (e.g. "todos") fall back to null.
                  const [firstSubcategory] = getMockSubcategories(category.id);
                  setActiveSubcategory(firstSubcategory?.slug ?? null);
                }}
                className={`flex items-center justify-center h-10 px-5 rounded-full font-callout text-sm font-semibold whitespace-nowrap active:scale-[0.97] transition-all duration-100 ${
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
      </section>

      {/* Level 2: Subcategorías Dinámicas */}
      {activeCategory !== "todos" && subcategories.length > 0 && (
        <section className="px-margin pt-1">
          <div className="bg-surface-container-low/70 border border-border-hairline rounded-[20px] p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon name={"account_tree"} className="text-[16px] text-primary-container" />
                <span className="font-label-compact text-[11px] text-ink-primary font-bold uppercase tracking-wider">
                  Subcategorías de
                  <span className="text-primary-container" id="currentParentLabel">
                    {parentLabel}
                  </span>
                </span>
              </div>
              <span
                className="font-label-compact text-[11px] text-ink-secondary font-medium"
                id="subcategorySummary"
              >
                {activeCategory === "telefonos" ? "4 marcas disponibles" : "3 subcategorías"}
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
                  <button
                    key={sub.slug}
                    type="button"
                    aria-pressed={isActive}
                    data-active={isActive}
                    className={pillClass}
                    onClick={() => setActiveSubcategory(sub.slug)}
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
                  </button>
                );
              })}
            </PillScroller>
          </div>
        </section>
      )}

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
            <Icon name={"inventory_2"} className="text-[48px] text-primary-container" />
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
