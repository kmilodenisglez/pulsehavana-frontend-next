"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";
import { useCart } from "@/lib/cart";
import { badgeOverlayTone } from "@/lib/badges";
import { formatCompact } from "@/lib/format";
import type { BadgeKind, Product } from "@/lib/types";

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

  // Tone of the state badge comes from the product data so it stays visually
  // distinct from the violet "featured" marker shown on the opposite corner.
  const badgeKind: BadgeKind = product.badge.kind;

  return (
    <article
      className={`@container w-full min-w-0 bg-surface-container-lowest rounded-[18px] p-2.5 flex flex-col justify-between shadow-sm ${
        outOfStock ? "opacity-80" : "active:scale-[0.99] transition-transform"
      }`}
    >
      <div className="flex flex-col w-full min-w-0">
        <Link href={`/product/${product.slug}`} className="flex flex-col w-full min-w-0">
          <div className="relative w-full aspect-square bg-surface-container rounded-[12px] overflow-hidden flex items-center justify-center mb-2.5">
            {/* Image: use safe fallback if image is missing */}
            <Image
              src={product.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 45vw, 240px"
              className={`object-cover ${outOfStock ? "grayscale-[30%]" : ""}`}
            />
            {/*
              Single overlay row for the top badges. Both badges share one flex
              track (state badge on the left, optional "featured" marker on the
              right) so they can never overlap: when space runs short the state
              badge shrinks and truncates instead of colliding with the marker.
            */}
            <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1.5">
              <span
                title={product.badge.label}
                className={`inline-flex min-w-0 items-center gap-1 px-2 py-0.5 rounded-full font-label-compact text-[10px] font-semibold ${badgeOverlayTone(
                  badgeKind,
                )}`}
              >
                {product.badge.dot ? (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" />
                ) : null}
                <span className="truncate">{product.badge.label}</span>
              </span>
              {product.featured ? (
                <span
                  role="img"
                  aria-label="Destacado"
                  title="Destacado"
                  className="shrink-0 inline-flex items-center gap-1 px-1.5 @min-[190px]:px-2 py-0.5 rounded-full bg-surface-base/85 text-primary-container border border-primary-container/20 shadow-sm font-label-compact text-[9px] font-bold tracking-wide backdrop-blur-sm"
                >
                  <Icon name="star" className="text-[11px]" filled />
                  {/* Show the label only when the card is wide enough (container query). */}
                  <span className="hidden @min-[190px]:inline">Destacado</span>
                </span>
              ) : null}
            </div>
          </div>
          {/* subcategory_name is rendered once, below the title (no duplicated image badge). */}
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
