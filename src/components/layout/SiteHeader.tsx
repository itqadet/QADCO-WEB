import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { HeaderShell } from "./HeaderShell";
import { MainNav } from "./MainNav";
import styles from "./SiteHeader.module.css";

export async function SiteHeader() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { common, nav } = dict;

  const items = [
    { href: href(locale, routes.about), label: nav.about },
    { href: href(locale, routes.services), label: nav.services },
    { href: href(locale, routes.products), label: nav.products },
    { href: href(locale, routes.projects), label: nav.projects },
    { href: href(locale, routes.process), label: nav.process },
    { href: href(locale, routes.contact), label: nav.contact },
  ];

  return (
    <HeaderShell clearOn={[href(locale), href(locale, routes.projects), `${href(locale, routes.projects)}/*`]} className={styles.header}>
      <Container className={styles.inner}>
        <Link className={styles.brand} href={href(locale)} aria-label={common.brandHomeLabel}>
          <Image className={styles.mark} src="/images/brand/qadco-mark.png" alt="" width={44} height={34} style={{ width: 44, height: "auto" }} preload />
          <span className={styles.brandText}>
            <span className={styles.brandName} lang="en">
              {common.brandShort}
            </span>
            <span className={styles.brandFull}>{common.brandFull}</span>
          </span>
        </Link>
        <MainNav
          locale={locale}
          items={items}
          cta={{ href: href(locale, routes.contact), label: common.requestVisit }}
          labels={{ menu: common.menu, close: common.close, nav: common.mainNav }}
        />
      </Container>
    </HeaderShell>
  );
}
