import { Icon } from "./Icon";

export function TrustCard() {
  return (
    <section id="tienda" className="px-margin md:px-margin-desktop py-space-md mb-2">
      <div className="bg-surface-container-lowest rounded-[18px] p-space-md shadow-sm flex flex-col gap-space-sm relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-tint flex items-center justify-center shrink-0 text-primary-container">
            <Icon name="storefront" className="text-[22px]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-compact text-label-compact text-primary-container uppercase tracking-wider font-semibold">
              Confianza &amp; Garantía
            </span>
            <h4 className="font-callout text-callout text-ink-primary font-semibold mt-0.5">
              Punto de encuentro garantizado
            </h4>
            <p className="font-body text-body text-ink-secondary leading-relaxed mt-1">
              Visita nuestra tienda física en Centro Habana. Pago seguro y entrega directa tras
              coordinar tus detalles por WhatsApp.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-1 pt-space-xs">
          <div className="bg-surface-container-low rounded-xl p-2.5 flex items-center gap-2">
            <Icon name="format_image_left" className="text-[18px] text-primary-container" />
            <span className="font-caption text-caption text-ink-primary text-xs font-medium">
              30 Días Garantía
            </span>
          </div>
          <div className="bg-surface-container-low rounded-xl p-2.5 flex items-center gap-2">
            <Icon name="payments" className="text-[18px] text-primary-container" />
            <span className="font-caption text-caption text-ink-primary text-xs font-medium">
              USD / CUP / Transfer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
