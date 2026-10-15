import type { L } from "./localized";

export const sectors = {
  offices: { en: "Towers and offices", ar: "أبراج ومكاتب" },
  hotels: { en: "Hotels", ar: "فنادق" },
  healthcare: { en: "Healthcare", ar: "رعاية صحية" },
  education: { en: "Education", ar: "تعليم" },
  government: { en: "Government", ar: "جهات حكومية" },
  residential: { en: "Residential", ar: "سكني" },
  retail: { en: "Retail and showrooms", ar: "تجزئة وصالات عرض" },
  sports: { en: "Sports and leisure", ar: "رياضة وترفيه" },
  banking: { en: "Banking", ar: "بنوك" },
  industrial: { en: "Industrial and infrastructure", ar: "صناعي وبنية تحتية" },
} satisfies Record<string, L>;

export type SectorKey = keyof typeof sectors;
export const sectorKeys = Object.keys(sectors) as SectorKey[];
