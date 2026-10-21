import type { Language } from "../types";

const localeByLanguage: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  bn: "bn-IN",
  mr: "mr-IN",
};

export function formatRupees(value: number, language: Language = "en"): string {
  return new Intl.NumberFormat(localeByLanguage[language] ?? "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function midpointBudget(minimum: number, maximum: number): number {
  return Math.round((minimum + maximum) / 2);
}
