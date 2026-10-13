"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { seedCartLines } from "./catalog";
import type { CartLine } from "./types";

const STORAGE_KEY = "phc.cart.v1";

interface CartContextValue {
  lines: CartLine[];
  /** Total number of units. */
  count: number;
  subtotal: number;
  addLine: (line: Omit<CartLine, "qty">, qty?: number) => void;
  updateQty: (id: string, delta: number) => void;
  removeLine: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Stable reference used for SSR, the initial client render and the first mutation. */
const SEED_LINES: CartLine[] = seedCartLines();

function parseLines(raw: string | null): CartLine[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartLine[]) : null;
  } catch {
    return null;
  }
}

function readStoredCart(): CartLine[] | null {
  try {
    return parseLines(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

/* ----------------------------------------------------------------- */
/*  localStorage-backed external store.                                */
/*  Read through `useSyncExternalStore` so the cart hydrates without a  */
/*  setState-in-effect cascade and without an SSR hydration mismatch.   */
/*  (https://react.dev/reference/react/useSyncExternalStore)            */
/* ----------------------------------------------------------------- */
let state: CartLine[] | null = null; // null = not yet read from storage
const listeners = new Set<() => void>();

function getSnapshot(): CartLine[] {
  if (state === null) state = readStoredCart() ?? SEED_LINES;
  return state;
}

function getServerSnapshot(): CartLine[] {
  return SEED_LINES;
}

function subscribe(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    state = readStoredCart() ?? SEED_LINES;
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function currentLines(): CartLine[] {
  return state ?? getSnapshot();
}

function commit(next: CartLine[]): void {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable (private mode) — keep in-memory only */
  }
  for (const listener of listeners) listener();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addLine = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    const current = currentLines();
    const existing = current.find((item) => item.id === line.id);
    commit(
      existing
        ? current.map((item) =>
            item.id === line.id ? { ...item, qty: Math.min(10, item.qty + qty) } : item,
          )
        : [...current, { ...line, qty }],
    );
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    commit(
      currentLines()
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, Math.min(10, item.qty + delta)) } : item,
        )
        .filter((item) => item.qty > 0),
    );
  }, []);

  const removeLine = useCallback((id: string) => {
    commit(currentLines().filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => commit([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((total, item) => total + item.qty, 0);
    const subtotal = lines.reduce((total, item) => total + item.unitPrice * item.qty, 0);
    return { lines, count, subtotal, addLine, updateQty, removeLine, clear };
  }, [lines, addLine, updateQty, removeLine, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return context;
}
