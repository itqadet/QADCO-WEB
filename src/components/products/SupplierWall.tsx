import Image from "next/image";
import { suppliers } from "@/content/products";
import styles from "./SupplierWall.module.css";
import { asset } from "@/lib/asset";

/** Every manufacturer and distributor we buy from, as a wall of logos. */
export function SupplierWall() {
  return (
    <ul className={styles.wall}>
      {Object.entries(suppliers).map(([id, s]) => (
        <li key={id} className={styles.tile}>
          <Image src={asset(s.src)} alt={s.name} title={s.name} width={s.w} height={s.h} className={styles.logo} unoptimized />
        </li>
      ))}
    </ul>
  );
}
