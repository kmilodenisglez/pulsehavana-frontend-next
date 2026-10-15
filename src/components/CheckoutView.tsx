"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Icon } from "./Icon";
import { useCart } from "@/lib/cart";
import { usd } from "@/lib/format";
import { generateOrderReference, saveOrder, type Order } from "@/lib/order";
import { productImages } from "@/lib/assets";

type FieldName = "name" | "phone" | "address";
type SubmitStatus = "idle" | "processing" | "done";

export function CheckoutView() {
  const router = useRouter();
  const { lines, count, subtotal, updateQty, removeLine } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [flashField, setFlashField] = useState<FieldName | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const empty = lines.length === 0;

  function flash(field: FieldName, element: HTMLInputElement | null) {
    element?.focus();
    setFlashField(field);
    window.setTimeout(() => setFlashField(null), 1500);
  }

  function handleRemove(id: string) {
    setRemovingId(id);
    window.setTimeout(() => {
      removeLine(id);
      setRemovingId(null);
    }, 200);
  }

  function handleSubmit() {
    if (status !== "idle" || empty) return;
    if (!name.trim()) return flash("name", nameRef.current);
    if (!phone.trim()) return flash("phone", phoneRef.current);
    if (!address.trim()) return flash("address", addressRef.current);

    const order: Order = {
      reference: generateOrderReference(),
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
      },
      lines,
      total: subtotal,
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);
    setStatus("processing");
    window.setTimeout(() => {
      setStatus("done");
      window.setTimeout(() => router.push("/confirmation"), 700);
    }, 900);
  }

  const fieldClass = (field: FieldName, base: string) =>
    `${base} ${
      flashField === field ? "bg-error-container" : "bg-surface-muted"
    } rounded-xl text-body font-body text-ink-primary placeholder:text-ink-secondary outline-none transition-all duration-150 focus:bg-surface-container-lowest focus:shadow-md`;

  return (
    <div className="px-margin pt-space-md pb-safe flex flex-col gap-space-lg w-full max-w-[640px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between gap-space-sm flex-wrap">
          <h2 className="font-title text-title text-ink-primary tracking-tight">Tu Pedido</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-tint text-primary font-caption text-caption font-medium">
            <Icon name="bolt" className="text-[16px]" />
          </div>
        </div>
        <p className="font-body text-body text-ink-secondary">
          Aparta tus equipos de inmediato. Verificación personal y pago seguro en tienda.
        </p>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-callout text-callout text-ink-primary">
            Artículos seleccionados ({count})
          </span>
          <span className="font-caption text-caption text-status-success font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-status-success inline-block" />
            Stock reservado por 48h
          </span>
        </div>

        {empty ? (
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col items-center text-center gap-space-xs">
            <Icon name="shopping_bag" className="text-[32px] text-primary-container" />
            <p className="font-callout text-callout text-ink-primary">Tu pedido está vacío</p>
            <p className="font-caption text-caption text-ink-secondary">
              Agrega equipos desde el catálogo para apartarlos en tienda.
            </p>
          </div>
        ) : (
          lines.map((line) => (
            <div
              key={line.id}
              className={`bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm transition-all duration-200 ${
                removingId === line.id ? "opacity-0 scale-95" : "opacity-100"
              }`}
            >
              <div className="flex items-start gap-space-md">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-low shrink-0 relative">
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-space-xs">
                    <h3 className="font-callout text-callout text-ink-primary truncate">
                      {line.name}
                    </h3>
                    <button
                      aria-label={`Eliminar ${line.name}`}
                      type="button"
                      onClick={() => handleRemove(line.id)}
                      className="w-8 h-8 -mr-1 -mt-1 rounded-full flex items-center justify-center text-ink-secondary hover:text-status-danger active:scale-95 transition-all"
                    >
                      <Icon name="delete" className="text-[19px]" />
                    </button>
                  </div>
                  <p className="font-caption text-caption text-ink-secondary">{line.subtitle}</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-callout text-callout text-primary">
                      {usd(line.unitPrice)}
                    </span>
                    <span className="font-caption text-caption text-ink-secondary">c/u</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs">
                <span className="font-caption text-caption text-ink-secondary">Cantidad</span>
                <div className="flex items-center bg-surface-muted rounded-full p-0.5 shadow-inner">
                  <button
                    aria-label="Disminuir cantidad"
                    type="button"
                    onClick={() => updateQty(line.id, -1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-ink-primary hover:bg-surface-container-lowest active:scale-90 transition-transform"
                  >
                    <Icon name="remove" className="text-[16px]" />
                  </button>
                  <span className="w-8 text-center font-callout text-callout text-ink-primary">
                    {line.qty}
                  </span>
                  <button
                    aria-label="Aumentar cantidad"
                    type="button"
                    onClick={() => updateQty(line.id, 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-ink-primary hover:bg-surface-container-lowest active:scale-90 transition-transform"
                  >
                    <Icon name="add" className="text-[16px]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-body text-body text-ink-secondary">Subtotal</span>
          <span className="font-callout text-callout text-ink-primary font-medium">
            {usd(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon name="store" className="text-[18px] text-ink-secondary" />
            <span className="font-body text-body text-ink-secondary">
              Entrega: Recogida en tienda
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-muted text-status-success font-caption text-caption font-semibold">
            Gratis
          </span>
        </div>
        <div className="h-px bg-surface-variant my-1" />
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex flex-col">
            <span className="font-callout text-callout text-ink-primary">
              Total a pagar en tienda
            </span>
            <span className="font-caption text-caption text-ink-secondary">
              Efectivo o Transferencia al retirar
            </span>
          </div>
          <span className="font-headline text-headline text-primary font-bold">
            {usd(subtotal)}
          </span>
        </div>
      </div>

      {/* Policy banner */}
      <div className="bg-primary-tint rounded-2xl p-space-md flex gap-space-sm items-start">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
          <Icon name="verified_user" className="text-[20px] text-on-primary" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="font-callout text-callout text-primary">Cero riesgo · Pago presencial</h4>
          <p className="font-caption text-caption text-ink-primary">
            El pago se efectúa presencialmente al recoger y comprobar tu equipo en{" "}
            <strong>Pulse Havana Center Cell</strong> tras coordinar detalles por WhatsApp.
          </p>
        </div>
      </div>

      {/* Express checkout form */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col">
          <h3 className="font-headline text-headline text-ink-primary tracking-tight">
            Datos de Recogida
          </h3>
          <p className="font-caption text-caption text-ink-secondary">
            Generamos tu ficha de apartado al instante.
          </p>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-callout text-callout text-ink-primary flex items-center gap-1"
            htmlFor="full-name"
          >
            <span>Nombre y apellidos</span>
            <span className="text-status-danger">*</span>
          </label>
          <div className="relative flex items-center">
            <Icon
              name="person"
              className="absolute left-3.5 text-[20px] text-ink-secondary pointer-events-none"
            />
            <input
              ref={nameRef}
              id="full-name"
              name="full-name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="ej: Carlos Manuel Gómez Pérez"
              className={fieldClass("name", "w-full h-12 pl-11 pr-4")}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-callout text-callout text-ink-primary flex items-center gap-1"
            htmlFor="phone-whatsapp"
          >
            <span>Teléfono / WhatsApp</span>
            <span className="text-status-danger">*</span>
          </label>
          <div className="relative flex items-center">
            <Icon
              name="phone_iphone"
              className="absolute left-3.5 text-[20px] text-ink-secondary pointer-events-none"
            />
            <input
              ref={phoneRef}
              id="phone-whatsapp"
              name="phone-whatsapp"
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="ej: +53 5 123 4567"
              className={fieldClass("phone", "w-full h-12 pl-11 pr-4")}
            />
          </div>
          <p className="font-caption text-caption text-ink-secondary pl-1">
            Te contactaremos para enviarte el código de recogida de tu pedido.
          </p>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-callout text-callout text-ink-primary flex items-center gap-1"
            htmlFor="address"
          >
            <span>Dirección de residencia</span>
            <span className="text-status-danger">*</span>
          </label>
          <div className="relative flex items-center">
            <Icon
              name="location_on"
              className="absolute left-3.5 text-[20px] text-ink-secondary pointer-events-none"
            />
            <input
              ref={addressRef}
              id="address"
              name="address"
              type="text"
              required
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="ej: Calle 23 #456 e/ J e I, Vedado, Plaza"
              className={fieldClass("address", "w-full h-12 pl-11 pr-4")}
            />
          </div>
          <div className="flex items-center gap-1 text-primary pl-1 font-caption text-caption">
            <Icon name="info" className="text-[14px]" />
            <span>Requerido para el registro de tu pedido en el sistema</span>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-callout text-callout text-ink-primary flex items-center justify-between"
            htmlFor="visit-notes"
          >
            <span>Notas o preferencia de horario</span>
            <span className="font-caption text-caption text-ink-secondary">Opcional</span>
          </label>
          <div className="relative">
            <textarea
              id="visit-notes"
              name="visit-notes"
              rows={2}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="ej: Paso hoy sobre las 4:00 PM después del trabajo..."
              className={`w-full p-3.5 ${
                flashField ? "bg-error-container" : "bg-surface-muted"
              } rounded-xl text-body font-body text-ink-primary placeholder:text-ink-secondary outline-none transition-all duration-150 focus:bg-surface-container-lowest focus:shadow-md resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Store pickup */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="storefront" className="text-primary text-[22px]" />
            <span className="font-callout text-callout text-ink-primary">
              Punto de Retiro Oficial
            </span>
          </div>
          <span className="font-caption text-caption text-status-success font-medium">
            Abierto hoy hasta 7:00 PM
          </span>
        </div>
        <div
          className="w-full h-32 rounded-xl bg-cover bg-center overflow-hidden flex items-end p-3 shadow-inner relative"
          style={{ backgroundImage: `url('${productImages.storeMap}')` }}
          role="img"
          aria-label="Pulse Havana Center Cell, Calle 23, Vedado, La Habana, Cuba"
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="relative z-10 text-on-primary">
            <p className="font-callout text-callout font-semibold">Pulse Havana Center Cell</p>
            <p className="font-caption text-caption text-surface-variant">
              Vedado, La Habana · Atención personalizada
            </p>
          </div>
        </div>
      </div>

      {/* Sticky submit bar */}
      <div className="sticky bottom-0 left-0 right-0 py-space-sm bg-chrome-translucent backdrop-blur-xl -mx-margin px-margin z-40">
        <button
          type="button"
          disabled={empty || status !== "idle"}
          onClick={handleSubmit}
          className={`w-full h-[52px] font-callout-button text-callout-button rounded-full flex items-center justify-center gap-2 shadow-lg active:scale-[0.97] transition-all duration-100 ${
            status === "done"
              ? "bg-status-success text-on-primary"
              : "bg-primary text-on-primary"
          } ${empty ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <Icon
            name={
              status === "processing" ? "progress_activity" : status === "done" ? "done_all" : "check_circle"
            }
            className={`text-[20px] ${status === "processing" ? "animate-spin" : ""}`}
          />
          <span>
            {empty
              ? "Tu pedido está vacío"
              : status === "processing"
                ? "Procesando reserva..."
                : status === "done"
                  ? "¡Pedido Reservado con Éxito!"
                  : `Confirmar Pedido (${usd(subtotal)})`}
          </span>
        </button>
        <div className="text-center pt-1.5">
          <span className="font-caption text-caption text-ink-secondary">
            Garantía oficial y factura timbrada al retirar
          </span>
        </div>
      </div>
    </div>
  );
}
