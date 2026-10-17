import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { pick } from "@/content/localized";
import type { Product } from "@/content/products";
import { BrandStrip } from "./BrandStrip";
import styles from "./BoardsList.module.css";

/** Materials without photos: one row each, with the brands we carry and an enquiry link. */
export async function BoardsList({ items }: { items: Product[] }) {
  const [{ products: t }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <ul className={styles.list}>
      {items.map((p) => {
        const name = pick(p.name, locale);
        return (
          <li key={p.id} className={styles.row}>
            <div className={styles.text}>
              <h3 className={styles.name}>{name}</h3>
              <p className={styles.summary}>{pick(p.summary, locale)}</p>
            </div>
            {p.brands?.length ? <BrandStrip ids={p.brands} label={t.brandsLabel} /> : <span />}
            <Link
              className={styles.ask}
              href={`${href(locale, routes.contact)}?message=${encodeURIComponent(`${t.askAbout}: ${name}`)}`}
            >
              {t.ask}
              <span className="visually-hidden">: {name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
