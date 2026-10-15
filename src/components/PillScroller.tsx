"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";

interface PillScrollerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Identifier of the currently selected pill. Changing it scrolls the
   * matching `[data-active="true"]` child to the horizontal center.
   */
  activeKey: string | null;
  children: ReactNode;
}

/**
 * Horizontally scrollable pill list that keeps the selected pill centered.
 *
 * Centering happens after each selection change and respects the user's
 * reduced-motion preference (instant jump instead of a smooth animation).
 * Selection is read from the DOM (`data-active`) so callers keep full control
 * over the pill markup and only need to flag the active child.
 */
export function PillScroller({ activeKey, children, ...rest }: PillScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const active = container.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const delta = activeRect.left + activeRect.width / 2 - (containerRect.left + containerRect.width / 2);

    // Already centered: nothing to do (also avoids a no-op smooth scroll).
    if (Math.abs(delta) < 1) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollBy({ left: delta, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [activeKey]);

  return (
    <div ref={containerRef} {...rest}>
      {children}
    </div>
  );
}
