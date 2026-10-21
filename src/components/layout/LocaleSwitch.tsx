"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { localeLabel, type Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/routing";

type LocaleSwitchProps = {
  to: Locale;
  className?: string;
  children?: ReactNode;
};

/**
 * Switches language without leaving the page: same page in the other language, keeping any
 * filters in the address (?sector=…), the #section, and the scroll position.
 */
export function LocaleSwitch({ to, className, children }: LocaleSwitchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const target = switchLocalePath(pathname, to);

  return (
    <Link
      className={className}
      href={target}
      hrefLang={to}
      lang={to}
      scroll={false}
      onClick={(e) => {
        // let new-tab and other modified clicks behave as normal links
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        router.push(`${target}${window.location.search}${window.location.hash}`, { scroll: false });
      }}
    >
      {children ?? localeLabel[to]}
    </Link>
  );
}
