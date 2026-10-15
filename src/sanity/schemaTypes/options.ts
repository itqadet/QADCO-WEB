import { sectors } from "@/content/sectors";
import { scopes } from "@/content/register";
import { towerDrawings } from "@/content/skyline";

/** Pick-lists shared by the schemas, generated from the site's own content definitions. */
export const sectorOptions = Object.entries(sectors).map(([value, l]) => ({ value, title: l.en }));
export const scopeOptions = Object.entries(scopes).map(([value, l]) => ({ value, title: l.en }));
export const drawingOptions = Object.entries(towerDrawings).map(([value, d]) => ({ value, title: d.label }));
