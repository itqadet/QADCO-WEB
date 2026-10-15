import { localeString, localeText } from "./localized";
import { project } from "./project";
import { registerEntry } from "./registerEntry";
import { tower } from "./tower";
import { brand } from "./brand";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [localeString, localeText, project, registerEntry, tower, brand, siteSettings];

/** Document types that exist exactly once and can't be created or deleted by editors. */
export const singletonTypes = new Set(["siteSettings"]);
