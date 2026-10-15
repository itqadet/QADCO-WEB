import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import { href } from "@/i18n/routing";
import { site } from "@/content/site";

type PageMeta = { title: string; description: string };

/** Page metadata with canonical and hreflang alternates for both languages. */
export function buildMetadata(locale: Locale, path: string, meta: PageMeta): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, href(l, path)]));
  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: href(locale, path),
      languages: { ...languages, "x-default": href("en", path) },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: locale === "ar" ? "ar_QA" : "en_QA",
      type: "website",
      images: [{ url: "/images/brand/qadco-logo-full.png", width: 1050, height: 560 }],
    },
  };
}
