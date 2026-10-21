import type { L } from "./localized";
import { register, type RegisterEntry } from "./register";

/*
 * Landmarks shown on the home page project board. Facts (place, year, contractor, consultant,
 * scope) come from the project register, looked up by name, so the two never disagree.
 * Each adds a name in both languages and a short label for the diagram.
 */
const picks: { register: string; name: L; short: L }[] = [
  { register: "Museum of Islamic Art", name: { en: "Museum of Islamic Art", ar: "متحف الفن الإسلامي" }, short: { en: "Museum of Islamic Art", ar: "متحف الفن الإسلامي" } },
  { register: "Mathaf: Arab Museum of Modern Art", name: { en: "Mathaf: Arab Museum of Modern Art", ar: "مَتحف: المتحف العربي للفن الحديث" }, short: { en: "Mathaf", ar: "مَتحف" } },
  { register: "New Doha International Airport", name: { en: "New Doha International Airport", ar: "مطار الدوحة الدولي الجديد" }, short: { en: "New Doha Airport", ar: "مطار الدوحة الجديد" } },
  { register: "Office of the Supreme Committee 2022 HQ (MOI)", name: { en: "Supreme Committee 2022 headquarters", ar: "مقر اللجنة العليا 2022" }, short: { en: "Supreme Committee 2022 HQ", ar: "مقر اللجنة العليا" } },
  { register: "Laffan Tower, Ministry of Justice", name: { en: "Laffan Tower, Ministry of Justice", ar: "برج لفان، وزارة العدل" }, short: { en: "Ministry of Justice", ar: "وزارة العدل" } },
  { register: "Burj Marina", name: { en: "Burj Marina, Lusail", ar: "برج المارينا، لوسيل" }, short: { en: "Burj Marina", ar: "برج المارينا" } },
  { register: "AKH Tower offices", name: { en: "AKH Tower, West Bay", ar: "برج AKH، الخليج الغربي" }, short: { en: "AKH Tower", ar: "برج AKH" } },
  { register: "Qatar Equestrian Federation", name: { en: "Qatar Equestrian Federation", ar: "الاتحاد القطري للفروسية" }, short: { en: "Equestrian Federation", ar: "اتحاد الفروسية" } },
  { register: "Al Mana Towers", name: { en: "Al Mana Towers", ar: "أبراج المانع" }, short: { en: "Al Mana Towers", ar: "أبراج المانع" } },
  { register: "University of Calgary in Qatar", name: { en: "University of Calgary in Qatar", ar: "جامعة كالغاري في قطر" }, short: { en: "Univ. of Calgary", ar: "جامعة كالغاري" } },
];

export type Landmark = RegisterEntry & { id: string; title: L; short: L };

export const landmarks: Landmark[] = picks.map((p, i) => {
  const entry = register.find((r) => r.name === p.register);
  if (!entry) throw new Error(`Landmark not in the project register: ${p.register}`);
  return { ...entry, id: `lm-${i}`, title: p.name, short: p.short };
});
