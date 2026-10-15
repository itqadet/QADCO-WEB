import { defineField, defineType } from "sanity";

/** English and Arabic side by side. Both are required, so nothing goes live half-translated. */
export const localeString = defineType({
  name: "localeString",
  title: "Text in both languages",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({ name: "en", title: "English", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ar", title: "العربية (Arabic)", type: "string", validation: (r) => r.required() }),
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Paragraph in both languages",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "ar", title: "العربية (Arabic)", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
});
