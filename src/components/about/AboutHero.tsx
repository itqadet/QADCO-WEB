import Link from "next/link";
import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import styles from "./AboutHero.module.css";

/**
 * About banner: title and lede on the dark band, the company's story as three dates joined by a
 * line of cove light, and a faint tumbling-block pattern (the cube in our logo) behind it all.
 */
export async function AboutHero() {
  const [{ about, nav, common }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <section className={styles.band} aria-labelledby="about-h">
      <span className={styles.cove} aria-hidden="true" />
      <Container className={styles.inner}>
        <nav aria-label={common.breadcrumb} className={styles.breadcrumb}>
          <Link href={href(locale)}>{common.home}</Link> / <span aria-current="page">{nav.about}</span>
        </nav>
        <h1 id="about-h" className={styles.title}>
          {about.title}
        </h1>
        <p className={styles.lede}>{about.lede}</p>

        <ol className={styles.timeline} aria-label={about.timeline.label}>
          {about.timeline.items.map((t, i) => (
            <li key={t.year} style={{ "--i": i } as CSSProperties}>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.year} dir={/\d/.test(t.year) ? "ltr" : undefined}>
                {t.year}
              </span>
              <span className={styles.event}>{t.text}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
