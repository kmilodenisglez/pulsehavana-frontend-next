"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";
import { useCart } from "@/lib/cart";
import { formatCompact } from "@/lib/format";
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
      name: product.category === "accesorios" ? product.name : `${product.name} ${storage.label}`,
      subtitle: `${color.name} · ${product.condition}`,
      unitPrice: storage.price,
      image: product.image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article
      className={`bg-surface-container-lowest rounded-[18px] p-2.5 flex flex-col justify-between shadow-sm ${
        outOfStock ? "opacity-80" : "active:scale-[0.99] transition-transform"
      }`}
    >
      <div className="flex flex-col">
        <Link href={`/product/${product.slug}`} className="flex flex-col">
          <div className="relative w-full aspect-square bg-surface-container rounded-[12px] overflow-hidden flex items-center justify-center mb-2.5">
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 45vw, 240px"
              className={`object-cover ${outOfStock ? "grayscale-[30%]" : ""}`}
            />
            <span
              className={`absolute top-2 left-2 px-2 py-0.5 rounded-full font-label-compact text-[11px] font-semibold ${badgeTone(
                product.badge.kind,
              )} ${product.badge.dot ? "flex items-center gap-1" : ""}`}
            >
              {product.badge.dot ? (
                <span className={`w-1 h-1 rounded-full ${dotTone(product.badge.kind)}`} />
              ) : null}
              {product.badge.label}
            </span>
          </div>
          <span className="font-caption text-caption text-ink-secondary leading-tight">
            {product.shortSpec}
          </span>
          <h3 className="font-callout text-callout text-ink-primary font-semibold leading-tight line-clamp-1 mt-0.5">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-caption text-caption text-ink-secondary text-xs font-semibold">
              USD
            </span>
            <span className="font-headline text-headline text-ink-primary font-bold tracking-tight">
              {formatCompact(product.price)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                outOfStock ? "bg-ink-secondary" : "bg-status-success"
              }`}
            />
            <span
              className={`font-caption text-caption font-medium ${
                outOfStock ? "text-ink-secondary" : "text-status-success"
              }`}
            >
              {product.stock.label}
            </span>
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
