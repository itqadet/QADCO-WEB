import { defineArrayMember, defineField, defineType } from "sanity";
import { productCategories, suppliers } from "@/content/products";

const categoryTitles: Record<(typeof productCategories)[number], string> = {
  ornamental: "Ornamental gypsum",
  acoustic: "Acoustic ceiling tiles",
  partitions: "Office partitions",
  boards: "Boards and materials",
};

/** A product on the Products page: something we make in our workshop, or supply and install. */
export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Product name", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Group",
      type: "string",
      options: { list: productCategories.map((value) => ({ value, title: categoryTitles[value] })), layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "Made or supplied",
      type: "string",
      options: {
        list: [
          { value: "made", title: "Made by QADCO" },
          { value: "supplied", title: "Supplied and installed" },
        ],
        layout: "radio",
      },
      initialValue: "made",
      validation: (r) => r.required(),
    }),
    defineField({ name: "summary", title: "One-line description", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "image",
      title: "Photo",
      description: "Optional for boards and materials. Use a sharp photo at least 800 px wide.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "brands",
      title: "Brands",
      description: "Manufacturers whose logos show on this product.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: Object.entries(suppliers).map(([value, s]) => ({ value, title: s.name })) },
    }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.en", subtitle: "category", media: "image" } },
});
