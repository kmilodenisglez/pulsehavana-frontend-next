"use client";

import { useSyncExternalStore } from "react";
import type { Category } from "./types";

/** Sentinel category id meaning "the whole catalog, no filter". */
export const ALL_CATEGORIES: Category["id"] = "todos";

export interface StoreFilters {
  /** Active Tier 1 category (`ALL_CATEGORIES` lists the whole catalog). */
  activeCategory: Category["id"];
  /** Active Tier 2 collection slug, or `null` for "all of them". */
  activeSubcategory: string | null;
}

/** The shop's home state: no parent category and no collection selected. */
const HOME_FILTERS: StoreFilters = { activeCategory: ALL_CATEGORIES, activeSubcategory: null };

const listeners = new Set<() => void>();

/** Current filters. Replaced (never mutated) so the snapshot stays referentially
 * stable between changes, which is what `useSyncExternalStore` requires. */
let filters: StoreFilters = HOME_FILTERS;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): StoreFilters {
  return filters;
}

/** Server render (and the first client paint) always start on the whole catalog. */
function getServerSnapshot(): StoreFilters {
  return HOME_FILTERS;
}

function update(next: StoreFilters) {
  if (
    next.activeCategory === filters.activeCategory &&
    next.activeSubcategory === filters.activeSubcategory
  ) {
    return;
  }
  filters = next;
  emit();
}

/**
 * Filter the catalog by parent category. Picking one also clears the collection
 * filter, i.e. "all of its collections".
 */
export function selectStoreCategory(categoryId: Category["id"]) {
  update({ activeCategory: categoryId, activeSubcategory: null });
}

/** Filter the catalog by one collection inside the active parent category. */
export function selectStoreSubcategory(subcategoryId: string) {
  update({ activeCategory: filters.activeCategory, activeSubcategory: subcategoryId });
}

/**
 * Back to the whole catalog — what the "Inicio" item of the `BottomNav` runs, so
 * the home tab always lands on every product (and the hero) instead of keeping
 * whatever collection the shopper had filtered before.
 */
export function clearStoreFilters() {
  update(HOME_FILTERS);
}

/**
 * Read and change the catalog filters.
 *
 * Module state read through `useSyncExternalStore` — the same shape as
 * `useStoreView` and the cart — because the filters are changed from two
 * places that are not parent and child: the catalog itself and the bottom
 * navigation. That keeps "Inicio" and the shop in sync without a provider and
 * without a setState-in-effect cascade.
 */
export function useStoreFilters() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    activeCategory: current.activeCategory,
    activeSubcategory: current.activeSubcategory,
    /** True on the shop's home state, where the hero is the shop's header. */
    isUnfiltered:
      current.activeCategory === ALL_CATEGORIES && current.activeSubcategory === null,
    selectCategory: selectStoreCategory,
    selectSubcategory: selectStoreSubcategory,
    clearFilters: clearStoreFilters,
  };
}
