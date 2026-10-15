import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localeLabel, otherLocale } from "@/i18n/config";
import { href, routes } from "@/i18n/routing";
import { site } from "@/content/site";
import { pick } from "@/content/localized";
import { getSettings } from "@/lib/content";
import { tradeAnchor, tradeKeys } from "@/content/drawings";
import { Container } from "@/components/ui/Container";
import styles from "./SiteFooter.module.css";

export async function SiteFooter() {
  const [dict, locale, settings] = await Promise.all([getDictionary(), getLocale(), getSettings()]);
  const { common, nav, trades } = dict;
  const other = otherLocale(locale);

  const columns = [
    {
      title: common.footer.company,
      links: [
        { href: href(locale, routes.about), label: nav.about },
        { href: href(locale, routes.projects), label: nav.projects },
        { href: href(locale, routes.process), label: nav.process },
        { href: href(locale, routes.contact), label: nav.contact },
      ],
    },
    {
      title: common.footer.services,
      links: tradeKeys.map((t) => ({
        href: href(locale, routes.services, tradeAnchor[t]),
        label: trades[t].title,
      })),
    },
  ];

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div>
            <Image
              className={styles.logo}
              src="/images/brand/qadco-logo-full.png"
              alt={common.logoAlt}
              width={1050}
              height={560}
              sizes="220px"
            />
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className={styles.heading}>{col.title}</h2>
              <ul className={styles.links}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className={styles.heading}>{common.footer.contact}</h2>
            <ul className={styles.links}>
              <li>
                <a href={settings.phone.href} dir="ltr">
                  {settings.phone.display}
                </a>
              </li>
              <li>
                <a href={settings.email.href} dir="ltr">
                  {settings.email.display}
                </a>
              </li>
              <li>{pick(settings.office, locale)}</li>
              {settings.poBox ? (
                <li>
                  {common.contactLabels.poBox} <span dir="ltr">{settings.poBox}</span>
                </li>
              ) : null}
              <li>
                <Link href={href(other)} hrefLang={other} lang={other}>
                  {localeLabel[other]}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.base}>
          <span>
            © {new Date().getFullYear()} {common.brandFull}. {common.cr} <span dir="ltr">{site.commercialRegistration}</span>
          </span>
          <span>{common.tagline}</span>
        </div>
      </Container>
    </footer>
  );
}
