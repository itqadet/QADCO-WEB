import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import styles from "./ProductsHero.module.css";

type ProductsHeroProps = {
  made: number;
  supplied: number;
  suppliers: number;
  groups: { id: string; title: string; count: number; image?: { src: string; width: number; height: number } }[];
};

/**
 * Products banner: the two ways we provide a product (made in our workshop, or supplied and
 * installed) as two numbered cards, and the product groups as sample swatches pinned to the
 * board, each jumping to its group below.
 */
export async function ProductsHero({ made, supplied, suppliers, groups }: ProductsHeroProps) {
  const [{ products: t, nav, common }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <section className={styles.band} aria-labelledby="products-h">
      <span className={styles.cove} aria-hidden="true" />
      <Container className={styles.inner}>
        <nav aria-label={common.breadcrumb} className={styles.breadcrumb}>
          <Link href={href(locale)}>{common.home}</Link> / <span aria-current="page">{nav.products}</span>
        </nav>

        <div className={styles.head}>
          <div>
            <h1 id="products-h" className={styles.title}>
              {t.title}
            </h1>
            <p className={styles.lede}>{t.lede}</p>
          </div>

          <dl className={styles.ways}>
            <div data-role="made">
              <dt>{t.hero.made.title}</dt>
              <dd className={styles.wayNum} dir="ltr">
                {made}
                <span> {t.hero.productsWord}</span>
              </dd>
              <dd className={styles.wayBody}>{t.hero.made.body}</dd>
            </div>
            <div data-role="supplied">
              <dt>{t.hero.supplied.title}</dt>
              <dd className={styles.wayNum} dir="ltr">
                {supplied}
                <span> {t.hero.productsWord}</span>
              </dd>
              <dd className={styles.wayBody}>
                {t.hero.supplied.body}{" "}
                <strong dir="ltr">
                  {suppliers} {t.hero.suppliersWord}
                </strong>
              </dd>
            </div>
          </dl>
        </div>

        <p className={styles.groupsHead}>{t.hero.groupsLabel}</p>
        <ul className={styles.swatches}>
          {groups.map((g, i) => (
            <li key={g.id} style={{ "--i": i } as CSSProperties}>
              <a href={`#${g.id}`} className={styles.swatch}>
                <span className={styles.swatchImg}>
                  {g.image ? (
                    <Image src={g.image.src} alt="" width={g.image.width} height={g.image.height} sizes="(max-width: 760px) 45vw, 22vw" />
                  ) : (
                    <span className={styles.boardPattern} aria-hidden="true" />
                  )}
                </span>
                <span className={styles.swatchText}>
                  <span className={styles.swatchName}>{g.title}</span>
                  <span className={styles.swatchCount}>
                    <span dir="ltr">{g.count}</span> {t.hero.items}
                  </span>
                </span>
                <span className={styles.pin} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
