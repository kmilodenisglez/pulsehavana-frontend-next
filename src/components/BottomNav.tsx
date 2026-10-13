"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { useCart } from "@/lib/cart";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  isActive: (pathname: string) => boolean;
}

const items: NavItem[] = [
  { href: "/", label: "Inicio", icon: "home", isActive: (p) => p === "/" },
  { href: "/#categories", label: "Categorías", icon: "grid_view", isActive: () => false },
  {
    href: "/checkout",
    label: "Carrito",
    icon: "shopping_bag",
    isActive: (p) => p.startsWith("/checkout"),
  },
  { href: "/#tienda", label: "Tienda", icon: "store", isActive: () => false },
];

export function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-chrome-translucent backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-16 px-space-sm mx-auto w-full max-w-[1280px]">
        {items.map((item) => {
          const active = item.isActive(pathname);
          const showBadge = item.icon === "shopping_bag" && count > 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
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
