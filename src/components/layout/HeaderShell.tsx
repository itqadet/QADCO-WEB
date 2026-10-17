"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type HeaderShellProps = {
  /** The home page path; there the header starts clear over the dark banner. */
  home: string;
  className: string;
  children: ReactNode;
};

/**
 * The sticky header element. Marks whether it sits over the home banner and whether the page
 * has scrolled, so the styles can switch from clear-over-the-room to solid gypsum.
 */
export function HeaderShell({ home, className, children }: HeaderShellProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={className} data-over-hero={pathname === home || undefined} data-scrolled={scrolled || undefined}>
      {children}
    </header>
  );
}
