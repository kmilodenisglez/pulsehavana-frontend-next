import { Suspense } from "react";
import type { Metadata } from "next";
import { BottomNav } from "@/components/BottomNav";
import { StoreFront } from "@/components/StoreFront";
import { StoreFrontSkeleton } from "@/components/StoreFrontSkeleton";
import { StoreHeader } from "@/components/StoreHeader";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getStoreCatalog } from "@/lib/store-catalog.server";

export const metadata: Metadata = {
  title: "Inicio",
};

/** `?cat=` as a single slug: a repeated parameter is not a catalog filter. */
function readCatalogSlug(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() || undefined;
}

/**
 * Storefront home. It is also the filtered catalog: the selection lives in the
 * URL (`?cat=<slug>`), so every category and collection has a link that can be
 * copied, shared and opened straight into the same view.
 *
 * The URL data streams into the page's static shell (header, navigation) through
 * a `Suspense` boundary, which is what Cache Components asks for: without it the
 * whole route would render per request instead of prerendering what does not
 * depend on the URL.
 */
export default function StorePage({ searchParams }: PageProps<"/">) {
  return (
    <>
      <StoreHeader />
      <main className="flex flex-col relative w-full pt-16 pb-24 lg:pb-8 bg-surface flex-grow">
        <div className="flex flex-col w-full mx-auto max-w-[1280px]">
          <Suspense fallback={<StoreFrontSkeleton />}>
            <StoreFrontData searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
      <WhatsAppFab />
      <BottomNav />
    </>
  );
}

/** One query per URL: resolve `?cat=` and fetch that catalog on the server. */
async function StoreFrontData({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { cat } = await searchParams;
  const data = await getStoreCatalog(readCatalogSlug(cat));
  return <StoreFront data={data} />;
}
