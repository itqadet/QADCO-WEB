import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { href, routes } from "@/i18n/routing";
import { getCaseStudies } from "@/lib/content";
import { site } from "@/content/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const caseStudies = await getCaseStudies();
  const paths = [...Object.values(routes), ...caseStudies.map((c) => `${routes.projects}/${c.slug}`)];
  const url = (path: string, locale: (typeof locales)[number]) => new URL(href(locale, path), site.url).toString();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: url(path, locale),
      changeFrequency: "monthly" as const,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(path, l)])) },
    })),
  );
}
