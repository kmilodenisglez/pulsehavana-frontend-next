import Image from "next/image";
import { logoUrl } from "@/lib/assets";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src={logoUrl}
      alt="Pulse Havana Center Cell Logo"
      width={128}
      height={128}
      className={`h-8 w-auto object-contain shrink-0 ${className}`}
    />
  );
}
