/** 1 180.5 → "1,180.50" (always two decimals, en-US grouping). */
export function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** 1180 → "1,180" (catalog card style, no decimals). */
export function formatCompact(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/** 968 → "USD 968.00" */
export function usd(value: number): string {
  return `USD ${formatAmount(value)}`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
