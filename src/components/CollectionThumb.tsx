import Image from "next/image";
import { Icon } from "./Icon";

interface CollectionThumbProps {
  /** Collection artwork; when missing the Material Symbol fallback is used. */
  image?: string;
  /** Material Symbol rendered when there is no artwork. */
  icon?: string;
  /** Intrinsic size in px. The visible box is sized by `className`. */
  size?: number;
  className?: string;
}

/**
 * Square artwork tile shared by the mobile/tablet catalog explorer (Tier 1 rail
 * and Tier 2 rows). The tile is decorative: the collection name is always
 * rendered next to it, so screen readers only announce the label once.
 */
export function CollectionThumb({ image, icon, size = 48, className = "" }: CollectionThumbProps) {
  return (
    <span className={`flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
      {image ? (
        <Image
          src={image}
          alt=""
          width={size}
          height={size}
          sizes={`${size}px`}
          className="w-full h-full object-cover"
        />
      ) : (
        <Icon name={icon ?? "category"} className="text-[22px] text-primary-container" />
      )}
    </span>
  );
}
