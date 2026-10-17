"use client";

import { CollectionThumb } from "./CollectionThumb";
import { Icon } from "./Icon";

export interface CollectionItem {
  /** Stable identity of the row. */
  key: string;
  title: string;
  /** Supporting line, e.g. "8 productos". */
  caption: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  onSelect: () => void;
}

export interface CollectionExplorerProps {
  /** Name of the selected Tier 1 category. */
  title: string;
  /** Copy of the count pill, e.g. "4 colecciones". */
  countLabel: string;
  items: CollectionItem[];
}

/**
 * Tier 2 collection list — detail half of the mobile/tablet catalog explorer.
 *
 * Rows behave as the subcategory filter, so the selected one is exposed with
 * `aria-pressed` and tinted with the brand violet instead of the solid fill
 * used by the desktop pills (a full-width solid row would be too heavy).
 * From `md` up the rows flow into two columns so a tablet width is not a single
 * 700px-wide row with a long gap between the label and the affordance.
 *
 * In the full-screen categories view the panel has a bounded height, so the
 * list scrolls on its own while the header stays visible.
 */
export function CollectionExplorer({ title, countLabel, items }: CollectionExplorerProps) {
  return (
    <div className="flex-1 min-w-0 min-h-0 px-3 py-2 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 pt-1 pb-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <h2 className="font-callout text-callout text-ink-primary font-bold truncate">{title}</h2>
          <Icon name="chevron_right" className="text-[18px] text-ink-secondary shrink-0" />
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-full bg-primary-tint text-primary-container font-label-compact text-label-compact font-semibold">
          {countLabel}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="font-caption text-caption text-ink-secondary py-4 text-center">
          Sin colecciones disponibles.
        </p>
      ) : (
        /* Only the rows scroll, so the panel header stays in place. The negative
           margin keeps the focus rings from being clipped by the scroll box. */
        <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1 pb-1 grid grid-cols-1 gap-2 content-start md:grid-cols-2">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={item.isActive}
              data-active={item.isActive}
              onClick={item.onSelect}
              className={`group w-full p-2.5 rounded-[16px] flex items-center justify-between gap-3 text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                item.isActive
                  ? "bg-primary-tint ring-1 ring-inset ring-primary-container/25"
                  : "bg-surface-base shadow-sm"
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <CollectionThumb
                  image={item.image}
                  icon={item.icon}
                  size={44}
                  className="w-11 h-11 rounded-[12px] bg-surface-muted p-1"
                />
                <span className="flex flex-col min-w-0">
                  <span
                    className={`font-body text-body font-semibold truncate ${
                      item.isActive
                        ? "text-primary-container"
                        : "text-ink-primary group-hover:text-primary-container transition-colors"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="font-caption text-[12px] text-ink-secondary leading-tight">
                    {item.caption}
                  </span>
                </span>
              </span>
              <Icon
                name={item.isActive ? "check_circle" : "chevron_right"}
                filled={item.isActive}
                className={`text-[20px] shrink-0 ${
                  item.isActive
                    ? "text-primary-container"
                    : "text-ink-secondary group-hover:text-primary-container transition-colors"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
