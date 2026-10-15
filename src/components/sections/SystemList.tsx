import styles from "./SystemList.module.css";

/** A two-column ruled list of the systems a trade covers. */
export function SystemList({ items }: { items: string[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
