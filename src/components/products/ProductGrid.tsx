import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { pick } from "@/content/localized";
import type { Product } from "@/content/products";
import { BrandStrip } from "./BrandStrip";
import styles from "./ProductGrid.module.css";

/** Product cards with a photo: what it is, who makes it, and a link that starts an enquiry. */
export async function ProductGrid({ items }: { items: Product[] }) {
  const [{ products: t }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <ul className={styles.grid}>
      {items.map((p) => {
        const name = pick(p.name, locale);
        const ask = `${href(locale, routes.contact)}?message=${encodeURIComponent(`${t.askAbout}: ${name}`)}`;
        return (
          <li key={p.id} className={styles.card}>
            <div className={styles.frame}>
              {p.image ? (
                <Image
                  className={styles.photo}
                  src={p.image.src}
                  alt={name}
                  width={p.image.width}
                  height={p.image.height}
                  sizes="(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 260px"
                />
              ) : null}
              <span className={styles.role} data-role={p.role}>
                {t.roles[p.role]}
              </span>
            </div>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.summary}>{pick(p.summary, locale)}</p>
            {p.brands?.length ? <BrandStrip ids={p.brands} label={t.brandsLabel} /> : null}
            <Link className={styles.ask} href={ask}>
              {t.ask}
              <span className="visually-hidden">: {name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
