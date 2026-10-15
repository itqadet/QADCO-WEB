import { defineField, defineType } from "sanity";
import { drawingOptions } from "./options";

/** A tower on the Doha skyline drawing on the Projects page. */
export const tower = defineType({
  name: "tower",
  title: "Skyline tower",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Tower name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "scope", title: "Our work", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "drawing",
      title: "Drawing",
      description: "The outline drawn on the skyline. Use a generic outline for a new tower.",
      type: "string",
      options: { list: drawingOptions, layout: "dropdown" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Position from the left", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Position", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.en", subtitle: "location.en" } },
});
