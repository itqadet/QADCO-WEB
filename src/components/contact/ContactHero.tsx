import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getSettings } from "@/lib/content";
import { site } from "@/content/site";
import { pick } from "@/content/localized";
import { DarkBand } from "@/components/ui/DarkBand";
import { OpenNow } from "./OpenNow";
import styles from "./ContactHero.module.css";

const icons = {
  call: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  visit: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
};

/** Contact banner: the title, today's open/closed status, and three one-tap ways to reach us. */
export async function ContactHero() {
  const [{ contact, nav }, locale, s] = await Promise.all([getDictionary(), getLocale(), getSettings()]);
  const q = contact.quick;

  const ways = [
    { key: "call", label: q.call, value: s.phone.display, href: s.phone.href, ltr: true },
    { key: "email", label: q.email, value: s.email.display, href: s.email.href, ltr: true },
    { key: "visit", label: q.visit, value: pick(s.office, locale), href: "#map-h", ltr: false },
  ] as const;

  return (
    <DarkBand
      id="contact-h"
      crumb={nav.contact}
      title={contact.title}
      lede={contact.lede}
      aside={
        <div className={styles.aside}>
          <OpenNow hours={site.officeHours} labels={{ open: q.open, closed: q.closed }} />
          {s.hours ? <p className={styles.hours}>{pick(s.hours, locale)}</p> : null}
        </div>
      }
    >
      <ul className={styles.ways}>
        {ways.map((w) => (
          <li key={w.key}>
            <a href={w.href} className={styles.way}>
              <span className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {icons[w.key]}
                </svg>
              </span>
              <span className={styles.wayText}>
                <span className={styles.wayLabel}>{w.label}</span>
                <span className={styles.wayValue} dir={w.ltr ? "ltr" : undefined}>
                  {w.value}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </DarkBand>
  );
}
