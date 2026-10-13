import type { CartLine } from "./types";

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

export interface Order {
  reference: string;
  customer: OrderCustomer;
  lines: CartLine[];
  total: number;
  createdAt: string;
}

const STORAGE_KEY = "phc.order.v1";

export function generateOrderReference(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `PHC-${digits}`;
}

export function saveOrder(order: Order): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    /* ignore storage failures */
  }
}

export function readOrder(): Order | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

/**
 * Stable snapshot for `useSyncExternalStore`: returns a cached reference so
 * React can compare with `Object.is` without re-rendering in a loop. The cache
 * is invalidated whenever the raw stored value changes.
 */
let snapshotRaw: string | null | undefined;
let snapshotOrder: Order | null = null;

export function getOrderSnapshot(): Order | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    try {
      snapshotOrder = raw ? (JSON.parse(raw) as Order) : null;
    } catch {
      snapshotOrder = null;
    }
  }
  return snapshotOrder;
}

export function subscribeToOrder(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function buildWhatsAppMessage(order: Order): string {
  const lines = order.lines
    .map((line) => `• ${line.name} x${line.qty} — USD ${line.unitPrice.toFixed(2)}`)
    .join("\n");
  return [
    `Hola Pulse Havana Center Cell, confirmo mi pedido ${order.reference}.`,
    "",
    lines,
    "",
    `Total: USD ${order.total.toFixed(2)}`,
    `Cliente: ${order.customer.name}`,
    "Modalidad: Recogida presencial en tienda física.",
  ].join("\n");
}

export function buildWhatsAppUrl(order: Order, phone = "+5359352209"): string {
  const normalizedPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(buildWhatsAppMessage(order))}`;
}
