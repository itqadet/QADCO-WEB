import type { ComponentPropsWithoutRef } from "react";
import { Container } from "./Container";
import styles from "./Section.module.css";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /** Use "band" for a full-width tinted section (CTA), "plain" for the default. */
  tone?: "plain" | "band";
  /** Skip the inner Container when the child already provides one. */
  bare?: boolean;
  /** Smaller top spacing, for the first section straight after a page intro. */
  tight?: boolean;
};

/** A page section with vertical rhythm; consecutive plain sections are divided by a rule. */
export function Section({ tone = "plain", bare = false, tight = false, className, children, ...rest }: SectionProps) {
  const cls = [styles.section, styles[tone], tight && styles.tight, className].filter(Boolean).join(" ");
  return (
    <section className={cls} {...rest}>
      {bare ? children : <Container>{children}</Container>}
    </section>
  );
}

type SectionHeadProps = {
  id: string;
  title: string;
  intro?: React.ReactNode;
};

/** Section heading on the left, a short muted intro on the right. */
export function SectionHead({ id, title, intro }: SectionHeadProps) {
  return (
    <div className={styles.head} data-reveal="">
      <h2 id={id}>{title}</h2>
      {intro ? <p>{intro}</p> : null}
    </div>
  );
}
