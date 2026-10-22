import { approvalCodes } from "@/content/process";
import { pick } from "@/content/localized";
import type { Locale } from "@/i18n/config";
import styles from "./ApprovalCodes.module.css";

/** The four codes consultants return on a submittal, each pressed on its card like a stamp. */
export function ApprovalCodes({ locale }: { locale: Locale }) {
  return (
    <ul className={styles.codes}>
      {approvalCodes.map((c) => (
        <li key={c.code} data-tone={c.tone}>
          <span className={styles.stamp} dir="ltr" aria-hidden="true">
            {c.code}
          </span>
          <span className={styles.label}>
            <span className="visually-hidden">{c.code}: </span>
            {pick(c.label, locale)}
          </span>
          <span className={styles.note}>{pick(c.note, locale)}</span>
        </li>
      ))}
    </ul>
  );
}
