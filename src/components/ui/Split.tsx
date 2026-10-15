import styles from "./Split.module.css";

/** Two columns at a 5:6 ratio that stack below 860px. Mirrors automatically in RTL. */
export function Split({ children, align = "start" }: { children: React.ReactNode; align?: "start" | "center" }) {
  return <div className={`${styles.split} ${align === "center" ? styles.center : ""}`}>{children}</div>;
}
