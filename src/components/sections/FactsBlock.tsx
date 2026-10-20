import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { facts } from "@/content/site";
import { CountUp } from "./CountUp";
import styles from "./FactsBlock.module.css";

/** One label set as a dimension line, the way a drawing measures a wall. */
function Dimension({ children }: { children: React.ReactNode }) {
  return (
    <dt className={styles.dim}>
      <span className={styles.tick} aria-hidden="true" />
      <span className={styles.line} data-side="start" aria-hidden="true" />
      <span className={styles.dimText}>{children}</span>
      <span className={styles.line} data-side="end" aria-hidden="true" />
      <span className={styles.tick} aria-hidden="true" />
    </dt>
  );
}

/**
 * Company facts on a drawing sheet: each figure is dimensioned like a plan, the projects count
 * gets a navy panel of its own, and the quality system is pressed on as a stamp. On the home
 * page the sheet is laid over the foot of the banner (`overlap`).
 */
export async function FactsBlock({ overlap = false }: { overlap?: boolean }) {
  const [{ facts: t }, locale] = await Promise.all([getDictionary(), getLocale()]);
  const i = (n: number) => ({ "--i": n }) as CSSProperties;

  return (
    <dl className={styles.sheet} data-overlap={overlap || undefined} aria-label={t.label} data-reveal="">
      <div className={styles.cell} style={i(0)}>
        <Dimension>{t.founded}</Dimension>
        <dd className={styles.figure} dir="ltr">
          {facts.founded}
        </dd>
        <dd className={styles.note}>{t.notes.founded}</dd>
      </div>

      <div className={styles.cell} style={i(1)}>
        <Dimension>{t.technicians}</Dimension>
        <dd className={styles.figure} dir="ltr">
          <CountUp value={facts.technicians} />
        </dd>
        <dd className={styles.note}>{t.notes.technicians}</dd>
      </div>

      <div className={`${styles.cell} ${styles.feature}`} style={i(2)}>
        <Dimension>{t.projects}</Dimension>
        <dd className={styles.figure} dir="ltr">
          <CountUp value={facts.projects} duration={1800} />
        </dd>
        <dd className={styles.note}>{t.notes.projects}</dd>
      </div>

      <div className={`${styles.cell} ${styles.stampCell}`} style={i(3)}>
        <dt className="visually-hidden">{t.quality}</dt>
        <dd className={styles.stamp}>
          <svg viewBox="0 0 160 160" className={styles.ring} aria-hidden="true">
            <defs>
              <path id="stamp-ring" d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
            </defs>
            <circle cx="80" cy="80" r="74" />
            <circle cx="80" cy="80" r="44" />
            <text>
              {/* no textLength: forcing the length breaks Arabic letter joining */}
              <textPath href="#stamp-ring" startOffset="0">
                {/* the Arabic phrase is about half the ring, so it goes round twice */}
                {`${t.stamp} · ${t.quality} · `.repeat(locale === "ar" ? 2 : 1)}
              </textPath>
            </text>
          </svg>
          {/* "ISO 9001" set on two lines in the centre of the stamp */}
          <span className={styles.stampValue} dir="ltr">
            {t.qualityValue.split(" ").map((part) => (
              <span key={part}>{part}</span>
            ))}
          </span>
        </dd>
      </div>
    </dl>
  );
}
