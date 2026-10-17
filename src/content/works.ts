import type { L } from "./localized";

/*
 * "Our work" reel on the home page: photos of finished and in-progress jobs.
 * Editors manage these in the Studio ("Work photos"); this list is used until any are published.
 * Source: assets/works_done (photos with other companies' watermarks were left out).
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
  w("majlis-seating", "interiors", 1600, 1200, "Majlis seating", "جلسة مجلس"),
  w("oval-cove-chandelier", "ceilings", 735, 859, "Oval cove with crystal chandelier", "تجويف بيضاوي مع ثريا كريستال"),
  w("columns-capitals-cornice", "classical", 1600, 1200, "Corinthian capitals and dentil cornice", "تيجان كورنثية وكورنيش مسنّن"),
  w("tv-wall-lit-shelves", "joinery", 736, 900, "TV wall with lit shelving", "جدار تلفاز مع رفوف مضاءة"),
  w("tray-blue-cove", "ceilings", 736, 736, "Layered tray with blue cove light", "سقف متدرج بإضاءة زرقاء مخفية"),
  w("fluted-columns-site", "classical", 1200, 1600, "Fluted columns, on site", "أعمدة مضلّعة أثناء التنفيذ"),
  w("fireplace-wall-slats", "joinery", 1024, 1536, "Fireplace wall with timber slats", "جدار مدفأة بشرائح خشبية"),
  w("round-fretwork-ceiling", "ceilings", 720, 720, "Round fretwork feature ceiling", "سقف بزخرفة دائرية مفرّغة"),
  w("door-vertical-grooves", "doors", 540, 960, "Entrance door with vertical grooves", "باب مدخل بأخاديد عمودية"),
  w("dome-dentil-cornice", "classical", 1600, 1200, "Dome with dentil cornice", "قبة بكورنيش مسنّن"),
  w("stepped-warm-cove", "ceilings", 720, 720, "Stepped ceiling with warm cove light", "سقف متدرج بإضاءة دافئة"),
  w("fitted-kitchen", "joinery", 720, 540, "Fitted kitchen", "مطبخ مُجهّز"),
  w("pilaster-cornice-corner", "classical", 1200, 1600, "Pilaster and cornice corner", "زاوية عمود جداري وكورنيش"),
  w("office-acoustic-ceiling", "ceilings", 899, 1599, "Office ceiling with acoustic panels and linear lights", "سقف مكتبي بألواح صوتية وإضاءة خطية"),
  w("door-two-tone", "doors", 540, 960, "Two-tone entrance door", "باب مدخل بلونين"),
  w("tv-wall-marble-slats", "joinery", 564, 874, "Marble-effect TV wall with slats", "جدار تلفاز بتأثير الرخام وشرائح"),
  w("sculpted-backlit-curves", "ceilings", 518, 683, "Sculpted ceiling with backlit curves", "سقف بمنحنيات مضاءة من الخلف"),
  w("column-base-panelling", "classical", 1200, 1600, "Column base and wall panelling", "قاعدة عمود وتكسية جدارية"),
  w("bedroom-timber-ceiling", "interiors", 720, 720, "Bedroom with timber ceiling feature", "غرفة نوم بسقف خشبي مميز"),
  w("tray-timber-beams", "ceilings", 720, 720, "Gypsum tray with timber beams", "سقف جبس متدرج بعوارض خشبية"),
  w("door-inlay", "doors", 540, 960, "Entrance door with inlay pattern", "باب مدخل بنقش مطعّم"),
  w("walk-in-wardrobe", "joinery", 720, 720, "Walk-in wardrobe", "غرفة ملابس"),
  w("tray-blue-lit", "ceilings", 720, 900, "Tray ceiling with blue light", "سقف متدرج بإضاءة زرقاء"),
  w("living-layered-ceiling", "interiors", 500, 500, "Living room with layered ceiling", "غرفة معيشة بسقف متدرج"),
  w("door-classic-panels", "doors", 540, 960, "Classic panelled door", "باب كلاسيكي بحشوات"),
];
