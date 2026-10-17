import { localeString, localeText } from "./localized";
import { project } from "./project";
import { registerEntry } from "./registerEntry";
import { tower } from "./tower";
import { brand } from "./brand";
import { product } from "./product";
import { siteSettings } from "./siteSettings";
import { homeHero } from "./homeHero";

export const schemaTypes = [localeString, localeText, homeHero, project, registerEntry, tower, brand, product, siteSettings];

/** Document types that exist exactly once and can't be created or deleted by editors. */
export const singletonTypes = new Set(["siteSettings", "homeHero"]);
