/**
 * One-time import of the site's built-in content into Sanity.
 *
 *   1. Put an Editor API token in .env.local as SANITY_API_WRITE_TOKEN
 *   2. npm run import-content
 *   3. Remove the token from .env.local again
 *
 * Safe to re-run: documents are only created if they don't exist yet (createIfNotExists),
 * so anything editors have changed in the Studio is never overwritten. Images are
 * de-duplicated by Sanity, so re-uploading the same file reuses the existing asset.
 *
 * IDs use dashes, never dots: Sanity treats IDs containing a dot as private, unreadable by the website.
 */
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { caseStudies } from "../src/content/case-studies.ts";
import { register } from "../src/content/register.ts";
import { towers } from "../src/content/skyline.ts";
import { brands } from "../src/content/credentials.ts";
import { defaultSettings } from "../src/content/site.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (existsSync(path.join(root, ".env.local"))) process.loadEnvFile(path.join(root, ".env.local"));

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is empty. Add an Editor token to .env.local (see the comment there) and run again.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vj2fsewo",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-10-01",
  token,
  useCdn: false,
});

const uploaded = new Map<string, string>();

/** Uploads a file from /public (path as used on the site, e.g. /images/work/x.jpg) and returns its asset id. */
async function upload(sitePath: string): Promise<string> {
  const cached = uploaded.get(sitePath);
  if (cached) return cached;
  const file = path.join(root, "public", sitePath);
  const asset = await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) });
  uploaded.set(sitePath, asset._id);
  process.stdout.write(".");
  return asset._id;
}

const image = (assetId: string) => ({ _type: "image", asset: { _type: "reference", _ref: assetId } });
const key = (i: number) => `k${i.toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const ls = (v: { en: string; ar: string }) => ({ _type: "localeString", en: v.en, ar: v.ar });
const lt = (v: { en: string; ar: string }) => ({ _type: "localeText", en: v.en, ar: v.ar });

async function main() {
  const docs: Record<string, unknown>[] = [];

  console.log(`Uploading photos for ${caseStudies.length} projects`);
  for (const [i, c] of caseStudies.entries()) {
    const photos = [];
    for (const [j, p] of c.photos.entries()) {
      photos.push({ ...image(await upload(p.src)), _key: key(j), caption: ls(p.caption) });
    }
    docs.push({
      _id: `project-${c.slug}`,
      _type: "project",
      title: ls(c.title),
      slug: { _type: "slug", current: c.slug },
      sector: c.sector,
      location: c.location ? ls(c.location) : undefined,
      building: c.building,
      contractor: c.contractor,
      consultant: c.consultant,
      summary: lt(c.summary),
      scope: c.scope.map((s, j) => ({ ...ls(s), _key: key(j) })),
      photos,
      featured: Boolean(c.featured),
      order: (i + 1) * 10,
    });
  }

  console.log(`\nUploading ${brands.length} brand logos`);
  for (const [i, b] of brands.entries()) {
    docs.push({
      _id: `brand-${b.id}`,
      _type: "brand",
      name: b.name,
      logo: image(await upload(`/images/brands/${b.id}.png`)),
      order: (i + 1) * 10,
    });
  }

  register.forEach((r, i) =>
    docs.push({
      _id: `register-${String(i + 1).padStart(3, "0")}`,
      _type: "registerEntry",
      name: r.name,
      sector: r.sector,
      location: r.location,
      contractor: r.contractor,
      consultant: r.consultant,
      scope: r.scope,
      period: r.period,
      sortKey: (i + 1) * 10,
    }),
  );

  towers.forEach((t, i) =>
    docs.push({
      _id: `tower-${t.id}`,
      _type: "tower",
      name: ls(t.name),
      location: ls(t.location),
      scope: ls(t.scope),
      drawing: t.id,
      order: (i + 1) * 10,
    }),
  );

  const s = defaultSettings;
  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    phone: s.phone.display,
    fax: s.fax?.display,
    email: s.email.display,
    office: ls(s.office),
    poBox: s.poBox,
    hours: s.hours ? ls(s.hours) : undefined,
    hoursConfirmed: s.hoursConfirmed,
  });

  console.log(`\nCreating ${docs.length} documents (existing ones are left untouched)`);
  for (let i = 0; i < docs.length; i += 50) {
    const tx = client.transaction();
    docs.slice(i, i + 50).forEach((d) => tx.createIfNotExists(d as { _id: string; _type: string }));
    await tx.commit({ visibility: "async" });
  }

  console.log(
    `Done: ${caseStudies.length} projects, ${register.length} register entries, ${towers.length} towers, ${brands.length} brands, contact details.`,
  );
  console.log("Remove SANITY_API_WRITE_TOKEN from .env.local now that the import has finished.");
}

main().catch((error) => {
  console.error("\nImport failed:", error.message);
  process.exit(1);
});
