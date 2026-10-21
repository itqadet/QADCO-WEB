import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import type { Photo } from "@/content/case-studies";
import { pick } from "@/content/localized";
import { Container } from "@/components/ui/Container";
import styles from "./CaseStudyHero.module.css";

type CaseStudyHeroProps = {
  title: string;
  summary: string;
  sector: string;
  cover: Photo;
  facts: { label: string; value: string; ltr?: boolean }[];
};

/**
 * Project page banner: title and summary beside the cover photo, laid over a soft, blurred
 * copy of the same photo, with the facts as a row of cards. The photo is shown no larger than
 * its own size, because most project photos are scans around 1000px wide.
 */
export async function CaseStudyHero({ title, summary, sector, cover, facts }: CaseStudyHeroProps) {
  const [{ common, nav }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <section className={styles.band} aria-labelledby="case-h">
      <div className={styles.backdrop} aria-hidden="true">
        <Image src={cover.src} alt="" width={cover.width} height={cover.height} sizes="40vw" />
      </div>
      <Container className={styles.inner}>
        <div className={styles.text}>
          <nav aria-label={common.breadcrumb} className={styles.breadcrumb}>
            <Link href={href(locale)}>{common.home}</Link> / <Link href={href(locale, routes.projects)}>{nav.projects}</Link> /{" "}
            <span aria-current="page">{title}</span>
          </nav>
          <p className={styles.sector}>{sector}</p>
          <h1 id="case-h" className={styles.title}>
            {title}
          </h1>
          <p className={styles.summary}>{summary}</p>
        </div>

        <figure className={styles.cover}>
          <Image
            src={cover.src}
            alt={pick(cover.caption, locale)}
            width={cover.width}
            height={cover.height}
            sizes="(max-width: 860px) 100vw, 45vw"
            style={{ maxWidth: `min(100%, ${cover.width}px)` }}
            preload
          />
          <figcaption>{pick(cover.caption, locale)}</figcaption>
        </figure>

        <dl className={styles.facts}>
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd lang={f.ltr ? "en" : undefined} dir={f.ltr ? "ltr" : undefined}>
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
