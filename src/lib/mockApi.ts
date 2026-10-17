/**
 * Mock API service for development without backend connection.
 * Returns the same shape as the real Django DRF endpoints.
 * To switch to real backend: replace import in StoreCatalog.tsx
 * and change the fetch URLs from /api/v1/ to the real endpoint.
 */
import type { Category, Product, Subcategory } from "./types";

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
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        is_active: true,
        products_count: 7,
      },
      {
        id: "paneles-solares",
        name: "Paneles Solares",
        slug: "paneles-solares",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        is_active: true,
        products_count: 5,
      },
      {
        id: "accesorios-solares",
        name: "Accesorios Solares",
        slug: "accesorios-solares",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        is_active: true,
        products_count: 20,
      },
      {
        id: "audio-airpods",
        name: "Audio & Airpods",
        slug: "audio-airpods",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
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
      category: "telefonos" as const,
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
      description: "El flagship de Apple con chasis de titanio, chip A17 Pro y sistema de cámaras profesional.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "iphone-14",
      name: "iPhone 14",
      brand: "Apple Hardware",
      category: "telefonos" as const,
      shortSpec: "128GB • Medianoche",
      price: 640,
      image: `${PUBLIC}/AB6AXuDNfnPTtBdU8z628XE106IyDFok0BHF6P8-WPPAmAk1Ac8tkYmxWIkLU1t0vdPj6bT7oRSZBisHRp_ku9GPh-iCwp3G3yfBOTL0jpDIDLCHqMov5JcAiGPYKZSEq9oBCQEB71QPRnAzkMoJqAssM0x0vUy45W2ymam2emueUy_OdBk8iE0_DOY1RCVyUSiD41sgvDq2WEeuBsgwele2_zxPlAoAUVgR6GV7zCsLfi4OD1yLQ62fWR4`,
      subcategory: "apple-iphone" as const,
      subcategory_name: "Apple",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Reacond. A+", kind: "primary" as const, dot: true },
      seriesTag: "Reacond. A+",
      condition: "Libre de Fábrica",
      colorLabel: "Medianoche",
      description: "iPhone 14 en excelente estado con batería y cámara certificadas.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "iphone-13",
      name: "iPhone 13",
      brand: "Apple Hardware",
      category: "telefonos" as const,
      shortSpec: "128GB • Azul",
      price: 590,
      image: `${PUBLIC}/AB6AXuDNfnPTtBdU8z628XE106IyDFok0BHF6P8-WPPAmAk1Ac8tkYmxWIkLU1t0vdPj6bT7oRSZBisHRp_ku9GPh-iCwp3G3yfBOTL0jpDIDLCHqMov5JcAiGPYKZSEq9oBCQEB71QPRnAzkMoJqAssM0x0vUy45W2ymam2emueUy_OdBk8iE0_DOY1RCVyUSiD41sgvDq2WEeuBsgwele2_zxPlAoAUVgR6GV7zCsLfi4OD1yLQ62fWR4`,
      subcategory: "apple-iphone" as const,
      subcategory_name: "Apple",
      stock: { status: "in-stock" as const, label: "En stock", units: 2 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Año 2022",
      condition: "Libre de Fábrica",
      colorLabel: "Azul",
      description: "Modelo 2022, batería excelente y cámaras nítidas para uso diario.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
    {
      slug: "galaxy-s24-ultra",
      name: "Galaxy S24 Ultra",
      brand: "Samsung Galaxy",
      category: "telefonos" as const,
      shortSpec: "256GB • Gris Titanio",
      price: 1050,
      image: `${PUBLIC}/AB6AXuA8PREatewAL0Gzd1y55wmjEx4fWABLVLxQ_CwnnNxmh29NnDrNys_Big3qIRJ0uoQi-xGYN4GbwG0bgoezX0wS8DhGibnEclrhIIXcaEmJZ_hiJDnq-G5s4CEsb9tdLwqJ_C0gscApRCZUGw4-NFK1hI25qQXDTnM1eBnlCXhWe-b08rwutM5XAucrmkKcZgpzB41qyPQpROvueE8jX5XMCqH6RqXcKkP0WJ_xYFNGdahmf8sULrQ`,
      subcategory: "samsung-galaxy" as const,
      subcategory_name: "Samsung",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Ultra",
      condition: "Libre de Fábrica",
      colorLabel: "Gris Titanio",
      description: "Galaxy AI, marco de titanio y S-Pen integrado. La experiencia Samsung más completa.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "galaxy-s23-fe",
      name: "Galaxy S23 FE",
      brand: "Samsung Galaxy",
      category: "telefonos" as const,
      shortSpec: "128GB • Mint",
      price: 780,
      image: `${PUBLIC}/AB6AXuA8PREatewAL0Gzd1y55wmjEx4fWABLVLxQ_CwnnNxmh29NnDrNys_Big3qIRJ0uoQi-xGYN4GbwG0bgoezX0wS8DhGibnEclrhIIXcaEmJZ_hiJDnq-G5s4CEsb9tdLwqJ_C0gscApRCZUGw4-NFK1hI25qQXDTnM1eBnlCXhWe-b08rwutM5XAucrmkKcZgpzB41qyPQpROvueE8jX5XMCqH6RqXcKkP0WJ_xYFNGdahmf8sULrQ`,
      subcategory: "samsung-galaxy" as const,
      subcategory_name: "Samsung",
      stock: { status: "low-stock" as const, label: "Pocas unidades", units: 2 },
      badge: { label: "Oferta", kind: "primary" as const, dot: true },
      seriesTag: "Fan Edition",
      condition: "Libre de Fábrica",
      colorLabel: "Mint",
      description: "Versión FE con rendimiento sólido y pantalla brillante para uso diario.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
    {
      slug: "xiaomi-mi-13",
      name: "Xiaomi Mi 13",
      brand: "Xiaomi",
      category: "telefonos" as const,
      shortSpec: "256GB • Blanco",
      price: 620,
      image: `${PUBLIC}/AB6AXuAjYsiAS_eapqCE9fazpfOi-ptyAP7e2aorAuzml7BVkSWFXIrl94KVU-7kv9J6cVMY58LmegMrg7oauZCxmzzNrafDKlUgn08Vei5iiLRzttL-dhaPG-UgKxq6CM44oGPWpkBTDSrcEKvUXiocrtLoafqGYHh2TBo0D4YDAewm2BMmy-dgRsBoOLq5KN3JCIkrxMXuf1tYwt7Dko7ri5w0qNcRu3J6dwsEiNaWNEmOU8Epsh67IKc`,
      subcategory: "xiaomi" as const,
      subcategory_name: "Xiaomi",
      stock: { status: "in-stock" as const, label: "En stock", units: 2 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Mi",
      condition: "Libre de Fábrica",
      colorLabel: "Blanco",
      description: "Xiaomi Mi 13 con cámara versátil y excelente equilibrio precio-rendimiento.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
    {
      slug: "redmi-note-13-pro",
      name: "Redmi Note 13 Pro",
      brand: "Xiaomi",
      category: "telefonos" as const,
      shortSpec: "256GB • Grafito",
      price: 470,
      image: `${PUBLIC}/AB6AXuAjYsiAS_eapqCE9fazpfOi-ptyAP7e2aorAuzml7BVkSWFXIrl94KVU-7kv9J6cVMY58LmegMrg7oauZCxmzzNrafDKlUgn08Vei5iiLRzttL-dhaPG-UgKxq6CM44oGPWpkBTDSrcEKvUXiocrtLoafqGYHh2TBo0D4YDAewm2BMmy-dgRsBoOLq5KN3JCIkrxMXuf1tYwt7Dko7ri5w0qNcRu3J6dwsEiNaWNEmOU8Epsh67IKc`,
      subcategory: "xiaomi" as const,
      subcategory_name: "Xiaomi",
      stock: { status: "in-stock" as const, label: "En stock", units: 3 },
      badge: { label: "Pro", kind: "primary" as const, dot: true },
      seriesTag: "Note",
      condition: "Libre de Fábrica",
      colorLabel: "Grafito",
      description: "Pantalla AMOLED y batería larga duración ideal para uso constante.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
    {
      slug: "pixel-8-pro",
      name: "Pixel 8 Pro",
      brand: "Google",
      category: "telefonos" as const,
      shortSpec: "128GB • Obsidiana",
      price: 980,
      image: `${PUBLIC}/AB6AXuA8PREatewAL0Gzd1y55wmjEx4fWABLVLxQ_CwnnNxmh29NnDrNys_Big3qIRJ0uoQi-xGYN4GbwG0bgoezX0wS8DhGibnEclrhIIXcaEmJZ_hiJDnq-G5s4CEsb9tdLwqJ_C0gscApRCZUGw4-NFK1hI25qQXDTnM1eBnlCXhWe-b08rwutM5XAucrmkKcZgpzB41qyPQpROvueE8jX5XMCqH6RqXcKkP0WJ_xYFNGdahmf8sULrQ`,
      subcategory: "google" as const,
      subcategory_name: "Google",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "AI Camera",
      condition: "Libre de Fábrica",
      colorLabel: "Obsidiana",
      description: "Google Pixel 8 Pro con experiencia de cámara y AI muy competitiva.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "pixel-8",
      name: "Pixel 8",
      brand: "Google",
      category: "telefonos" as const,
      shortSpec: "128GB • Rosa",
      price: 760,
      image: `${PUBLIC}/AB6AXuA6iJFRBk7YIpk6OngBkxvtwZKskaH0sh1Xg6Ugg0nUmre3NWsnUhV78P_kwzROhUglCw8HWMcUYpEq0WpJMEiVvm61tgH42EmgmgEq8mCc0GIAoCx8mtEfPaq2TepcX3MJXYMzhDtO9Sipo0opLPudoyE2S06pWMUwu50FjVfkJhGImDAOr4rJvkd3hlGDnNwSTDP3zEMHeWiZQlcf_JFNI9vYQdQxpcF8n1N-riu5RBv7C76yUdQ`,
      subcategory: "google" as const,
      subcategory_name: "Google",
      stock: { status: "low-stock" as const, label: "Pocas unidades", units: 1 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Pixel",
      condition: "Libre de Fábrica",
      colorLabel: "Rosa",
      description: "Pixel 8 compacto, limpio y potente para quien quiere Android puro.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
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
      subcategory: "inversores" as const,
      subcategory_name: "Inversores",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Garantía 1 Año", kind: "primary" as const, dot: true },
      seriesTag: "Power Station",
      condition: "Lista para uso",
      colorLabel: "Blanco",
      description: "Inversor híbrido 5kW con monitorización WiFi y gran eficiencia.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "inversor-growatt-5kw",
      name: "Inversor Growatt 5kW",
      brand: "Growatt",
      category: "energia" as const,
      shortSpec: "5kW • Monofásico",
      price: 850,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      subcategory: "inversores" as const,
      subcategory_name: "Inversores",
      stock: { status: "low-stock" as const, label: "Pocas unidades", units: 1 },
      badge: { label: "Backup", kind: "primary" as const, dot: true },
      seriesTag: "Hybrid",
      condition: "Lista para uso",
      colorLabel: "Negro",
      description: "Inversor híbrido confiable para respaldo doméstico y estabilidad energética.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "bateria-lifepo4-5kwh",
      name: "Batería LiFePO4 5.12kWh",
      brand: "VoltNest",
      category: "energia" as const,
      shortSpec: "48V • 100Ah",
      price: 1250,
      image: `${PUBLIC}/AB6AXuAjYsiAS_eapqCE9fazpfOi-ptyAP7e2aorAuzml7BVkSWFXIrl94KVU-7kv9J6cVMY58LmegMrg7oauZCxmzzNrafDKlUgn08Vei5iiLRzttL-dhaPG-UgKxq6CM44oGPWpkBTDSrcEKvUXiocrtLoafqGYHh2TBo0D4YDAewm2BMmy-dgRsBoOLq5KN3JCIkrxMXuf1tYwt7Dko7ri5w0qNcRu3J6dwsEiNaWNEmOU8Epsh67IKc`,
      subcategory: "baterias-litio" as const,
      subcategory_name: "Baterías Litio",
      stock: { status: "in-stock" as const, label: "En stock", units: 2 },
      badge: { label: "Grado A+", kind: "success" as const, dot: true },
      seriesTag: "LiFePO4",
      condition: "Garantizada",
      colorLabel: "Negro",
      description: "Sistema de baterías de litio para respaldo de gran capacidad y alta duración.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "bateria-lifepo4-10kwh",
      name: "Batería LiFePO4 10kWh",
      brand: "VoltNest",
      category: "energia" as const,
      shortSpec: "51.2V • 200Ah",
      price: 2100,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      subcategory: "baterias-litio" as const,
      subcategory_name: "Baterías Litio",
      stock: { status: "low-stock" as const, label: "Pocas unidades", units: 1 },
      badge: { label: "Premium", kind: "primary" as const, dot: true },
      seriesTag: "LiFePO4",
      condition: "Garantizada",
      colorLabel: "Negro",
      description: "Batería modular para sistemas con consumo medio y alto en hogares o locales.",
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
      category: "energia" as const,
      shortSpec: "400W • Monocristalino",
      price: 420,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      subcategory: "paneles-solares" as const,
      subcategory_name: "Paneles Solares",
      stock: { status: "in-stock" as const, label: "En stock", units: 4 },
      badge: { label: "Eficiencia", kind: "success" as const, dot: true },
      seriesTag: "Solar",
      condition: "Certificado",
      colorLabel: "Azul",
      description: "Panel solar monocristalino de 400 W para carga y respaldo con excelente rendimiento diario.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "panel-solar-550w",
      name: "Panel Solar 550W",
      brand: "EcoVolt",
      category: "energia" as const,
      shortSpec: "550W • Bifacial",
      price: 560,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      subcategory: "paneles-solares" as const,
      subcategory_name: "Paneles Solares",
      stock: { status: "in-stock" as const, label: "En stock", units: 3 },
      badge: { label: "Alta Eficiencia", kind: "success" as const, dot: true },
      seriesTag: "Bifacial",
      condition: "Certificado",
      colorLabel: "Azul",
      description: "Panel de mayor potencia para sistemas residenciales y de respaldo.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
    {
      slug: "controlador-mppt",
      name: "Controlador MPPT 60A",
      brand: "SolarEdge",
      category: "energia" as const,
      shortSpec: "60A • 12V/24V/48V",
      price: 240,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      subcategory: "accesorios-solares" as const,
      subcategory_name: "Accesorios Solares",
      stock: { status: "in-stock" as const, label: "En stock", units: 4 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "MPPT",
      condition: "Garantizado",
      colorLabel: "Negro",
      description: "Controlador para optimizar carga y rendimiento del sistema solar.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
    {
      slug: "cable-solar-25m",
      name: "Cable Solar 25m",
      brand: "SolarEdge",
      category: "energia" as const,
      shortSpec: "25m • 6mm²",
      price: 125,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      subcategory: "accesorios-solares" as const,
      subcategory_name: "Accesorios Solares",
      stock: { status: "in-stock" as const, label: "En stock", units: 7 },
      badge: { label: "Cable", kind: "primary" as const, dot: true },
      seriesTag: "Cable",
      condition: "Garantizado",
      colorLabel: "Negro",
      description: "Cable de interconexión para instalaciones solares de corto y medio alcance.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
    {
      slug: "adaptador-usb-c-20w",
      name: "Adaptador USB-C 20W Apple",
      brand: "Accesorios Apple",
      category: "accesorios" as const,
      shortSpec: "Carga Rápida Original • Sellado",
      price: 28,
      image: `${PUBLIC}/AB6AXuCe98FQKK-8f1Mu30G90gpDYxss-NJeeZwzvWUfDJYh6vFUVZEzvTS0HJwqLisyj9ztFoEpbwksKFvvEAXjsW85GmnKUxARLpwmcZl4Ff7HExF0jm714TSgHaAQobvg1R-VkKN5Illizo2DiosLl-Ei3SPVPnlhEtD0RdUJETNNMgs38ZJmJjimLmZeZx9qAdaud9-wHpUxNgcUpzFz1wvVQWPWvgjV-LLOS2v1ArY2vySU3ezo5q4`,
      subcategory: "cargadores-cables" as const,
      subcategory_name: "Cargadores & Cables",
      stock: { status: "in-stock" as const, label: "En stock", units: 1 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Original",
      condition: "Original",
      colorLabel: "Blanco",
      description: "Adaptador original para carga rápida y compatible con Apple.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
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
      subcategory: "cargadores-cables" as const,
      subcategory_name: "Cargadores & Cables",
      stock: { status: "in-stock" as const, label: "En stock", units: 3 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Carga",
      condition: "Garantizado",
      colorLabel: "Negro",
      description: "Cargador portátil con salida de 100W para carga rápida en movimiento.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
    {
      slug: "funda-iphone-15",
      name: "Funda iPhone 15",
      brand: "Case Pro",
      category: "accesorios" as const,
      shortSpec: "Transparente • Slim",
      price: 26,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      subcategory: "fundas-micas" as const,
      subcategory_name: "Fundas & Micas",
      stock: { status: "in-stock" as const, label: "En stock", units: 9 },
      badge: { label: "Protección", kind: "success" as const, dot: true },
      seriesTag: "Case",
      condition: "Garantizado",
      colorLabel: "Transparente",
      description: "Funda ligera con protección para canto y cámara.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
    {
      slug: "mica-samsung-s24",
      name: "Mica Samsung S24",
      brand: "Case Pro",
      category: "accesorios" as const,
      shortSpec: "Templado • 9H",
      price: 18,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      subcategory: "fundas-micas" as const,
      subcategory_name: "Fundas & Micas",
      stock: { status: "in-stock" as const, label: "En stock", units: 12 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Mica",
      condition: "Garantizado",
      colorLabel: "Blanco",
      description: "Mica de alta resistencia para protección total de la pantalla.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
    {
      slug: "airpods-pro",
      name: "AirPods Pro",
      brand: "Apple",
      category: "accesorios" as const,
      shortSpec: "ANC • MagSafe",
      price: 210,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      subcategory: "audio-airpods" as const,
      subcategory_name: "Audio & Airpods",
      stock: { status: "in-stock" as const, label: "En stock", units: 2 },
      badge: { label: "Popular", kind: "primary" as const, dot: true },
      seriesTag: "Audio",
      condition: "Original",
      colorLabel: "Blanco",
      description: "Audio con cancelación activa de ruido para máximo confort.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: true,
    },
    {
      slug: "earbuds-jbl",
      name: "Earbuds JBL",
      brand: "JBL",
      category: "accesorios" as const,
      shortSpec: "Bluetooth 5.3",
      price: 90,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      subcategory: "audio-airpods" as const,
      subcategory_name: "Audio & Airpods",
      stock: { status: "in-stock" as const, label: "En stock", units: 5 },
      badge: { label: "Nuevo", kind: "success" as const, dot: true },
      seriesTag: "Audio",
      condition: "Garantizado",
      colorLabel: "Negro",
      description: "Auriculares inalámbricos con sonido balanceado y durabilidad alta.",
      gallery: [],
      colors: [],
      storages: [],
      specs: [],
      detailBadges: [],
      featured: false,
    },
  ],
};

/** Material Symbol fallback per collection, used when the API sends no artwork. */
const SUBCATEGORY_ICONS: Record<string, string> = {
  Apple: "phone_iphone",
  Samsung: "android",
  Xiaomi: "devices",
  Google: "mobile_friendly",
  Inversores: "electrical_services",
  "Baterías Litio": "battery_charging_full",
  "Paneles Solares": "solar_power",
  "Accesorios Solares": "cable",
  "Cargadores & Cables": "power",
  "Fundas & Micas": "smartphone",
  "Audio & Airpods": "headphones",
};

/** First artwork found in a category, reused as the category tile. */
function categoryArtwork(slug: string): string | undefined {
  return mockCategoriesTree
    .find((category) => category.slug === slug)
    ?.subcategories.find((subcategory) => subcategory.image)?.image;
}

/**
 * Get categories (Tier 1) (mimics /api/v1/categories/).
 * Includes the "Todos" pseudo-category plus one tile per parent category.
 */
export function getMockCategories(): Category[] {
  const result: Category[] = [
    { id: "todos", label: "Todos", icon: "grid_view" },
    {
      id: "telefonos",
      label: "Teléfonos",
      icon: "smartphone",
      image: categoryArtwork("telefonos"),
    },
    {
      id: "energia",
      label: "Energía & Respaldo",
      icon: "battery_charging_full",
      image: categoryArtwork("energia"),
    },
    {
      id: "accesorios",
      label: "Audio & Accesorios",
      icon: "headphones",
      image: categoryArtwork("accesorios"),
    },
  ];
  return result;
}

/** Get subcategories for a category (mimics /api/v1/categories/{slug}/subcategories/). Plain function, not a hook. */
export function getMockSubcategories(categorySlug: string): Subcategory[] {
  const category = mockCategoriesTree.find((c) => c.slug === categorySlug);
  if (!category) return [];

  return category.subcategories.map((sub) => {
    const count = mockProductsByFilter.todos.filter(
      (product) => product.category === categorySlug && product.subcategory === sub.slug,
    ).length;

    return {
      name: sub.name,
      slug: sub.slug,
      count,
      icon: SUBCATEGORY_ICONS[sub.name] ?? "category",
      image: sub.image,
    };
  });
}

/**
 * Defensive normalization: the list serializer omits variant/detail data, so
 * consumers (cards *and* the product detail view) always receive at least one
 * color, one storage and one gallery image to render.
 */
export function normalizeMockProduct(p: Product): Product {
  return {
    ...p,
    colors:
      p.colors && p.colors.length
        ? p.colors
        : [{ name: p.colorLabel || "Default", hex: "#4F46E5" }],
    storages:
      p.storages && p.storages.length
        ? p.storages
        : [{ label: "Default", price: p.price }],
    gallery:
      p.gallery && p.gallery.length
        ? p.gallery
        : [{ src: p.image, alt: p.name, label: "Producto" }],
  };
}

/**
 * Resolve a single product by slug from the mock catalog.
 * Used by the product detail route so it stays in sync with the grid, which is
 * also fed by `mockProductsByFilter`.
 */
export function getMockProductBySlug(slug: string): Product | undefined {
  const raw = mockProductsByFilter.todos.find((p) => p.slug === slug);
  if (!raw) return undefined;
  return normalizeMockProduct(raw as Product);
}

/** All slugs available in the mock catalog (for static params / sitemap use). */
export function getMockProductSlugs(): string[] {
  return mockProductsByFilter.todos.map((p) => p.slug);
}

/** Get products with filters (mimics /api/v1/products/). Plain function, not a hook. */
export function getMockProducts(filters: {
  category_slug?: string;
  subcategory_slug?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  search?: string;
} = {}): { data: Product[]; meta: { page: number; page_size: number; total_pages: number; total_items: number } } {
  let products = [...mockProductsByFilter.todos];

  // If a parent category slug is provided (e.g. 'telefonos'), expand it to
  // the list of subcategory slugs and filter products that belong to any
  // of those subcategories. If a specific subcategory_slug is provided,
  // filter by that instead.
  if (filters.category_slug) {
    products = products.filter((p) => p.category === filters.category_slug);
  }

  if (filters.subcategory_slug) {
    products = products.filter((p) => p.subcategory === filters.subcategory_slug!);
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

  // Defensive: ensure returned products always have at least one color, one storage and one image
  const normalized = products.map(normalizeMockProduct);

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