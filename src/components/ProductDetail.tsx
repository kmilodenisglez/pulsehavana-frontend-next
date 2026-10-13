"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "./Icon";
import { useCart } from "@/lib/cart";
import { formatAmount, usd } from "@/lib/format";
import type { BadgeKind, Product } from "@/lib/types";

function detailBadgeTone(kind: BadgeKind): string {
  switch (kind) {
    case "primary":
      return "bg-primary-tint text-primary";
    case "success":
      return "bg-status-success/10 text-status-success";
    default:
      return "bg-surface-container-highest text-ink-secondary";
  }
}

function storageGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  return "grid-cols-3";
}

export function ProductDetail({ product }: { product: Product }) {
  const { addLine } = useCart();

  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [storageIndex, setStorageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const color = product.colors[colorIndex];
  const storage = product.storages[storageIndex];
  const unitPrice = storage.price;
  const total = unitPrice * quantity;
  const outOfStock = product.stock.status === "out-of-stock";

  function handleTrackScroll() {
    const track = trackRef.current;
    if (!track) return;
    setActiveSlide(Math.round(track.scrollLeft / track.offsetWidth));
  }

  function goToSlide(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.offsetWidth * index, behavior: "smooth" });
  }

  function handleAddToCart() {
    if (outOfStock) return;
    addLine(
      {
        id: `${product.slug}|${storage.label}|${color.name}`,
        slug: product.slug,
        name:
          product.category === "accesorios"
            ? product.name
            : `${product.name} ${storage.label}`,
        subtitle: `${color.name} · ${product.condition}`,
        unitPrice,
        image: product.gallery[0]?.src ?? product.image,
      },
      quantity,
    );
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2400);
  }

  return (
    <div className="px-margin flex flex-col gap-space-lg w-full max-w-[640px] mx-auto pt-space-md">
      {/* Badges */}
      <div className="flex items-center gap-space-xs flex-wrap">
        {product.detailBadges.map((badge) => (
          <div
            key={badge.label}
            className={`inline-flex items-center ${badge.dot ? "gap-1.5" : badge.icon ? "gap-1" : ""} px-3 py-1 rounded-full font-label-compact text-label-compact ${detailBadgeTone(
              badge.kind,
            )}`}
          >
            {badge.dot ? (
              <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            ) : null}
            {badge.icon ? (
              <Icon name={badge.icon} className="text-[14px]" filled={badge.iconFilled} />
            ) : null}
            {badge.label}
          </div>
        ))}
      </div>

      {/* Titles & pricing */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col min-w-0">
            <p className="font-label-compact text-label-compact uppercase tracking-wider text-ink-secondary">
              {product.brand}
            </p>
            <h2 className="font-headline text-headline text-ink-primary font-semibold tracking-tight">
              {product.name}
            </h2>
          </div>
          <button
            aria-label="Favorito"
            aria-pressed={isFavorite}
            type="button"
            onClick={() => setIsFavorite((value) => !value)}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-[0.97] transition-all duration-100 shadow-sm ${
              isFavorite ? "bg-danger-tint text-status-danger" : "bg-surface-container text-ink-secondary"
            }`}
          >
            <Icon name="favorite" className="text-[20px]" filled={isFavorite} />
          </button>
        </div>
        <div className="flex items-baseline gap-space-xs mt-1">
          <span className="font-caption text-caption text-ink-secondary">USD</span>
          <span className="font-title text-title text-ink-primary font-bold tracking-tight">
            {formatAmount(unitPrice)}
          </span>
          <span
            className={`font-caption text-caption px-2 py-0.5 rounded-full font-medium ml-1 ${
              outOfStock
                ? "text-status-danger bg-danger-tint"
                : "text-status-success bg-status-success/10"
            }`}
          >
            {product.stock.label}
          </span>
        </div>
      </div>

      {/* Carousel gallery */}
      <div className="relative w-full rounded-2xl bg-surface-container-lowest p-space-sm shadow-sm overflow-hidden">
        <div
          ref={trackRef}
          onScroll={handleTrackScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full no-scrollbar rounded-xl"
        >
          {product.gallery.map((image) => (
            <div
              key={image.src}
              className="min-w-full snap-center flex items-center justify-center aspect-square bg-surface-container-low rounded-xl overflow-hidden relative"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                quality={100}
                unoptimized
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
              />
              {image.label ? (
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-ink-primary font-label-compact text-label-compact">
                  {image.label}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        {product.gallery.length > 1 ? (
          <div className="flex items-center justify-center gap-1.5 py-2.5">
            {product.gallery.map((image, index) => (
              <button
                key={image.src}
                type="button"
                aria-label={`Foto ${index + 1}`}
                aria-current={index === activeSlide}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-200 ${
                  index === activeSlide ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-surface-variant"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Color selector */}
      <div className="flex flex-col gap-space-xs bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-caption text-caption text-ink-secondary">{product.colorLabel}:</span>
          <span className="font-caption text-caption font-semibold text-ink-primary">
            {color.name}
          </span>
        </div>
        <div className="flex items-center gap-space-sm pt-1">
          {product.colors.map((option, index) => {
            const selected = index === colorIndex;
            return (
              <button
                key={option.name}
                type="button"
                aria-pressed={selected}
                onClick={() => setColorIndex(index)}
                className={`flex-1 py-2.5 px-3 rounded-full flex items-center justify-center gap-2 font-callout text-[14px] active:scale-[0.97] transition-all ${
                  selected
                    ? "bg-primary-tint text-primary font-semibold"
                    : "bg-surface-container text-ink-secondary font-medium"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-inner"
                  style={{ backgroundColor: option.hex }}
                />
                {option.name.replace(/^Titanio\s|^Titanium\s/, "")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage selector */}
      <div className="flex flex-col gap-space-xs bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-caption text-caption text-ink-secondary">
            Capacidad de Almacenamiento:
          </span>
          <span className="font-caption text-caption font-semibold text-ink-primary">
            {storage.label}
          </span>
        </div>
        <div className={`grid ${storageGridClass(product.storages.length)} gap-space-xs pt-1`}>
          {product.storages.map((option, index) => {
            const selected = index === storageIndex;
            return (
              <button
                key={option.label}
                type="button"
                aria-pressed={selected}
                onClick={() => setStorageIndex(index)}
                className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center active:scale-[0.97] transition-all ${
                  selected
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container text-ink-primary"
                }`}
              >
                <span className="font-callout text-callout font-semibold">{option.label}</span>
                <span
                  className={`font-label-compact text-label-compact mt-0.5 ${
                    selected ? "opacity-90" : "text-ink-secondary"
                  }`}
                >
                  ${formatAmount(option.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Specs bento grid */}
      <div className="flex flex-col gap-space-sm bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
        <div className="flex items-center justify-between pb-1">
          <h3 className="font-callout text-callout font-semibold text-ink-primary">
            Ficha Técnica Oficial
          </h3>
          <span className="font-label-compact text-label-compact text-primary bg-primary-tint px-2 py-0.5 rounded-full font-semibold">
            {product.seriesTag}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-space-xs">
          {product.specs.map((spec) => (
            <div key={spec.label} className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-primary">
                <Icon name={spec.icon} className="text-[18px]" />
                <span className="font-label-compact text-label-compact font-semibold uppercase text-ink-secondary">
                  {spec.label}
                </span>
              </div>
              <p className="font-caption text-caption text-ink-primary font-semibold leading-tight">
                {spec.title}
              </p>
              <p className="font-label-compact text-label-compact text-ink-secondary">
                {spec.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Store pickup notice */}
      <div className="flex items-start gap-3 p-space-md bg-surface-container-low rounded-2xl">
        <div className="w-10 h-10 rounded-full bg-primary-tint flex items-center justify-center shrink-0 text-primary">
          <Icon name="storefront" className="text-[20px]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h4 className="font-caption text-caption font-semibold text-ink-primary">
            Recogida Exclusiva en Sucursal
          </h4>
          <p className="font-label-compact text-label-compact text-ink-secondary leading-relaxed">
            Recogida física en{" "}
            <strong className="text-ink-primary font-semibold">Pulse Havana Center Cell</strong>.
            Pago presencial en efectivo o transferencia verificada al retirar tu equipo con un
            asesor.
          </p>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-4 z-20 w-full p-2.5 rounded-3xl bg-chrome-translucent backdrop-blur-xl shadow-lg flex items-center gap-2">
        <div className="flex items-center justify-between bg-surface-container rounded-full h-[50px] px-1 w-[110px] shrink-0">
          <button
            aria-label="Restar"
            type="button"
            disabled={quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink-primary active:scale-[0.90] transition-transform duration-100 disabled:opacity-30"
          >
            <Icon name="remove" className="text-[18px]" />
          </button>
          <span className="font-callout text-callout font-bold text-ink-primary select-none">
            {quantity}
          </span>
          <button
            aria-label="Sumar"
            type="button"
            disabled={quantity >= 10}
            onClick={() => setQuantity((value) => Math.min(10, value + 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink-primary active:scale-[0.90] transition-transform duration-100 disabled:opacity-30"
          >
            <Icon name="add" className="text-[18px]" />
          </button>
        </div>
        <button
          type="button"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className={`flex-1 h-[50px] px-4 rounded-full font-callout-button text-callout-button flex items-center justify-center gap-2 shadow-md active:scale-[0.97] transition-transform duration-100 min-w-0 ${
            outOfStock ? "bg-surface-container-highest text-ink-secondary/60 cursor-not-allowed" : "bg-primary text-on-primary"
          }`}
        >
          <Icon name={outOfStock ? "block" : "shopping_bag"} className="text-[20px] shrink-0" />
          <span className="truncate">
            {outOfStock ? "Agotado" : `Añadir al Carrito (${usd(total)})`}
          </span>
        </button>
      </div>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-ink-primary text-surface-container-lowest font-caption text-caption shadow-xl transition-opacity duration-300 z-50 flex items-center gap-2 ${
          toastVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Icon name="check_circle" className="text-status-success text-[18px]" filled />
        <span>¡Añadido a tu pedido en tienda!</span>
      </div>
    </div>
  );
}
