/**
 * Builds the site as plain files for shared hosting (Bluehost) into out/.
 *
 *   npm run build:static
 *
 * A static site can't run the parts that need a Node.js server, so for the length of this
 * build they are set aside (and always put back, even if the build fails):
 *   src/proxy.ts       language redirect  -> done by .htaccess instead
 *   src/app/api        Vercel mail route  -> contact.php instead
 *   src/app/studio     Sanity Studio      -> staff keep using the Studio on Vercel
 * Project pages are listed at build time, so dynamicParams is switched off too.
 * Then .htaccess and contact.php are copied in and out/ is zipped for upload.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = (...parts) => path.join(root, ...parts);
const aside = p(".static-aside");

const moves = [
  ["src/proxy.ts", "proxy.ts"],
  ["src/app/api", "api"],
  ["src/app/studio", "studio"],
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
      NEXT_PUBLIC_CONTACT_ENDPOINT: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/contact.php",
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

cpSync(p("deploy/bluehost/.htaccess"), p("out/.htaccess"));
cpSync(p("deploy/bluehost/contact.php"), p("out/contact.php"));
// the root page: .htaccess sends visitors to /en/ or /ar/; this covers a server without rewrites
writeFileSync(
  p("out/index.html"),
  `<!doctype html><meta charset="utf-8"><title>QADCO</title><meta name="robots" content="noindex">
<script>location.replace((navigator.language||"").toLowerCase().startsWith("ar")?"/ar/":"/en/")</script>
<meta http-equiv="refresh" content="1;url=/en/"><a href="/en/">QADCO</a>`,
);

rmSync(p("qadco-website-bluehost.zip"), { force: true });
if (process.platform === "win32") {
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path 'out/*','out/.htaccess' -DestinationPath 'qadco-website-bluehost.zip' -Force"`, { cwd: root, stdio: "inherit" });
} else {
  execSync("cd out && zip -qr ../qadco-website-bluehost.zip . -x '.DS_Store'", { cwd: root, stdio: "inherit", shell: "/bin/sh" });
}
console.log("\nDone: out/ and qadco-website-bluehost.zip are ready to upload to public_html.");
