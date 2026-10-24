/**
 * Builds the site as plain files for shared hosting (Bluehost) into out/.
 *
 *   npm run build:static                      site at the domain root
 *   BASE_PATH=/preview npm run build:static   site in a sub-folder (marked noindex)
 *
 * A static site can't run the parts that need a Node.js server, so for the length of this
 * build they are set aside (and always put back, even if the build fails):
 *   src/proxy.ts       language redirect  -> done by .htaccess instead
 *   src/app/api        Vercel mail route  -> contact.php instead
 *   src/app/studio     Sanity Studio      -> built separately as plain files into out/studio
 *   src/app/inbox      chat inbox         -> the team uses it on Vercel; the chat talks to Vercel
 * Project pages are listed at build time, so dynamicParams is switched off too.
 * Then .htaccess and contact.php are copied in and out/ is zipped for upload.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { zipDir } from "./zip-dir.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = (...parts) => path.join(root, ...parts);
const aside = p(".static-aside");
const base = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

const moves = [
  ["src/proxy.ts", "proxy.ts"],
  ["src/app/api", "api"],
  ["src/app/studio", "studio"],
  ["src/app/inbox", "inbox"],
];
const slugPage = p("src/app/[lang]/projects/[slug]/page.tsx");
const slugSource = readFileSync(slugPage, "utf8");

function restore() {
  for (const [from, name] of moves) {
    if (existsSync(path.join(aside, name)) && !existsSync(p(from))) renameSync(path.join(aside, name), p(from));
  }
  writeFileSync(slugPage, slugSource);
  rmSync(aside, { recursive: true, force: true });
}

if (existsSync(aside)) restore(); // tidy up after an interrupted earlier run

let failed = false;
try {
  rmSync(aside, { recursive: true, force: true });
  mkdirSync(aside);
  for (const [from, name] of moves) if (existsSync(p(from))) renameSync(p(from), path.join(aside, name));
  writeFileSync(slugPage, slugSource.replace("export const dynamicParams = true;", "export const dynamicParams = false;"));
  rmSync(p("out"), { recursive: true, force: true });
  rmSync(p(".next"), { recursive: true, force: true });

  execSync("npx next build", {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      STATIC_EXPORT: "1",
      BASE_PATH: base,
      // The form posts to the mail route on Vercel: Bluehost's bot check answers background
      // requests to contact.php with a cookie page instead. Set this to `${base}/contact.php` to
      // use the PHP mailer on a host without that check.
      NEXT_PUBLIC_CONTACT_ENDPOINT: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "https://qadco-web.vercel.app/api/contact",
      // a sub-folder copy is a preview: keep it out of search results
      // the live chat's API runs on Vercel with its database
      NEXT_PUBLIC_CHAT_ENDPOINT: process.env.NEXT_PUBLIC_CHAT_ENDPOINT || "https://qadco-web.vercel.app/api/chat",
      NEXT_PUBLIC_NOINDEX: base ? "1" : process.env.NEXT_PUBLIC_NOINDEX || "",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://www.qasralandalusco.com",
    },
  });
} catch {
  failed = true;
} finally {
  restore();
}
if (failed) {
  console.error("\nStatic build failed; the project files were put back as they were.");
  process.exit(1);
}

// Sanity Studio as plain files (it runs entirely in the browser), at <base>/studio
try {
  execSync("npx sanity build out/studio -y", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, SANITY_STUDIO_BASE_PATH: `${base}/studio` },
  });
} catch {
  console.error("\nStudio build failed.");
  process.exit(1);
}
// Sanity's page template links its icons from /static/ whatever the base path; point them at the Studio's own copy
const studioPage = p("out/studio/index.html");
writeFileSync(studioPage, readFileSync(studioPage, "utf8").replaceAll('href="/static/', `href="${base}/studio/static/`));

writeFileSync(p("out/.htaccess"), readFileSync(p("deploy/bluehost/.htaccess"), "utf8").replaceAll("__BASE__", base));
cpSync(p("deploy/bluehost/contact.php"), p("out/contact.php"));
// the root page: .htaccess sends visitors to /en/ or /ar/; this covers a server without rewrites
writeFileSync(
  p("out/index.html"),
  `<!doctype html><meta charset="utf-8"><title>QADCO</title><meta name="robots" content="noindex">
<script>location.replace("${base}/"+((navigator.language||"").toLowerCase().startsWith("ar")?"ar":"en")+"/")</script>
<meta http-equiv="refresh" content="1;url=${base}/en/"><a href="${base}/en/">QADCO</a>`,
);

rmSync(p("qadco-website-bluehost.zip"), { force: true });
// forward-slash paths and Unix permissions, so folders are readable after cPanel's Extract
zipDir(p("out"), p("qadco-website-bluehost.zip"));
console.log(`\nDone: out/ and qadco-website-bluehost.zip are ready to upload to public_html${base}/.`);
