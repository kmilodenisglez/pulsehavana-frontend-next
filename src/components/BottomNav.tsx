"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Icon } from "./Icon";
import { useCart } from "@/lib/cart";
import { CATEGORY_PARAM, catalogHref } from "@/lib/store-catalog";
import { setStoreView, useStoreView, type StoreView } from "@/lib/store-view";

interface NavContext {
  pathname: string;
  /** View the storefront shows on mobile & tablet (desktop ignores it). */
  view: StoreView;
  /** Slug the shop is filtered by (`?cat=`), so view toggles keep it. */
  cat: string | null;
}

interface NavItem {
  /** Target URL. Resolved per render: the "Categorías" toggle points back here. */
  href: string;
  label: string;
  icon: string;
  active: boolean;
  /**
   * Runs on click. View items switch a client view and must not reach the
   * server: they `preventDefault()` and keep the `href` for sharing.
   */
  onSelect: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Navigation items for the current view. Built per render because "Categorías"
 * is a toggle: while the explorer is open its `href` points at the same catalog
 * without the view hash, so picking it again closes the view (URL included) and
 * leaves the shop exactly as it was — filter and all.
 */
function buildItems({ pathname, view, cat }: NavContext): NavItem[] {
  const onStore = pathname === "/";
  const isCategoriesView = view === "categorias";

  return [
    {
      // "Inicio" is the shop's home: the bare path drops any `?cat=` filter, so
      // the tab always lands on every product, with the hero.
      href: catalogHref(null),
      label: "Inicio",
      icon: "home",
      active: onStore && !isCategoriesView,
      onSelect: () => setStoreView("inicio"),
    },
    {
      href: catalogHref(cat, isCategoriesView ? "inicio" : "categorias"),
      label: "Categorías",
      icon: "grid_view",
      active: onStore && isCategoriesView,
      // The view is client state mirrored in the hash: switching it changes no
      // catalog data, so on the store it must not cost a server read — the click
      // is handled here and the `href` stays for whoever copies the link or opens
      // it in a new tab. From another route (e.g. a product page) the link has to
      // navigate back to the store, so the click goes through.
      onSelect: (event) => {
        if (onStore) event.preventDefault();
        setStoreView(isCategoriesView ? "inicio" : "categorias");
      },
    },
    {
      href: "/checkout",
      label: "Carrito",
      icon: "shopping_bag",
      active: pathname.startsWith("/checkout"),
      onSelect: () => setStoreView("inicio"),
    },
  ];
}

/**
 * Bottom navigation for mobile & tablet. Hidden from `lg` up, where the desktop
 * chrome takes over (pages compensate with `lg:pb-8`).
 *
 * It also drives the storefront views (see `useStoreView`): "Categorías" opens
 * the full-screen explorer and, picked again, closes it back to the shop exactly
 * as it was; "Inicio" returns to the shop and drops any catalog filter, so the
 * home tab always lands on every product (see `catalogHref`). Both the click and
 * the `href` change the view, so the items keep working from other routes — e.g.
 * the product page — without extra code.
 */
export function BottomNav() {
  return (
    // The filter the toggle must preserve is read from the URL — the same place
    // the server reads it from — and `useSearchParams` suspends, so the nav
    // renders a shell first: same items, links without the filter, still working.
    <Suspense fallback={<BottomNavShell cat={null} />}>
      <BottomNavWithFilter />
    </Suspense>
  );
}

function BottomNavWithFilter() {
  const cat = useSearchParams().get(CATEGORY_PARAM);
  return <BottomNavShell cat={cat} />;
}

function BottomNavShell({ cat }: { cat: string | null }) {
  const pathname = usePathname();
  const { count } = useCart();
  const { view } = useStoreView();
  const items = buildItems({ pathname, view, cat });

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-chrome-translucent backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)] lg:hidden">
      <div className="flex items-center justify-around h-16 px-space-sm mx-auto w-full max-w-[1280px]">
        {items.map((item) => {
          const showBadge = item.icon === "shopping_bag" && count > 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              onClick={item.onSelect}
              className={`flex flex-col items-center justify-center flex-1 h-12 transition-colors duration-150 active:scale-[0.97] ${
                item.active ? "text-primary-container font-semibold" : "text-ink-secondary"
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
