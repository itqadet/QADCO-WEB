"use client";

import { useEffect, useState } from "react";
import styles from "./ContactHero.module.css";

type OpenNowProps = {
  hours: { days: readonly number[]; open: number; close: number };
  labels: { open: string; closed: string };
};

/** "Open now" or "Closed now", from the current time in Doha. Hidden until it knows. */
export function OpenNow({ hours, labels }: OpenNowProps) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      // Doha is UTC+3 all year
      const doha = new Date(Date.now() + 3 * 3600_000);
      const day = doha.getUTCDay();
      const h = doha.getUTCHours() + doha.getUTCMinutes() / 60;
      setOpen(hours.days.includes(day) && h >= hours.open && h < hours.close);
    };
    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, [hours]);

  if (open === null) return null;
  return (
    <span className={styles.status} data-open={open || undefined}>
      <span className={styles.dot} aria-hidden="true" />
      {open ? labels.open : labels.closed}
    </span>
  );
}
