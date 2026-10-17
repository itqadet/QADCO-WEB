"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const trackRef = useRef<HTMLDivElement>(null);
  const target = otherLocale(locale);

  // Close the menu after navigating.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /*
   * The cove-light: one warm line under the links that glides to whichever link is pointed at
   * or focused, and rests under the current page.
   */
  const moveTo = useCallback((link: HTMLElement | null) => {
    const track = trackRef.current;
    if (!track) return;
    if (!link) {
      track.style.setProperty("--cove-o", "0");
      return;
    }
    track.style.setProperty("--cove-x", `${link.offsetLeft}px`);
    track.style.setProperty("--cove-w", `${link.offsetWidth}px`);
    track.style.setProperty("--cove-o", "1");
  }, []);

  const toCurrent = useCallback(
    () => moveTo(trackRef.current?.querySelector<HTMLElement>("a[aria-current]") ?? null),
    [moveTo],
  );

  useLayoutEffect(() => {
    toCurrent();
    const track = trackRef.current;
    if (!track) return;
    // widths change when the web fonts arrive or the window resizes
    const ro = new ResizeObserver(toCurrent);
    ro.observe(track);
    // turn the gliding on only after the first placement, so it doesn't slide in on load
    const id = requestAnimationFrame(() => track.setAttribute("data-ready", ""));
    return () => {
      ro.disconnect();
      cancelAnimationFrame(id);
    };
  }, [pathname, toCurrent]);

  const onPoint = (e: { target: EventTarget }) => {
    const link = (e.target as HTMLElement).closest<HTMLElement>("a");
    if (link) moveTo(link);
  };

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.burger} aria-hidden="true" />
        {open ? labels.close : labels.menu}
      </button>

      <nav id="site-nav" aria-label={labels.nav} className={`${styles.nav} ${open ? styles.open : ""}`}>
        <div
          ref={trackRef}
          className={styles.track}
          onMouseOver={onPoint}
          onFocus={onPoint}
          onMouseLeave={toCurrent}
          onBlur={toCurrent}
        >
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
          <span className={styles.cove} aria-hidden="true" />
        </div>
        <Link className={styles.lang} href={switchLocalePath(pathname, target)} hrefLang={target} lang={target}>
          {localeLabel[target]}
        </Link>
        <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
      </nav>
    </>
  );
}
