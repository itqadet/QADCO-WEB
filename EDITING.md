# Editing the QADCO website

Open **/studio** on the website (for example `https://your-domain/studio`) and sign in with the account you were invited with. Everything you publish appears on the website within about a minute.

Every text field has an **English** box and an **العربية** box. Both must be filled in before you can publish.

## Add a project with photos

1. Go to **Projects with photos** and click the pencil icon (Create).
2. **About the project:** fill in the project name in both languages, then press **Generate** next to *Web address*. Choose the sector, and add the location, building height, main contractor and consultant if you know them.
3. **Short description:** one or two sentences in each language.
4. **What we installed:** click *Add item* for each line, for example "Gypsum board ceilings with cove lighting".
5. **Photos:** drag photos in. The first photo is the cover, and you can drag photos to reorder them. Click each photo to add a caption in both languages that says what it shows.
6. **Where it shows:** tick *Show on the home page* to feature it (the home page shows up to four). Lower *Display order* numbers show first.
7. Click **Publish**.

Tips:
- Upload photos straight from the camera; they are resized automatically. Landscape photos work best.
- To hide a project without deleting it, use the menu (⋯) → **Unpublish**.

## Add a row to the project register

**Project register** → Create. Fill in the name, sector, scope and year. New entries appear at the top of the register (sort position 0); give a larger number to move one down.

## Add a tower to the Doha skyline

**Skyline towers** → Create. Fill in the name, location and our work in both languages, then pick a **Drawing**. Use one of the *Generic* outlines for a tower that has no drawing of its own yet; a developer can draw a specific one later.

## Products

The Products page lists what we make in our workshop and what we supply and install.

- Until the first product is published in the Studio, the page shows the built-in list (sample designs cut from the "gypsum designs" collages).
- Once you publish any product, the page shows only the products in the Studio, so add the full set before publishing.
- For each product: name in both languages, group, *Made by QADCO* or *Supplied and installed*, a one-line description, a sharp photo (at least 800 px wide; optional for boards and materials) and the brands.
- The suppliers wall at the bottom of the page is fixed in the site code (from "Our Suppliers & Manufacturers"); ask the developer to change it.
- The map pin on the Contact page is set in the site code (`mapQuery` in `src/content/site.ts`).

## Brands and contact details

- **Brands:** upload a logo (PNG or SVG on a white or transparent background) and publish.
- **Contact details:** phone, fax, email, address, P.O. box and office hours. Tick *Office hours are correct* for the hours you typed to appear on the website; until then it shows the built-in hours (Saturday to Thursday, 7:00 am to 6:00 pm).

## What can't be edited here

Page design, menus, the services and method-statement text, and the company logo are part of the website's code, so they can't be broken by accident. Ask your developer to change those.
