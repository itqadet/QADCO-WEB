import type { L } from "./localized";

/*
 * "Our work" reel on the home page: photos of finished and in-progress jobs.
 * Editors manage these in the Studio ("Work photos"); this list is used until any are published.
 * Source: assets/works_done (photos with other companies' watermarks were left out). Every photo
 * is of a client's project, so all are anonymised by scripts/anonymise-works.py: mirrored, cropped,
 * personal items and views blurred, then a focus blur and the brand duotone (navy to cream)
 * so no room, colour or finish can be matched to a client's home.
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
  src: `/images/reel/${id}.jpg`,
  width,
  height,
});

/** In display order: groups alternate so the full reel has rhythm. */
export const works: WorkPhoto[] = [
  w("majlis-seating", "interiors", 1263, 947, "Majlis seating", "جلسة مجلس"),
  w("oval-cove-chandelier", "ceilings", 593, 693, "Oval cove with crystal chandelier", "تجويف بيضاوي مع ثريا كريستال"),
  w("columns-capitals-cornice", "classical", 1291, 967, "Corinthian capitals and dentil cornice", "تيجان كورنثية وكورنيش مسنّن"),
  w("tv-wall-lit-shelves", "joinery", 594, 734, "TV wall with lit shelving", "جدار تلفاز مع رفوف مضاءة"),
  w("tray-blue-cove", "ceilings", 594, 598, "Layered tray with cove light", "سقف متدرج بإضاءة مخفية"),
  w("fluted-columns-site", "classical", 947, 1303, "Fluted columns, on site", "أعمدة مضلّعة أثناء التنفيذ"),
  w("fireplace-wall-slats", "joinery", 826, 1239, "Fireplace wall with timber slats", "جدار مدفأة بشرائح خشبية"),
  w("round-fretwork-ceiling", "ceilings", 580, 580, "Round fretwork feature ceiling", "سقف بزخرفة دائرية مفرّغة"),
  w("door-vertical-grooves", "doors", 426, 757, "Entrance door with vertical grooves", "باب مدخل بأخاديد عمودية"),
  w("dome-dentil-cornice", "classical", 819, 1008, "Dome with dentil cornice", "قبة بكورنيش مسنّن"),
  w("stepped-warm-cove", "ceilings", 580, 580, "Stepped ceiling with warm cove light", "سقف متدرج بإضاءة دافئة"),
  w("fitted-kitchen", "joinery", 568, 418, "Fitted kitchen", "مطبخ مُجهّز"),
  w("pilaster-cornice-corner", "classical", 967, 1291, "Pilaster and cornice corner", "زاوية عمود جداري وكورنيش"),
  w("office-acoustic-ceiling", "ceilings", 711, 1048, "Office ceiling with acoustic panels and linear lights", "سقف مكتبي بألواح صوتية وإضاءة خطية"),
  w("door-two-tone", "doors", 426, 757, "Two-tone entrance door", "باب مدخل بلونين"),
  w("tv-wall-marble-slats", "joinery", 454, 704, "Marble-effect TV wall with slats", "جدار تلفاز بتأثير الرخام وشرائح"),
  w("sculpted-backlit-curves", "ceilings", 418, 551, "Sculpted ceiling with backlit curves", "سقف بمنحنيات مضاءة من الخلف"),
  w("column-base-panelling", "classical", 967, 1291, "Column base and wall panelling", "قاعدة عمود وتكسية جدارية"),
  w("bedroom-timber-ceiling", "interiors", 605, 507, "Bedroom with timber ceiling feature", "غرفة نوم بسقف خشبي مميز"),
  w("tray-timber-beams", "ceilings", 580, 574, "Gypsum tray with timber beams", "سقف جبس متدرج بعوارض خشبية"),
  w("door-inlay", "doors", 426, 757, "Entrance door with inlay pattern", "باب مدخل بنقش مطعّم"),
  w("walk-in-wardrobe", "joinery", 580, 580, "Walk-in wardrobe", "غرفة ملابس"),
  w("tray-blue-lit", "ceilings", 580, 725, "Tray ceiling with perimeter light", "سقف متدرج بإضاءة محيطية"),
  w("living-layered-ceiling", "interiors", 387, 378, "Living room with layered ceiling", "غرفة معيشة بسقف متدرج"),
  w("door-classic-panels", "doors", 426, 757, "Classic panelled door", "باب كلاسيكي بحشوات"),
];
