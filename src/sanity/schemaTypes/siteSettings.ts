import { defineField, defineType } from "sanity";

/** Company contact details shown in the footer, contact blocks and contact page. One document only. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Contact details",
  type: "document",
  fields: [
    defineField({ name: "phone", title: "Phone", description: "For example +974 4460 4337", type: "string", validation: (r) => r.required() }),
    defineField({ name: "fax", title: "Fax", type: "string" }),
    defineField({
      name: "email",
      title: "Email",
      description: "Also receives the contact form.",
      type: "string",
      validation: (r) => r.required().email(),
    }),
    defineField({ name: "office", title: "Office address", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "poBox", title: "P.O. Box", type: "string" }),
    defineField({ name: "hours", title: "Office hours", type: "localeString" }),
    defineField({
      name: "hoursConfirmed",
      title: "Office hours are correct",
      description: "Until ticked, the hours show highlighted in yellow as a reminder.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { prepare: () => ({ title: "Contact details" }) },
});
