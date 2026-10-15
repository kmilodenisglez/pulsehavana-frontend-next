"use client";

import { useState, useEffect } from "react";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";
import { pluralize } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import { useMockCategories, useMockSubcategories, useMockProducts } from "@/lib/mockApi";

// --- Mock configuration ---
// Set initial mock active category (use 'todos' to show all)
const MOCK_ACTIVE_CATEGORY: Category["id"] = "todos";

export function StoreCatalog() {
  // State initialization: use mock mode or null for real API
  const [activeCategory, setActiveCategory] = useState<Category["id"] | null>(MOCK_ACTIVE_CATEGORY);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string>("Todos");
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // --- Category tree from mock API (or real backend) ---
  useEffect(() => {
    const catTree = useMockCategories();
    setCategories(catTree);
  }, []);

  // Subcategories from mock API (or real backend fetch)
  useEffect(() => {
    if (activeCategory) {
      const subs = useMockSubcategories(activeCategory);
      // We don't set state here directly - useMockSubcategories is used inline
      // when rendering the pills. This keeps it simple for mock mode.
    }
  }, [activeCategory]);

  // Products from mock API (or real backend fetch)
  useEffect(() => {
    const catFilter = activeCategory === "todos" ? undefined : (activeCategory as string | undefined);
    const { data: fetchedProducts, meta } = useMockProducts({
      category_slug: catFilter,
      subcategory_slug: activeSubcategory as string | undefined,
    });
    setProducts(fetchedProducts);
    setProductCount(meta.total_items || 0);
  }, [activeCategory, activeSubcategory]);

  // --- Category labels for display ---
  const categoryLabels: Record<string, string> = {
    telefonos: "Teléfonos",
    energia: "Energía & Respaldo",
    accesorios: "Audio & Accesorios",
    todos: "Todos",
  };

  // Render subcategory pills
  const renderSubcategoryPills = () => {
    if (!activeCategory || activeCategory === "todos") return null;

    const subs = useMockSubcategories(activeCategory);
    if (!subs) return null;

    return (
      <div className="bg-surface-container-low/70 border border-border-hairline rounded-[20px] p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon name={"account_tree"} className="text-[16px] text-primary-container" />
            <span className="font-label-compact text-[11px] text-ink-primary font-bold uppercase tracking-wider">
              Subcategorías de
              <span className="text-primary-container" id="currentParentLabel">
                {categoryLabels[activeCategory as keyof Record<Category["id"], string>]}
              </span>
            </span>
          </div>
          <span className="font-label-compact text-[11px] text-ink-secondary font-medium" id="subcategorySummary">
            {activeCategory === "telefonos" ? "4 marcas disponibles" : "3 subcategorías"}
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none no-scrollbar py-0.5" id="subcategoriesContainer">
          {subs.map((sub, index) => {
            const isActive = activeSubcategory === sub.slug;
            const pillClass = isActive
              ? "subcat-pill active flex items-center gap-2 h-9 px-3 rounded-full bg-primary-container text-on-primary font-callout text-xs font-semibold whitespace-nowrap shadow-sm active:scale-[0.97] transition-all"
              : "subcat-pill flex items-center gap-2 h-9 px-3 rounded-full bg-surface-base border border-border-hairline text-ink-primary font-callout text-xs font-semibold whitespace-nowrap active:scale-[0.97] transition-all";

            return (
              <button
                key={sub.name}
                className={pillClass}
                onClick={() => {
                  setActiveSubcategory(sub.slug);
                  setActivePath(
                    `${categoryLabels[activeCategory as keyof Record<Category["id"], string>]} → ${sub.name} (` + sub.count + ` productos sincronizados)`
                  );
                }}
              >
                <Icon
                  name={sub.icon}
                  className={isActive ? "text-[16px] text-on-primary" : "text-[16px] text-ink-secondary"}
                />
                <span>{sub.name}</span>
                <span className={isActive ? "px-1.5 py-0.2 bg-white/20 rounded-full font-label-compact text-[10px] leading-tight font-bold text-on-primary" : "px-1.5 py-0.2 bg-surface-container-high text-ink-secondary rounded-full font-label-compact text-[10px] leading-tight font-bold"}>
                  {sub.count} disp.
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Product grid rendering ---
  const renderProductsGrid = () => {
    if (productCount === 0) {
      return (
        <div className="col-span-full pt-8 text-center">
          <Icon name={"inventory_2"} className="text-[48px] text-primary-container" />
          <p className="font-callout text-callout text-ink-primary mt-2">Sin equipos en esta categoría</p>
          <p className="font-caption text-caption text-ink-secondary">Escríbenos por WhatsApp y te avisamos cuando llegue nuevo stock.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3 mt-space-xs sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Level 1: Categorías Principales */}
      <section id="categories" className="w-full py-space-sm">
        <div className="flex items-center gap-2 overflow-x-auto px-margin md:px-margin-desktop scrollbar-none no-scrollbar py-0.5">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActiveCategory(category.id);
                  setActiveSubcategory(null);
                  setActivePath(category.label);
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
        </div>
      </section>

      {/* Level 2: Subcategorías Dinámicas */}
      {activeCategory && activeCategory !== "todos" && (
        <section className="px-margin pt-1">
          {renderSubcategoryPills()}
        </section>
      )}

      {/* Barra de Contexto y Filtros (ProductFilterSet) */}
      <section className="px-margin pt-space-sm pb-1">
        <div className="flex items-center justify-between bg-surface-container-lowest border border-border-hairline rounded-[16px] px-3.5 py-2.5 shadow-sm">
          <div className="flex items-center gap-1.5 min-w-0">
            <Icon name={"filter_alt"} className="text-[18px] text-primary-container shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-callout text-[13px] font-semibold text-ink-primary truncate" id="activeFilterBreadcrumb">{activePath}</span>
              <span className="font-caption text-[11px] text-ink-secondary leading-none">
                {productCount} productos sincronizados
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
            {productCount} modelos en local
          </span>
        </div>
        {renderProductsGrid()}
      </section>
    </>
  );
}