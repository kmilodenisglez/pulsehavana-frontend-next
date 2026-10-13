"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { Icon } from "./Icon";
import { productImages } from "@/lib/assets";
import { usd } from "@/lib/format";
import {
  buildWhatsAppUrl,
  getOrderSnapshot,
  subscribeToOrder,
  type Order,
} from "@/lib/order";

const fallbackOrder: Order = {
  reference: "PHC-7842",
  customer: { name: "Carlos Manuel Gómez", phone: "", address: "", notes: "" },
  lines: [
    {
      id: "iphone-15-pro|128GB|Titanio Natural",
      slug: "iphone-15-pro",
      name: "iPhone 15 Pro 128GB",
      subtitle: "Titanio Natural • Estado Sellado",
      unitPrice: 940,
      qty: 1,
      image: productImages.orderThumb,
    },
  ],
  total: 968,
  createdAt: "",
};

const getServerSnapshot = () => null;

export function OrderConfirmation() {
  const stored = useSyncExternalStore(subscribeToOrder, getOrderSnapshot, getServerSnapshot);
  const order = stored ?? fallbackOrder;
  const [refCopied, setRefCopied] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);

  async function copyReference() {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.reference);
    } catch {
      /* clipboard unavailable */
    }
    setRefCopied(true);
    window.setTimeout(() => setRefCopied(false), 2000);
  }

  async function copySummary() {
    if (!order) return;
    const summary = [
      `*Pulse Havana Center Cell - Pedido ${order.reference}*`,
      `Cliente: ${order.customer.name}`,
      `Total: ${usd(order.total)}`,
      "Modalidad: Recogida presencial en tienda física.",
      "Estado: Registrado en sistema.",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      /* clipboard unavailable */
    }
    setSummaryCopied(true);
    window.setTimeout(() => setSummaryCopied(false), 2000);
  }

  return (
    <main className="flex flex-col relative w-full bg-surface flex-grow pt-safe pb-safe">
      <div className="flex flex-col w-full px-margin pb-space-3xl space-y-space-xl">
        {/* Celebration header */}
        <div className="flex flex-col items-center text-center pt-space-md">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-status-success/10 text-status-success mb-space-md shadow-sm">
            <Icon name="check_circle" className="text-[44px]" filled />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-success/10 text-status-success font-caption text-caption mb-space-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            Confirmación Inmediata
          </span>
          <h1 className="font-title text-title text-ink-primary tracking-tight">
            ¡Pedido Registrado!
          </h1>
          <p className="font-body text-body text-ink-secondary max-w-xs mt-space-xs">
            Hemos registrado tu pedido con éxito en nuestro sistema.
          </p>
        </div>

        {order ? (
          <>
            {/* Reference card */}
            <div className="w-full bg-surface-muted rounded-[18px] p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center justify-between pb-space-sm border-b-0">
                <div>
                  <p className="font-caption text-caption text-ink-secondary">
                    Referencia de Pedido
                  </p>
                  <p className="font-headline text-headline text-ink-primary tracking-tight">
                    {order.reference}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyReference}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-container-highest text-primary font-caption text-caption font-semibold active:scale-[0.97] transition-all"
                >
                  <Icon name={refCopied ? "check" : "content_copy"} className="text-[18px]" />
                  <span>{refCopied ? "Copiado" : "Copiar"}</span>
                </button>
              </div>

              {/* Order lines */}
              {order.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-xl shadow-sm"
                >
                  <Image
                    src={line.image}
                    alt={line.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-lg object-cover bg-surface-container"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-body text-body font-semibold text-ink-primary truncate">
                      {line.name}
                    </span>
                    <span className="font-caption text-caption text-ink-secondary">
                      {line.subtitle}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-callout text-callout text-ink-primary font-bold">
                      {line.qty}x
                    </span>
                  </div>
                </div>
              ))}

              {/* Meta */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                <div className="flex items-center justify-between py-1">
                  <span className="font-body text-body text-ink-secondary">Total a Pagar</span>
                  <span className="font-headline text-headline text-primary font-bold">
                    {usd(order.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-body text-body text-ink-secondary">Cliente</span>
                  <span className="font-body text-body text-ink-primary font-semibold">
                    {order.customer.name}
                  </span>
                </div>
                <div className="flex items-start justify-between py-1 gap-4">
                  <span className="font-body text-body text-ink-secondary shrink-0">Modalidad</span>
                  <span className="font-body text-body text-ink-primary text-right font-medium">
                    Recogida presencial en tienda física Pulse Havana Center Cell
                  </span>
                </div>
              </div>
            </div>

            {/* Primary actions */}
            <div className="flex flex-col w-full space-y-space-md">
              <a
                href={buildWhatsAppUrl(order)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-[50px] bg-primary-container text-on-primary font-callout-button text-callout-button rounded-full shadow-md active:scale-[0.97] transition-all"
              >
                <Icon name="chat" className="text-[22px]" />
                <span>📱 Enviar pedido por WhatsApp</span>
              </a>
              <p className="font-caption text-caption text-ink-secondary text-center px-space-sm leading-relaxed">
                Pulsa para abrir WhatsApp con tu resumen de pedido precompletado y coordinar la
                fecha y hora de tu visita para el pago y recogida en tienda.
              </p>
              <button
                type="button"
                onClick={copySummary}
                className="flex items-center justify-center gap-2 w-full h-[44px] bg-primary-tint text-primary font-callout-button text-callout-button rounded-full active:scale-[0.97] transition-all"
              >
                <Icon name={summaryCopied ? "check" : "assignment"} className="text-[20px]" />
                <span>{summaryCopied ? "¡Resumen Copiado!" : "Copiar resumen del pedido"}</span>
              </button>
            </div>
          </>
        ) : (
          <div className="w-full bg-surface-muted rounded-[18px] p-space-lg shadow-sm space-y-space-md">
            <div className="h-5 w-24 rounded-full bg-surface-container-high animate-pulse" />
            <div className="h-16 rounded-xl bg-surface-container-high animate-pulse" />
            <div className="h-24 rounded-xl bg-surface-container-high animate-pulse" />
          </div>
        )}

        {/* How delivery works */}
        <div className="w-full bg-surface-container-lowest rounded-[18px] p-space-lg shadow-sm space-y-space-md">
          <div className="flex items-center gap-2">
            <Icon name="help_outline" className="text-primary text-[24px]" />
            <h2 className="font-headline text-headline text-ink-primary">
              ¿Cómo funciona la entrega?
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Envía el mensaje por WhatsApp",
                body: "Envía el mensaje precompletado por WhatsApp a nuestro equipo para formalizar tu turno.",
              },
              {
                title: "Coordinamos tu visita",
                body: "Coordinamos contigo la hora de tu visita a la tienda para garantizar stock reservado.",
              },
              {
                title: "Revisión, pago y entrega",
                body: "Revisas tu celular en persona, realizas el pago y te lo llevas listo.",
              },
            ].map((step, index) => (
              <div key={step.title} className="flex items-start gap-3.5">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-fixed text-primary font-callout text-callout shrink-0">
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <p className="font-body text-body font-semibold text-ink-primary">{step.title}</p>
                  <p className="font-caption text-caption text-ink-secondary mt-0.5">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store info */}
        <div className="w-full bg-surface-muted rounded-[18px] p-space-lg shadow-sm space-y-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="storefront" className="text-primary text-[24px]" />
              <h3 className="font-headline text-headline text-ink-primary">Tienda Física</h3>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-status-success/10 text-status-success font-label-compact text-label-compact">
              Abierto hoy
            </span>
          </div>
          <div className="relative w-full h-36 rounded-xl overflow-hidden shadow-sm">
            <Image
              src={productImages.storeFront}
              alt="Interior de la tienda Pulse Havana Center Cell"
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-3">
              <span className="text-white font-callout text-callout font-semibold">
                Pulse Havana Center Cell
              </span>
            </div>
          </div>
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3">
              <Icon name="location_on" className="text-ink-secondary text-[20px] shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-body font-semibold text-ink-primary">Ubicación</p>
                <p className="font-caption text-caption text-ink-secondary">
                  Calle 23 esq. L, Vedado, La Habana, Cuba
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="schedule" className="text-ink-secondary text-[20px] shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-body font-semibold text-ink-primary">
                  Horario de Atención
                </p>
                <p className="font-caption text-caption text-ink-secondary">
                  Lunes a Sábado: 9:30 AM – 6:30 PM (Domingos con cita)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="support_agent" className="text-ink-secondary text-[20px] shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-body font-semibold text-ink-primary">
                  Teléfono de Soporte
                </p>
                <p className="font-caption text-caption text-ink-secondary">
                  +53 59352209
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
