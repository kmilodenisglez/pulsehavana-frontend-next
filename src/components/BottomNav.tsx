"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { useCart } from "@/lib/cart";
import { useStoreView, type StoreView } from "@/lib/store-view";

interface NavContext {
  pathname: string;
  /** View the storefront shows on mobile & tablet (desktop ignores it). */
  view: StoreView;
}

interface NavItem {
  href: string;
  label: string;
  icon: string;
  isActive: (context: NavContext) => boolean;
  /**
   * View this item opens. "Inicio" is the shop and "Categorías" the full-screen
   * explorer; the cart opens its own route and comes back to the shop.
   */
  view: StoreView;
}

const items: NavItem[] = [
  {
    href: "/",
    label: "Inicio",
    icon: "home",
    view: "inicio",
    isActive: ({ pathname, view }) => pathname === "/" && view === "inicio",
  },
  {
    href: "/#categorias",
    label: "Categorías",
    icon: "grid_view",
    view: "categorias",
    isActive: ({ pathname, view }) => pathname === "/" && view === "categorias",
  },
  {
    href: "/checkout",
    label: "Carrito",
    icon: "shopping_bag",
    view: "inicio",
    isActive: ({ pathname }) => pathname.startsWith("/checkout"),
  },
];

/**
 * Bottom navigation for mobile & tablet. Hidden from `lg` up, where the desktop
 * chrome takes over (pages compensate with `lg:pb-8`).
 *
 * It also drives the storefront views: "Categorías" opens the full-screen
 * categories view and "Inicio" brings the shop back without it (see
 * `useStoreView`). Both the click and the `href` change the view, so the items
 * keep working from other routes — e.g. the product page — without extra code.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const { view, setView } = useStoreView();

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
              onClick={() => setView(item.view)}
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
