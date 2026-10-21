"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./ProjectBoard.module.css";

export type BoardProject = {
  id: string;
  title: string;
  short: string;
  place?: string;
  period: string;
  sector: string;
  consultant?: string;
  contractor?: string;
  scopes: { key: string; label: string }[];
};

type ProjectBoardProps = {
  projects: BoardProject[];
  rtl: boolean;
  labels: {
    label: string;
    consultants: string;
    projects: string;
    scopes: string;
    pick: string;
    sector: string;
    place: string;
    year: string;
    consultant: string;
    contractor: string;
    scope: string;
    tourPause: string;
    tourPlay: string;
    of: string;
  };
};

/* the diagram's drawing space */
const W = 1100;
const H = 620;
const HUB = { x: W / 2, y: 320 };
const RING = 190;
const LEFT = 240; // consultant column (room for the longest name to its left)
const RIGHT = W - 225; // scope column
const TOUR = 3800;

/** A soft S-curve from one node to another, the way wiring is drawn on a board. */
const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2;
  return `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
};

/**
 * The project board: landmark projects orbit a QADCO hub; wires run left to the consultant who
 * approved each one and right to the trades we delivered there. Choosing a project lights its
 * wires and spells the connections out in words beside the diagram. When left alone it tours
 * the projects; any choice, the pause button, or leaving the screen stops it.
 */
export function ProjectBoard({ projects, rtl, labels }: ProjectBoardProps) {
  const [active, setActive] = useState(0);
  const [touring, setTouring] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  // mirror the diagram for Arabic, so it reads from the right
  const mx = (x: number) => (rtl ? W - x : x);

  const graph = useMemo(() => {
    const consultants = [...new Set(projects.map((p) => p.consultant).filter(Boolean))] as string[];
    const scopeMap = new Map<string, string>();
    projects.forEach((p) => p.scopes.forEach((s) => scopeMap.set(s.key, s.label)));
    const scopes = [...scopeMap.entries()].map(([key, label]) => ({ key, label }));
    const spread = (n: number, i: number) => 110 + ((H - 190) * (i + 0.5)) / n;

    const nodes = projects.map((p, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / projects.length;
      return { ...p, x: HUB.x + Math.cos(a) * RING, y: HUB.y + Math.sin(a) * RING, cos: Math.cos(a), sin: Math.sin(a) };
    });
    return {
      nodes,
      consultants: consultants.map((name, i) => ({ name, x: LEFT, y: spread(consultants.length, i) })),
      scopes: scopes.map((s, i) => ({ ...s, x: RIGHT, y: spread(scopes.length, i) })),
    };
  }, [projects]);

  const current = graph.nodes[active];
  const linkedConsultant = current.consultant;
  const linkedScopes = new Set(current.scopes.map((s) => s.key));

  /* narrow screens: crop the drawing to the ring, labels move to the panel */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const set = () => setNarrow(mq.matches);
    set();
    mq.addEventListener("change", set);
    setTouring(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* the guided tour */
  useEffect(() => {
    if (!touring) return;
    const id = window.setInterval(() => {
      if (visible.current) setActive((a) => (a + 1) % projects.length);
    }, TOUR);
    return () => window.clearInterval(id);
  }, [touring, projects.length]);

  const choose = (i: number) => {
    setTouring(false);
    setActive(i);
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const viewBox = narrow ? `${W / 2 - 290} 90 580 480` : `0 20 ${W} ${H - 10}`;

  return (
    <div ref={rootRef} className={styles.board} data-touring={touring || undefined}>
      <div className={styles.diagram}>
        <svg viewBox={viewBox} className={styles.svg} aria-hidden="true">
          <defs>
            <radialGradient id="pb-hub" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f2d49b" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#f2d49b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* column headings */}
          {!narrow ? (
            <g className={styles.heads}>
              <text x={mx(LEFT)} y={58} textAnchor="middle">
                {labels.consultants}
              </text>
              <text x={HUB.x} y={58} textAnchor="middle">
                {labels.projects}
              </text>
              <text x={mx(RIGHT)} y={58} textAnchor="middle">
                {labels.scopes}
              </text>
            </g>
          ) : null}

          {/* wires: hub to every project, and the active project's wires to both columns */}
          {graph.nodes.map((n, i) => (
            <line
              key={`h-${n.id}`}
              x1={mx(HUB.x)}
              y1={HUB.y}
              x2={mx(n.x)}
              y2={n.y}
              className={styles.spoke}
              data-on={i === active || undefined}
            />
          ))}
          {graph.nodes.map((n, i) => (
            <g key={`w-${n.id}`} data-on={i === active || undefined} className={styles.wires}>
              {n.consultant
                ? (() => {
                    const c = graph.consultants.find((k) => k.name === n.consultant)!;
                    return <path d={curve({ x: mx(n.x), y: n.y }, { x: mx(c.x), y: c.y })} />;
                  })()
                : null}
              {n.scopes.map((s) => {
                const t = graph.scopes.find((k) => k.key === s.key)!;
                return <path key={s.key} d={curve({ x: mx(n.x), y: n.y }, { x: mx(t.x), y: t.y })} />;
              })}
            </g>
          ))}

          {/* consultant nodes */}
          {graph.consultants.map((c) => (
            <g key={c.name} className={styles.side} data-on={c.name === linkedConsultant || undefined}>
              <rect x={mx(c.x) - 7} y={c.y - 7} width={14} height={14} rx={2} transform={`rotate(45 ${mx(c.x)} ${c.y})`} />
              <text x={mx(c.x) + (rtl ? 18 : -18)} y={c.y + 4} textAnchor={rtl ? "start" : "end"}>
                {c.name}
              </text>
            </g>
          ))}

          {/* scope nodes */}
          {graph.scopes.map((s) => (
            <g key={s.key} className={styles.side} data-on={linkedScopes.has(s.key) || undefined}>
              <circle cx={mx(s.x)} cy={s.y} r={7} />
              <text x={mx(s.x) + (rtl ? -18 : 18)} y={s.y + 4} textAnchor={rtl ? "end" : "start"}>
                {s.label}
              </text>
            </g>
          ))}

          {/* the hub */}
          <circle cx={mx(HUB.x)} cy={HUB.y} r={90} fill="url(#pb-hub)" className={styles.halo} />
          <circle cx={mx(HUB.x)} cy={HUB.y} r={40} className={styles.hub} />
          <text x={mx(HUB.x)} y={HUB.y + 6} textAnchor="middle" className={styles.hubText}>
            QADCO
          </text>

          {/* project nodes: click or tap to choose (the list beside is the keyboard route) */}
          {graph.nodes.map((n, i) => (
            <g
              key={n.id}
              className={styles.node}
              data-on={i === active || undefined}
              onClick={() => choose(i)}
              style={{ "--i": i } as CSSProperties}
            >
              <circle cx={mx(n.x)} cy={n.y} r={22} className={styles.hit} />
              <circle cx={mx(n.x)} cy={n.y} r={i === active ? 13 : 9} className={styles.dot} />
              {!narrow ? (
                <text x={mx(n.x)} y={n.y + (n.sin < -0.6 ? -22 : 34)} textAnchor="middle">
                  {n.short}
                </text>
              ) : null}
            </g>
          ))}
        </svg>
      </div>

      <div className={styles.panel}>
        <div className={styles.card} key={current.id} aria-live={touring ? "off" : "polite"}>
          <p className={styles.count} dir="ltr">
            {pad(active + 1)} <span>/ {pad(projects.length)}</span>
          </p>
          <h3 className={styles.title}>{current.title}</h3>
          <dl className={styles.facts}>
            {current.place ? (
              <div>
                <dt>{labels.place}</dt>
                <dd lang="en">{current.place}</dd>
              </div>
            ) : null}
            <div>
              <dt>{labels.year}</dt>
              <dd dir="ltr">{current.period}</dd>
            </div>
            <div>
              <dt>{labels.sector}</dt>
              <dd>{current.sector}</dd>
            </div>
            {current.consultant ? (
              <div data-key="consultant">
                <dt>{labels.consultant}</dt>
                <dd lang="en">{current.consultant}</dd>
              </div>
            ) : null}
            {current.contractor ? (
              <div>
                <dt>{labels.contractor}</dt>
                <dd lang="en">{current.contractor}</dd>
              </div>
            ) : null}
          </dl>
          <p className={styles.scopeHead}>{labels.scope}</p>
          <ul className={styles.scopes}>
            {current.scopes.map((s) => (
              <li key={s.key}>{s.label}</li>
            ))}
          </ul>
        </div>

        <div className={styles.picker}>
          <p className={styles.pickHead} id="pb-pick">
            {labels.pick}
          </p>
          <ul className={styles.chips} aria-labelledby="pb-pick">
            {projects.map((p, i) => (
              <li key={p.id}>
                <button type="button" aria-pressed={i === active} onClick={() => choose(i)}>
                  {p.short}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className={styles.tour} onClick={() => setTouring((t) => !t)} aria-pressed={touring}>
            <span className={styles.tourIcon} data-on={touring || undefined} aria-hidden="true" />
            {touring ? labels.tourPause : labels.tourPlay}
          </button>
        </div>
      </div>
    </div>
  );
}
