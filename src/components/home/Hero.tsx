import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { heroPhoto } from "@/content/hero";
import { ButtonLink, ButtonRow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DrawingToReality } from "./DrawingToReality";
import styles from "./Hero.module.css";

/** Home hero: the positioning statement beside our drawing-versus-built ceiling. */
export async function Hero() {
  const [{ home, common }, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { hero } = home;

  return (
    <Container as="section" className={styles.hero} aria-labelledby="hero-h">
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
          <ButtonLink href={href(locale, routes.projects)} variant="quiet">
            {common.seeWork}
          </ButtonLink>
        </ButtonRow>
      </div>

      <figure className={styles.figure}>
        <DrawingToReality
          drawing={heroPhoto.drawing}
          photo={heroPhoto.src}
          width={heroPhoto.width}
          height={heroPhoto.height}
          alt={hero.imageAlt}
          labels={hero.compare}
        />
        <figcaption className={styles.caption}>{hero.caption}</figcaption>
      </figure>
    </Container>
  );
}
