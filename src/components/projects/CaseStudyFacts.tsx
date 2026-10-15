import styles from "./CaseStudyFacts.module.css";

/** Project facts as a drawing title block: sector, location, building, contractor, consultant. */
export function CaseStudyFacts({ facts }: { facts: { label: string; value: string; ltr?: boolean }[] }) {
  return (
    <dl className={styles.block} style={{ gridTemplateColumns: `repeat(${facts.length}, minmax(0, 1fr))` }}>
      {facts.map((f) => (
        <div key={f.label} className={styles.cell}>
          <dt>{f.label}</dt>
          <dd lang={f.ltr ? "en" : undefined} dir={f.ltr ? "ltr" : undefined}>
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
