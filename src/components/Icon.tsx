import type { CSSProperties } from "react";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  style?: CSSProperties;
}

/** Material Symbols Outlined glyph. Purely decorative — labels carry meaning. */
export function Icon({ name, className, filled = false, style }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={
        className ? `material-symbols-outlined ${className}` : "material-symbols-outlined"
      }
      style={filled ? { fontVariationSettings: "'FILL' 1", ...style } : style}
    >
      {name}
    </span>
  );
}
