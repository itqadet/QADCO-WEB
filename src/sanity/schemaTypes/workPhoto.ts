import { defineField, defineType } from "sanity";
import { workCategories } from "@/content/works";

const categoryTitles: Record<(typeof workCategories)[number], string> = {
  ceilings: "Gypsum ceilings",
  classical: "Columns and cornices",
  joinery: "Joinery and feature walls",
  interiors: "Interiors",
  doors: "Doors",
};

/** A photo in the "Our work" reel on the home page. */
export const workPhoto = defineType({
  name: "workPhoto",
  title: "Work photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      description: "Our own work only, at least 1000 px on the long side, with no other company's watermark.",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Group",
      type: "string",
      options: { list: workCategories.map((value) => ({ value, title: categoryTitles[value] })), layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "caption.en", subtitle: "category", media: "image" } },
});
