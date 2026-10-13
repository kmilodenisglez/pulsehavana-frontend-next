import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 flex-grow px-margin py-space-3xl text-center">
      <span
        aria-hidden="true"
        className="material-symbols-outlined text-[48px] text-primary-container"
      >
        search_off
      </span>
      <h1 className="font-title text-title text-ink-primary tracking-tight">No encontramos esto</h1>
      <p className="font-body text-body text-ink-secondary max-w-xs">
        El equipo o la página que buscas no está disponible en este momento.
      </p>
      <Link
        href="/"
        className="mt-2 h-[50px] px-6 rounded-full bg-primary text-on-primary font-callout-button text-callout-button flex items-center justify-center shadow-md active:scale-[0.97] transition-transform duration-100"
      >
        Volver a la tienda
      </Link>
    </main>
  );
}
