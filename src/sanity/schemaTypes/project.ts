import { defineArrayMember, defineField, defineType } from "sanity";
import { sectorOptions } from "./options";

/** A project with photographs: gets its own page and a card on the Projects page. */
export const project = defineType({
  name: "project",
  title: "Project with photos",
  type: "document",
  groups: [
    { name: "about", title: "About the project", default: true },
    { name: "photos", title: "Photos" },
    { name: "display", title: "Where it shows" },
  ],
  fields: [
    defineField({ name: "title", title: "Project name", type: "localeString", group: "about", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      description: "Becomes qadco.qa/en/projects/… Press Generate after typing the English name.",
      type: "slug",
      group: "about",
      options: { source: "title.en", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "string",
      group: "about",
      options: { list: sectorOptions, layout: "dropdown" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "location", title: "Location", type: "localeString", group: "about" }),
    defineField({ name: "building", title: "Building height", description: "For example 2B+G+38", type: "string", group: "about" }),
    defineField({ name: "contractor", title: "Main contractor", type: "string", group: "about" }),
    defineField({ name: "consultant", title: "Consultant", type: "string", group: "about" }),
    defineField({
      name: "summary",
      title: "Short description",
      description: "One or two sentences shown under the project name.",
      type: "localeText",
      group: "about",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "scope",
      title: "What we installed",
      description: "One line per item.",
      type: "array",
      group: "about",
      of: [defineArrayMember({ type: "localeString" })],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "photos",
      title: "Photos",
      description: "The first photo is the cover. Drag to reorder.",
      type: "array",
      group: "photos",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "caption",
              title: "Caption",
              description: "Describe what the photo shows. Also read aloud to blind visitors.",
              type: "localeString",
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "featured",
      title: "Show on the home page",
      description: "Up to four projects show on the home page.",
      type: "boolean",
      group: "display",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      description: "Lower numbers show first.",
      type: "number",
      group: "display",
      initialValue: 100,
    }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title.en", subtitle: "location.en", media: "photos.0" },
  },
});
