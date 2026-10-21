"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type HeaderShellProps = {
  /** Pages that open on a dark banner; there the header starts clear over it. "/x/*" covers pages under /x. */
  clearOn: string[];
  className: string;
  children: ReactNode;
};

/**
 * The sticky header element. Marks whether it sits over the home banner and whether the page
 * has scrolled, so the styles can switch from clear-over-the-room to solid gypsum.
 */
export function HeaderShell({ clearOn, className, children }: HeaderShellProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={className} data-over-hero={clearOn.some((p) => (p.endsWith("/*") ? pathname.startsWith(p.slice(0, -1)) : pathname === p)) || undefined} data-scrolled={scrolled || undefined}>
      {children}
    </header>
  );
}
