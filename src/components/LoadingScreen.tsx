"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { logoUrl } from "@/lib/assets";

/** Counter ramp (000 → 100), the pause at 100 and the curtain exit, in ms. */
const LOADING_MS = 1700;
const HOLD_MS = 140;
const EXIT_MS = 650;

/**
 * Brand intro — the storefront's loading screen.
 *
 * It is mounted once by the root layout, so it covers the very first paint of a
 * document and never re-appears on client-side navigation (the layout persists).
 * The page is already rendered underneath (the catalog streams through
 * `StoreFrontSkeleton`); this layer only owns the moment before the curtain
 * slides up.
 *
 * Composition, bottom to top: surface → brand bloom → pulse ring → logo →
 * wordmark + counter → progress line. It uses the same light surface as the
 * page, so the curtain hands over without a colour jump. The counter is painted
 * straight onto the refs from a single `requestAnimationFrame` ramp (no re-render
 * per frame); the intro choreography is CSS (`--animate-intro-*` in `globals.css`).
 *
 * Accessibility: the OS motion preference removes the intro entirely (CSS hides
 * it before hydration, and the effect stops the timers), and `<noscript>` also
 * hides it so a JavaScript-less document is never trapped behind the curtain.
 * The only thing announced is the live status; everything visual is decorative.
 */
export function LoadingScreen() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;

    // The intro is decoration, not a gate: with the OS motion preference the
    // layer is already hidden by CSS (`motion-reduce:hidden`) from the first
    // paint, so it only needs to leave the tree.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setGone(true), EXIT_MS);
      return () => window.clearTimeout(timer);
    }

    // Hold the page still while the curtain is down, then hand scrolling back.
    root.style.overflow = "hidden";

    const startedAt = performance.now();
    let frame = 0;
    let exitTimer = 0;

    const paint = (value: number) => {
      if (counterRef.current) {
        counterRef.current.textContent = String(value).padStart(3, "0");
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${value / 100})`;
      }
    };

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / LOADING_MS, 1);
      // easeInOutSine: a steady build-up without an abrupt start or stop.
      const eased = 0.5 - Math.cos(Math.PI * progress) / 2;
      paint(Math.round(eased * 100));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      exitTimer = window.setTimeout(() => setLeaving(true), HOLD_MS);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      root.style.overflow = previousOverflow;
    };
  }, []);

  // Drop the layer once the curtain has finished sliding away, and hand the
  // page back: the component stays mounted (it returns `null`), so the lock is
  // released here instead of in the ramp's unmount cleanup.
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => {
      document.documentElement.style.overflow = "";
      setGone(true);
    }, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  if (gone) return null;

  return (
    <>
      <noscript>
        <style>{`[data-loading-screen]{display:none}`}</style>
      </noscript>

      <div
        data-loading-screen
        role="status"
        className="fixed inset-0 z-[100] overflow-hidden bg-surface motion-reduce:hidden"
        style={{
          transition: `transform ${EXIT_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
          transform: leaving ? "translateY(-100%)" : undefined,
        }}
      >
        <span className="sr-only">Cargando la tienda…</span>

        {/* Brand bloom behind the mark: a soft violet breath on the light
            surface, so the intro stays branded without tinting the whole page. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 41%, var(--color-primary-tint) 0%, transparent 55%)",
          }}
        />

        <div
          aria-hidden="true"
          className="relative flex h-full w-full flex-col items-center justify-center px-6"
        >
          {/* Logo + pulse ring */}
          <div className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
            <span className="absolute inset-0 rounded-full border border-primary-container/30 animate-intro-ring" />
            <span
              className="absolute -inset-3 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--color-primary-tint-hover) 0%, transparent 70%)",
              }}
            />
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 animate-intro-logo">
              <Image
                src={logoUrl}
                alt=""
                fill
                priority
                sizes="(min-width: 640px) 112px, 96px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Wordmark + counter */}
          <div className="mt-10 flex w-full max-w-sm items-end justify-between sm:mt-12">
            <div className="flex flex-col animate-intro-rise [animation-delay:320ms]">
              <span className="font-label-compact text-label-compact uppercase tracking-widest text-primary-container">
                Pulse
              </span>
              <span className="mt-1 font-headline text-headline tracking-widest text-ink-primary">
                HAVANA
              </span>
              <span className="mt-1 font-label-compact text-label-compact uppercase tracking-widest text-ink-secondary">
                Tecnología · Cuba
              </span>
            </div>

            <div className="flex flex-col items-end animate-intro-rise [animation-delay:420ms]">
              <div className="flex items-baseline gap-1">
                <span
                  ref={counterRef}
                  className="font-title text-title tabular-nums text-ink-primary"
                >
                  000
                </span>
                <span className="font-caption text-caption text-ink-secondary">
                  %
                </span>
              </div>
              <span className="mt-1 font-label-compact text-label-compact uppercase tracking-widest text-ink-secondary">
                Cargando
              </span>
            </div>
          </div>

          {/* Progress line */}
          <div className="mt-6 h-[2px] w-full max-w-sm overflow-hidden bg-primary-container/15 animate-intro-rise [animation-delay:420ms]">
            <div
              ref={barRef}
              className="h-full w-full origin-left"
              style={{
                transform: "scaleX(0)",
                background:
                  "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary-container) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
