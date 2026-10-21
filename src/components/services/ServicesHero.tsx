import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href } from "@/i18n/routing";
import { tradeAnchor, tradeKeys, type TradeKey } from "@/content/drawings";
import { Container } from "@/components/ui/Container";
import styles from "./ServicesHero.module.css";

type ServicesHeroProps = {
  crumb: string;
  photos: Record<TradeKey, { src: string; width: number; height: number }>;
};

/**
 * Services banner: the title over a dark band, and the four services as photo panels side by
 * side. The panel being pointed at or focused opens wide to show its summary; each one jumps to
 * its section further down. On phones the panels become a 2 x 2 grid of cards.
 */
export async function ServicesHero({ crumb, photos }: ServicesHeroProps) {
  const [{ services, trades, home, common }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <section className={styles.band} aria-labelledby="services-h">
      <span className={styles.cove} aria-hidden="true" />
      <Container className={styles.inner}>
        <nav aria-label={common.breadcrumb} className={styles.breadcrumb}>
          <Link href={href(locale)}>{common.home}</Link> / <span aria-current="page">{crumb}</span>
        </nav>
        <div className={styles.head}>
          <h1 id="services-h" className={styles.title}>
            {services.title}
          </h1>
          <p className={styles.lede}>{services.hero.lede}</p>
        </div>

        <ul className={styles.panels}>
          {tradeKeys.map((t, i) => (
            <li key={t} className={styles.panel} style={{ "--i": i } as CSSProperties}>
              <a href={`#${tradeAnchor[t]}`} className={styles.link}>
                <Image
                  className={styles.photo}
                  src={photos[t].src}
                  alt=""
                  width={photos[t].width}
                  height={photos[t].height}
                  sizes="(max-width: 760px) 50vw, 45vw"
                  preload={i === 0}
                />
                <span className={styles.shade} aria-hidden="true" />
                <span className={styles.num} dir="ltr" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.text}>
                  <span className={styles.name}>{trades[t].title}</span>
                  <span className={styles.sub}>{home.tiles[t]}</span>
                  <span className={styles.cta} aria-hidden="true">
                    {services.hero.explore}
                    <span className={styles.arrow} />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
