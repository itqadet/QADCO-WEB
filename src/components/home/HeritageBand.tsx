import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import styles from "./HeritageBand.module.css";

/**
 * The one dark section: the story behind the name, over a faint Andalusian
 * tumbling-blocks pattern drawn from the cube in the logo.
 */
export async function HeritageBand() {
  const [{ home }, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { heritage } = home;

  return (
    <section className={styles.band} aria-labelledby="name-h">
      <Container className={styles.grid}>
        <div>
          <div className={styles.coveLine} aria-hidden="true" />
          <h2 id="name-h" className={styles.title}>
            {heritage.title}
          </h2>
        </div>
        <div>
          {heritage.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>
            <Link href={href(locale, routes.about)}>{heritage.link}</Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
