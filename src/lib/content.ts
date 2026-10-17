import { sanityFetch } from "@/sanity/client";
import { resolveImage, type SanityImage } from "@/sanity/image";
import { caseStudies as localCaseStudies, type CaseStudy, type Photo } from "@/content/case-studies";
import { register as localRegister, type RegisterEntry, type ScopeKey } from "@/content/register";
import { towers as localTowers, towerDrawings, type Tower } from "@/content/skyline";
import { brands as localBrands } from "@/content/credentials";
import { defaultSettings, type Settings } from "@/content/site";
import { defaultHero, type HeroImages } from "@/content/hero";
import { products as localProducts, suppliers, type Product, type SupplierId } from "@/content/products";
import type { L } from "@/content/localized";
import type { SectorKey } from "@/content/sectors";

/*
 * All editable content is read through these functions. Each one prefers what editors have
 * published in Sanity and falls back to the built-in content in src/content when Sanity has
 * nothing yet (or can't be reached), so the site always renders.
 */

/* ---------- Projects with photos ---------- */

type SanityProject = {
  title: L;
  slug: string;
  sector: SectorKey;
  location?: L;
  building?: string;
  contractor?: string;
  consultant?: string;
  summary: L;
  scope: L[];
  featured?: boolean;
  photos: (SanityImage & { caption: L })[];
};

const imageFields = `asset->{_id, url, metadata{dimensions{width, height}}}, crop, hotspot`;

const projectsQuery = `*[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc){
  title, "slug": slug.current, sector, location, building, contractor, consultant, summary, scope, featured,
  photos[]{ ${imageFields}, caption }
}`;

function fromSanityProject(p: SanityProject): CaseStudy {
  const photos: Photo[] = (p.photos ?? [])
    .filter((ph) => ph?.asset)
    .map((ph) => ({ ...resolveImage(ph), caption: ph.caption }));
  return {
    slug: p.slug,
    title: p.title,
    sector: p.sector,
    location: p.location,
    building: p.building,
    contractor: p.contractor,
    consultant: p.consultant,
    summary: p.summary,
    scope: p.scope ?? [],
    featured: p.featured,
    cover: photos[0],
    photos,
  };
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const data = await sanityFetch<SanityProject[]>(projectsQuery);
  const fromCms = (data ?? []).map(fromSanityProject).filter((c) => c.cover);
  return fromCms.length ? fromCms : localCaseStudies;
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  return (await getCaseStudies()).find((c) => c.slug === slug);
}

/** Projects flagged for the home page, at most four. */
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  const all = await getCaseStudies();
  const featured = all.filter((c) => c.featured);
  return (featured.length ? featured : all).slice(0, 4);
}

/* ---------- Project register ---------- */

const registerQuery = `*[_type == "registerEntry"] | order(sortKey asc, _createdAt desc){
  name, sector, location, contractor, consultant, scope, period
}`;

export async function getRegister(): Promise<RegisterEntry[]> {
  const data = await sanityFetch<(RegisterEntry & { scope: ScopeKey[] })[]>(registerQuery);
  if (!data?.length) return localRegister;
  return data.map((r) => ({
    ...r,
    location: r.location || undefined,
    contractor: r.contractor || undefined,
    consultant: r.consultant || undefined,
    scope: r.scope ?? [],
  }));
}

/* ---------- Skyline ---------- */

type SanityTower = { _id: string; name: L; location: L; scope: L; drawing: string };

const towersQuery = `*[_type == "tower"] | order(order asc, _createdAt asc){ _id, name, location, scope, drawing }`;

export async function getTowers(): Promise<Tower[]> {
  const data = await sanityFetch<SanityTower[]>(towersQuery);
  if (!data?.length) return localTowers;
  return data.map((t) => {
    const { label: _label, ...geometry } = towerDrawings[t.drawing] ?? towerDrawings["generic-slab"];
    return { id: t._id, name: t.name, location: t.location, scope: t.scope, ...geometry };
  });
}

/* ---------- Brands ---------- */

export type BrandLogo = { id: string; name: string; src: string; width: number; height: number };

const brandsQuery = `*[_type == "brand" && defined(logo.asset)] | order(order asc, name asc){ _id, name, logo{ ${imageFields} } }`;

export async function getBrands(): Promise<BrandLogo[]> {
  const data = await sanityFetch<{ _id: string; name: string; logo: SanityImage }[]>(brandsQuery);
  if (data?.length) {
    return data.map((b) => ({ id: b._id, name: b.name, ...resolveImage(b.logo, 600) }));
  }
  return localBrands.map((b) => ({ id: b.id, name: b.name, src: `/images/brands/${b.id}.png`, width: b.w, height: b.h }));
}

/* ---------- Products ---------- */

type SanityProduct = Omit<Product, "image" | "brands"> & { image?: SanityImage; brands?: string[] };

const productsQuery = `*[_type == "product" && defined(category)] | order(order asc, _createdAt asc){
  "id": _id, category, role, name, summary, brands, image{ ${imageFields} }
}`;

export async function getProducts(): Promise<Product[]> {
  const data = await sanityFetch<SanityProduct[]>(productsQuery);
  if (!data?.length) return localProducts;
  return data.map((p) => ({
    ...p,
    image: p.image?.asset ? resolveImage(p.image, 1200) : undefined,
    brands: p.brands?.filter((b): b is SupplierId => b in suppliers),
  }));
}

/* ---------- Home page banner ---------- */

type SanityHero = { image?: SanityImage; drawing?: SanityImage; kind?: HeroImages["kind"]; alt?: L; caption?: L };

const heroQuery = `*[_id == "homeHero"][0]{ image{ ${imageFields} }, drawing{ ${imageFields} }, kind, alt, caption }`;

export async function getHero(): Promise<HeroImages> {
  const h = await sanityFetch<SanityHero | null>(heroQuery);
  if (!h?.image?.asset || !h.drawing?.asset || !h.alt || !h.caption) return defaultHero;
  return {
    image: resolveImage(h.image, 2000),
    drawing: resolveImage(h.drawing, 2000),
    kind: h.kind ?? "visualised",
    alt: h.alt,
    caption: h.caption,
  };
}

/* ---------- Contact details ---------- */

type SanitySettings = {
  phone?: string;
  fax?: string;
  email?: string;
  office?: L;
  poBox?: string;
  hours?: L;
  hoursConfirmed?: boolean;
};

const settingsQuery = `*[_id == "siteSettings"][0]{ phone, fax, email, office, poBox, hours, hoursConfirmed }`;

/** Turns a display number like "+974 4460 4337" into a dialable link. */
const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

export async function getSettings(): Promise<Settings> {
  const s = await sanityFetch<SanitySettings | null>(settingsQuery);
  if (!s?.phone || !s.email) return defaultSettings;
  return {
    phone: { display: s.phone, href: tel(s.phone) },
    fax: s.fax ? { display: s.fax } : undefined,
    email: { display: s.email, href: `mailto:${s.email}` },
    office: s.office ?? defaultSettings.office,
    poBox: s.poBox,
    // Hours left unconfirmed in the Studio are a placeholder; show the confirmed built-in hours instead.
    ...(s.hoursConfirmed && s.hours
      ? { hours: s.hours, hoursConfirmed: true }
      : { hours: defaultSettings.hours, hoursConfirmed: defaultSettings.hoursConfirmed }),
  };
}
