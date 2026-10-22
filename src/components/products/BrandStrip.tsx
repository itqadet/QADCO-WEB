import Image from "next/image";
import { suppliers, type SupplierId } from "@/content/products";
import styles from "./BrandStrip.module.css";

/** A row of small manufacturer logos, named for screen readers. */
export function BrandStrip({ ids, label }: { ids: SupplierId[]; label: string }) {
  return (
    <ul className={styles.strip} aria-label={label}>
      {ids.map((id) => {
        const s = suppliers[id];
        return (
          <li key={id}>
            <Image src={s.src} alt={s.name} title={s.name} width={s.w} height={s.h} className={styles.logo} unoptimized loading="eager" />
          </li>
        );
      })}
    </ul>
  );
}
