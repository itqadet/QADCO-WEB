import type { Locale } from "./config";

/** Site sections, shared by navigation, metadata and the sitemap. */
export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  projects: "/projects",
  process: "/process",
  contact: "/contact",
} as const;

export type RouteKey = keyof typeof routes;

/** Builds a locale-prefixed path: href("ar", "/services", "ceilings") → "/ar/services#ceilings". */
export function href(locale: Locale, path: string = "/", hash?: string): string {
  const base = path === "/" ? `/${locale}` : `/${locale}${path}`;
  return hash ? `${base}#${hash}` : base;
}

/** Swaps the locale segment of a pathname, keeping the rest of the path. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  parts[1] = to;
  return parts.join("/") || `/${to}`;
}
