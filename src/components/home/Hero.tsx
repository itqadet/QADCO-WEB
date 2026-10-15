import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { getHero } from "@/lib/content";
import { pick } from "@/content/localized";
import { ButtonLink, ButtonRow } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DrawingToReality } from "./DrawingToReality";
import styles from "./Hero.module.css";

/** Home hero: the positioning statement above a drawing compared with its render or photograph. */
export async function Hero() {
  const [{ home, common }, locale, banner] = await Promise.all([getDictionary(), getLocale(), getHero()]);
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
  );
}
