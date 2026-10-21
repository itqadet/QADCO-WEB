/**
 * Swap the project photos in Sanity for the files in public/images/projects, matched by
 * filename (e.g. akh-timber-coffer.jpg). Captions, order, hotspots and covers are kept; only
 * each photo's image file changes.
 *
 *   1. Put an Editor API token in .env.local as SANITY_API_WRITE_TOKEN
 *   2. npm run replace-project-photos
 *   3. Remove the token from .env.local again
 *
 * Safe to re-run: Sanity de-duplicates uploads, and photos already pointing at the new file
 * are left alone.
 */
import { createReadStream, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (existsSync(path.join(root, ".env.local"))) process.loadEnvFile(path.join(root, ".env.local"));

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is empty. Add an Editor token to .env.local and run again.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vj2fsewo",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-10-01",
  token,
  useCdn: false,
});

const dir = path.join(root, "public/images/projects");
const files = new Set(readdirSync(dir).filter((f) => f.endsWith(".jpg")));

type Photo = { _key: string; asset?: { _ref: string; originalFilename?: string } };
type Project = { _id: string; slug: string; photos: Photo[] };

const projects = await client.fetch<Project[]>(
  `*[_type == "project"]{ _id, "slug": slug.current, photos[]{ _key, asset{ _ref, "originalFilename": @->originalFilename } } }`,
);

const uploaded = new Map<string, string>();
let swapped = 0;

for (const project of projects) {
  const patch = client.patch(project._id);
  let changed = false;
  for (const photo of project.photos ?? []) {
    const name = photo.asset?.originalFilename;
    if (!name || !files.has(name)) continue;
    let ref = uploaded.get(name);
    if (!ref) {
      const asset = await client.assets.upload("image", createReadStream(path.join(dir, name)), { filename: name });
      ref = asset._id;
      uploaded.set(name, ref);
    }
    if (ref === photo.asset?._ref) continue;
    patch.set({ [`photos[_key=="${photo._key}"].asset`]: { _type: "reference", _ref: ref } });
    changed = true;
    swapped++;
  }
  if (changed) {
    await patch.commit();
    console.log(`updated ${project.slug}`);
  }
}

console.log(`${swapped} photos swapped across ${projects.length} projects.`);
