"use client";

import { useRouter } from "next/navigation";
import { useFeatureFlags } from "@/lib/feature-flags";
import { BrandLogo } from "./BrandLogo";
import { Icon } from "./Icon";

export function BackHeader({ title }: { title: string }) {
  const router = useRouter();
  const { showUserShortcuts } = useFeatureFlags();

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-chrome-translucent backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-margin md:px-margin-desktop mx-auto w-full max-w-[1280px] flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs min-w-0 flex-1">
          <button
            aria-label="Volver"
            type="button"
            onClick={() => router.back()}
            className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-ink-primary active:scale-[0.97] transition-transform duration-100"
          >
            <Icon name="arrow_back_ios_new" className="text-[24px]" />
          </button>
          <BrandLogo className="hidden xs:block" />
          <h1 className="font-headline text-headline text-ink-primary truncate tracking-tight">
            {title}
          </h1>
        </div>
        {showUserShortcuts ? (
          <div className="flex items-center gap-space-xs shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Icon name="person" className="text-on-primary text-[18px]" />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
