"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `is-in` to every `[data-reveal]` element as it scrolls into view, once.
 * Elements are only hidden while `html.reveal-ready` is set, which this component adds itself,
 * so content stays visible without JavaScript and with reduced motion.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    // Anything already on screen shows immediately, so nothing above the fold blinks.
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add("is-in");
    });
    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          observer.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    targets.forEach((el) => !el.classList.contains("is-in") && observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
