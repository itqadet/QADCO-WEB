import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./TextLink.module.css";

/** A prominent underlined link with a maroon rule, used for "see more" style links. */
export function TextLink({ className, ...rest }: ComponentPropsWithoutRef<typeof Link>) {
  return <Link className={className ? `${styles.link} ${className}` : styles.link} {...rest} />;
}
