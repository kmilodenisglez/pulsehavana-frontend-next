"use client";

import type { StoreCatalogData } from "@/lib/store-catalog";
import { useStoreView } from "@/lib/store-view";
import { StoreCatalog } from "./StoreCatalog";
import { StoreCategories } from "./StoreCategories";
import { StoreHero } from "./StoreHero";
import { TrustCard } from "./TrustCard";

export interface StoreFrontProps {
  /** Everything this URL renders, resolved on the server from `?cat=`. */
  data: StoreCatalogData;
}

/**
 * Storefront home body: renders the mobile/tablet categories view and the shop,
 * so the hero, the catalog and the explorer always agree on the selection.
 *
 * The selection is not state held here: `?cat=<slug>` is the URL's, resolved by
 * the server (`getStoreCatalog`) and turned into links by the children, so the
 * same URL always renders the same catalog — server-side and for whoever opens
 * the shared link.
 *
 * Below `lg` the "Categorías" item of the `BottomNav` swaps the shop for the
 * full-screen categories view (see `useStoreView`). Desktop ignores the view, so
 * both branches are always drawn there and the pills inside `StoreCatalog`
 * handle the two tiers.
 */
export function StoreFront({ data }: StoreFrontProps) {
  const { view } = useStoreView();
  const isCategoriesView = view === "categorias";

  return (
    <>
      {/* Mobile & tablet only: the categories view takes over the screen (the
          header and the bottom navigation stay put). */}
      {isCategoriesView ? <StoreCategories data={data} /> : null}

      {/* Shop view. It stays mounted while the categories view is open — that
          keeps the scroll position and the already-loaded product imagery — but
          steps aside below `lg`, where the categories view owns the screen. */}
      <div className={`${isCategoriesView ? "hidden lg:flex" : "flex"} flex-col w-full`}>
        {/* The hero is the shop's home header: it only shows on the unfiltered
            catalog, so any category (parent or collection) takes it away and the
            products keep the screen. The categories view takes it away with the
            shop itself. */}
        {data.selection.slug === null ? <StoreHero /> : null}
        <StoreCatalog data={data} />
        <TrustCard />
      </div>
    </>
  );
}
