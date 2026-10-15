import styles from "./ServiceAreas.module.css";

/** The towns and districts QADCO covers, as a wrapping list of tags. */
export function ServiceAreas({ label, areas }: { label: string; areas: string[] }) {
  return (
    <ul className={styles.areas} aria-label={label}>
      {areas.map((area) => (
        <li key={area}>{area}</li>
      ))}
    </ul>
  );
}
