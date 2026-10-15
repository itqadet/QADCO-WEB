import type { L } from "./localized";

/**
 * Towers in Doha where QADCO carried out interior finishing (profile pp.48–49),
 * drawn as simplified elevations. Not to scale.
 *
 * Each `shape` is an SVG path in local units: x from 0 to `w`, y from 0 (ground) upward as
 * negative values. `detail` adds thin linework (façade lines) on top of the body.
 */
export type Tower = {
  id: string;
  name: L;
  location: L;
  scope: L;
  w: number;
  shape: string;
  detail?: string;
  /** Where the label pin sits, in local units. */
  top: [number, number];
};

export const towers: Tower[] = [
  {
    id: "salam",
    name: { en: "Al Salam Tower", ar: "برج السلام" },
    location: { en: "West Bay", ar: "الخليج الغربي" },
    scope: { en: "Interior finishing works", ar: "أعمال التشطيبات الداخلية" },
    w: 64,
    shape: "M0 0V-150L13-176L26-150V0ZM34 0V-130L47-154L60-130V0Z",
    detail: "M13-150V0M47-130V0",
    top: [13, -176],
  },
  {
    id: "mana",
    name: { en: "Al Mana Tower", ar: "برج المانع" },
    location: { en: "Doha", ar: "الدوحة" },
    scope: { en: "Aluminium and gypsum ceilings, cornices and bulkheads", ar: "أسقف ألمنيوم وجبس وكرانيش وجسور" },
    w: 70,
    shape: "M0 0V-138Q0-146 8-146H24Q32-146 32-138V0ZM38 0V-122Q38-130 46-130H62Q70-130 70-122V0Z",
    detail: "M0-100H32M0-60H32M38-90H70M38-50H70",
    top: [16, -146],
  },
  {
    id: "doha-tower",
    name: { en: "Burj Qatar (Doha Tower)", ar: "برج قطر (برج الدوحة)" },
    location: { en: "West Bay", ar: "الخليج الغربي" },
    scope: { en: "Interior finishing works", ar: "أعمال التشطيبات الداخلية" },
    w: 56,
    shape: "M0 0V-276Q2-318 28-320Q54-318 56-276V0Z",
    detail: "M28-320V-352M0-240L56-200M0-200L56-160M0-160L56-120M0-120L56-80M0-80L56-40M56-240L0-200M56-200L0-160M56-160L0-120M56-120L0-80M56-80L0-40",
    top: [28, -352],
  },
  {
    id: "akh",
    name: { en: "AKH Tower", ar: "برج AKH" },
    location: { en: "West Bay (Dafna)", ar: "الخليج الغربي (الدفنة)" },
    scope: { en: "Decorative gypsum ceilings, coffers and demountable partitions", ar: "أسقف جبسية زخرفية وتجاويف وقواطع قابلة للفك" },
    w: 50,
    shape: "M0 0L8-268L36-280L50 0Z",
    detail: "M22-274L25 0",
    top: [22, -280],
  },
  {
    id: "palm",
    name: { en: "Palm Towers", ar: "أبراج النخيل" },
    location: { en: "West Bay", ar: "الخليج الغربي" },
    scope: { en: "Interior finishing works", ar: "أعمال التشطيبات الداخلية" },
    w: 62,
    shape: "M0 0V-300L26-290V0ZM36 0V-286L62-298V0Z",
    detail: "M8-280V0M18-280V0M44-280V0M54-280V0",
    top: [13, -300],
  },
  {
    id: "tornado",
    name: { en: "Tornado Tower", ar: "برج تورنادو" },
    location: { en: "West Bay", ar: "الخليج الغربي" },
    scope: { en: "Interior finishing works", ar: "أعمال التشطيبات الداخلية" },
    w: 54,
    shape: "M0 0C20-90 20-180 2-272H52C34-180 34-90 54 0Z",
    detail: "M10-40L44-110M10-110L44-40M13-120L41-190M13-190L41-120M10-200L44-262M10-262L44-200",
    top: [27, -272],
  },
  {
    id: "rabban",
    name: { en: "Al Rabban Suites", ar: "أجنحة الربان" },
    location: { en: "Dafna", ar: "الدفنة" },
    scope: { en: "Gypsum ceilings, partitions and wall lining", ar: "أسقف وقواطع جبسية وتكسية جدران" },
    w: 44,
    shape: "M0 0V-206H6V-218H38V-206H44V0Z",
    detail: "M22-218V-238M0-170H44M0-120H44M0-70H44",
    top: [22, -238],
  },
  {
    id: "jasra",
    name: { en: "Al Jasra Twin Tower", ar: "برج الجسرة التوأم" },
    location: { en: "Doha", ar: "الدوحة" },
    scope: { en: "Suspended ceilings and drywall partitions", ar: "أسقف معلّقة وقواطع جبسية" },
    w: 66,
    shape: "M0 0V-194H30V0ZM36 0V-176H66V0Z",
    detail: "M15-194V0M51-176V0",
    top: [15, -194],
  },
  {
    id: "samikh",
    name: { en: "Bin Samikh Hotel Tower", ar: "برج فندق بن سميخ" },
    location: { en: "Doha", ar: "الدوحة" },
    scope: { en: "Gypsum board ceilings on DECO suspension", ar: "أسقف ألواح جبسية على نظام تعليق DECO" },
    w: 44,
    shape: "M2 0V-226H0V-236H44V-226H42V0Z",
    detail: "M2-190H42M2-150H42M2-110H42M2-70H42M22-236V-252",
    top: [22, -252],
  },
  {
    id: "mkh",
    name: { en: "MKH Tower", ar: "برج MKH" },
    location: { en: "Lusail", ar: "لوسيل" },
    scope: { en: "Gypsum ceilings", ar: "أسقف جبسية" },
    w: 46,
    shape: "M0 0C-6-80 14-150 6-222L40-228C48-150 30-80 46 0Z",
    detail: "M8-120C24-130 30-120 40-126M6-160C22-170 30-160 42-166",
    top: [23, -228],
  },
  {
    id: "marina",
    name: { en: "Burj Marina", ar: "برج المارينا" },
    location: { en: "Lusail", ar: "لوسيل" },
    scope: { en: "Gypsum ceilings and partitions", ar: "أسقف وقواطع جبسية" },
    w: 48,
    shape: "M0 0V-232L44-254L48 0Z",
    detail: "M0-232L48-180",
    top: [22, -254],
  },
  {
    id: "viva-bahriya",
    name: { en: "Viva Bahriya, The Pearl", ar: "فيفا بحرية، اللؤلؤة" },
    location: { en: "The Pearl", ar: "اللؤلؤة" },
    scope: { en: "Suspended ceilings and drywall partitions", ar: "أسقف معلّقة وقواطع جبسية" },
    w: 54,
    shape: "M0 0V-160H8V-176H46V-160H54V0ZM17-176Q17-196 27-198Q37-196 37-176Z",
    detail: "M27-198V-210M0-120H54M0-80H54M0-40H54",
    top: [27, -210],
  },
];

/** Geometry of one elevation drawing, without its text. */
export type TowerDrawing = Pick<Tower, "w" | "shape" | "detail" | "top"> & { label: string };

/**
 * Elevations editors can choose from in the Studio: one for each tower above, plus generic
 * outlines for towers that don't have their own drawing yet.
 */
export const towerDrawings: Record<string, TowerDrawing> = {
  ...Object.fromEntries(
    towers.map(({ id, name, w, shape, detail, top }) => [id, { label: name.en, w, shape, detail, top }]),
  ),
  "generic-slab": {
    label: "Generic: rectangular tower",
    w: 44,
    shape: "M0 0V-210H44V0Z",
    detail: "M0-170H44M0-130H44M0-90H44M0-50H44",
    top: [22, -210],
  },
  "generic-stepped": {
    label: "Generic: stepped tower",
    w: 48,
    shape: "M0 0V-150H6V-190H14V-226H34V-190H42V-150H48V0Z",
    detail: "M24-226V-244M0-110H48M0-70H48",
    top: [24, -244],
  },
  "generic-spire": {
    label: "Generic: tower with spire",
    w: 46,
    shape: "M0 0V-230L23-262L46-230V0Z",
    detail: "M23-262V-290M0-180H46M0-130H46M0-80H46",
    top: [23, -290],
  },
  "generic-twin": {
    label: "Generic: twin towers",
    w: 60,
    shape: "M0 0V-180H26V0ZM34 0V-200H60V0Z",
    detail: "M13-180V0M47-200V0",
    top: [47, -200],
  },
  "generic-low": {
    label: "Generic: low-rise building",
    w: 70,
    shape: "M0 0V-90H70V0Z",
    detail: "M0-60H70M0-30H70M35-90V0",
    top: [35, -90],
  },
};