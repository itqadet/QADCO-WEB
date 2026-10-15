import type { Locale } from "@/i18n/config";

/** A string in both site languages. Used by content files; UI strings live in the dictionaries. */
export type L = { en: string; ar: string };

export function pick(value: L, locale: Locale): string {
  return value[locale];
}
