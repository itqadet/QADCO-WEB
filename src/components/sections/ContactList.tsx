import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getSettings } from "@/lib/content";
import { site } from "@/content/site";
import { pick } from "@/content/localized";
import { Placeholder } from "@/components/ui/Placeholder";
import styles from "./ContactList.module.css";

/** Label/value rows for phone, fax, email and office (optionally P.O. box, hours and a map link). */
export async function ContactList({ detailed = false }: { detailed?: boolean }) {
  const [{ common }, locale, s] = await Promise.all([getDictionary(), getLocale(), getSettings()]);

  return (
    <ul className={styles.list}>
      <li>
        <span className={styles.label}>{common.contactLabels.phone}</span>
        {/* Numbers and addresses always read left to right, also on Arabic pages. */}
        <a href={s.phone.href} dir="ltr" className={styles.value}>
          {s.phone.display}
        </a>
      </li>
      {s.fax ? (
        <li>
          <span className={styles.label}>{common.contactLabels.fax}</span>
          <span dir="ltr" className={styles.plain}>
            {s.fax.display}
          </span>
        </li>
      ) : null}
      <li>
        <span className={styles.label}>{common.contactLabels.email}</span>
        <a href={s.email.href} dir="ltr" className={styles.value}>
          {s.email.display}
        </a>
      </li>
      <li>
        <span className={styles.label}>{common.contactLabels.office}</span>
        <span>
          {pick(s.office, locale)}
          {detailed ? (
            <>
              <br />
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className={styles.map}>
                {common.openMap}
              </a>
            </>
          ) : null}
        </span>
      </li>
      {detailed && s.poBox ? (
        <li>
          <span className={styles.label}>{common.contactLabels.poBox}</span>
          <span dir="ltr" className={styles.plain}>
            {s.poBox}, Doha
          </span>
        </li>
      ) : null}
      {detailed && s.hours ? (
        <li>
          <span className={styles.label}>{common.contactLabels.hours}</span>
          <span>
            <Placeholder active={!s.hoursConfirmed}>{pick(s.hours, locale)}</Placeholder>
          </span>
        </li>
      ) : null}
    </ul>
  );
}
