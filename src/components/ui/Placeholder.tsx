import styles from "./Placeholder.module.css";

/** Highlights content that still needs the client's real details before launch. */
export function Placeholder({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  if (!active) return <>{children}</>;
  return <span className={styles.placeholder}>{children}</span>;
}
