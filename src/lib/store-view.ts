"use client";

import { useSyncExternalStore } from "react";

/**
 * Which view the mobile & tablet storefront shows. Desktop ignores it: from
 * `lg` up the catalog always renders both category levels inline.
 */
export type StoreView = "inicio" | "categorias";

/** Hash that deep-links to the categories view (e.g. `/#categorias`). */
const CATEGORIES_HASH = "#categorias";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Follow browser-driven hash changes too: deep links, history navigation and
  // links coming from another route (e.g. the product page).
  window.addEventListener("hashchange", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("hashchange", listener);
  };
}

function viewFromHash(hash: string): StoreView {
  return hash === CATEGORIES_HASH ? "categorias" : "inicio";
}

/** Server render (and the first client paint) always start on the store view. */
function getServerSnapshot(): StoreView {
  return "inicio";
}

function getSnapshot(): StoreView {
  return viewFromHash(window.location.hash);
}

/**
 * Switch view. The hash mirrors the view so `/#categorias` can be linked and
 * shared; `replaceState` keeps a tab switch out of the history stack, and the
 * manual `emit` covers it because `replaceState` fires no `hashchange`.
 */
function setStoreView(view: StoreView) {
  const { pathname, search, hash } = window.location;
  const nextHash = view === "categorias" ? CATEGORIES_HASH : "";
  if (hash !== nextHash) {
    window.history.replaceState(window.history.state, "", `${pathname}${search}${nextHash}`);
  }
  emit();
}

/**
 * Read and switch the mobile & tablet view.
 *
 * Backed by the URL hash through `useSyncExternalStore` — exactly how the cart
 * is backed by localStorage — so the bottom navigation and the store body stay
 * in sync without a provider and without a setState-in-effect cascade.
 */
export function useStoreView() {
  const view = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { view, setView: setStoreView };
}
