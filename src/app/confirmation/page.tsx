import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/OrderConfirmation";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  description: "Tu pedido fue registrado. Coordina tu visita por WhatsApp.",
};

export default function ConfirmationPage() {
  return <OrderConfirmation />;
}
