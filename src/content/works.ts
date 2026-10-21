import type { L } from "./localized";

/*
 * "Our work" reel on the home page: photos of finished and in-progress jobs.
 * Editors manage these in the Studio ("Work photos"); this list is used until any are published.
 * Source: assets/works_done (photos with other companies' watermarks were left out). Every photo
 * is of a client's project, so all are anonymised by scripts/anonymise-works.py: mirrored, cropped,
 * personal items and views blurred, distinctive furnishings recoloured.
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
  src: `/images/works/${id}.jpg`,
  width,
  height,
});

/** In display order: groups alternate so the full reel has rhythm. */
export const works: WorkPhoto[] = [
  w("majlis-seating", "interiors", 1504, 1128, "Majlis seating", "جلسة مجلس"),
  w("oval-cove-chandelier", "ceilings", 706, 824, "Oval cove with crystal chandelier", "تجويف بيضاوي مع ثريا كريستال"),
  w("columns-capitals-cornice", "classical", 1536, 1152, "Corinthian capitals and dentil cornice", "تيجان كورنثية وكورنيش مسنّن"),
  w("tv-wall-lit-shelves", "joinery", 707, 873, "TV wall with lit shelving", "جدار تلفاز مع رفوف مضاءة"),
  w("tray-blue-cove", "ceilings", 707, 713, "Layered tray with blue cove light", "سقف متدرج بإضاءة زرقاء مخفية"),
  w("fluted-columns-site", "classical", 1128, 1552, "Fluted columns, on site", "أعمدة مضلّعة أثناء التنفيذ"),
  w("fireplace-wall-slats", "joinery", 983, 1475, "Fireplace wall with timber slats", "جدار مدفأة بشرائح خشبية"),
  w("round-fretwork-ceiling", "ceilings", 691, 691, "Round fretwork feature ceiling", "سقف بزخرفة دائرية مفرّغة"),
  w("door-vertical-grooves", "doors", 507, 902, "Entrance door with vertical grooves", "باب مدخل بأخاديد عمودية"),
  w("dome-dentil-cornice", "classical", 976, 1200, "Dome with dentil cornice", "قبة بكورنيش مسنّن"),
  w("stepped-warm-cove", "ceilings", 691, 691, "Stepped ceiling with warm cove light", "سقف متدرج بإضاءة دافئة"),
  w("fitted-kitchen", "joinery", 677, 497, "Fitted kitchen", "مطبخ مُجهّز"),
  w("pilaster-cornice-corner", "classical", 1152, 1536, "Pilaster and cornice corner", "زاوية عمود جداري وكورنيش"),
  w("office-acoustic-ceiling", "ceilings", 846, 1247, "Office ceiling with acoustic panels and linear lights", "سقف مكتبي بألواح صوتية وإضاءة خطية"),
  w("door-two-tone", "doors", 507, 902, "Two-tone entrance door", "باب مدخل بلونين"),
  w("tv-wall-marble-slats", "joinery", 541, 839, "Marble-effect TV wall with slats", "جدار تلفاز بتأثير الرخام وشرائح"),
  w("sculpted-backlit-curves", "ceilings", 497, 656, "Sculpted ceiling with backlit curves", "سقف بمنحنيات مضاءة من الخلف"),
  w("column-base-panelling", "classical", 1152, 1536, "Column base and wall panelling", "قاعدة عمود وتكسية جدارية"),
  w("bedroom-timber-ceiling", "interiors", 720, 604, "Bedroom with timber ceiling feature", "غرفة نوم بسقف خشبي مميز"),
  w("tray-timber-beams", "ceilings", 691, 684, "Gypsum tray with timber beams", "سقف جبس متدرج بعوارض خشبية"),
  w("door-inlay", "doors", 507, 902, "Entrance door with inlay pattern", "باب مدخل بنقش مطعّم"),
  w("walk-in-wardrobe", "joinery", 691, 691, "Walk-in wardrobe", "غرفة ملابس"),
  w("tray-blue-lit", "ceilings", 691, 864, "Tray ceiling with blue light", "سقف متدرج بإضاءة زرقاء"),
  w("living-layered-ceiling", "interiors", 460, 450, "Living room with layered ceiling", "غرفة معيشة بسقف متدرج"),
  w("door-classic-panels", "doors", 507, 902, "Classic panelled door", "باب كلاسيكي بحشوات"),
];
