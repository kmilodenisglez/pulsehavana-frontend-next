"use client";

import Link from "next/link";
import { useFeatureFlags } from "@/lib/feature-flags";
import { useCart } from "@/lib/cart";
import { BrandLogo } from "./BrandLogo";
import { Icon } from "./Icon";

export function StoreHeader() {
  const { count } = useCart();
  const { showUserShortcuts } = useFeatureFlags();

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-chrome-translucent backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-margin md:px-margin-desktop mx-auto w-full max-w-[1280px] flex items-center justify-between">
        <div className="flex items-center gap-space-sm min-w-0">
          <Link
            href="/"
            aria-label="Ir a la página de inicio"
            className="shrink-0 rounded-lg transition-transform duration-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <BrandLogo />
          </Link>
          <div className="flex flex-col min-w-0">
            <span className="font-headline text-headline text-ink-primary leading-none truncate tracking-tight">
              Pulse HCC
            </span>
            <span className="font-caption text-caption text-ink-secondary truncate leading-none mt-0.5">
              Pulse Havana Center Cell
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            aria-label="Buscar dispositivos"
            type="button"
            className="w-11 h-11 rounded-full flex items-center justify-center text-ink-secondary active:scale-[0.97] transition-transform duration-100"
          >
            <Icon name="search" className="text-[22px]" />
          </button>
          <Link
            aria-label="Bolsa de compras"
            href="/checkout"
            className="w-11 h-11 relative rounded-full flex items-center justify-center text-ink-secondary active:scale-[0.97] transition-transform duration-100"
          >
            <Icon name="shopping_bag" className="text-[22px]" />
            {count > 0 ? (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary-container text-on-primary font-label-compact text-[10px] leading-none flex items-center justify-center pointer-events-none">
                {count}
              </span>
            ) : null}
          </Link>
          {showUserShortcuts ? (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 ml-space-xs">
              <Icon name="person" className="text-on-primary text-[18px]" />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
