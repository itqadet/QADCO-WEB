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
  /** Where the map on the Contact page puts its pin: an address, or "latitude,longitude" for an exact spot. */
  mapQuery: "Street 12, Doha Industrial Area, Qatar",
  /**
   * Office hours for the "Open now" badge on the Contact page, in Doha time (UTC+3).
   * Days use JavaScript numbering (0 = Sunday ... 6 = Saturday). Keep in step with the hours
   * shown under Contact details.
   */
  officeHours: { days: [6, 0, 1, 2, 3, 4], open: 7, close: 18 },
  /** WhatsApp number for the chat button, international form, digits only (as used in wa.me links). */
  whatsapp: "97444604337",
  /**
   * Crisp live chat (crisp.chat): the Website ID from Crisp -> Settings -> Website settings ->
   * Setup instructions. Empty keeps the help button WhatsApp-only. It is a public value.
   */
  crispWebsiteId: "",
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
  hours: { en: "Saturday to Thursday, 7:00 am to 6:00 pm", ar: "من السبت إلى الخميس، 7:00 صباحًا حتى 6:00 مساءً" },
  hoursConfirmed: true,
};

/** Facts from the profile, shown in the title-block strip. */
export const facts = {
  founded: 1996,
  incorporated: 2002,
  technicians: "300+",
  projects: "1000+",
} as const;
