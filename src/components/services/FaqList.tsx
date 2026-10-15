import styles from "./FaqList.module.css";

/** Questions as native <details> disclosures: keyboard and screen-reader friendly without JS. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className={styles.faq}>
      {items.map((item) => (
        <details key={item.q} className={styles.item}>
          <summary className={styles.summary}>{item.q}</summary>
          <p className={styles.answer}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
