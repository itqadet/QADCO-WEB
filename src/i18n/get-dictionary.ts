import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  ar: () => import("./dictionaries/ar").then((m) => m.default),
};

/** Resolves the current locale from the `[lang]` root segment, or 404s. */
export async function getLocale(): Promise<Locale> {
  // `lang` is undefined under /studio, which has its own root layout.
  const value = await lang();
  if (!value || !hasLocale(value)) notFound();
  return value;
}

/** Loads the dictionary for the current route's locale. Server Components only. */
export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}
