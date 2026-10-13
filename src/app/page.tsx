import type { Metadata } from "next";
import { BottomNav } from "@/components/BottomNav";
import { StoreCatalog } from "@/components/StoreCatalog";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreHero } from "@/components/StoreHero";
import { TrustCard } from "@/components/TrustCard";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export const metadata: Metadata = {
  title: "Inicio",
};

export default function StorePage() {
  return (
    <>
      <StoreHeader />
      <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface flex-grow">
        <div className="flex flex-col w-full mx-auto max-w-[1280px]">
          <StoreHero />
          <StoreCatalog />
          <TrustCard />
        </div>
      </main>
      <WhatsAppFab />
      <BottomNav />
    </>
  );
}
