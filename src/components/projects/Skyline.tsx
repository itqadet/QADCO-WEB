"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./Skyline.module.css";

export type SkylineTower = {
  id: string;
  name: string;
  location: string;
  scope: string;
  w: number;
  shape: string;
  detail?: string;
  top: [number, number];
};

type SkylineProps = {
  towers: SkylineTower[];
  initial: string;
  labels: {
    hint: string;
    notToScale: string;
    listLabel: string;
    scopeLabel: string;
    locationLabel: string;
    prev: string;
    next: string;
    of: string;
  };
};

const GAP = 30;
const MARGIN = 28;
const GROUND = 372;
const TOP = 150; // the tallest tower reaches about y = -225
const REFLECT = 90; // the water below the ground line

/**
 * Doha towers QADCO finished, drawn at night. The towers rise on arrival; the chosen one lights
 * up floor by floor in cove light and shows in the water below. Pointing previews a tower,
 * selecting keeps it. The tab strip under the drawing is the accessible control (arrow keys
 * move along it); the drawing itself is a pointer convenience, hidden from assistive tech.
 */
export function Skyline({ towers, initial, labels }: SkylineProps) {
  const [selected, setSelected] = useState(initial);
  const [hovered, setHovered] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const activeId = hovered ?? selected;
  const index = Math.max(0, towers.findIndex((t) => t.id === selected));
  const active = towers.find((t) => t.id === activeId) ?? towers[0];

  let x = MARGIN;
  const placed = towers.map((t) => {
    const at = x;
    x += t.w + GAP;
    return { ...t, x: at };
  });
  const width = x - GAP + MARGIN;
  const pin = placed.find((t) => t.id === activeId)!;

  const go = (i: number) => setSelected(towers[(i + towers.length) % towers.length].id);

  /* keep the chosen tab in view inside the strip */
  useEffect(() => {
    const strip = stripRef.current;
    const tab = strip?.querySelector<HTMLElement>(`[data-id="${selected}"]`);
    if (!strip || !tab || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({
      left: tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [selected]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    let to = -1;
    if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) to = i + 1;
    if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) to = i - 1;
    if (e.key === "Home") to = 0;
    if (e.key === "End") to = towers.length - 1;
    if (to === -1) return;
    e.preventDefault();
    const n = (to + towers.length) % towers.length;
    go(n);
    stripRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[n]?.focus();
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={styles.wrap}>
      <figure className={styles.figure}>
        <svg
          className={styles.svg}
          viewBox={`0 ${GROUND - 225 - TOP / 3} ${width} ${225 + TOP / 3 + REFLECT}`}
          aria-hidden="true"
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <pattern id="sk-floors" width="8" height="9" patternUnits="userSpaceOnUse">
              <rect width="8" height="4" fill="#f2d49b" />
            </pattern>
            <linearGradient id="sk-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1b2a6b" />
              <stop offset="1" stopColor="#0b1438" />
            </linearGradient>
            <linearGradient id="sk-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="sk-fade">
              <rect x="0" y={GROUND} width={width} height={REFLECT} fill="url(#sk-water)" />
            </mask>
            {placed.map((t) => (
              <clipPath key={t.id} id={`sk-c-${t.id}`}>
                <path d={t.shape} />
              </clipPath>
            ))}
          </defs>

          {/* reflections in the water */}
          <g mask="url(#sk-fade)" className={styles.water}>
            {placed.map((t) => (
              <g key={t.id} transform={`translate(${t.x} ${GROUND}) scale(1 -0.42)`} data-active={t.id === activeId || undefined}>
                <path d={t.shape} />
              </g>
            ))}
          </g>

          {/* the towers, rising in turn */}
          {placed.map((t, i) => (
            <g
              key={t.id}
              transform={`translate(${t.x} ${GROUND})`}
              className={styles.tower}
              data-active={t.id === activeId || undefined}
              onMouseEnter={() => setHovered(t.id)}
              onClick={() => setSelected(t.id)}
              style={{ "--i": i } as CSSProperties}
            >
              <rect x={-GAP / 2} y={t.top[1] - 10} width={t.w + GAP} height={-t.top[1] + 10} className={styles.hit} />
              <g className={styles.rise}>
                <path className={styles.body} d={t.shape} />
                {/* floors that light up from the ground when chosen */}
                <g clipPath={`url(#sk-c-${t.id})`}>
                  <rect className={styles.floors} x={0} y={t.top[1]} width={t.w} height={-t.top[1]} fill="url(#sk-floors)" />
                </g>
                {t.detail ? <path className={styles.detail} d={t.detail} /> : null}
                <path className={styles.edge} d={t.shape} />
              </g>
            </g>
          ))}

          <path className={styles.ground} d={`M0 ${GROUND}H${width}`} />

          {/* beacon above the active tower */}
          <g className={styles.pin} style={{ transform: `translate(${pin.x + pin.top[0]}px, ${GROUND + pin.top[1]}px)` }}>
            <path d="M0 -8V-26" />
            <circle cy={-32} r={5} />
            <circle cy={-32} r={11} className={styles.glow} />
          </g>
        </svg>
      </figure>

      {/* the chosen tower, in words */}
      <div className={styles.card} aria-live="polite" key={active.id}>
        <p className={styles.count} dir="ltr">
          {pad(towers.findIndex((t) => t.id === active.id) + 1)} <span>/ {pad(towers.length)}</span>
        </p>
        <h3 className={styles.name}>{active.name}</h3>
        <dl className={styles.facts}>
          <div>
            <dt>{labels.locationLabel}</dt>
            <dd>{active.location}</dd>
          </div>
          <div>
            <dt>{labels.scopeLabel}</dt>
            <dd>{active.scope}</dd>
          </div>
        </dl>
      </div>

      {/* tower tabs */}
      <div className={styles.nav}>
        <button type="button" className={styles.arrow} onClick={() => go(index - 1)} aria-label={labels.prev}>
          <span className={styles.chev} data-dir="prev" aria-hidden="true" />
        </button>
        <div ref={stripRef} className={styles.strip} role="tablist" aria-label={labels.listLabel}>
          {towers.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              data-id={t.id}
              aria-selected={t.id === selected}
              tabIndex={t.id === selected ? 0 : -1}
              className={styles.tab}
              onClick={() => setSelected(t.id)}
              onFocus={() => setHovered(null)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {t.name}
            </button>
          ))}
        </div>
        <button type="button" className={styles.arrow} onClick={() => go(index + 1)} aria-label={labels.next}>
          <span className={styles.chev} data-dir="next" aria-hidden="true" />
        </button>
      </div>

      <p className={styles.caption}>
        <span>{labels.hint}</span>
        <span>{labels.notToScale}</span>
      </p>
    </div>
  );
}
