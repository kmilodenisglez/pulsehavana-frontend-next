"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";
import { categories, getFeaturedByCategory } from "@/lib/catalog";
import { pluralize } from "@/lib/format";
import type { Category } from "@/lib/types";

export function StoreCatalog() {
  const [active, setActive] = useState<Category["id"]>("todos");
  const items = getFeaturedByCategory(active);

  return (
    <>
      <section id="categories" className="w-full py-space-sm">
        <div className="flex items-center gap-2 overflow-x-auto px-margin md:px-margin-desktop scrollbar-none no-scrollbar py-0.5">
          {categories.map((category) => {
            const isActive = category.id === active;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(category.id)}
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

      <section className="px-margin md:px-margin-desktop py-space-sm">
        <div className="flex items-center justify-between pb-space-xs">
          <h2 className="font-headline text-headline text-ink-primary font-semibold tracking-tight">
            Catálogo Destacado
          </h2>
          <span className="font-caption text-caption text-ink-secondary font-medium">
            {items.length} {pluralize(items.length, "modelo", "modelos")}
          </span>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 mt-space-xs sm:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-space-xs bg-surface-container-lowest rounded-[18px] p-space-lg shadow-sm flex flex-col items-center text-center gap-space-xs">
            <Icon name="inventory_2" className="text-[32px] text-primary-container" />
            <p className="font-callout text-callout text-ink-primary">
              Sin equipos en esta categoría
            </p>
            <p className="font-caption text-caption text-ink-secondary">
              Escríbenos por WhatsApp y te avisamos cuando llegue nuevo stock.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
