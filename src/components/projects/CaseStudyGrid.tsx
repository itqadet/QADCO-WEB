import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import type { CaseStudy } from "@/content/case-studies";
import { sectors } from "@/content/sectors";
import { pick } from "@/content/localized";
import styles from "./CaseStudyGrid.module.css";

/** Column spans across a 12-column grid, so the photographs don't read as a uniform card kit. */
const spans = [7, 5, 4, 4, 4, 6, 6];
const featuredSpans = [7, 5, 5, 7];

type CaseStudyGridProps = {
  items: CaseStudy[];
  /** The home page's four-up layout instead of the full gallery rhythm. */
  featured?: boolean;
  headingLevel?: "h2" | "h3";
};

export async function CaseStudyGrid({ items, featured = false, headingLevel = "h3" }: CaseStudyGridProps) {
  const [locale, { projects }] = await Promise.all([getLocale(), getDictionary()]);
  const pattern = featured ? featuredSpans : spans;
  const Heading = headingLevel;

  return (
    <ul className={styles.grid}>
      {items.map((c, i) => (
        <li key={c.slug} style={{ gridColumn: `span ${pattern[i % pattern.length]}` }}>
          <Link href={href(locale, `${routes.projects}/${c.slug}`)} className={styles.card}>
            <span className={styles.frame} data-reveal="image" style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
              <Image src={c.cover.src} alt="" width={c.cover.width} height={c.cover.height} sizes="(max-width: 760px) 100vw, 50vw" />
            </span>
            <Heading className={styles.title}>{pick(c.title, locale)}</Heading>
            <span className={styles.meta}>
              {pick(sectors[c.sector], locale)}
              {c.location ? <>, {pick(c.location, locale)}</> : null}
            </span>
            <span className="visually-hidden">{projects.caseStudies.view}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
