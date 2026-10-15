import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, REVALIDATE_SECONDS } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // The CDN serves published content quickly; edits reach it within seconds.
  useCdn: true,
  perspective: "published",
});

/**
 * Fetches published content, cached for REVALIDATE_SECONDS. Returns null if Sanity can't be
 * reached, so pages can fall back to the built-in content instead of failing.
 */
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: REVALIDATE_SECONDS, tags: ["sanity"] } });
  } catch (error) {
    console.warn("[sanity] fetch failed, using built-in content:", (error as Error).message);
    return null;
  }
}
