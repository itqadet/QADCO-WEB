import styles from "./PrinciplesList.module.css";

type Principle = { title: string; body: string };

/** A two-column list of working principles, each under a rule. */
export function PrinciplesList({ items }: { items: Principle[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.title} className={styles.item}>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
