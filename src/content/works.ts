import type { L } from "./localized";

/*
 * "Our work" reel on the home page: photos of finished and in-progress jobs.
 * Editors manage these in the Studio ("Work photos"); this list is used until any are published.
 * Source: assets/works_done_tweaked (images carrying other companies' watermarks are left out).
 */

export const workCategories = ["ceilings", "classical", "joinery", "interiors", "doors"] as const;
export type WorkCategory = (typeof workCategories)[number];

export type WorkPhoto = {
  id: string;
  category: WorkCategory;
  caption: L;
  src: string;
  width: number;
  height: number;
};

const w = (id: string, category: WorkCategory, width: number, height: number, en: string, ar: string): WorkPhoto => ({
  id,
  category,
  caption: { en, ar },
  src: `/images/our-work/${id}.jpg`,
  width,
  height,
});

/** In display order: groups alternate so the full reel has rhythm. */
export const works: WorkPhoto[] = [
  w("majlis", "interiors", 1400, 1056, "Majlis seating", "جلسة مجلس"),
  w("oval-cove", "ceilings", 1189, 1400, "Oval cove with crystal chandelier", "تجويف بيضاوي مع ثريا كريستال"),
  w("capitals-cornice", "classical", 1400, 1056, "Corinthian capitals and gilded cornice", "تيجان كورنثية وكورنيش مذهّب"),
  w("tv-wall-marble", "joinery", 907, 1400, "Marble TV wall with timber slats", "جدار تلفاز رخامي بشرائح خشبية"),
  w("door-lit-inlays", "doors", 769, 1400, "Entrance door with lit inlays", "باب مدخل بتطعيمات مضيئة"),
  w("blue-cove-chandelier", "ceilings", 1125, 1400, "Stepped ceiling with blue cove light", "سقف متدرج بإضاءة زرقاء مخفية"),
  w("column-panelling", "classical", 1056, 1400, "Fluted column and wall panelling", "عمود مضلّع وتكسية جدارية"),
  w("fireplace-wall", "joinery", 1150, 1400, "TV wall with fireplace and timber slats", "جدار تلفاز مع مدفأة وشرائح خشبية"),
  w("bedroom-cove", "interiors", 1110, 1400, "Bedroom with cove-lit ceiling", "غرفة نوم بسقف بإضاءة مخفية"),
  w("geometric-cove", "ceilings", 1400, 1400, "Geometric stepped ceiling with warm cove light", "سقف هندسي متدرج بإضاءة دافئة"),
  w("door-grooves", "doors", 769, 1400, "Entrance door with vertical grooves", "باب مدخل بأخاديد عمودية"),
  w("dome-cornice-gilded", "classical", 1400, 1056, "Dome with dentil cornice", "قبة بكورنيش مسنّن"),
  w("kitchen", "joinery", 1056, 1400, "Fitted kitchen", "مطبخ مُجهّز"),
  w("round-tiers", "ceilings", 1189, 1400, "Round tiered ceiling with chandelier", "سقف دائري متدرج مع ثريا"),
  w("door-diagonal", "doors", 769, 1400, "Entrance door with diagonal inlay", "باب مدخل بتطعيم مائل"),
  w("wardrobe", "joinery", 1400, 1400, "Walk-in wardrobe", "غرفة ملابس"),
  w("living-layered", "interiors", 1400, 1400, "Living room with layered ceiling", "غرفة معيشة بسقف متدرج"),
  w("corridor-blue-cove", "ceilings", 1056, 1400, "Corridor ceiling with blue cove light", "سقف ممر بإضاءة زرقاء مخفية"),
  w("door-steel-inlays", "doors", 769, 1400, "Entrance door with steel inlays", "باب مدخل بتطعيمات معدنية"),
  w("tray-timber-living", "ceilings", 1400, 1400, "Tray ceiling with timber beams", "سقف متدرج بعوارض خشبية"),
  w("door-panelled", "doors", 769, 1400, "Panelled timber door", "باب خشبي بحشوات"),
  w("living-sculpted", "interiors", 1400, 933, "Living room with sculpted ceiling coves", "غرفة معيشة بتجاويف سقف منحوتة"),
];
