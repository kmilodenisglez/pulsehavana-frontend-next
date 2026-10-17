import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { StoreConfigProvider } from "@/lib/store-config-provider";
import { getStoreConfig } from "@/lib/store-config.server";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const materialSymbols = localFont({
  src: "./fonts/material-symbols-outlined.woff2",
  variable: "--font-material-symbols",
  display: "swap",
  weight: "100 700",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "Pulse Havana Center Cell",
    template: "%s · Pulse Havana Center Cell",
  },
  description:
    "Tienda de telefonía en La Habana. Equipos nuevos y reacondicionados certificados, con garantía directa y recogida presencial en tienda.",
  applicationName: "Pulse Havana Center Cell",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#fcf8fb",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Public business configuration (WhatsApp, store name/address/hours) resolved
  // on the server: API first, environment/defaults when the backend is silent.
  const storeConfig = await getStoreConfig();

  return (
    <html lang="es" className={`${inter.variable} ${materialSymbols.variable} h-full`}>
      <body className="bg-surface font-body text-body text-ink-primary min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
        <StoreConfigProvider config={storeConfig}>
          <CartProvider>{children}</CartProvider>
        </StoreConfigProvider>
      </body>
    </html>
  );
}
