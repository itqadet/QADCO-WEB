/**
 * Settings for the Sanity command line (`npx sanity ...`). Used to build the Studio as plain files
 * for hosts without Node.js (Bluehost): scripts/build-static.mjs runs `sanity build` with
 * SANITY_STUDIO_BASE_PATH set to where the Studio will live, e.g. /preview/studio.
 */
import path from "node:path";
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "vj2fsewo", dataset: "production" },
  // where the built Studio's own files are served from
  project: { basePath: process.env.SANITY_STUDIO_BASE_PATH || "/studio" },
  // the schema imports site content through the same "@/" shortcut as the website
  vite: (config) => ({
    ...config,
    resolve: { ...config.resolve, alias: { ...config.resolve?.alias, "@": path.resolve(__dirname, "src") } },
  }),
});
