"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import styles from "./GroupNav.module.css";

type GroupNavProps = {
  label: string;
  groups: { id: string; title: string; count?: number }[];
};

/** Sticky jump links to each product group; the group being read is marked as current. */
export function GroupNav({ label, groups }: GroupNavProps) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const sections = groups.map((g) => document.getElementById(g.id)).filter((el): el is HTMLElement => !!el);
    let frame = 0;
    // the current group is the last one whose top has passed the upper third of the screen
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.33;
      const passed = sections.filter((s) => s.getBoundingClientRect().top <= line);
      const last = passed[passed.length - 1];
      // only while that group is still on screen past the line, so nothing stays lit below the last group
      setCurrent(last && last.getBoundingClientRect().bottom > line ? last.id : null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [groups]);

  return (
    <nav className={styles.bar} aria-label={label}>
      <Container as="ul" className={styles.list}>
        {groups.map((g) => (
          <li key={g.id}>
            <a href={`#${g.id}`} className={styles.link} aria-current={current === g.id ? "location" : undefined}>
              {g.title}
              {g.count !== undefined ? <span className={styles.count}>{g.count}</span> : null}
            </a>
          </li>
        ))}
      </Container>
    </nav>
  );
}
