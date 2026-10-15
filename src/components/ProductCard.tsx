"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";
import { useCart } from "@/lib/cart";
import { formatCompact, usd } from "@/lib/format";
import type { BadgeKind, Product } from "@/lib/types";

function badgeTone(kind: BadgeKind): string {
  switch (kind) {
    case "success":
      return "bg-status-success/10 text-status-success";
    case "primary":
      return "bg-primary-tint text-primary-container";
    default:
      return "bg-surface-container-highest text-ink-secondary";
  }
}

function dotTone(kind: BadgeKind): string {
  return kind === "primary" ? "bg-primary-container" : "bg-status-success";
}

export function ProductCard({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock.status === "out-of-stock";
  const storage = product.storages[0];
  const color = product.colors[0];

  function handleAdd() {
    if (outOfStock || added) return;
    addLine({
      id: `${product.slug}|${storage.label}|${color.name}`,
      slug: product.slug,
      name: product.name,
      subtitle: `${color.name} · ${product.condition}`,
      unitPrice: storage.price,
      image: product.image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  // Determinar el badge kind basado en si el producto es destacado
  const badgeKind: BadgeKind = product.featured ? "primary" : "success";

  return (
    <article
      className={`bg-surface-container-lowest rounded-[18px] p-2.5 flex flex-col justify-between shadow-sm ${
        outOfStock ? "opacity-80" : "active:scale-[0.99] transition-transform"
      }`}
    >
      <div className="flex flex-col">
        <Link href={`/product/${product.slug}`} className="flex flex-col">
          <div className="relative w-full aspect-square bg-surface-container rounded-[12px] overflow-hidden flex items-center justify-center mb-2.5">
            {/* Image: use safe fallback if image is missing */}
            <Image
              src={product.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 45vw, 240px"
              className={`object-cover ${outOfStock ? "grayscale-[30%]" : ""}`}
            />
            {/* Badge de subcategoría - basado en ProductListSerializer subcategory_name */}
              <span
                className={`absolute top-2 left-2 px-2 py-0.5 rounded-full font-label-compact text-[11px] font-semibold ${badgeTone(
                  badgeKind,
                )} ${product.badge.dot ? "flex items-center gap-1" : ""} backdrop-blur-sm`}
              >
                {product.badge.dot ? (
                  <span className={`w-1.5 h-1.5 rounded-full ${dotTone(badgeKind)}`} />
                ) : null}
                {product.badge.label}
              </span>
              {/* Subcategory small label (separate element to avoid absolute nesting issues) */}
              {product.subcategory_name && (
                <span
                  className={`absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-surface-container-high/50 text-ink-secondary font-label-compact text-[9px] font-semibold whitespace-nowrap backdrop-blur-sm`}
                >
                  {product.subcategory_name}
                </span>
              )}
            {/* Distintivo visual para productos destacados (is_featured) */}
            {product.featured && (
              <span
                className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-primary-container/20 text-primary-container font-label-compact text-[9px] font-semibold backdrop-blur-sm`}
              >
                Destacado
              </span>
            )}
          </div>
          {/* shortSpec removed - using subcategory info instead */}
          <h3 className="font-callout text-callout text-ink-primary font-semibold leading-tight line-clamp-1 mt-0.5">
            {product.name}
          </h3>
          <span className="font-caption text-caption text-ink-secondary text-[12px] leading-tight mt-0.5">
            {product.subcategory_name || ""}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-caption text-ink-secondary text-xs font-bold">USD</span>
            <span className="font-headline text-[20px] text-ink-primary font-black tracking-tight">
              {formatCompact(product.price)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            {/* Etiqueta de condición física garantizada en tienda física */}
            {product.condition && (
              <span
                className={`px-2 py-0.5 rounded-full bg-surface-container-low/50 text-ink-secondary font-label-compact text-[8px] font-semibold whitespace-nowrap backdrop-blur-sm`}
              >
                {product.condition}
              </span>
            )}
          </div>
        </Link>
      </div>
      <button
        type="button"
        disabled={outOfStock}
        onClick={handleAdd}
        className={
          outOfStock
            ? "mt-3 w-full h-[44px] rounded-full bg-surface-container-highest text-ink-secondary/60 font-callout-button text-[14px] font-semibold flex items-center justify-center gap-1 cursor-not-allowed"
            : `mt-3 w-full h-[44px] rounded-full ${
                added ? "bg-status-success" : "bg-primary-container"
              } text-on-primary font-callout-button text-[14px] font-semibold flex items-center justify-center gap-1 shadow-sm active:scale-[0.97] transition-all duration-100`
        }
      >
        <Icon name={outOfStock ? "block" : added ? "check" : "add"} className="text-[18px]" />
        <span>{outOfStock ? "Agotado" : added ? "¡Listo!" : "Añadir"}</span>
      </button>
    </article>
  );
}