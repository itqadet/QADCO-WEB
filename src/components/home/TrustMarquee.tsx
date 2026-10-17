import Image from "next/image";
import { approvals } from "@/content/credentials";
import { getBrands } from "@/lib/content";
import styles from "./TrustMarquee.module.css";

/**
 * Two slowly moving rows: the consultants and authorities that approved us, and the brands we
 * install. Each row is rendered twice so the loop is seamless; the copy is hidden from screen
 * readers. Hovering or focusing pauses it, and with reduced motion the rows simply wrap.
 */
export async function TrustMarquee({ approvalsLabel, brandsLabel }: { approvalsLabel: string; brandsLabel: string }) {
  const brands = await getBrands();

  const approvalItems = (hidden: boolean) => (
    <ul className={styles.track} aria-hidden={hidden || undefined} aria-label={hidden ? undefined : approvalsLabel}>
      {approvals.map((name) => (
        <li key={name} className={styles.name} lang="en" dir="ltr">
          {name}
        </li>
      ))}
    </ul>
  );

  const brandItems = (hidden: boolean) => (
    <ul className={styles.track} aria-hidden={hidden || undefined} aria-label={hidden ? undefined : brandsLabel}>
      {brands.map((b) => (
        <li key={b.id} className={styles.logo}>
          <Image src={b.src} alt={hidden ? "" : b.name} width={b.width} height={b.height} sizes="140px" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.marquee}>
      <div className={styles.row} tabIndex={0}>
        {approvalItems(false)}
        {approvalItems(true)}
      </div>
      <div className={`${styles.row} ${styles.reverse}`} tabIndex={0}>
        {brandItems(false)}
        {brandItems(true)}
      </div>
    </div>
  );
}
