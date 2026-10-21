export function formatRupees(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function midpointBudget(minimum: number, maximum: number): number {
  return Math.round((minimum + maximum) / 2);
}
