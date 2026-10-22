import type { CSSProperties } from "react";
import styles from "./ProcessRoute.module.css";

type ProcessRouteProps = {
  label: string;
  itemsWord: string;
  stages: { id: string; code: string; title: string; summary: string; count: number }[];
};

/**
 * The three method-statement stages as a route across the banner: numbered stations joined by
 * a dashed line of cove light, each with its summary and how many items it holds. Each jumps
 * to the full transmittal below.
 */
export function ProcessRoute({ label, itemsWord, stages }: ProcessRouteProps) {
  return (
    <ol className={styles.route} aria-label={label}>
      {stages.map((s, i) => (
        <li key={s.id} style={{ "--i": i } as CSSProperties}>
          <a href="#stages" className={styles.station}>
            <span className={styles.node} aria-hidden="true">
              {i + 1}
            </span>
            <span className={styles.code} dir="ltr">
              {s.code}
            </span>
            <span className={styles.title}>{s.title}</span>
            <span className={styles.summary}>{s.summary}</span>
            <span className={styles.count}>
              <span dir="ltr">{s.count}</span> {itemsWord}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
