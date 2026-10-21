import type { L } from "./localized";
import { register, type RegisterEntry } from "./register";

/*
 * Landmarks shown on the home page project board. Facts (place, year, contractor, consultant,
 * scope) come from the project register, looked up by name, so the two never disagree.
 *
 * Logos are the owners' trademarks, shown only to identify projects we worked on. Sources:
 * dohahamadairport.com, mia.org.qa, mathaf.org.qa, sc.qa (all official sites) and Wikipedia's
 * University of Calgary logo. "dark" plates carry logos made for dark backgrounds. Landmarks
 * without a usable public logo (a state emblem, private buildings) get a lettermark.
 */
export type LandmarkLogo =
  | { kind: "image"; src: string; width: number; height: number; plate: "light" | "dark" }
  | { kind: "letters"; text: string };

const img = (src: string, width: number, height: number, plate: "light" | "dark" = "light"): LandmarkLogo => ({
  kind: "image",
  src: `/images/landmarks/${src}`,
  width,
  height,
  plate,
});
const letters = (text: string): LandmarkLogo => ({ kind: "letters", text });

const picks: { register: string; name: L; short: L; logo: LandmarkLogo }[] = [
  {
    register: "Museum of Islamic Art",
    name: { en: "Museum of Islamic Art", ar: "متحف الفن الإسلامي" },
    short: { en: "Museum of Islamic Art", ar: "متحف الفن الإسلامي" },
    logo: img("mia.svg", 274, 103, "dark"),
  },
  {
    register: "Mathaf: Arab Museum of Modern Art",
    name: { en: "Mathaf: Arab Museum of Modern Art", ar: "مَتحف: المتحف العربي للفن الحديث" },
    short: { en: "Mathaf", ar: "مَتحف" },
    logo: img("mathaf.svg", 584, 234),
  },
  {
    register: "New Doha International Airport",
    name: { en: "Hamad International Airport (New Doha International Airport)", ar: "مطار حمد الدولي (مطار الدوحة الدولي الجديد)" },
    short: { en: "Hamad Int'l Airport", ar: "مطار حمد الدولي" },
    logo: img("hia.svg", 295, 119, "dark"),
  },
  {
    register: "Office of the Supreme Committee 2022 HQ (MOI)",
    name: { en: "Supreme Committee 2022 headquarters", ar: "مقر اللجنة العليا 2022" },
    short: { en: "Supreme Committee HQ", ar: "مقر اللجنة العليا" },
    logo: img("supreme-committee.png", 245, 94),
  },
  {
    register: "Laffan Tower, Ministry of Justice",
    name: { en: "Laffan Tower, Ministry of Justice", ar: "برج لفان، وزارة العدل" },
    short: { en: "Ministry of Justice", ar: "وزارة العدل" },
    logo: letters("MoJ"),
  },
  {
    register: "Burj Marina",
    name: { en: "Burj Marina, Lusail", ar: "برج المارينا، لوسيل" },
    short: { en: "Burj Marina", ar: "برج المارينا" },
    logo: letters("BM"),
  },
  {
    register: "AKH Tower offices",
    name: { en: "AKH Tower, West Bay", ar: "برج AKH، الخليج الغربي" },
    short: { en: "AKH Tower", ar: "برج AKH" },
    logo: letters("AKH"),
  },
  {
    register: "Qatar Equestrian Federation",
    name: { en: "Qatar Equestrian Federation", ar: "الاتحاد القطري للفروسية" },
    short: { en: "Equestrian Federation", ar: "اتحاد الفروسية" },
    logo: letters("QEF"),
  },
  {
    register: "Al Mana Towers",
    name: { en: "Al Mana Towers", ar: "أبراج المانع" },
    short: { en: "Al Mana Towers", ar: "أبراج المانع" },
    logo: letters("AM"),
  },
  {
    register: "University of Calgary in Qatar",
    name: { en: "University of Calgary in Qatar", ar: "جامعة كالغاري في قطر" },
    short: { en: "Univ. of Calgary", ar: "جامعة كالغاري" },
    logo: img("ucalgary.svg", 383, 289),
  },
];

export type Landmark = RegisterEntry & { id: string; title: L; short: L; logo: LandmarkLogo };

export const landmarks: Landmark[] = picks.map((p, i) => {
  const entry = register.find((r) => r.name === p.register);
  if (!entry) throw new Error(`Landmark not in the project register: ${p.register}`);
  return { ...entry, id: `lm-${i}`, title: p.name, short: p.short, logo: p.logo };
});
