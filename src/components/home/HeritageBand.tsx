import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import styles from "./HeritageBand.module.css";

/**
 * The one dark section: the story behind the name in a single statement, over a slowly drifting
 * Andalusian tumbling-blocks pattern drawn from the cube in the logo.
 */
export async function HeritageBand() {
  const [{ home }, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { heritage } = home;

  return (
    <section className={styles.band} aria-labelledby="name-h">
      <Container className={styles.inner} data-reveal="">
        <div className={styles.coveLine} aria-hidden="true" />
        <h2 id="name-h" className={styles.title}>
          {heritage.title}
        </h2>
        <p className={styles.line}>{heritage.line}</p>
        <Link className={styles.link} href={href(locale, routes.about)}>
          {heritage.link}
        </Link>
      </Container>
    </section>
  );
}
