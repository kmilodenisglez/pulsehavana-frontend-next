/**
 * Streaming fallback for the store body.
 *
 * The catalog is URL data (`?cat=`) resolved on the server, so this is what the
 * page's static shell shows while that query is in flight — a cold load of a
 * shared link, mainly. Client-side, clicking a category is a transition and React
 * keeps the current catalog on screen instead of swapping it for this skeleton.
 *
 * Shape mirrors the shop (`hero` + filter bar + product grid) so the swap does
 * not move the page around; the blocks are decorative, hence `aria-hidden`.
 */
export function StoreFrontSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col w-full animate-pulse">
      <section className="px-margin md:px-margin-desktop pt-space-md pb-space-sm">
        <div className="rounded-[20px] bg-surface-container-low min-h-[190px]" />
      </section>

      <section className="px-margin pt-space-sm pb-1">
        <div className="rounded-[16px] bg-surface-container-low h-[58px]" />
      </section>

      <section className="px-margin py-space-sm">
        <div className="grid grid-cols-2 gap-3 mt-space-xs sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="rounded-[20px] bg-surface-container-low h-[236px]" />
          ))}
        </div>
      </section>
    </div>
  );
}
