import type { L } from "./localized";
import type { SectorKey } from "./sectors";

/**
 * Project register, compiled from the profile's project lists (pp.21–39, 51–53).
 * Contract values are deliberately omitted. Private homes are listed without owner names.
 * Project, contractor and consultant names are proper nouns and stay in Latin script in both languages.
 */
export const scopes = {
  gyp: { en: "Gypsum board ceilings", ar: "أسقف ألواح جبسية" },
  mf: { en: "Mineral fibre ceilings", ar: "أسقف ألياف معدنية" },
  met: { en: "Metal ceilings", ar: "أسقف معدنية" },
  grg: { en: "GRG ceilings", ar: "أسقف GRG" },
  part: { en: "Drywall partitions", ar: "قواطع جبسية" },
  dem: { en: "Demountable partitions", ar: "قواطع قابلة للفك" },
  ac: { en: "Acoustic ceilings", ar: "أسقف صوتية" },
  ww: { en: "Wood wool cladding", ar: "تكسية الصوف الخشبي" },
  dec: { en: "Decorative gypsum and cornices", ar: "جبس زخرفي وكرانيش" },
  gen: { en: "Ceilings and partitions", ar: "أسقف وقواطع" },
} satisfies Record<string, L>;

export type ScopeKey = keyof typeof scopes;

export type RegisterEntry = {
  name: string;
  sector: SectorKey;
  location?: string;
  contractor?: string;
  consultant?: string;
  scope: ScopeKey[];
  period: string;
};

type Row = [name: string, sector: SectorKey, location: string, contractor: string, consultant: string, scope: ScopeKey[], period: string];

const rows: Row[] = [
  // Ongoing and awarded, 2015–16
  ["Holiday Inn", "hotels", "Nujma", "Man Enterprises", "Arab Engineering Bureau", ["gen"], "2015–16"],
  ["Office of the Supreme Committee 2022 HQ (MOI)", "government", "Al Saad", "Al Ali International", "Architecture and Planning Group", ["gen"], "2015–16"],
  ["National Cyber Security Center", "government", "Wadi Al Sail", "Al Ali International", "EHAF", ["gen"], "2015–16"],
  ["Two health care centres", "healthcare", "Muaither and Wajbah", "International Trading & Contracting", "CEG", ["gen"], "2015–16"],
  ["Four new schools, package 4", "education", "Doha", "Amana Qatar", "Arab Engineering Bureau", ["gen"], "2015–16"],
  ["Aster Hospital", "healthcare", "Doha", "Hamton International", "EHAF", ["gen"], "2015–16"],
  ["Doha Festival City", "retail", "Umm Salal", "International Trading & Contracting", "WSP", ["gen"], "2015–16"],
  ["Marina Yacht Club", "sports", "Lusail", "CEINSA JV Al Jaber Trading", "Dorsch Group Qatar", ["gen"], "2015–16"],
  ["QNB branch", "banking", "C-Ring Road", "Ghadeer Interior Decoration", "Architecture and Planning Group", ["gen"], "2015–16"],
  ["Porto Arabia PA10B", "residential", "The Pearl", "Harinsa Qatar", "", ["gen"], "2015–16"],
  ["Barwa Al Khor housing, package 2", "residential", "Al Khor", "Insha Contracting", "", ["gen"], "2015–16"],
  ["Barwa Al Baraha", "residential", "Industrial Area", "Construction & Reconstruction Co.", "Qatar Design Consortium", ["gen"], "2015–16"],
  ["Kahramaa central workshop", "industrial", "Doha", "Leighton Contracting", "Qatar Design Consortium", ["gen"], "2015–16"],
  ["Labour accommodation", "residential", "Ras Laffan", "National Industrial Contracting", "Qatar Design Consortium", ["gen"], "2015–16"],
  ["Le Mirage apartment building", "residential", "New Salata", "MID Contracting", "Arab Engineering Bureau", ["gen"], "2015–16"],
  ["Al Madeena Complex", "offices", "Bin Omran", "Hamton International", "James Cubitt & Partners", ["gen"], "2015–16"],
  ["General Takaful", "offices", "C-Ring Road", "Oriental Enterprises", "Khatib & Alami", ["gen"], "2015–16"],
  ["Premier Inn hotel", "hotels", "Doha", "Al Fowriya", "Arab Engineering Bureau", ["gen"], "2015–16"],
  ["Ezdan School", "education", "Al Wakra", "SAK Trading & Contracting", "", ["gen"], "2015–16"],
  ["Existing schools and kindergartens, phase 2", "education", "Doha", "Al Huda Engineering", "KEO", ["gen"], "2015–16"],
  ["NPP032 commercial infrastructure", "industrial", "New Port", "Shapoorji Pallonji", "Arab Engineering Bureau", ["gen"], "2015–16"],
  ["Container and vehicle inspection system", "government", "Abu Samra", "China Railway", "COWI", ["gen"], "2015–16"],
  ["Al Matar showroom", "retail", "Matar Qadeem", "Ghantoot Construction", "James Cubitt & Partners", ["gen"], "2015–16"],

  // Completed 2012–2014
  ["MKH Tower", "offices", "Lusail", "CRC", "SYNA Engineering", ["gyp"], "2014"],
  ["Al Rabban Suites", "hotels", "Dafna", "CRC", "Arab Engineering Bureau", ["gyp", "part"], "2014"],
  ["Burj Marina", "residential", "Lusail", "Redco International", "KEO", ["gyp", "part"], "2014"],
  ["Health centre, package 3", "healthcare", "Al Nuaim", "Amana Qatar", "Dar Al-Handasah", ["gyp", "part", "mf"], "2014"],
  ["Health centre, package 1", "healthcare", "Al Karaana", "Al Sariya", "Dar Al-Handasah", ["gyp", "part", "mf"], "2014"],
  ["Health centre, package 1", "healthcare", "Al Ghuwairiya", "Al Sraiya", "Dar Al-Handasah", ["gyp", "part", "mf"], "2014"],
  ["Civil Defence, phase 2", "government", "Al Thumama", "Al Aali International", "MOI Engineering and Maintenance", ["gyp", "met"], "2014"],
  ["Juma Masjid", "government", "Dukhan", "Al Madar", "Iproplan", ["met", "gyp"], "2014"],
  ["New community centre", "government", "Dukhan", "NICC", "MZ & Partners", ["met", "gyp"], "2014"],
  ["University of Calgary in Qatar", "education", "Al Rayyan", "Al Ali", "", ["gyp", "met", "mf"], "2014"],
  ["Qatar Equestrian Federation", "sports", "Al Rayyan", "Lotus", "Dar Al-Handasah", ["met", "gyp"], "2014"],
  ["School project, package 1", "education", "Al Khisha and Al Luqtha", "ITCC", "ECG", ["gyp", "met", "ww"], "2014"],
  ["Laffan Tower, Ministry of Justice", "government", "West Bay", "Dolphin Holding", "FAIM", ["gyp"], "2014"],
  ["Barwa Al Khor housing development", "residential", "Al Khor", "Group 3 Contracting", "MZ & Partners", ["gyp", "dec"], "2014"],
  ["Al Madin Complex", "offices", "Bin Mahmoud", "Hamton International", "EHAF", ["gyp", "part"], "2014"],
  ["Bin Samikh hotel tower", "hotels", "Doha", "Harinsa Qatar", "Arab Consulting Engineers", ["gyp"], "2012–14"],
  ["Qatar Olympic Committee", "sports", "Doha", "Lotus", "", ["gen"], "2012–14"],
  ["Doha Bank", "banking", "Doha", "Doha Bank", "", ["grg", "part"], "2012–14"],
  ["Al Jasra Twin Tower", "offices", "Doha", "CRC", "EHAF", ["gen"], "2013"],
  ["Al Baraha Tower", "offices", "Doha", "CRC", "EHAF", ["gen"], "2012"],
  ["Museum of Islamic Art", "government", "Corniche", "Al Fowriya", "", ["gen"], "2012–14"],
  ["MIA service building", "government", "Corniche", "Al Fowriya", "", ["gen"], "2012–14"],
  ["Qatar Airways crew accommodation", "residential", "Doha", "Redco International", "", ["gen"], "2012–14"],
  ["AMB Military College", "government", "Doha", "Arcon", "", ["gen"], "2012–14"],
  ["Halul Island facilities", "industrial", "Halul Island", "Oriental", "", ["gen"], "2012–14"],
  ["MIC business and recreation complex", "sports", "Mesaieed", "Arcon", "", ["gen"], "2012–14"],
  ["Al Shiouk Mosque", "government", "Doha", "Oriental", "", ["gen"], "2012–14"],
  ["Audi showroom", "retail", "Doha", "NICC", "", ["gen"], "2012–14"],
  ["Al Khaliji Bank", "banking", "Doha", "Shannon Engineering", "", ["gen"], "2012–14"],
  ["CBQ Academy", "education", "Doha", "Ramco Trading & Contracting", "Arab Engineering Bureau", ["gen"], "2014"],
  ["Police officers' accommodation (MOI)", "government", "Doha", "Al Ali International", "", ["gen"], "2012–14"],
  ["Dukhan township", "residential", "Dukhan", "Energy Tech", "", ["gen"], "2012–14"],
  ["Basketball stadium", "sports", "Doha", "ITCC", "", ["gen"], "2012–14"],
  ["Doha Academy", "education", "Doha", "NICC", "", ["gen"], "2012–14"],
  ["Three schools, package 1", "education", "Doha", "ITCC", "", ["gen"], "2012–14"],
  ["Ooredoo (Q-Tel) building", "offices", "Doha", "Amana Qatar", "", ["gen"], "2012–14"],
  ["Al Wakra Municipality", "government", "Al Wakra", "Hamton International", "", ["gen"], "2012–14"],

  // Completed 2008–2012
  ["AKH Tower offices", "offices", "West Bay", "Ramco Trading & Contracting", "SYNA", ["dec", "gyp", "dem"], "2011"],
  ["Commercial and residential building", "offices", "Doha", "Ramco Trading & Contracting", "Qatar Design Consortium", ["gen"], "2013"],
  ["Al Attiya Building", "offices", "Doha", "CRC", "Arab Engineering Bureau", ["gen"], "2009"],
  ["Al Mana Towers", "offices", "Doha", "CRC", "Khatib & Alami", ["met", "gyp"], "2007"],
  ["Panasonic showroom", "retail", "Doha", "CRC", "James Cubitt & Partners", ["gen"], "2010"],
  ["Al Backer Tower", "offices", "Doha", "CRC", "James Cubitt & Partners", ["gen"], "2011"],
  ["Criminal Investigation Department", "government", "Doha", "Al Ali International", "MOI Engineering and Maintenance", ["dec", "gyp"], "2011"],
  ["Five new schools", "education", "Doha", "Al Ali International", "Khatib & Alami", ["gen"], "2010"],
  ["Al Khor housing project", "residential", "Al Khor", "CRC", "Arab Engineering Bureau", ["gen"], "2012"],
  ["Viva Bahriya 17", "residential", "The Pearl", "Redco Construction Al Mana", "", ["gen"], "2010–11"],
  ["Silhouette Tower", "offices", "Doha", "Redco Construction Al Mana", "CIECO", ["met", "gyp"], "2010–11"],
  ["Dukhan housing project, phase VIII", "residential", "Dukhan", "NICC", "Consulting Engineering Group", ["gyp"], "2009"],
  ["Mathaf: Arab Museum of Modern Art", "government", "Education City", "Confidence Engineering Development", "", ["gen"], "2010–11"],
  ["Doha Stadium (Six Club)", "sports", "Doha", "ITCC", "", ["gen"], "2010–11"],
  ["International School (Choueifat)", "education", "Doha", "Mamco General Contracting", "", ["gen"], "2010–11"],
  ["Retaj hotel", "hotels", "Doha", "Ghadeer Interior Decoration", "", ["gen"], "2010–11"],
  ["Algerian Embassy", "government", "Doha", "Afrina Trading & Contracting", "", ["gen"], "2011–12"],
  ["Al Naser Twin Tower", "offices", "Doha", "CRC", "", ["gen"], "2011–12"],
  ["Ramada hotel extension", "hotels", "Doha", "Al Jaber Trading & Contracting", "W.S. Atkins", ["met", "gyp", "dec"], "2008–09"],
  ["Al Amana Tower", "offices", "Doha", "CRC Dorra", "Khatib & Alami", ["met", "gyp", "dec"], "2008–09"],
  ["Majidco Tower", "offices", "Doha", "Al Majid Est.", "Consulting Engineering Group", ["gyp", "part"], "2008–09"],
  ["124-villa compound", "residential", "Gharafa", "Gettco Contracting", "Diwan Architect", ["gyp", "met", "dec"], "2008–09"],
  ["Al Wakra, Al Khor and Al Ahli sports clubs", "sports", "Doha", "International Trading & Contracting", "QNOC", ["gyp", "met", "ac"], "2008–09"],
  ["Mesaieed housing, package III", "residential", "Mesaieed", "Al Attiyah Contracting & Trading", "Mounsell Consulting Services", ["met", "gyp", "dec"], "2008–09"],
  ["Al Rayah printing press, Gulf Publishing", "industrial", "Doha", "Lotus Trading & Contracting", "Arab Engineering Bureau", ["met", "gyp", "part"], "2008–09"],
  ["Six schools (Abu Hamour, Al Sailiya, Al Saad, Al Dakhira, Al Khor, Madinat Khalifa)", "education", "Doha", "International Trading & Contracting", "", ["mf", "met"], "2008–09"],
  ["Hamad Medical Corporation training centre", "healthcare", "Doha", "Bujamoor Trading & Contracting", "", ["met", "mf", "gyp"], "2008–12"],
  ["New Doha International Airport", "industrial", "Doha", "Sky Oryx", "", ["part"], "2008–12"],
  ["Doha International Airport cargo extension", "industrial", "Doha", "Gulf Housing & Construction", "KEO", ["part", "mf"], "2008–12"],
  ["Al Othman Tower (B+G+21)", "offices", "West Bay", "Gulf Housing & Construction", "AEB", ["gyp", "met", "dec"], "2008–12"],
  ["Mushreq Tower and four residential towers", "offices", "West Bay", "Thani Bin Abdullah Housing Group", "", ["part", "grg", "gyp"], "2008–12"],
  ["Qatar University computer building", "education", "Doha", "Al Andalus Engineering", "Qatari Engineer & Associates", ["mf", "met", "gyp"], "2008–12"],
  ["College of Technology", "education", "Al Muraikh", "Tadmur Contracting & Trading", "Arab Engineers Consultant", ["mf", "met", "gyp"], "2008–12"],
  ["Dasman hypermarket", "retail", "Doha", "Amana Steel Buildings", "", ["part", "gyp"], "2008–12"],
  ["Cinema at Landmark", "retail", "Landmark", "Tivoli", "", ["gyp"], "2008–12"],
  ["Dana Tower", "offices", "Doha", "IBA", "", ["grg"], "2008–12"],
  ["Qatar Islamic Bank main office", "banking", "Al Saad", "", "", ["part"], "2008–12"],
  ["Qatar Development Bank", "banking", "Doha", "", "", ["dem"], "2008–12"],
  ["Legislation office, Diwan Al Amiri", "government", "Doha", "Shanoon Trading & Contracting", "", ["part", "grg", "dec"], "2008–12"],
  ["Private palace", "residential", "Al Wajba", "AKC Contracting", "", ["grg", "dec"], "2008–12"],
  ["Private palace", "residential", "Al Wajba", "International Trading & Contracting", "", ["grg", "dec"], "2008–12"],
  ["Qatar Sports Club", "sports", "Doha", "International Trading & Contracting", "", ["dec", "met"], "2008–12"],
  ["Al Arabi Sports Club", "sports", "Doha", "Tadmur Trading & Contracting", "", ["met", "ac", "mf"], "2008–12"],
  ["Al Wusail Olympic shooting range", "sports", "Al Wusail", "Al Attiyah Contracting & Trading", "", ["met"], "2008–12"],
  ["Private villas", "residential", "Dafna, Duhail, Abu Hamour, Khartiyat, Umm Salal", "", "", ["gyp", "met", "dec"], "2008–12"],
];

export const register: RegisterEntry[] = rows.map(([name, sector, location, contractor, consultant, scope, period]) => ({
  name,
  sector,
  location: location || undefined,
  contractor: contractor || undefined,
  consultant: consultant || undefined,
  scope,
  period,
}));
