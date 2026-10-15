import { Archivo, IBM_Plex_Sans_Arabic, Reem_Kufi } from "next/font/google";

/** Latin headings and body. The width axis gives the extended headline cut. */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** Arabic headings: geometric kufi, matching the logo's Arabic lettering. */
export const reemKufi = Reem_Kufi({
  subsets: ["arabic"],
  variable: "--font-reem-kufi",
  display: "swap",
  preload: false,
});

/** Arabic body text. */
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});

export const fontVariables = [archivo.variable, reemKufi.variable, plexArabic.variable].join(" ");
