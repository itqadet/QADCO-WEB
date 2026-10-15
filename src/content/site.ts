import type { L } from "./localized";

/**
 * Fixed company facts and site settings.
 * Contact details are edited in the Studio ("Contact details"); `defaultSettings` is used until
 * they are published there. Source: QADCO Company Profile & Pre-Qualification (confirmed Oct 2026).
 */
export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  commercialRegistration: "25310",
  website: "www.qasralandalusco.com",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Qasr+Al+Andalus+Co+Street+12+Doha+Industrial+Area+Qatar",
} as const;

export type Settings = {
  phone: { display: string; href: string };
  fax?: { display: string };
  email: { display: string; href: string };
  office: L;
  poBox?: string;
  hours?: L;
  /** Until confirmed, hours are shown highlighted as a reminder. */
  hoursConfirmed: boolean;
};

export const defaultSettings: Settings = {
  phone: { display: "+974 4460 4337", href: "tel:+97444604337" },
  fax: { display: "+974 4460 4338" },
  email: { display: "qadco-1@qatar.net.qa", href: "mailto:qadco-1@qatar.net.qa" },
  office: {
    en: "Gate 59, Street 12, Doha Industrial Area, Qatar",
    ar: "بوابة 59، شارع 12، المنطقة الصناعية، الدوحة، قطر",
  },
  poBox: "11218",
  hours: { en: "Sunday to Thursday, 7:30 to 17:00", ar: "من الأحد إلى الخميس، 7:30 حتى 17:00" },
  hoursConfirmed: false,
};

/** Facts from the profile, shown in the title-block strip. */
export const facts = {
  founded: 1996,
  incorporated: 2002,
  technicians: "300+",
  projects: "200+",
} as const;
