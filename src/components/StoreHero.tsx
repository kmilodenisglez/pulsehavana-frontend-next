import { Icon } from "./Icon";

export function StoreHero() {
  return (
    <section className="px-margin md:px-margin-desktop pt-space-md pb-space-sm flex flex-col gap-space-sm">
      <div className="relative overflow-hidden rounded-[20px] bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between min-h-[190px]">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-tint rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-space-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-tint self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            <span className="font-label-compact text-label-compact text-primary-container tracking-wide font-semibold">
              Recogida presencial en tienda física
            </span>
          </div>
          <h1 className="font-large-title-mobile text-large-title-mobile text-ink-primary tracking-tight mt-1">
            La mejor tecnología en La Habana.
          </h1>
          <p className="font-body text-body text-ink-secondary text-sm leading-relaxed max-w-[90%]">
            Nuevos y reacondicionados certificados con garantía técnica directa en nuestro local.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-space-sm pt-space-xs text-ink-secondary font-caption text-caption">
          <div className="flex items-center gap-1">
            <Icon name="verified" className="text-[16px] text-primary-container" filled />
            <span>Inspección 360°</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-surface-container-highest" />
          <div className="flex items-center gap-1">
            <Icon name="local_shipping" className="text-[16px] text-primary-container" />
            <span>Entrega inmediata</span>
          </div>
        </div>
      </div>
    </section>
  );
}
