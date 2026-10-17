import type { Metadata } from "next";
import { BottomNav } from "@/components/BottomNav";
import { StoreFront } from "@/components/StoreFront";
import { StoreHeader } from "@/components/StoreHeader";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export const metadata: Metadata = {
  title: "Inicio",
};

export default function StorePage() {
  return (
    <>
      <StoreHeader />
      <main className="flex flex-col relative w-full pt-16 pb-24 lg:pb-8 bg-surface flex-grow">
        <div className="flex flex-col w-full mx-auto max-w-[1280px]">
          <StoreFront />
        </div>
      </main>
      <WhatsAppFab />
      <BottomNav />
    </>
  );
}
