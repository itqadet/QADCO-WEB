"use client";

import { useState } from "react";
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
  labels: { hint: string; notToScale: string; listLabel: string; scopeLabel: string; locationLabel: string };
};

const GAP = 30;
const MARGIN = 28;
const GROUND = 372;
const HEIGHT = 410;

/**
 * A simplified elevation of Doha towers QADCO has worked in. Pointing at a tower previews it;
 * selecting a tower (in the drawing or the list) keeps it. The buttons below the drawing are the
 * accessible control; the drawing itself is a pointer convenience and hidden from assistive tech.
 */
export function Skyline({ towers, initial, labels }: SkylineProps) {
  const [selected, setSelected] = useState(initial);
  const [hovered, setHovered] = useState<string | null>(null);
  const activeId = hovered ?? selected;
  const active = towers.find((t) => t.id === activeId) ?? towers[0];

  // Lay the towers out left to right along one ground line.
  let x = MARGIN;
  const placed = towers.map((t) => {
    const at = x;
    x += t.w + GAP;
    return { ...t, x: at };
  });
  const width = x - GAP + MARGIN;
  const pin = placed.find((t) => t.id === activeId)!;

  return (
    <div className={styles.wrap}>
      <figure className={styles.figure}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          aria-hidden="true"
          onMouseLeave={() => setHovered(null)}
        >
          {/* ground line with ticks every 60 units, like a drawing's grid */}
          <path className={styles.ground} d={`M0 ${GROUND}H${width}`} />
          {Array.from({ length: Math.floor(width / 60) + 1 }, (_, i) => (
            <path key={i} className={styles.tick} d={`M${i * 60} ${GROUND}v8`} />
          ))}

          {placed.map((t) => (
            <g
              key={t.id}
              transform={`translate(${t.x} ${GROUND})`}
              className={styles.tower}
              data-active={t.id === activeId || undefined}
              onMouseEnter={() => setHovered(t.id)}
              onClick={() => setSelected(t.id)}
            >
              {/* generous invisible hit area, so slim towers are easy to point at */}
              <rect x={-GAP / 2} y={t.top[1] - 10} width={t.w + GAP} height={-t.top[1] + 10} className={styles.hit} />
              <path className={styles.body} d={t.shape} />
              {t.detail ? <path className={styles.detail} d={t.detail} /> : null}
            </g>
          ))}

          {/* pin above the active tower */}
          {/* positioned with a CSS transform (not the attribute) so it glides between towers */}
          <g className={styles.pin} style={{ transform: `translate(${pin.x + pin.top[0]}px, ${GROUND + pin.top[1]}px)` }}>
            <path d="M0 -8V-26" />
            <circle cy={-32} r={6} />
          </g>
        </svg>
        <figcaption className={styles.caption}>
          <span>{labels.hint}</span>
          <span>{labels.notToScale}</span>
        </figcaption>
      </figure>

      <div className={styles.panel} aria-live="polite">
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

      <div className={styles.list} role="group" aria-label={labels.listLabel}>
        {towers.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === selected}
            onClick={() => setSelected(t.id)}
            onFocus={() => setHovered(null)}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
