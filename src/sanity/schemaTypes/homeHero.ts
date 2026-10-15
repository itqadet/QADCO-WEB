import { defineField, defineType } from "sanity";

/** The comparison banner at the top of the home page. One document only. */
export const homeHero = defineType({
  name: "homeHero",
  title: "Home page banner",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Photo or 3D visualisation",
      description: "Landscape, at least 2000px wide. A sharp image here matters more than anywhere else on the site.",
      // No cropping here: the drawing must keep exactly the same framing to line up.
      type: "image",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "This image is a…",
      type: "string",
      options: {
        list: [
          { title: "3D visualisation (labelled “Visualised”)", value: "visualised" },
          { title: "Photo of finished work (labelled “Built”)", value: "built" },
        ],
        layout: "radio",
      },
      initialValue: "visualised",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "drawing",
      title: "Matching drawing or sketch",
      description:
        "A line drawing of the same view, the same size and framing as the image above, so the two line up when visitors drag the divider.",
      type: "image",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "alt",
      title: "Describe the image",
      description: "Read aloud to blind visitors. Say what the room shows.",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", title: "Caption under the banner", type: "localeString", validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: "Home page banner" }) },
});
