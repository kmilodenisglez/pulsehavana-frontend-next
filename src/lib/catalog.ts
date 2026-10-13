import { productImages } from "./assets";
import type { CartLine, Category, Product } from "./types";

export const categories: Category[] = [
  { id: "todos", label: "Todos" },
  { id: "apple-iphone", label: "Apple iPhone" },
  { id: "samsung-galaxy", label: "Samsung Galaxy" },
  { id: "xiaomi", label: "Xiaomi" },
  { id: "accesorios", label: "Accesorios" },
  { id: "panel-solar", label: "Panel Solar" },
  { id: "estacion-energia", label: "Estación de Energía" },
];

const appleBadges = [
  { label: "Nuevo Sellado", kind: "success" as const, dot: true },
  {
    label: "Garantía directa de tienda",
    kind: "primary" as const,
    icon: "verified_user",
    iconFilled: true,
  },
];

const iphone15ProMax: Product = {
  slug: "iphone-15-pro-max",
  name: "iPhone 15 Pro Max",
  brand: "Apple Hardware",
  category: "apple-iphone",
  shortSpec: "256GB • Titanio",
  price: 1180,
  image: productImages.iphone15ProMax,
  stock: { status: "low-stock", label: "En stock (3 unid.)", units: 3 },
  badge: { label: "Nuevo", kind: "success", dot: true },
  seriesTag: "Pro Grade",
  condition: "Libre de Fábrica",
  colorLabel: "Acabado Titanio",
  description:
    "El flagship de Apple con chasis de titanio grado aeroespacial, chip A17 Pro y sistema de cámaras profesional.",
  gallery: [
    {
      src: productImages.iphone15ProMax,
      alt: "iPhone 15 Pro Max en Titanio Natural",
      label: "Vista Frontal & Trasera",
    },
  ],
  colors: [
    { name: "Titanio Natural", hex: "#9f9587" },
    { name: "Titanio Negro", hex: "#3c3b3e" },
    { name: "Titanio Blanco", hex: "#e3e4e5" },
  ],
  storages: [
    { label: "256GB", price: 1180 },
    { label: "512GB", price: 1320 },
    { label: "1TB", price: 1480 },
  ],
  specs: [
    {
      icon: "smartphone",
      label: "Pantalla",
      title: 'Super Retina XDR 6.7"',
      subtitle: "OLED 120Hz ProMotion",
    },
    {
      icon: "memory",
      label: "Procesador",
      title: "Chip A17 Pro",
      subtitle: "GPU de 6 núcleos con trazado",
    },
    {
      icon: "photo_camera",
      label: "Cámara",
      title: "Sistema Triple 48MP",
      subtitle: "Teleobjetivo 5x y modo Retrato",
    },
    {
      icon: "cable",
      label: "Conectividad",
      title: "Puerto USB-C",
      subtitle: "Compatibilidad USB 3 (10 Gb/s)",
    },
  ],
  detailBadges: appleBadges,
  featured: true,
};

const iphone15Pro: Product = {
  slug: "iphone-15-pro",
  name: "iPhone 15 Pro",
  brand: "Apple Hardware",
  category: "apple-iphone",
  shortSpec: "128GB • Titanio",
  price: 940,
  image: productImages.iphone15ProCart,
  stock: { status: "in-stock", label: "En Stock" },
  badge: { label: "Nuevo", kind: "success", dot: true },
  seriesTag: "Pro Grade",
  condition: "Libre de Fábrica",
  colorLabel: "Acabado Titanio",
  description:
    "Titanio grado aeroespacial, chip A17 Pro y un sistema de cámaras profesional en un diseño más ligero que nunca.",
  gallery: [
    {
      src: productImages.iphone15ProFront,
      alt: "iPhone 15 Pro Titanio Natural",
      label: "Vista Frontal & Trasera",
    },
    {
      src: productImages.iphone15ProEdge,
      alt: "Detalle Titanio Natural",
      label: "Borde Titanio Grado 5",
    },
    {
      src: productImages.iphone15ProPort,
      alt: "Conector USB-C",
      label: "Puerto USB-C 3",
    },
  ],
  colors: [
    { name: "Titanio Natural", hex: "#9f9587" },
    { name: "Titanio Negro", hex: "#3c3b3e" },
    { name: "Titanio Blanco", hex: "#e3e4e5" },
  ],
  storages: [
    { label: "128GB", price: 940 },
    { label: "256GB", price: 1050 },
    { label: "512GB", price: 1240 },
  ],
  specs: [
    {
      icon: "smartphone",
      label: "Pantalla",
      title: 'Super Retina XDR 6.1"',
      subtitle: "OLED 120Hz ProMotion",
    },
    {
      icon: "memory",
      label: "Procesador",
      title: "Chip A17 Pro",
      subtitle: "GPU de 6 núcleos con trazado",
    },
    {
      icon: "photo_camera",
      label: "Cámara",
      title: "Sistema Triple 48MP",
      subtitle: "Teleobjetivo 3x y modo Retrato",
    },
    {
      icon: "cable",
      label: "Conectividad",
      title: "Puerto USB-C",
      subtitle: "Compatibilidad USB 3 (10 Gb/s)",
    },
  ],
  detailBadges: appleBadges,
  featured: false,
};

const iphone14: Product = {
  slug: "iphone-14",
  name: "iPhone 14",
  brand: "Apple Hardware",
  category: "apple-iphone",
  shortSpec: "128GB • Medianoche",
  price: 640,
  image: productImages.iphone14,
  stock: { status: "in-stock", label: "En stock" },
  badge: { label: "Reacond. A+", kind: "primary", dot: true },
  seriesTag: "Reacond. A+",
  condition: "Reacondicionado A+",
  colorLabel: "Acabado",
  description:
    "iPhone 14 reacondicionado grado A+ con batería verificada y garantía directa de tienda.",
  gallery: [
    {
      src: productImages.iphone14,
      alt: "iPhone 14 Medianoche",
      label: "Vista Frontal & Trasera",
    },
  ],
  colors: [
    { name: "Medianoche", hex: "#2e3641" },
    { name: "Morado", hex: "#b8b0d1" },
    { name: "Blanco Estelar", hex: "#e3e4e5" },
  ],
  storages: [
    { label: "128GB", price: 640 },
    { label: "256GB", price: 720 },
  ],
  specs: [
    {
      icon: "smartphone",
      label: "Pantalla",
      title: 'Super Retina XDR 6.1"',
      subtitle: "OLED 60Hz",
    },
    { icon: "memory", label: "Procesador", title: "Chip A15 Bionic", subtitle: "GPU de 5 núcleos" },
    {
      icon: "photo_camera",
      label: "Cámara",
      title: "Sistema Dual 12MP",
      subtitle: "Gran angular y ultra gran angular",
    },
    {
      icon: "battery_full",
      label: "Batería",
      title: "Hasta 87% de salud",
      subtitle: "Verificada en tienda",
    },
  ],
  detailBadges: [
    { label: "Reacondicionado A+", kind: "primary", dot: true },
    { label: "Garantía directa de tienda", kind: "success", icon: "verified_user", iconFilled: true },
  ],
  featured: true,
};

const galaxyS24Ultra: Product = {
  slug: "galaxy-s24-ultra",
  name: "Galaxy S24 Ultra",
  brand: "Samsung Galaxy",
  category: "samsung-galaxy",
  shortSpec: "256GB • S-Pen",
  price: 1050,
  image: productImages.galaxyS24Ultra,
  stock: { status: "in-stock", label: "En stock" },
  badge: { label: "Nuevo", kind: "success", dot: true },
  seriesTag: "Ultra",
  condition: "Libre de Fábrica",
  colorLabel: "Acabado Titanio",
  description:
    "Galaxy AI, marco de titanio y S-Pen integrado. La experiencia Samsung más completa.",
  gallery: [
    {
      src: productImages.galaxyS24Ultra,
      alt: "Samsung Galaxy S24 Ultra Titanium Gray",
      label: "Vista Frontal & Trasera",
    },
  ],
  colors: [
    { name: "Titanium Gray", hex: "#8a8d93" },
    { name: "Titanium Black", hex: "#2f3136" },
    { name: "Titanium Violet", hex: "#c9c0dd" },
  ],
  storages: [
    { label: "256GB", price: 1050 },
    { label: "512GB", price: 1150 },
  ],
  specs: [
    {
      icon: "smartphone",
      label: "Pantalla",
      title: 'Dynamic AMOLED 6.8"',
      subtitle: "QHD+ 120Hz adaptativo",
    },
    { icon: "memory", label: "Procesador", title: "Snapdragon 8 Gen 3", subtitle: "Para Galaxy" },
    {
      icon: "photo_camera",
      label: "Cámara",
      title: "Cuádruple 200MP",
      subtitle: "Zoom óptico 5x y AI",
    },
    {
      icon: "edit",
      label: "S-Pen",
      title: "Lápiz integrado",
      subtitle: "Notas y trazos de precisión",
    },
  ],
  detailBadges: [
    { label: "Nuevo Sellado", kind: "success", dot: true },
    { label: "Garantía directa de tienda", kind: "primary", icon: "verified_user", iconFilled: true },
  ],
  featured: true,
};

const iphone13: Product = {
  slug: "iphone-13",
  name: "iPhone 13",
  brand: "Apple Hardware",
  category: "apple-iphone",
  shortSpec: "128GB • Blanco",
  price: 490,
  image: productImages.iphone13,
  stock: { status: "out-of-stock", label: "Agotado" },
  badge: { label: "Reacond.", kind: "neutral" },
  seriesTag: "Reacond.",
  condition: "Reacondicionado Certificado",
  colorLabel: "Acabado",
  description:
    "iPhone 13 reacondicionado certificado. Excelente relación calidad-precio con garantía de tienda.",
  gallery: [
    {
      src: productImages.iphone13,
      alt: "iPhone 13 Blanco",
      label: "Vista Frontal & Trasera",
    },
  ],
  colors: [
    { name: "Blanco Estelar", hex: "#e3e4e5" },
    { name: "Medianoche", hex: "#2e3641" },
    { name: "Rosa", hex: "#f0cdd3" },
  ],
  storages: [{ label: "128GB", price: 490 }],
  specs: [
    {
      icon: "smartphone",
      label: "Pantalla",
      title: 'Super Retina XDR 6.1"',
      subtitle: "OLED 60Hz",
    },
    { icon: "memory", label: "Procesador", title: "Chip A15 Bionic", subtitle: "GPU de 4 núcleos" },
    {
      icon: "photo_camera",
      label: "Cámara",
      title: "Sistema Dual 12MP",
      subtitle: "Modo Cine 1080p",
    },
    {
      icon: "battery_full",
      label: "Batería",
      title: "Hasta 85% de salud",
      subtitle: "Verificada en tienda",
    },
  ],
  detailBadges: [
    { label: "Reacondicionado", kind: "neutral", dot: true },
    { label: "Garantía directa de tienda", kind: "primary", icon: "verified_user", iconFilled: true },
  ],
  featured: true,
};

const adapterUsbC: Product = {
  slug: "adaptador-usb-c-20w-apple",
  name: "Adaptador USB-C 20W Apple",
  brand: "Accesorios Apple",
  category: "accesorios",
  shortSpec: "Carga Rápida Original • Sellado",
  price: 28,
  image: productImages.adapterUsbC,
  stock: { status: "in-stock", label: "En stock" },
  badge: { label: "Nuevo", kind: "success", dot: true },
  seriesTag: "Original",
  condition: "Sellado Original",
  colorLabel: "Acabado",
  description:
    "Adaptador de corriente USB-C de 20 W original Apple para carga rápida de iPhone y iPad.",
  gallery: [
    {
      src: productImages.adapterUsbC,
      alt: "Adaptador USB-C 20W Apple",
      label: "Producto",
    },
  ],
  colors: [{ name: "Blanco", hex: "#ffffff" }],
  storages: [{ label: "20W", price: 28 }],
  specs: [
    { icon: "bolt", label: "Potencia", title: "20 W", subtitle: "Carga rápida USB-C" },
    { icon: "verified", label: "Original", title: "Apple", subtitle: "Producto sellado" },
    { icon: "cable", label: "Conector", title: "USB-C", subtitle: "Compatible con iPhone 15" },
    { icon: "shield", label: "Garantía", title: "30 días", subtitle: "Directa en tienda" },
  ],
  detailBadges: [
    { label: "Sellado Original", kind: "success", dot: true },
    { label: "Garantía directa de tienda", kind: "primary", icon: "verified_user", iconFilled: true },
  ],
  featured: false,
};

const panelSolar: Product = {
  slug: "panel-solar-400w",
  name: "Panel Solar 400W",
  brand: "EcoVolt",
  category: "panel-solar",
  shortSpec: "400W • Monocristalino",
  price: 420,
  image: productImages.solarPanel,
  stock: { status: "in-stock", label: "En stock" },
  badge: { label: "Eficiencia", kind: "success", dot: true },
  seriesTag: "Solar",
  condition: "Certificado",
  colorLabel: "Acabado",
  description:
    "Panel solar monocristalino de 400 W diseñado para carga doméstica y sistemas de respaldo con excelente rendimiento diario.",
  gallery: [
    {
      src: productImages.solarPanel,
      alt: "Panel solar 400W",
      label: "Panel Solar",
    },
  ],
  colors: [
    { name: "Negro", hex: "#111827" },
    { name: "Plata", hex: "#d1d5db" },
  ],
  storages: [
    { label: "400W", price: 420 },
    { label: "600W", price: 560 },
  ],
  specs: [
    { icon: "solar_power", label: "Potencia", title: "400 W", subtitle: "Máxima generación diaria" },
    { icon: "battery_charging_full", label: "Eficiencia", title: "21.8%", subtitle: "Alta conversión solar" },
    { icon: "shield", label: "Durabilidad", title: "25 años", subtitle: "Garantía de rendimiento" },
    { icon: "thermostat", label: "Uso", title: "Residencial", subtitle: "Sistema híbrido y autoconsumo" },
  ],
  detailBadges: [
    { label: "Eficiencia certificada", kind: "success", dot: true },
    { label: "Instalación guiada", kind: "primary", icon: "support_agent", iconFilled: true },
  ],
  featured: true,
};

const estacionEnergia: Product = {
  slug: "estacion-energia-portatil-1kwh",
  name: "Estación de Energía 1 kWh",
  brand: "VoltNest",
  category: "estacion-energia",
  shortSpec: "1 kWh • Portátil",
  price: 890,
  image: productImages.powerStation,
  stock: { status: "low-stock", label: "Pocas unidades" },
  badge: { label: "Backup", kind: "primary", dot: true },
  seriesTag: "Power Station",
  condition: "Lista para uso",
  colorLabel: "Acabado",
  description:
    "Estación de energía portátil con salida estable para respaldo doméstico, herramientas y equipos esenciales en cualquier momento.",
  gallery: [
    {
      src: productImages.powerStation,
      alt: "Estación de energía portátil",
      label: "Power Station",
    },
  ],
  colors: [
    { name: "Gris", hex: "#6b7280" },
    { name: "Negro", hex: "#111827" },
  ],
  storages: [
    { label: "1 kWh", price: 890 },
    { label: "2 kWh", price: 1240 },
  ],
  specs: [
    { icon: "battery_charging_full", label: "Capacidad", title: "1 kWh", subtitle: "Almacenamiento portátil" },
    { icon: "bolt", label: "Potencia", title: "1200 W", subtitle: "Salida continua estable" },
    { icon: "sync", label: "Carga", title: "Solar + AC", subtitle: "Carga híbrida rápida" },
    { icon: "timer", label: "Autonomía", title: "Hasta 12h", subtitle: "Dependiendo del consumo" },
  ],
  detailBadges: [
    { label: "Respaldo doméstico", kind: "primary", dot: true },
    { label: "Carga solar compatible", kind: "success", icon: "solar_power", iconFilled: true },
  ],
  featured: true,
};

/** Products shown in the storefront grid. */
export const products: Product[] = [
  iphone15ProMax,
  iphone14,
  galaxyS24Ultra,
  iphone13,
  panelSolar,
  estacionEnergia,
];

/** Everything resolvable by slug (catalog + extras used by the cart). */
export const allProducts: Product[] = [...products, iphone15Pro, adapterUsbC];

export function getProduct(slug: string): Product | undefined {
  return allProducts.find((product) => product.slug === slug);
}

export function getFeaturedByCategory(category: Category["id"]): Product[] {
  if (category === "todos") return products;
  return products.filter((product) => product.category === category);
}

/** Cart seed mirroring the "Tu Pedido" state from the checkout reference design. */
export function seedCartLines(): CartLine[] {
  return [
    {
      id: "iphone-15-pro|128GB|Titanio Natural",
      slug: iphone15Pro.slug,
      name: "iPhone 15 Pro 128GB",
      subtitle: "Titanio Natural · Libre de Fábrica",
      unitPrice: 940,
      qty: 1,
      image: iphone15Pro.image,
    },
    {
      id: "adaptador-usb-c-20w-apple|20W|Blanco",
      slug: adapterUsbC.slug,
      name: "Adaptador USB-C 20W Apple",
      subtitle: "Carga Rápida Original · Sellado",
      unitPrice: 28,
      qty: 1,
      image: adapterUsbC.image,
    },
  ];
}
