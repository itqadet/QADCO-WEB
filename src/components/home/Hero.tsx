import Image from "next/image";
import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { getHero } from "@/lib/content";
import { pick } from "@/content/localized";
import { ButtonLink, ButtonRow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DrawingToReality } from "./DrawingToReality";
import styles from "./Hero.module.css";

/** The full-bleed room behind the banner: a lit, coffered corridor from our visualisations. */
const backdrop = { src: "/images/services/corridor-coffers.jpg", width: 1600, height: 1600 };

/**
 * Home hero. A full-bleed render of a lit coffered corridor sits behind everything, darkened
 * from the text side, with a faint drafting grid and one warm cove-light sweep on load. On top:
 * the statement, and our drawing compared with its render or photograph.
 */
export async function Hero() {
  const [{ home, common }, locale, banner] = await Promise.all([getDictionary(), getLocale(), getHero()]);
  const { hero } = home;

  return (
    <section className={styles.band} aria-labelledby="hero-h">
      <div className={styles.backdrop} aria-hidden="true">
        <Image
          className={styles.backdropImage}
          src={backdrop.src}
          alt=""
          width={backdrop.width}
          height={backdrop.height}
          sizes="100vw"
          quality={85}
          preload
        />
      </div>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.cove} aria-hidden="true" />

      <Container className={styles.hero}>
        <h1 id="hero-h" className={styles.title}>
          {hero.titleLines.map((line, i) => (
            <span key={line} className={styles.line} style={{ "--i": i } as CSSProperties}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <div className={styles.text}>
          <p className={styles.lede}>{hero.lede}</p>
          <ButtonRow>
            <ButtonLink href={href(locale, routes.contact)}>{common.requestVisit}</ButtonLink>
            <ButtonLink href={href(locale, routes.projects)} variant="onDark">
              {common.seeWork}
            </ButtonLink>
          </ButtonRow>
        </div>

        <figure className={styles.figure}>
          <DrawingToReality
            drawing={banner.drawing}
            image={banner.image}
            alt={pick(banner.alt, locale)}
            labels={{
              drawing: hero.compare.drawing,
              image: banner.kind === "built" ? hero.compare.built : hero.compare.visualised,
              slider: banner.kind === "built" ? hero.compare.sliderBuilt : hero.compare.sliderVisualised,
              hint: hero.compare.hint,
            }}
          />
          <figcaption className={styles.caption}>{pick(banner.caption, locale)}</figcaption>
        </figure>
      </Container>
    </section>
  );
}
