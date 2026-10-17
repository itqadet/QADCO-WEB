import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "quiet" | "onDark";

function cx(variant: Variant, className?: string) {
  return [styles.button, styles[variant], className].filter(Boolean).join(" ");
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & { variant?: Variant };

/** A link styled as a button, for navigation actions like "Request a site visit". */
export function ButtonLink({ variant = "primary", className, ...rest }: ButtonLinkProps) {
  return <Link className={cx(variant, className)} {...rest} />;
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & { variant?: Variant };

/** A real <button>, for form submits and in-page actions. */
export function Button({ variant = "primary", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cx(variant, className)} {...rest} />;
}

/** Groups buttons with consistent spacing. */
export function ButtonRow({ children }: { children: React.ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}
