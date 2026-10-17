import type { L } from "./localized";

/*
 * Products page: what QADCO makes in its own workshop and what it supplies and installs.
 * Editors manage products in the Studio ("Products"); this list is used until any are published.
 * Sample photos were cut from the "gypsum designs" collages, so they are small: replace them with
 * full-size photos when available.
 */

export const productCategories = ["ornamental", "acoustic", "partitions", "boards"] as const;
export type ProductCategory = (typeof productCategories)[number];

export type ProductRole = "made" | "supplied";

/** Manufacturers and distributors, from "Our Suppliers & Manufacturers". */
export const suppliers = {
  qgyps: { name: "Qgyps, Qatar Gypsum Board Factory", src: "/images/suppliers/qgyps.png", w: 248, h: 94 },
  armstrong: { name: "Armstrong Ceiling Systems", src: "/images/brands/armstrong.png", w: 544, h: 138 },
  gyproc: { name: "Gyproc, Saint-Gobain", src: "/images/suppliers/gyproc.png", w: 216, h: 77 },
  heradesign: { name: "Heradesign Acoustic Ceilings", src: "/images/suppliers/heradesign.png", w: 248, h: 130 },
  knauf: { name: "Knauf", src: "/images/brands/knauf.png", w: 399, h: 173 },
  usg: { name: "USG", src: "/images/brands/usg.png", w: 299, h: 216 },
  "usg-me": { name: "USG ME", src: "/images/suppliers/usg-me.png", w: 187, h: 76 },
  sas: { name: "SAS International", src: "/images/brands/sas-international.png", w: 585, h: 339 },
  ramco: { name: "Ramco: Hilux and Hicem boards", src: "/images/suppliers/ramco.png", w: 290, h: 54 },
  shera: { name: "Shera", src: "/images/suppliers/shera.png", w: 336, h: 54 },
  kimmco: { name: "Kimmco insulation", src: "/images/suppliers/kimmco.png", w: 330, h: 173 },
  decotech: { name: "Decotech Metal Profile Factory", src: "/images/suppliers/decotech.png", w: 518, h: 118 },
  crascom: { name: "Crascom Building & Construction", src: "/images/suppliers/crascom.png", w: 259, h: 73 },
  imar: { name: "IMAR Trading & Contracting", src: "/images/suppliers/imar.png", w: 490, h: 160 },
} as const;
export type SupplierId = keyof typeof suppliers;

export type ProductImage = { src: string; width: number; height: number };

export type Product = {
  id: string;
  category: ProductCategory;
  role: ProductRole;
  name: L;
  summary: L;
  image?: ProductImage;
  brands?: SupplierId[];
};

const img = (src: string, width: number, height: number): ProductImage => ({ src, width, height });

export const products: Product[] = [
  /* ---------- ornamental gypsum, made in our workshop ---------- */
  {
    id: "carved-plaster",
    category: "ornamental",
    role: "made",
    name: { en: "Hand-carved plaster ceilings", ar: "أسقف جبس منحوتة يدويًا" },
    summary: {
      en: "Deep relief carved in place, for majlis and reception ceilings.",
      ar: "نقوش بارزة عميقة تُنحت في الموقع لأسقف المجالس وصالات الاستقبال.",
    },
    image: img("/images/work/sys-carved-plaster.jpg", 944, 714),
  },
  {
    id: "medallion-cove",
    category: "ornamental",
    role: "made",
    name: { en: "Medallion with cove lighting", ar: "ميدالية سقف مع إضاءة مخفية" },
    summary: {
      en: "A central ornament framed by a shaped, lit cove.",
      ar: "زخرفة مركزية يحيط بها تجويف منحني مُضاء.",
    },
    image: img("/images/products/orn-medallion-cove.jpg", 164, 246),
  },
  {
    id: "round-dome",
    category: "ornamental",
    role: "made",
    name: { en: "Round dome with moulded rim", ar: "قبة دائرية بإطار مزخرف" },
    summary: {
      en: "A shallow dome lined with layered mouldings.",
      ar: "قبة ضحلة تحيط بها حليات متدرجة.",
    },
    image: img("/images/products/orn-round-dome.jpg", 163, 246),
  },
  {
    id: "dome-ring",
    category: "ornamental",
    role: "made",
    name: { en: "Dome with beaded ring", ar: "قبة بحلقة خرزية" },
    summary: {
      en: "A recessed dome with a beaded ring and dentil cornice.",
      ar: "قبة غائرة بحلقة خرزية وكورنيش مسنّن.",
    },
    image: img("/images/products/orn-dome-ring.jpg", 164, 246),
  },
  {
    id: "relief-panel",
    category: "ornamental",
    role: "made",
    name: { en: "Relief panel ceiling", ar: "سقف بلوحة زخرفية بارزة" },
    summary: {
      en: "A raised ornamental panel inside a lit tray.",
      ar: "لوحة زخرفية بارزة داخل سقف متدرج مُضاء.",
    },
    image: img("/images/products/orn-relief-panel.jpg", 164, 247),
  },
  {
    id: "coffered-relief",
    category: "ornamental",
    role: "made",
    name: { en: "Coffered ceiling with relief", ar: "سقف كاسيت بزخارف بارزة" },
    summary: {
      en: "Deep coffers, each with its own cast ornament.",
      ar: "تجاويف عميقة تحمل كل منها زخرفتها المصبوبة.",
    },
    image: img("/images/products/orn-coffered-relief.jpg", 163, 247),
  },
  {
    id: "relief-scroll",
    category: "ornamental",
    role: "made",
    name: { en: "Scroll relief ceiling", ar: "سقف بزخارف لولبية" },
    summary: {
      en: "Flowing scrollwork across a framed ceiling field.",
      ar: "زخارف لولبية متصلة داخل إطار السقف.",
    },
    image: img("/images/products/orn-relief-scroll.jpg", 164, 247),
  },
  {
    id: "freehand-relief",
    category: "ornamental",
    role: "made",
    name: { en: "Freehand plaster relief", ar: "زخارف جبسية حرّة" },
    summary: {
      en: "Floral relief worked across a flat ceiling, around lights and vents.",
      ar: "زخارف نباتية بارزة على سقف مستوٍ تلتف حول الإضاءة وفتحات التكييف.",
    },
    image: img("/images/products/relief-ceiling-room.jpg", 198, 200),
  },
  {
    id: "light-slots",
    category: "ornamental",
    role: "made",
    name: { en: "Ceiling with linear light slots", ar: "سقف بمجاري إضاءة خطية" },
    summary: {
      en: "A clean gypsum ceiling with recessed LED channels.",
      ar: "سقف جبسي بسيط بمجاري إضاءة LED غائرة.",
    },
    image: img("/images/products/relief-linear-light.jpg", 198, 198),
  },
  {
    id: "cornices-pilasters",
    category: "ornamental",
    role: "made",
    name: { en: "Cornices and pilasters", ar: "كورنيش وأعمدة جدارية" },
    summary: {
      en: "Crown mouldings, pilasters and wall panelling to match.",
      ar: "حليات تاجية وأعمدة جدارية وتكسيات جدران متناسقة.",
    },
    image: img("/images/products/mould-pilaster-cornice.jpg", 300, 302),
  },

  /* ---------- acoustic ceiling tiles, supplied and installed ---------- */
  {
    id: "perforated-gypsum",
    category: "acoustic",
    role: "supplied",
    name: { en: "Perforated gypsum tiles", ar: "بلاطات جبس مثقّبة" },
    summary: {
      en: "Sound-absorbing tiles with a fleece backing, in square or random patterns.",
      ar: "بلاطات ماصّة للصوت ببطانة قماشية، بثقوب مربعة أو عشوائية.",
    },
    image: img("/images/work/school-corridor-perforated.jpg", 562, 848),
    brands: ["armstrong", "gyproc", "knauf", "usg"],
  },
  {
    id: "lay-in-grid",
    category: "acoustic",
    role: "supplied",
    name: { en: "Lay-in tile grid systems", ar: "أنظمة بلاطات على شبكة تعليق" },
    summary: {
      en: "Exposed-grid tiles that lift out for access to the services above.",
      ar: "بلاطات على شبكة ظاهرة تُرفع بسهولة للوصول إلى الخدمات فوق السقف.",
    },
    image: img("/images/products/acoustic-diagonal.jpg", 231, 111),
    brands: ["armstrong", "usg", "usg-me"],
  },
  {
    id: "metal-tiles",
    category: "acoustic",
    role: "supplied",
    name: { en: "Perforated metal tiles", ar: "بلاطات معدنية مثقّبة" },
    summary: {
      en: "Clip-in and lay-in metal tiles for corridors and public areas.",
      ar: "بلاطات معدنية بتثبيت مخفي أو على شبكة للممرات والمناطق العامة.",
    },
    image: img("/images/work/sys-metal-perforated.jpg", 972, 593),
    brands: ["sas", "usg-me"],
  },
  {
    id: "woodwool",
    category: "acoustic",
    role: "supplied",
    name: { en: "Woodwool acoustic panels", ar: "ألواح صوتية من الصوف الخشبي" },
    summary: {
      en: "Natural wood-wool panels for halls, gyms and classrooms.",
      ar: "ألواح من ألياف الخشب الطبيعية للقاعات والصالات الرياضية والفصول.",
    },
    image: img("/images/work/school-woodwool-cladding.jpg", 850, 459),
    brands: ["heradesign"],
  },

  /* ---------- office partitions, supplied and installed ---------- */
  {
    id: "frosted-glass",
    category: "partitions",
    role: "supplied",
    name: { en: "Frosted glass partitions", ar: "قواطع زجاج مصنفر" },
    summary: {
      en: "Framed glazing with privacy film and full-height doors.",
      ar: "زجاج بإطارات مع طبقة خصوصية وأبواب بارتفاع كامل.",
    },
    image: img("/images/products/part-frosted-door.jpg", 263, 258),
  },
  {
    id: "glazed",
    category: "partitions",
    role: "supplied",
    name: { en: "Full-height glazed partitions", ar: "قواطع زجاجية بارتفاع كامل" },
    summary: {
      en: "Slim aluminium frames that keep offices open and bright.",
      ar: "إطارات ألمنيوم نحيفة تُبقي المكاتب مفتوحة ومضيئة.",
    },
    image: img("/images/work/part-demountable-glazed.jpg", 944, 750),
  },
  {
    id: "timber-glass",
    category: "partitions",
    role: "supplied",
    name: { en: "Timber and glass partitions", ar: "قواطع خشب وزجاج" },
    summary: {
      en: "Timber-faced solid panels combined with glazed modules.",
      ar: "ألواح مصمتة بواجهات خشبية مع وحدات زجاجية.",
    },
    image: img("/images/work/part-demountable-timber.jpg", 926, 750),
  },

  /* ---------- boards and materials, supplied ---------- */
  {
    id: "gypsum-board",
    category: "boards",
    role: "supplied",
    name: { en: "Gypsum board", ar: "ألواح الجبس" },
    summary: {
      en: "Standard, moisture-resistant and fire-rated boards for ceilings and walls.",
      ar: "ألواح عادية ومقاومة للرطوبة ومقاومة للحريق للأسقف والجدران.",
    },
    brands: ["qgyps", "gyproc", "knauf", "usg"],
  },
  {
    id: "cement-board",
    category: "boards",
    role: "supplied",
    name: { en: "Cement and calcium silicate board", ar: "ألواح أسمنتية وسيليكات الكالسيوم" },
    summary: {
      en: "For wet areas, external soffits and walls that take knocks.",
      ar: "للمناطق الرطبة والأسقف الخارجية والجدران المعرّضة للصدمات.",
    },
    brands: ["ramco", "shera"],
  },
  {
    id: "insulation",
    category: "boards",
    role: "supplied",
    name: { en: "Insulation", ar: "مواد العزل" },
    summary: {
      en: "Glass wool and rock wool for thermal and acoustic insulation.",
      ar: "صوف زجاجي وصخري للعزل الحراري والصوتي.",
    },
    brands: ["kimmco"],
  },
  {
    id: "metal-profiles",
    category: "boards",
    role: "supplied",
    name: { en: "Metal profiles and suspension", ar: "قطاعات معدنية وأنظمة تعليق" },
    summary: {
      en: "Studs, channels and ceiling grids, cut to length.",
      ar: "قوائم ومجارٍ وشبكات أسقف بالأطوال المطلوبة.",
    },
    brands: ["decotech", "knauf", "usg-me"],
  },
];
