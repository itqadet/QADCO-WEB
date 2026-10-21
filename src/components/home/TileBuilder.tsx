"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Drives the "What we do" tiles on every device. As each tile travels up the screen its photo
 * rises over the drawing (--p, 0 to 1), so the effect plays on phones and tablets from plain
 * scrolling, not only on hover. Tiles past halfway are marked built (data-built) for the stage
 * label. The flip buttons (data-flip-btn) hold a tile on its drawing until pressed again.
 */
export function TileBuilder({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const tiles = Array.from(list.children) as HTMLElement[];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      const vh = window.innerHeight;
      for (const tile of tiles) {
        let p = 1;
        if (!still) {
          const top = tile.getBoundingClientRect().top;
          // starts as the tile's top passes 90% down the screen, finished by 40%
          p = Math.min(1, Math.max(0, (vh * 0.9 - top) / (vh * 0.5)));
        }
        tile.style.setProperty("--p", p.toFixed(3));
        tile.toggleAttribute("data-built", p >= 0.5);
        tile.toggleAttribute("data-moving", p > 0.01 && p < 0.99);
      }
    };

    update();
    list.setAttribute("data-live", "");
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <ul
      ref={ref}
      className={className}
      onClick={(e) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-flip-btn]");
        if (!btn) return;
        const tile = btn.closest("li");
        const on = !tile?.hasAttribute("data-flip");
        tile?.toggleAttribute("data-flip", on);
        btn.setAttribute("aria-pressed", String(on));
      }}
    >
      {children}
    </ul>
  );
}
