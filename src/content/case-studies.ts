import type { L } from "./localized";
import type { SectorKey } from "./sectors";

/**
 * Projects with QADCO's own photographs (profile pp.40–47).
 * Facts are only what the profile states; contract values are deliberately omitted.
 */
export type CaseStudy = {
  slug: string;
  title: L;
  sector: SectorKey;
  location?: L;
  building?: string;
  contractor?: string;
  consultant?: string;
  summary: L;
  scope: L[];
  /** Shown on the home page (at most four). */
  featured?: boolean;
  cover: Photo;
  photos: Photo[];
};

export type Photo = { src: string; width: number; height: number; caption: L };

const p = (file: string, width: number, height: number, en: string, ar: string): Photo => ({
  src: `/images/projects/${file}.jpg`,
  width,
  height,
  caption: { en, ar },
});

export const caseStudies: CaseStudy[] = [
  {
    slug: "akh-tower",
    featured: true,
    title: { en: "AKH Tower offices", ar: "مكاتب برج AKH" },
    sector: "offices",
    location: { en: "West Bay (Dafna), Doha", ar: "الخليج الغربي (الدفنة)، الدوحة" },
    building: "2B+G+38",
    contractor: "Ramco Trading & Contracting",
    consultant: "SYNA",
    summary: {
      en: "Decorative gypsum ceilings, geometric timber-and-plaster coffers and demountable partitions across a 38-storey office tower in West Bay.",
      ar: "أسقف جبسية زخرفية وتجاويف هندسية من الخشب والجص وقواطع قابلة للفك في برج مكاتب من 38 طابقًا في الخليج الغربي.",
    },
    scope: [
      { en: "Decorative gypsum board ceilings with cornices", ar: "أسقف ألواح جبسية زخرفية مع كرانيش" },
      { en: "Geometric coffers with timber-faced bulkheads", ar: "تجاويف هندسية بجسور مكسوّة بالخشب" },
      { en: "Ornamental painted ceilings", ar: "أسقف مزخرفة بالرسم" },
      { en: "Demountable partitions with glazed panels", ar: "قواطع قابلة للفك بألواح زجاجية" },
    ],
    cover: p("akh-timber-coffer", 1920, 1259, "Geometric timber-and-gypsum coffer in an executive suite", "تجويف هندسي من الخشب والجبس في جناح تنفيذي"),
    photos: [
      p("akh-timber-coffer", 1920, 1259, "Geometric timber-and-gypsum coffer in an executive suite", "تجويف هندسي من الخشب والجبس في جناح تنفيذي"),
      p("akh-hexagon-coffer", 1920, 1280, "Stepped hexagonal gypsum coffer with cornice", "تجويف جبسي سداسي متدرّج مع كرنيش"),
      p("akh-ornamental-ceiling", 1168, 1808, "Ornamental painted gypsum ceiling", "سقف جبسي مزخرف بالرسم"),
      p("akh-corridor-partitions", 1200, 1920, "Corridor of demountable timber partitions", "ممر بقواطع خشبية قابلة للفك"),
      p("akh-tower-exterior", 997, 1920, "AKH Tower, West Bay", "برج AKH، الخليج الغربي"),
    ],
  },
  {
    slug: "criminal-investigation-department",
    featured: true,
    title: { en: "Criminal Investigation Department", ar: "إدارة البحث الجنائي" },
    sector: "government",
    location: { en: "Doha", ar: "الدوحة" },
    contractor: "Al Ali International",
    consultant: "M.O.I. Engineering and Maintenance Division",
    summary: {
      en: "Decorative gypsum ceilings for the auditorium, reception and halls of the Ministry of Interior's Criminal Investigation Department, completed in 2011.",
      ar: "أسقف جبسية زخرفية لقاعة المحاضرات والاستقبال والقاعات في إدارة البحث الجنائي بوزارة الداخلية، أُنجزت عام 2011.",
    },
    scope: [
      { en: "Curved gypsum bulkheads with recessed downlights", ar: "جسور جبسية منحنية مع سبوتات غائرة" },
      { en: "Stepped auditorium ceiling", ar: "سقف متدرّج لقاعة المحاضرات" },
      { en: "Coffered reception ceiling", ar: "سقف مجوّف لمنطقة الاستقبال" },
    ],
    cover: p("cid-auditorium-stage", 1920, 1259, "Auditorium with curved gypsum bulkheads", "قاعة محاضرات بجسور جبسية منحنية"),
    photos: [
      p("cid-auditorium-stage", 1920, 1259, "Auditorium with curved gypsum bulkheads", "قاعة محاضرات بجسور جبسية منحنية"),
      p("cid-auditorium-side", 1920, 1259, "Auditorium seating under the stepped ceiling", "مقاعد القاعة تحت السقف المتدرّج"),
      p("cid-reception", 1920, 1259, "Reception under a coffered ceiling", "الاستقبال تحت سقف مجوّف"),
      p("cid-hall", 1920, 1259, "Hall with layered gypsum bulkheads", "قاعة بجسور جبسية متعددة المستويات"),
      p("cid-exterior", 1840, 1136, "Criminal Investigation Department building", "مبنى إدارة البحث الجنائي"),
    ],
  },
  {
    slug: "al-attiya-tower",
    title: { en: "Al Attiya Tower", ar: "برج العطية" },
    sector: "offices",
    location: { en: "Corniche, Doha", ar: "الكورنيش، الدوحة" },
    building: "2B+G+14",
    contractor: "CRC Engineering",
    consultant: "Top Design Engineering Consultant",
    summary: {
      en: "Office floors designed with gypsum board and metal ceiling tiles, integrating linear lighting and air diffusers.",
      ar: "طوابق مكاتب بتصميم يجمع الألواح الجبسية وبلاطات الأسقف المعدنية، مع دمج الإنارة الطولية وفتحات التكييف.",
    },
    scope: [
      { en: "Gypsum board ceilings and bulkheads", ar: "أسقف وجسور من الألواح الجبسية" },
      { en: "Metal ceiling tiles on concealed grid", ar: "بلاطات أسقف معدنية على شبكة مخفية" },
      { en: "Coordination of lights and diffusers", ar: "تنسيق الإنارة وفتحات التكييف" },
    ],
    cover: p("attiya-metal-office", 1120, 1904, "Metal tile ceiling with linear lights", "سقف بلاطات معدنية مع إنارة طولية"),
    photos: [
      p("attiya-metal-office", 1120, 1904, "Metal tile ceiling with linear lights", "سقف بلاطات معدنية مع إنارة طولية"),
      p("attiya-metal-tiles", 1120, 1904, "Gypsum bulkhead meeting the metal tile field", "جسر جبسي يلتقي بحقل البلاطات المعدنية"),
      p("attiya-exterior", 1728, 1376, "Al Attiya Tower on the Corniche", "برج العطية على الكورنيش"),
    ],
  },
  {
    slug: "golden-tower",
    title: { en: "Golden Tower", ar: "البرج الذهبي" },
    sector: "offices",
    location: { en: "Doha", ar: "الدوحة" },
    summary: {
      en: "Lobby and corridor ceilings with deep cove lighting set into gypsum bulkheads.",
      ar: "أسقف للردهة والممرات بإضاءة مخفية عميقة داخل جسور جبسية.",
    },
    scope: [
      { en: "Gypsum bulkheads with cove lighting", ar: "جسور جبسية بإضاءة مخفية" },
      { en: "Linear slot diffusers set into the ceiling", ar: "فتحات تكييف شريطية مدمجة في السقف" },
    ],
    cover: p("golden-cove-lobby", 1136, 1904, "Lobby ceiling with deep cove lighting", "سقف الردهة بإضاءة مخفية عميقة"),
    photos: [
      p("golden-cove-lobby", 1136, 1904, "Lobby ceiling with deep cove lighting", "سقف الردهة بإضاءة مخفية عميقة"),
      p("golden-cove-corridor", 1044, 1920, "Corridor bulkhead with cove light", "جسر الممر بإضاءة مخفية"),
    ],
  },
  {
    slug: "school-doha",
    title: { en: "School campus, Doha", ar: "مجمّع مدرسي، الدوحة" },
    sector: "education",
    location: { en: "Doha", ar: "الدوحة" },
    contractor: "Al Ali International / Al Mana Qatar",
    summary: {
      en: "Perforated gypsum ceilings, 600 × 600 mm tile ceilings and wood wool acoustic wall cladding for a school campus.",
      ar: "أسقف جبسية مثقّبة وأسقف بلاطات 600 × 600 مم وتكسية جدارية صوتية من الصوف الخشبي لمجمّع مدرسي.",
    },
    scope: [
      { en: "Perforated gypsum board ceilings", ar: "أسقف ألواح جبسية مثقّبة" },
      { en: "600 × 600 mm ceiling tiles", ar: "بلاطات أسقف 600 × 600 مم" },
      { en: "Wood wool acoustic wall cladding", ar: "تكسية جدارية صوتية من الصوف الخشبي" },
    ],
    cover: p("school-woodwool-cladding", 1920, 1014, "Wood wool acoustic wall cladding", "تكسية جدارية صوتية من الصوف الخشبي"),
    photos: [
      p("school-woodwool-cladding", 1920, 1014, "Wood wool acoustic wall cladding", "تكسية جدارية صوتية من الصوف الخشبي"),
      p("school-corridor-perforated", 1184, 1792, "Corridor with perforated gypsum ceiling", "ممر بسقف جبسي مثقّب"),
      p("school-corridor-tiles", 1184, 1792, "Corridor with 600 × 600 mm tile ceiling", "ممر بسقف بلاطات 600 × 600 مم"),
      p("school-ceiling-works", 1792, 1184, "Gypsum bulkheads during installation", "جسور جبسية أثناء التركيب"),
      p("school-exterior", 1920, 840, "The school campus", "المجمّع المدرسي"),
    ],
  },
  {
    slug: "holiday-inn",
    featured: true,
    title: { en: "Holiday Inn hotel", ar: "فندق هوليداي إن" },
    sector: "hotels",
    location: { en: "Nujma, Doha", ar: "النجمة، الدوحة" },
    contractor: "Man Enterprises",
    consultant: "Arab Engineering Bureau",
    summary: {
      en: "Decorative gypsum board ceilings throughout the guest rooms of a new Holiday Inn.",
      ar: "أسقف ألواح جبسية زخرفية في غرف النزلاء بفندق هوليداي إن الجديد.",
    },
    scope: [
      { en: "Decorative gypsum board ceilings", ar: "أسقف ألواح جبسية زخرفية" },
      { en: "Suspended ceilings and drywall partitions", ar: "أسقف معلّقة وقواطع جبسية" },
    ],
    cover: p("hotel-room-twin", 1792, 1184, "Guest room with gypsum ceiling", "غرفة نزلاء بسقف جبسي"),
    photos: [
      p("hotel-room-twin", 1792, 1184, "Guest room with gypsum ceiling", "غرفة نزلاء بسقف جبسي"),
      p("hotel-room-single", 1792, 1184, "Guest room ceiling and curtain pocket", "سقف غرفة النزلاء وجيب الستارة"),
      p("hotel-construction", 1312, 1856, "The hotel during construction", "الفندق أثناء الإنشاء"),
    ],
  },
  {
    slug: "health-centre",
    featured: true,
    title: { en: "Health centre", ar: "مركز صحي" },
    sector: "healthcare",
    contractor: "Amana Qatar",
    summary: {
      en: "Decorative gypsum ceilings with cove lighting for the reception, corridors and atrium of a primary health care centre.",
      ar: "أسقف جبسية زخرفية بإضاءة مخفية للاستقبال والممرات والردهة في مركز للرعاية الصحية الأولية.",
    },
    scope: [
      { en: "Gypsum bulkheads with cove lighting", ar: "جسور جبسية بإضاءة مخفية" },
      { en: "Gypsum ceilings and partitions", ar: "أسقف وقواطع جبسية" },
      { en: "Mineral fibre ceilings", ar: "أسقف الألياف المعدنية" },
    ],
    cover: p("health-reception", 1904, 1232, "Reception under a lit gypsum bulkhead", "الاستقبال تحت جسر جبسي مضاء"),
    photos: [
      p("health-reception", 1904, 1232, "Reception under a lit gypsum bulkhead", "الاستقبال تحت جسر جبسي مضاء"),
      p("health-atrium", 1904, 1232, "Atrium with layered gypsum ceilings", "ردهة بأسقف جبسية متعددة المستويات"),
      p("health-corridor", 1792, 1376, "Clinic corridor with cove-lit bulkheads", "ممر العيادات بجسور ذات إضاءة مخفية"),
      p("health-exterior", 1840, 1136, "The health centre", "المركز الصحي"),
    ],
  },
];

