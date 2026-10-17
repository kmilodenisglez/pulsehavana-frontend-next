import Image from "next/image";
import { Icon } from "./Icon";

interface CollectionThumbProps {
  /** Collection artwork; when missing the Material Symbol fallback is used. */
  image?: string;
  /** Material Symbol rendered when there is no artwork. */
  icon?: string;
  /** Intrinsic size in px. The visible box is sized by `className`. */
  size?: number;
  /**
   * Width the tile occupies on screen (`next/image` `sizes`). Defaults to the
   * intrinsic size, which is right for fixed tiles; fluid tiles (e.g. the
   * megamenu grid) must pass their real layout width so the browser does not
   * download an upscaled candidate.
   */
  sizes?: string;
  className?: string;
  /** Size/colour of the Material Symbol fallback. */
  iconClassName?: string;
}

/**
 * Square artwork tile shared by the catalog chrome (mobile/tablet Tier 1 rail
 * and Tier 2 rows, desktop megamenu grid). The tile is decorative: the
 * collection name is always rendered next to or under it, so screen readers
 * only announce the label once.
 */
export function CollectionThumb({
  image,
  icon,
  size = 48,
  sizes,
  className = "",
  iconClassName = "text-[22px] text-primary-container",
}: CollectionThumbProps) {
  return (
    <span className={`flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
      {image ? (
        <Image
          src={image}
          alt=""
          width={size}
          height={size}
          sizes={sizes ?? `${size}px`}
          className="w-full h-full object-cover"
        />
      ) : (
        <Icon name={icon ?? "category"} className={iconClassName} />
      )}
    </span>
  );
}
