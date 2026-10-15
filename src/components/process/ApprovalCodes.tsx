import { approvalCodes } from "@/content/process";
import { pick } from "@/content/localized";
import type { Locale } from "@/i18n/config";
import styles from "./ApprovalCodes.module.css";

/** The four codes consultants return on a submittal, as a key. */
export function ApprovalCodes({ locale }: { locale: Locale }) {
  return (
    <ul className={styles.codes}>
      {approvalCodes.map((c) => (
        <li key={c.code} data-tone={c.tone}>
          <span className={styles.code} dir="ltr">
            {c.code}
          </span>
          <span>{pick(c.label, locale)}</span>
        </li>
      ))}
    </ul>
  );
}
