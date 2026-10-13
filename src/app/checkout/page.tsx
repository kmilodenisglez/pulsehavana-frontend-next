import type { Metadata } from "next";
import { BackHeader } from "@/components/BackHeader";
import { CheckoutView } from "@/components/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout Exprés",
  description: "Aparta tus equipos y confirma tu pedido para recogida en tienda.",
};

export default function CheckoutPage() {
  return (
    <>
      <BackHeader title="Checkout Exprés" />
      <main className="flex flex-col relative w-full pt-16 bg-surface flex-grow">
        <div className="flex flex-col w-full pb-safe">
          <CheckoutView />
        </div>
      </main>
    </>
  );
}
