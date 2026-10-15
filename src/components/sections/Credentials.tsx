import Image from "next/image";
import { approvals } from "@/content/credentials";
import { getBrands } from "@/lib/content";
import styles from "./Credentials.module.css";

/** Consultants and authorities that approved QADCO, as a ruled two-column list. */
export function ApprovalsList({ label }: { label: string }) {
  return (
    <ul className={styles.approvals} aria-label={label}>
      {approvals.map((name) => (
        <li key={name} lang="en" dir="ltr">
          {name}
        </li>
      ))}
    </ul>
  );
}

/** Manufacturer logos on a quiet grid. Logos sit on white tiles because several have white grounds. */
export async function BrandGrid({ label }: { label: string }) {
  const brands = await getBrands();
  return (
    <ul className={styles.brands} aria-label={label}>
      {brands.map((b) => (
        <li key={b.id}>
          <Image src={b.src} alt={b.name} width={b.width} height={b.height} sizes="160px" />
        </li>
      ))}
    </ul>
  );
}
