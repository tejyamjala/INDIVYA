import type { Language } from "../types";

type Dictionary = Record<string, string>;
type LocaleModule = { default: Dictionary };

const localeTags: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  bn: "bn-IN",
  mr: "mr-IN",
};

const localeLoaders: Record<Language, () => Promise<LocaleModule>> = {
  en: async () => ({ default: {} }),
  hi: () => import("../locales/hi.json"),
  te: () => import("../locales/te.json"),
  ta: () => import("../locales/ta.json"),
  kn: () => import("../locales/kn.json"),
  ml: () => import("../locales/ml.json"),
  bn: () => import("../locales/bn.json"),
  mr: () => import("../locales/mr.json"),
};

const dictionaries: Partial<Record<Language, Dictionary>> = { en: {} };
const loading: Partial<Record<Language, Promise<void>>> = {};
let activeLanguage: Language = "en";

const legacyKeys = {
  discover: "Discover",
  explore: "Explore",
  pilgrims: "Pilgrims",
  planner: "Trip planner",
  saved: "Saved",
  profile: "Profile",
  search: "Search places, states, experiences",
  save: "Save place",
  planTrip: "Plan a trip",
  signOut: "Sign out",
} as const;
export type CopyKey = keyof typeof legacyKeys;

export function getLocaleTag(language: Language): string {
  return localeTags[language] ?? localeTags.en;
}

export function setActiveLanguage(language: Language) {
  activeLanguage = language;
}

export function isLocaleLoaded(language: Language): boolean {
  return dictionaries[language] !== undefined;
}

export function loadLocale(language: Language): Promise<void> {
  if (isLocaleLoaded(language)) return Promise.resolve();
  if (loading[language]) return loading[language]!;
  loading[language] = localeLoaders[language]().then(({ default: dictionary }) => {
    dictionaries[language] = dictionary;
  }).catch(() => {
    // Keep the app usable if a locale chunk cannot be reached; English remains the fallback.
    dictionaries[language] = {};
  });
  return loading[language]!;
}

export function translate(language: Language, source: string, values?: Record<string, string | number>): string {
  const key = source.replace(/\s+/g, " ").trim();
  const template = dictionaries[language]?.[key] ?? source;
  const rendered = values ? template.replace(/\{\{(\d+)\}\}/g, (placeholder, key: string) => {
    const value = values[key];
    return value === undefined ? placeholder : String(value);
  }) : template;
  const namedEntities: Record<string, string> = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: "\u00a0", quot: "\"" };
  return rendered.replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi, (entity, value: string) => {
    if (value[0] !== "#") return namedEntities[value.toLowerCase()] ?? entity;
    const codePoint = value[1]?.toLowerCase() === "x" ? Number.parseInt(value.slice(2), 16) : Number.parseInt(value.slice(1), 10);
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity;
  });
}

export function tr(source: string, values?: Record<string, string | number>): string {
  return translate(activeLanguage, source, values);
}

export function t(language: Language, key: CopyKey): string {
  return translate(language, legacyKeys[key]);
}
