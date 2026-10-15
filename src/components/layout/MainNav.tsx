"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { localeLabel, otherLocale, type Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/routing";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./MainNav.module.css";

type MainNavProps = {
  locale: Locale;
  items: { href: string; label: string }[];
  cta: { href: string; label: string };
  labels: { menu: string; close: string; nav: string };
};

export function MainNav({ locale, items, cta, labels }: MainNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const target = otherLocale(locale);

  // Close the menu after navigating.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? labels.close : labels.menu}
      </button>

      <nav id="site-nav" aria-label={labels.nav} className={`${styles.nav} ${open ? styles.open : ""}`}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.link}
                aria-current={
                  pathname === item.href ? "page" : pathname.startsWith(`${item.href}/`) ? "true" : undefined
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link className={styles.lang} href={switchLocalePath(pathname, target)} hrefLang={target} lang={target}>
          {localeLabel[target]}
        </Link>
        <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
      </nav>
    </>
  );
}
