import Link from "next/link";
import type { ReactNode } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href } from "@/i18n/routing";
import { Container } from "./Container";
import styles from "./DarkBand.module.css";

type DarkBandProps = {
  id: string;
  crumb: string;
  title: string;
  lede: ReactNode;
  /** Optional block beside the title on wide screens. */
  aside?: ReactNode;
  children?: ReactNode;
};

/**
 * The dark banner that opens the inner pages: breadcrumb, title and lede over navy with a
 * drafting grid and a line of cove light under the header. Anything passed as children sits
 * below the title.
 */
export async function DarkBand({ id, crumb, title, lede, aside, children }: DarkBandProps) {
  const [{ common }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <section className={styles.band} aria-labelledby={id}>
      <span className={styles.cove} aria-hidden="true" />
      <Container className={styles.inner}>
        <nav aria-label={common.breadcrumb} className={styles.breadcrumb}>
          <Link href={href(locale)}>{common.home}</Link> / <span aria-current="page">{crumb}</span>
        </nav>
        <div className={styles.head} data-aside={aside ? "" : undefined}>
          <div>
            <h1 id={id} className={styles.title}>
              {title}
            </h1>
            <p className={styles.lede}>{lede}</p>
          </div>
          {aside}
        </div>
        {children}
      </Container>
    </section>
  );
}
