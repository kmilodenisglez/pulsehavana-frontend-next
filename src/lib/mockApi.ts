/**
 * Mock API service for development without backend connection.
 * Returns the same shape as the real Django DRF endpoints.
 * To switch to real backend: replace import in StoreCatalog.tsx
 * and change the fetch URLs from /api/v1/ to the real endpoint.
 */
import type { Category, CategoryId, Product, StockStatus, BadgeKind } from "./types";

/** Base URL for images (same as real catalog) */
const PUBLIC = "https://lh3.googleusercontent.com/aida-public";

/** Category tree with subcategories and product counts */
export const mockCategoriesTree = [
  {
    id: "telefonos",
    name: "Teléfonos",
    slug: "telefonos",
    is_active: true,
    subcategories: [
      {
        id: "apple-iphone",
        name: "Apple",
        slug: "apple-iphone",
        image: `${PUBLIC}/AB6AXuA6iJFRBk7YIpk6OngBkxvtwZKskaH0sh1Xg6Ugg0nUmre3NWsnUhV78P_kwzROhUglCw8HWMcUYpEq0WpJMEiVvm61tgH42EmgmgEq8mCc0GIAoCx8mtEfPaq2TepcX3MJXYMzhDtO9Sipo0opLPudoyE2S06pWMUwu50FjVfkJhGImDAOr4rJvkd3hlGDnNwSTDP3zEMHeWiZQlcf_JFNI9vYQdQxpcF8n1N-riu5RBv7C76yUdQ`,
        is_active: true,
        products_count: 8,
      },
      {
        id: "samsung-galaxy",
        name: "Samsung",
        slug: "samsung-galaxy",
        image: `${PUBLIC}/AB6AXuA8PREatewAL0Gzd1y55wmjEx4fWABLVLxQ_CwnnNxmh29NnDrNys_Big3qIRJ0uoQi-xGYN4GbwG0bgoezX0wS8DhGibnEclrhIIXcaEmJZ_hiJDnq-G5s4CEsb9tdLwqJ_C0gscApRCZUGw4-NFK1hI25qQXDTnM1eBnlCXhWe-b08rwutM5XAucrmkKcZgpzB41qyPQpROvueE8jX5XMCqH6RqXcKkP0WJ_xYFNGdahmf8sULrQ`,
        is_active: true,
        products_count: 6,
      },
      {
        id: "xiaomi",
        name: "Xiaomi",
        slug: "xiaomi",
        image: `${PUBLIC}/AB6AXuAjYsiAS_eapqCE9fazpfOi-ptyAP7e2aorAuzml7BVkSWFXIrl94KVU-7kv9J6cVMY58LmegMrg7oauZCxmzzNrafDKlUgn08Vei5iiLRzttL-dhaPG-UgKxq6CM44oGPWpkBTDSrcEKvUXiocrtLoafqGYHh2TBo0D4YDAewm2BMmy-dgRsBoOLq5KN3JCIkrxMXuf1tYwt7Dko7ri5w0qNcRu3J6dwsEiNaWNEmOU8Epsh67IKc`,
        is_active: true,
        products_count: 4,
      },
      {
        id: "panel-solar",
        name: "Google",
        slug: "google",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
        is_active: true,
        products_count: 2,
      },
    ],
  },
  {
    id: "energia",
    name: "Energía & Respaldo",
    slug: "energia",
    is_active: true,
    subcategories: [
      {
        id: "inversores",
        name: "Inversores",
        slug: "inversores",
        image: `${PUBLIC}/AB6AXuDNfnPTtBdU8z628XE106IyDFok0BHF6P8-WPPAmAk1Ac8tkYmxWIkLU1t0vdPj6bT7oRSZBisHRp_ku9GPh-iCwp3G3yfBOTL0jpDIDLCHqMov5JcAiGPYKZSEq9oBCQEB71QPRnAzkMoJqAssM0x0vUy45W2ymam2emueUy_OdBk8iE0_DOY1RCVyUSiD41sgvDq2WEeuBsgwele2_zxPlAoAUVgR6GV7zCsLfi4OD1yLQ62fWR4`,
        is_active: true,
        products_count: 3,
      },
      {
        id: "baterias-litio",
        name: "Baterías Litio",
        slug: "baterias-litio",
        image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
        is_active: true,
        products_count: 7,
      },
      {
        id: "paneles-solares",
        name: "Paneles Solares",
        slug: "paneles-solares",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
        is_active: true,
        products_count: 5,
      },
      {
        id: "accesorios-solares",
        name: "Accesorios Solares",
        slug: "accesorios-solares",
        image: "https://images.unsplash.com/photo-1559593895-b7a3c3d3e4d3?auto=format&fit=crop&w=1200&q=80",
        is_active: true,
        products_count: 4,
      },
    ],
  },
  {
    id: "accesorios",
    name: "Audio & Accesorios",
    slug: "accesorios",
    is_active: true,
    subcategories: [
      {
        id: "cargadores-cables",
        name: "Cargadores & Cables",
        slug: "cargadores-cables",
        image: `${PUBLIC}/AB6AXuCe98FQKK-8f1Mu30G90gpDYxss-NJeeZwzvWUfDJYh6vFUVZEzvTS0HJwqLisyj9ztFoEpbwksKFvvEAXjsW85GmnKUxARLpwmcZl4Ff7HExF0jm714TSgHaAQobvg1R-VkKN5Illizo2DiosLl-Ei3SPVPnlhEtD0RdUJETNNMgs38ZJmJjimLmZeZx9qAdaud9-wHpUxNgcUpzFz1wvVQWPWvgjV-LLOS2v1ArY2vySU3ezo5q4`,
        is_active: true,
        products_count: 12,
      },
      {
        id: "fundas-micas",
        name: "Fundas & Micas",
        slug: "fundas-micas",
        image: "https://images.unsplash.com/photo-1523275335684-374e4cddba4e?auto=format&fit=crop&w=1200&q=80",
        is_active: true,
        products_count: 20,
      },
      {
        id: "audio-airpods",
        name: "Audio & Airpods",
        slug: "audio-airpods",
        image: "https://images.unsplash.com/photo-1618341589919-a5bb9d0cad15?auto=format&fit=crop&w=1200&q=80",
        is_active: true,
        products_count: 9,
      },
    ],
  },
];

/** Products grouped by category and subcategory - with full Product shape */
export const mockProductsByFilter = {
  // All products (category: "todos")
  todos: [
    {
      slug: "iphone-15-pro-max",
      name: "iPhone 15 Pro Max",
      brand: "Apple Hardware",
      category: "apple-iphone" as const,
      shortSpec: "256GB • Titanio",
      price: 1180,
      image: `${PUBLIC}/AB6AXuA6iJFRBk7YIpk6OngBkxvtwZKskaH0sh1Xg6Ugg0nUmre3NWsnUhV78P_kwzROhUglCw8HWMcUYpEq0WpJMEiVvm61tgH42EmgmgEq8mCc0GIAoCx8mtEfPaq2TepcX3MJXYMzhDtO9Sipo0opLPudoyE2S06pWMUwu50FjVfkJhGImDAOr4rJvkd3hlGDnNwSTDP3zEMHeWiZQlcf_JFNI9vYQdQxpcF8n1N-riu5RBv7C76yUdQ`,
      subcategory: "apple-iphone" as const,
      subcategory_name: "Apple",
      stock: { status: "low-stock" as const, label: "En stock (3 unid.)", units: 3 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Pro Grade",
      condition: "Libre de Fábrica",
      colorLabel: "Acabado Titanio",
      description:
        "El flagship de Apple con chasis de titanio grado aeroespacial, chip A17 Pro y sistema de cámaras profesional.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "galaxy-s24-ultra",
      name: "Galaxy S24 Ultra",
      brand: "Samsung Galaxy",
      category: "samsung-galaxy" as const,
      shortSpec: "256GB • S-Pen",
      price: 1050,
      image: `${PUBLIC}/AB6AXuA8PREatewAL0Gzd1y55wmjEx4fWABLVLxQ_CwnnNxmh29NnDrNys_Big3qIRJ0uoQi-xGYN4GbwG0bgoezX0wS8DhGibnEclrhIIXcaEmJZ_hiJDnq-G5s4CEsb9tdLwqJ_C0gscApRCZUGw4-NFK1hI25qQXDTnM1eBnlCXhWe-b08rwutM5XAucrmkKcZgpzB41qyPQpROvueE8jX5XMCqH6RqXcKkP0WJ_xYFNGdahmf8sULrQ`,
      subcategory: "samsung-galaxy" as const,
      subcategory_name: "Samsung",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Ultra",
      condition: "Libre de Fábrica",
      colorLabel: "Acabado Titanio",
      description:
        "Galaxy AI, marco de titanio y S-Pen integrado. La experiencia Samsung más completa.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "panel-solar-400w",
      name: "Panel Solar 400W",
      brand: "EcoVolt",
      category: "panel-solar" as const,
      shortSpec: "400W • Monocristalino",
      price: 420,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
      subcategory: "panel-solar" as const,
      subcategory_name: "Paneles Solares",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Eficiencia", kind: "success" as const, dot: true },
      seriesTag: "Solar",
      condition: "Certificado",
      colorLabel: "Acabado",
      description:
        "Panel solar monocristalino de 400 W diseñado para carga doméstica y sistemas de respaldo con excelente rendimiento diario.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "estacion-energia-1kwh",
      name: "Estación de Energía 1 kWh",
      brand: "VoltNest",
      category: "estacion-energia" as const,
      shortSpec: "1 kWh • Portátil",
      price: 890,
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
      subcategory: "estacion-energia" as const,
      subcategory_name: "Inversores",
      stock: { status: "low-stock" as const, label: "Pocas unidades", units: 1 },
      badge: { label: "Backup", kind: "primary" as const, dot: true },
      seriesTag: "Power Station",
      condition: "Lista para uso",
      colorLabel: "Acabado",
      description:
        "Estación de energía portátil con salida estable para respaldo doméstico, herramientas y equipos esenciales en cualquier momento.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
  ],

  // By category + subcategory
  telefonos_apple: [
    {
      slug: "iphone-15-pro-max",
      name: "iPhone 15 Pro Max",
      brand: "Apple Hardware",
      category: "apple-iphone" as const,
      shortSpec: "256GB • Titanio",
      price: 1180,
      image: `${PUBLIC}/AB6AXuA6iJFRBk7YIpk6OngBkxvtwZKskaH0sh1Xg6Ugg0nUmre3NWsnUhV78P_kwzROhUglCw8HWMcUYpEq0WpJMEiVvm61tgH42EmgmgEq8mCc0GIAoCx8mtEfPaq2TepcX3MJXYMzhDtO9Sipo0opLPudoyE2S06pWMUwu50FjVfkJhGImDAOr4rJvkd3hlGDnNwSTDP3zEMHeWiZQlcf_JFNI9vYQdQxpcF8n1N-riu5RBv7C76yUdQ`,
      subcategory: "apple-iphone" as const,
      subcategory_name: "Apple",
      stock: { status: "low-stock" as const, label: "En stock (3 unid.)", units: 3 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Pro Grade",
      condition: "Libre de Fábrica",
      featured: true,
    },
    {
      slug: "iphone-14",
      name: "iPhone 14",
      brand: "Apple Hardware",
      category: "apple-iphone" as const,
      shortSpec: "128GB • Medianoche",
      price: 640,
      image: `${PUBLIC}/AB6AXuDNfnPTtBdU8z628XE106IyDFok0BHF6P8-WPPAmAk1Ac8tkYmxWIkLU1t0vdPj6bT7oRSZBisHRp_ku9GPh-iCwp3G3yfBOTL0jpDIDLCHqMov5JcAiGPYKZSEq9oBCQEB71QPRnAzkMoJqAssM0x0vUy45W2ymam2emueUy_OdBk8iE0_DOY1RCVyUSiD41sgvDq2WEeuBsgwele2_zxPlAoAUVgR6GV7zCsLfi4OD1yLQ62fWR4`,
      subcategory: "apple-iphone" as const,
      subcategory_name: "Apple",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Reacond. A+", kind: "primary" as const, dot: true },
      seriesTag: "Reacond. A+",
      featured: true,
    },
    {
      slug: "galaxy-s24-ultra",
      name: "Galaxy S24 Ultra",
      brand: "Samsung Galaxy",
      category: "samsung-galaxy" as const,
      shortSpec: "256GB • S-Pen",
      price: 1050,
      image: `${PUBLIC}/AB6AXuA8PREatewAL0Gzd1y55wmjEx4fWABLVLxQ_CwnnNxmh29NnDrNys_Big3qIRJ0uoQi-xGYN4GbwG0bgoezX0wS8DhGibnEclrhIIXcaEmJZ_hiJDnq-G5s4CEsb9tdLwqJ_C0gscApRCZUGw4-NFK1hI25qQXDTnM1eBnlCXhWe-b08rwutM5XAucrmkKcZgpzB41qyPQpROvueE8jX5XMCqH6RqXcKkP0WJ_xYFNGdahmf8sULrQ`,
      subcategory: "samsung-galaxy" as const,
      subcategory_name: "Samsung",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Ultra",
      condition: "Libre de Fábrica",
      featured: true,
    },
    {
      slug: "xiaomi-mi13",
      name: "Xiaomi Mi 13",
      brand: "Xiaomi",
      category: "xiaomi" as const,
      shortSpec: "128GB • Blanco",
      price: 520,
      image: `${PUBLIC}/AB6AXuAjYsiAS_eapqCE9fazpfOi-ptyAP7e2aorAuzml7BVkSWFXIrl94KVU-7kv9J6cVMY58LmegMrg7oauZCxmzzNrafDKlUgn08Vei5iiLRzttL-dhaPG-UgKxq6CM44oGPWpkBTDSrcEKvUXiocrtLoafqGYHh2TBo0D4YDAewm2BMmy-dgRsBoOLq5KN3JCIkrxMXuf1tYwt7Dko7ri5w0qNcRu3J6dwsEiNaWNEmOU8Epsh67IKc`,
      subcategory: "xiaomi" as const,
      subcategory_name: "Xiaomi",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "",
      condition: "Libre de Fábrica",
      featured: false,
    },
  ],

  energia_inversores: [
    {
      slug: "estacion-energia-1kwh",
      name: "Estación de Energía 1 kWh",
      brand: "VoltNest",
      category: "estacion-energia" as const,
      shortSpec: "1 kWh • Portátil",
      price: 890,
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
      subcategory: "estacion-energia" as const,
      subcategory_name: "Inversores",
      stock: { status: "low-stock" as const, label: "Pocas unidades", units: 1 },
      badge: { label: "Backup", kind: "primary" as const, dot: true },
      seriesTag: "Power Station",
      condition: "Lista para uso",
      featured: true,
    },
    {
      slug: "inversor-deye-5kw",
      name: "Inversor Deye 5kW",
      brand: "Deye",
      category: "energia" as const,
      shortSpec: "5kW • 48V",
      price: 890,
      image: `${PUBLIC}/AB6AXuDNfnPTtBdU8z628XE106IyDFok0BHF6P8-WPPAmAk1Ac8tkYmxWIkLU1t0vdPj6bT7oRSZBisHRp_ku9GPh-iCwp3G3yfBOTL0jpDIDLCHqMov5JcAiGPYKZSEq9oBCQEB71QPRnAzkMoJqAssM0x0vUy45W2ymam2emueUy_OdBk8iE0_DOY1RCVyUSiD41sgvDq2WEeuBsgwele2_zxPlAoAUVgR6GV7zCsLfi4OD1yLQ62fWR4`,
      subcategory: "energia" as const,
      subcategory_name: "Inversores",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Garantía 1 Año", kind: "primary" as const, dot: true },
      seriesTag: "Power Station",
      condition: "Lista para uso",
      featured: true,
    },
  ],

  accesorios_cargadores: [
    {
      slug: "adaptador-usb-c-20w",
      name: "Adaptador USB-C 20W Apple",
      brand: "Accesorios Apple",
      category: "accesorios" as const,
      shortSpec: "Carga Rápida Original • Sellado",
      price: 28,
      image: `${PUBLIC}/AB6AXuCe98FQKK-8f1Mu30G90gpDYxss-NJeeZwzvWUfDJYh6vFUVZEzvTS0HJwqLisyj9ztFoEpbwksKFvvEAXjsW85GmnKUxARLpwmcZl4Ff7HExF0jm714TSgHaAQobvg1R-VkKN5Illizo2DiosLl-Ei3SPVPnlhEtD0RdUJETNNMgs38ZJmJjimLmZeZx9qAdaud9-wHpUxNgcUpzFz1wvVQWPWvgjV-LLOS2v1ArY2vySU3ezo5q4`,
      subcategory: "accesorios" as const,
      subcategory_name: "Cargadores & Cables",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Original",
      featured: false,
    },
    {
      slug: "cargador-portable",
      name: "Cargador Portátil 100W",
      brand: "Accesorios",
      category: "accesorios" as const,
      shortSpec: "Carga Rápida 100W",
      price: 45,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      subcategory: "accesorios" as const,
      subcategory_name: "Cargadores & Cables",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "",
      featured: false,
    },
  ],
};

/** Get categories tree (mimics /api/v1/categories/) */
export function useMockCategories(): Category[] {
  // Transform mockCategoriesTree to Category[] format
  const result: Category[] = [
    { id: "todos", label: "Todos" },
    { id: "telefonos", label: "Teléfonos" },
    { id: "energia", label: "Energía & Respaldo" },
    { id: "accesorios", label: "Audio & Accesorios" },
  ];
  return result;
}

/** Get subcategories for a category (mimics /api/v1/categories/{slug}/subcategories/) */
export function useMockSubcategories(categorySlug: string) {
  const category = mockCategoriesTree.find((c) => c.slug === categorySlug);
  if (!category) return [];

  // Transform to the format expected by StoreCatalog
  return category.subcategories.map((sub) => ({
    name: sub.name,
    count: sub.products_count,
    icon: sub.name === "Apple"
      ? "phone_iphone"
      : sub.name === "Samsung"
        ? "android"
        : sub.name === "Xiaomi"
          ? "devices"
          : "mobile_friendly",
  }));
}

/** Get products with filters (mimics /api/v1/products/) */
export function useMockProducts(filters: {
  category_slug?: string;
  subcategory_slug?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  search?: string;
} = {}): { data: Product[]; meta: { page: number; page_size: number; total_pages: number; total_items: number } } {
  let products = [...mockProductsByFilter.todos];

  if (filters.category_slug) {
    products = products.filter(
      (p) => p.subcategory === filters.category_slug! || !p.subcategory
    );
  }

  if (filters.subcategory_slug) {
    products = products.filter(
      (p) => p.subcategory === filters.subcategory_slug!
    );
  }

  if (filters.min_price != null) {
    products = products.filter((p) => p.price >= (filters.min_price! || 0));
  }

  if (filters.max_price != null) {
    products = products.filter((p) => p.price <= (filters.max_price! || Infinity));
  }

  if (filters.is_featured != null) {
    products = products.filter((p) => p.featured === filters.is_featured!);
  }

  if (filters.search) {
    const searchLower = filters.search!.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.subcategory_name && p.subcategory_name!.toLowerCase().includes(searchLower))
    );
  }

  // Sort by name default
  products.sort((a, b) => a.name.localeCompare(b.name));

  // Defensive: ensure returned products always have at least one color and one storage
  const normalized = products.map((p) => ({
    // keep original shape
    ...p,
    colors: p.colors && p.colors.length ? p.colors : [{ name: p.colorLabel || "Default" }],
    storages: p.storages && p.storages.length ? p.storages : [{ label: "Default", price: p.price }],
  }));

  return {
    data: normalized,
    meta: {
      page: 1,
      page_size: normalized.length,
      total_pages: 1,
      total_items: normalized.length,
    },
  };
}