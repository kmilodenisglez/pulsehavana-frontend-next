import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackHeader } from "@/components/BackHeader";
import { ProductDetail } from "@/components/ProductDetail";
import { allProducts, getProduct } from "@/lib/catalog";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <BackHeader title="Detalle De Producto" />
      <main className="flex flex-col relative w-full pt-16 bg-surface flex-grow">
        <div className="flex flex-col w-full pb-safe">
          <ProductDetail product={product} />
        </div>
      </main>
    </>
  );
}
