import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackHeader } from "@/components/BackHeader";
import { BottomNav } from "@/components/BottomNav";
import { ProductDetail } from "@/components/ProductDetail";
import { allProducts, getProduct } from "@/lib/catalog";
import { getMockProductBySlug, getMockProductSlugs } from "@/lib/mockApi";
import type { Product } from "@/lib/types";

/**
 * This route reads `params` at the top level so an unknown slug returns a real
 * HTTP 404 before any `<Suspense>` boundary can start streaming the shell.
 * Cache Components' instant-navigation validation only accepts a streamed
 * "soft 404", so the route explicitly opts out of that dev validation.
 * See node_modules/next/dist/docs -> guides/streaming.md and
 * guides/adopting-partial-prefetching.md.
 */
export const instant = false;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * The storefront grid is served by the mock API while this route has richer
 * hand-authored data in `catalog.ts`. Prefer the curated catalog and fall back
 * to the mock catalog so every product card links to something real.
 */
function resolveProduct(slug: string): Product | undefined {
  return getProduct(slug) ?? getMockProductBySlug(slug);
}

export function generateStaticParams() {
  const slugs = new Set<string>([
    ...allProducts.map((product) => product.slug),
    ...getMockProductSlugs(),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = resolveProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = resolveProduct(slug);
  if (!product) notFound();

  return (
    <>
      <BackHeader title="Detalle De Producto" />
      <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface flex-grow">
        <div className="flex flex-col w-full pb-safe">
          <ProductDetail product={product} />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
