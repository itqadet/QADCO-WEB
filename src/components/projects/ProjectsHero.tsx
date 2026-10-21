import Link from "next/link";
import type { ReactNode } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import styles from "./ProjectsHero.module.css";

type ProjectsHeroProps = {
  crumb: string;
  title: string;
  lede: string;
  stats: { value: string; label: string }[];
  children: ReactNode;
};

/**
 * Projects banner: Doha at night. Title, three numbers and the skyline share one dark band,
 * with a drafting grid and a cove-light line along the top, as on the home banner.
 */
export async function ProjectsHero({ crumb, title, lede, stats, children }: ProjectsHeroProps) {
  const [{ common }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <section className={styles.band} aria-labelledby="projects-h">
      <span className={styles.cove} aria-hidden="true" />
      <Container className={styles.inner}>
        <nav aria-label={common.breadcrumb} className={styles.breadcrumb}>
          <Link href={href(locale)}>{common.home}</Link> / <span aria-current="page">{crumb}</span>
        </nav>

        <div className={styles.head}>
          <div>
            <h1 id="projects-h" className={styles.title}>
              {title}
            </h1>
            <p className={styles.lede}>{lede}</p>
          </div>
          <dl className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd dir="ltr">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {children}
      </Container>
    </section>
  );
}
