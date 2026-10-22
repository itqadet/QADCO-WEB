import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getSettings } from "@/lib/content";
import { ContactList } from "@/components/sections/ContactList";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMap } from "@/components/contact/ContactMap";
import styles from "@/components/contact/ContactPage.module.css";
import { site } from "@/content/site";
import { pick } from "@/content/localized";
import { Container } from "@/components/ui/Container";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.contact, dict.contact.meta);
}

export default async function ContactPage() {
  const [{ contact }, settings, locale] = await Promise.all([getDictionary(), getSettings(), getLocale()]);

  return (
    <>
      <ContactHero />

      <Container as="section" aria-label={contact.sectionLabel} className={styles.layout}>
        <div className={styles.formCard}>
          <div className={styles.formHead}>
            <h2>{contact.quick.formTitle}</h2>
            <span className={styles.reply}>{contact.quick.replyNote}</span>
          </div>
          <ContactForm labels={contact.form} recipient={settings.email.display} phone={settings.phone} />
        </div>
        <aside className={styles.side}>
          <div className={styles.detailsCard}>
            <h2>{contact.directTitle}</h2>
            <ContactList detailed />
          </div>
          <p className={styles.note}>{contact.drawingsNote}</p>
        </aside>
      </Container>

      <Container as="section" aria-labelledby="map-h" className={styles.map}>
        <h2 id="map-h" style={{ scrollMarginTop: "calc(var(--header-h) + 24px)" }}>
          {contact.map.title}
        </h2>
        <ContactMap query={site.mapQuery} locale={locale} address={pick(settings.office, locale)} labels={contact.map} />
      </Container>
    </>
  );
}
