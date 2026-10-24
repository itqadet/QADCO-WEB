"use client";

/** Sanity Studio, served by the website at /studio. */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "qadco",
  title: "QADCO website",
  // On Vercel the Studio is a page of the site at /studio. The plain-file build for Bluehost sets
  // its path in sanity.cli.ts instead, and this one is added on top of it, so it stays at the root.
  basePath: process.env.SANITY_STUDIO_BASE_PATH ? "/" : "/studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Hide "Contact details" from the "Create new" menu: there is exactly one.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Contact details can be edited and published, but not duplicated or deleted.
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => action === "publish" || action === "discardChanges" || action === "restore")
        : actions,
  },
});
