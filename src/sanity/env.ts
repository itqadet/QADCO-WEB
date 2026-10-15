/** Sanity connection settings. The project ID and dataset are public values. */
// Trimmed because values pasted into hosting dashboards or piped in a shell often carry a stray line ending.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "vj2fsewo";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
export const apiVersion = "2026-10-01";

/** How long published edits can take to appear on the site, in seconds. */
export const REVALIDATE_SECONDS = 60;
