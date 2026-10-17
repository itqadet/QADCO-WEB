# QADCO website

Website for **Qasr Al Andalus Co. W.L.L. (QADCO)**: ceilings, partitions and interior fit-out in Qatar. English and Arabic, built with Next.js 16 (App Router), React 19 and TypeScript.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000 (redirects to /en or /ar)
npm run build      # production build: type-checks and prerenders every page
npm run start      # serve the production build
```

Requires Node.js 20.9 or newer.

## Folder structure

```
public/images/
  brand/           logo: full lockup, hexagon mark, stacked mark
  drawings/        trade drawings (ceiling plan, partition plan, panel elevation)
  projects/        project photos (1024 × 1024)
src/
  proxy.ts         redirects /path to /en/path or /ar/path from Accept-Language
  app/
    [lang]/        root layout + one folder per page; `lang` is "en" or "ar"
    sitemap.ts     sitemap.xml with hreflang alternates
    robots.ts
    icon.png       favicon
  components/
    layout/        SiteHeader, MainNav (client), SiteFooter, SkipLink
    ui/            primitives: Button, Container, Section, Split, TextLink, Placeholder
    sections/      blocks shared by pages: PageIntro, CtaBand, ContactList, DrawingSheet, ...
    home/          AnnotatedHero, TradeRow, HeritageBand, WorkGrid, ProcessSteps
    about/         PrinciplesList, ServiceAreas
    services/      TradeDetail, SpecTable, FaqList
    projects/      ProjectGallery (client: filter + lightbox)
    contact/       ContactForm (client: validation + email hand-off)
  content/         language-independent data: contact details, photos, drawings, hero keynotes
  i18n/
    config.ts      locales, text direction, language names
    routing.ts     route map and locale-aware `href()` helper
    get-dictionary.ts  loads the dictionary for the current [lang] via next/root-params
    dictionaries/  en.ts (source of truth) and ar.ts (type-checked against en.ts)
  lib/             fonts (next/font) and metadata helpers
  styles/          tokens.css (design tokens) and globals.css (base styles)
```

Each component has its own CSS Module next to it. Colours, type and spacing come from `src/styles/tokens.css`, which follows the QADCO Design System in `../design-system/qadco/MASTER.md`.

## Editing content

- **Text, in both languages:** `src/i18n/dictionaries/en.ts` and `ar.ts`. `ar.ts` is typed against `en.ts`, so a missing Arabic string fails the build.
- **Contact details:** `src/content/site.ts`. Set `placeholder: false` once a real value is in; the yellow highlight disappears.
- **Projects:** add the photo to `public/images/projects/`, an entry to `src/content/projects.ts`, and its title, detail and alt text under `projectItems` in both dictionaries.
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` (for example `https://www.qadco.qa`) so canonical links and the sitemap use the live domain.

## Content editing (Sanity)

Projects, the project register, skyline towers, brands and contact details are edited by QADCO staff in Sanity Studio at **/studio** (project `vj2fsewo`, dataset `production`). See [EDITING.md](EDITING.md) for the staff guide.

- `src/sanity/`: client, image helper, Studio schemas and sidebar. `sanity.config.ts` configures the Studio.
- `src/lib/content.ts`: every page reads editable content through these functions. They fall back to the built-in content in `src/content/` while Sanity is empty or unreachable.
- Published changes appear within about 60 seconds (`revalidate = 60`).

**One-time import of the existing content:** create an Editor token at sanity.io/manage → project → API → Tokens, paste it into `.env.local` as `SANITY_API_WRITE_TOKEN`, run `npm run import-content`, then delete the token. Re-running never overwrites edits.

**CORS:** in sanity.io/manage → API → CORS origins, add `http://localhost:3000` and the live domain, each with *Allow credentials* ticked, or the Studio can't sign in.

## Deploying

The site is hosted on Vercel (project `qadco-web`, live at https://qadco-web.vercel.app) and connected to
https://github.com/yusufShire/QADCO-WEB. **Every push to `main` deploys to production automatically**;
pushes to other branches get a preview link.

Environment variables are set in the Vercel project: `NEXT_PUBLIC_SANITY_PROJECT_ID=vj2fsewo`,
`NEXT_PUBLIC_SANITY_DATASET=production`, `NEXT_PUBLIC_SITE_URL=https://qadco-web.vercel.app`.
When a custom domain is added, update `NEXT_PUBLIC_SITE_URL` and add the domain to Sanity's CORS origins.

**Contact form email (Resend):** `RESEND_API_KEY` sends each request by email. `CONTACT_TO` sets the recipient
(currently itqadet@gmail.com, because Resend only delivers to the account owner's address until a domain is verified).
After verifying qasralandalusco.com in Resend, set `CONTACT_FROM=QADCO Website <website@qasralandalusco.com>` and
`CONTACT_TO=qadco-1@qatar.net.qa`, then redeploy. Without a key, the form shows the request with copy, email and call options.

## Before launch

- Replace the placeholder phone, WhatsApp, email and office hours in `src/content/site.ts` and the dictionaries.
- The contact form currently opens the visitor's email app. To receive submissions directly, replace `handOff` in `ContactForm.tsx` with a Server Action or a form service.
- Have a native speaker proofread `ar.ts`.
