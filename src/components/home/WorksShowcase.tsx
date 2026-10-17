import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { getWorks } from "@/lib/content";
import { workCategories } from "@/content/works";
import { pick } from "@/content/localized";
import { Container } from "@/components/ui/Container";
import { WorksReel } from "./WorksReel";
import styles from "./WorksShowcase.module.css";

/** "Our work": a dark full-width band carrying the photo reel. */
export async function WorksShowcase() {
  const [{ home }, locale, works] = await Promise.all([getDictionary(), getLocale(), getWorks()]);
  const t = home.works;
  const used = new Set(works.map((w) => w.category));

  return (
    <section className={styles.band} aria-labelledby="works-h">
      <Container className={styles.head}>
        <h2 id="works-h" className={styles.title}>
          {t.title}
        </h2>
        <p className={styles.intro}>{t.intro}</p>
      </Container>

      <WorksReel
        photos={works.map((w) => ({ id: w.id, category: w.category, caption: pick(w.caption, locale), src: w.src, width: w.width, height: w.height }))}
        categories={workCategories.filter((c) => used.has(c)).map((c) => ({ id: c, label: t.categories[c] }))}
        rtl={locale === "ar"}
        labels={t}
      />

      <Container className={styles.foot}>
        <Link href={href(locale, routes.projects)} className={styles.more}>
          {home.featured.more}
        </Link>
      </Container>
    </section>
  );
}
