# Hosting the QADCO website on Bluehost (WordPress Plus / shared hosting)

Bluehost shared hosting runs PHP and serves files, but not Node.js. So for Bluehost the site is
built as ready-made pages (`npm run build:static`), and three server jobs are handled differently:

| On Vercel | On Bluehost |
|---|---|
| Language redirect (`src/proxy.ts`) | `.htaccess` sends `/` to `/en/` or `/ar/` |
| Contact form mail (`/api/contact`) | `contact.php` sends through Resend |
| Sanity edits appear within a minute | A GitHub Action rebuilds and uploads every hour |

Sanity Studio (where staff edit content) stays at **https://qadco-web.vercel.app/studio**.

---

## 1. Back up anything already on the domain

If a WordPress site lives in `public_html`, it will be replaced. In Bluehost, create a backup
first (**Hosting → Backups**, or cPanel → **File Manager**, select `public_html`, **Compress**).

## 2. First upload (by hand)

1. Run `npm run build:static` (or use the zip already built: `qadco-website-bluehost.zip`).
2. Bluehost → **Advanced** (cPanel) → **File Manager** → open `public_html`.
3. Remove the old site files (after the backup), then **Upload** `qadco-website-bluehost.zip`.
4. Right-click the zip → **Extract** into `public_html`, then delete the zip.
5. In File Manager → **Settings**, tick **Show Hidden Files** and check `.htaccess` is there.

## 3. Turn on the contact form

1. In File Manager, go to your **home folder** (one level **above** `public_html`).
2. Create a file named `qadco-config.php` there, with the content of
   `deploy/bluehost/qadco-config.example.php`, and put your **Resend API key** in it.
   Never place this file inside `public_html`.
3. Send a test request from the Contact page.

## 4. SSL

Bluehost → **Websites → Settings → Security** → turn on **Free SSL**. The `.htaccess` file
then sends every visitor to `https://`.

## 5. Automatic updates (recommended)

So that Sanity edits and code changes reach Bluehost without manual uploads:

1. Bluehost cPanel → **FTP Accounts** → create an FTP account whose directory is your home
   folder (or note the main account's details). Note the **FTP server** name.
2. GitHub → repository **QADCO-WEB** → **Settings → Secrets and variables → Actions**:
   - **Secrets**: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
   - **Variables**: `BLUEHOST_ENABLED` = `true`; optionally `SITE_URL` (your domain with
     `https://`) and `FTP_DIR` (default `public_html/`)
3. GitHub → **Actions → Deploy to Bluehost → Run workflow** to test it.

From then on it runs on every push and every hour.

## 6. Domain

If the domain's DNS is managed at Bluehost, nothing else is needed. If it currently points
to Vercel, point it back to Bluehost (Bluehost → **Domains → DNS**).
