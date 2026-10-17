"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { useCart } from "@/lib/cart";
import { clearStoreFilters } from "@/lib/store-filters";
import { setStoreView, useStoreView, type StoreView } from "@/lib/store-view";

interface NavContext {
  pathname: string;
  /** View the storefront shows on mobile & tablet (desktop ignores it). */
  view: StoreView;
}

interface NavItem {
  /** Target URL. Resolved per render: the "Categorías" toggle points back here. */
  href: string;
  label: string;
  icon: string;
  isActive: (context: NavContext) => boolean;
  /** Store state the item sets when picked (view and, for "Inicio", filters). */
  onSelect: () => void;
}

/**
 * Navigation items for the current view. Built per render because "Categorías"
 * is a toggle: while the explorer is open its `href` points back at the shop, so
 * picking it again closes the view and the URL drops the hash on its own.
 */
function buildItems(view: StoreView): NavItem[] {
  return [
    {
      href: "/",
      label: "Inicio",
      icon: "home",
      onSelect: () => {
        // "Inicio" is the shop's home, so it drops any active filter: the tab
        // always lands on every product, with the hero.
        clearStoreFilters();
        setStoreView("inicio");
      },
      isActive: ({ pathname, view }) => pathname === "/" && view === "inicio",
    },
    {
      href: view === "categorias" ? "/" : "/#categorias",
      label: "Categorías",
      icon: "grid_view",
      // Toggle. Closing leaves the shop exactly as it was — filters included —
      // which is what the shopper had on screen before opening the explorer.
      onSelect: () => setStoreView(view === "categorias" ? "inicio" : "categorias"),
      isActive: ({ pathname, view }) => pathname === "/" && view === "categorias",
    },
    {
      href: "/checkout",
      label: "Carrito",
      icon: "shopping_bag",
      onSelect: () => setStoreView("inicio"),
      isActive: ({ pathname }) => pathname.startsWith("/checkout"),
    },
  ];
}

/**
 * Bottom navigation for mobile & tablet. Hidden from `lg` up, where the desktop
 * chrome takes over (pages compensate with `lg:pb-8`).
 *
 * It also drives the storefront views (see `useStoreView`): "Categorías" opens
 * the full-screen explorer and, picked again, closes it back to the shop exactly
 * as it was; "Inicio" returns to the shop and clears any active catalog filter,
 * so the home tab always lands on every product (see `useStoreFilters`). Both
 * the click and the `href` change the view, so the items keep working from other
 * routes — e.g. the product page — without extra code.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const { view } = useStoreView();
  const items = buildItems(view);

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-chrome-translucent backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)] lg:hidden">
      <div className="flex items-center justify-around h-16 px-space-sm mx-auto w-full max-w-[1280px]">
        {items.map((item) => {
          const active = item.isActive({ pathname, view });
          const showBadge = item.icon === "shopping_bag" && count > 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={item.onSelect}
              className={`flex flex-col items-center justify-center flex-1 h-12 transition-colors duration-150 active:scale-[0.97] ${
                active ? "text-primary-container font-semibold" : "text-ink-secondary"
              }`}
            >
              {showBadge ? (
                <div className="relative flex items-center justify-center">
                  <Icon name={item.icon} className="text-[24px]" />
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary-container text-on-primary font-label-compact text-[9px] leading-none flex items-center justify-center">
                    {count}
                  </span>
                </div>
              ) : (
                <Icon name={item.icon} className="text-[24px]" />
              )}
              <span className="font-label-compact text-label-compact mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
