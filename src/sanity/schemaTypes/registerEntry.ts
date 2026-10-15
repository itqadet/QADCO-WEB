import { defineField, defineType } from "sanity";
import { scopeOptions, sectorOptions } from "./options";

/** One row in the searchable project register. No photos needed. */
export const registerEntry = defineType({
  name: "registerEntry",
  title: "Register entry",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Project name",
      description: "Shown as written, in both languages.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "string",
      options: { list: sectorOptions, layout: "dropdown" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "contractor", title: "Main contractor", type: "string" }),
    defineField({ name: "consultant", title: "Consultant", type: "string" }),
    defineField({
      name: "scope",
      title: "Our scope",
      type: "array",
      of: [{ type: "string" }],
      options: { list: scopeOptions, layout: "grid" },
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "period",
      title: "Year",
      description: "A year (2024) or a range (2023–24).",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sortKey",
      title: "Sort position",
      description: "Lower numbers show first. New entries default to the top.",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [{ title: "Register order", name: "sortKey", by: [{ field: "sortKey", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "period" } },
});
