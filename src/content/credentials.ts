/**
 * Credentials from the profile.
 * Approvals: consultants and authorities whose submittals approved QADCO (profile pp.55–63).
 * Brands: manufacturers QADCO installs (profile p.64). Logos cropped from the profile scan;
 * replace with clean vector files from each manufacturer when available.
 */
export const approvals = [
  "Ashghal (Public Works Authority)",
  "Qatar Petroleum",
  "Qatar Olympic Committee",
  "KEO International Consultants",
  "Dar Al-Handasah",
  "Arab Engineering Bureau",
  "Consulting Engineering Group",
  "Khatib & Alami",
  "Arab Consulting Engineers",
] as const;

export const brands = [
  { id: "armstrong", name: "Armstrong", w: 544, h: 138 },
  { id: "usg", name: "USG", w: 299, h: 216 },
  { id: "knauf", name: "Knauf", w: 399, h: 173 },
  { id: "chicago-metallic", name: "Chicago Metallic", w: 460, h: 124 },
  { id: "sas-international", name: "SAS International", w: 585, h: 339 },
  { id: "boral", name: "Boral", w: 459, h: 302 },
  { id: "mada-gypsum", name: "Mada Gypsum", w: 523, h: 542 },
  { id: "gypsemna", name: "Gypsemna", w: 479, h: 212 },
  { id: "a-metal", name: "A-Metal Systems", w: 275, h: 111 },
  { id: "diacrete", name: "Diacrete", w: 419, h: 168 },
  { id: "saddi-metal", name: "Saddi Metal", w: 546, h: 146 },
  { id: "tamsuei", name: "Tamsuei", w: 542, h: 186 },
  { id: "deco", name: "DECO", w: 548, h: 204 },
] as const;
