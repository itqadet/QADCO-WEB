import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getSettings } from "@/lib/content";
import { PageIntro } from "@/components/sections/PageIntro";
import { ContactList } from "@/components/sections/ContactList";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";
import { site } from "@/content/site";
import { pick } from "@/content/localized";
import { Container } from "@/components/ui/Container";
import { Split } from "@/components/ui/Split";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.contact, dict.contact.meta);
}

export default async function ContactPage() {
  const [{ contact, nav }, settings, locale] = await Promise.all([getDictionary(), getSettings(), getLocale()]);

  return (
    <>
      <PageIntro crumb={nav.contact} title={contact.title} lede={contact.lede} />

      <Container as="section" aria-label={contact.sectionLabel} style={{ paddingBottom: "var(--section)" }}>
        <Split>
          <ContactForm labels={contact.form} recipient={settings.email.display} phone={settings.phone} />
          <div>
            <h2>{contact.directTitle}</h2>
            <ContactList detailed />
            <p style={{ marginTop: "1.5rem", color: "var(--muted)" }}>{contact.drawingsNote}</p>
          </div>
        </Split>
      </Container>

      <Container as="section" aria-labelledby="map-h" style={{ paddingBottom: "var(--section)" }}>
        <h2 id="map-h">{contact.map.title}</h2>
        <ContactMap query={site.mapQuery} locale={locale} address={pick(settings.office, locale)} labels={contact.map} />
      </Container>
    </>
  );
}
