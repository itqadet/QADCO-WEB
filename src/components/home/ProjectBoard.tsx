"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./ProjectBoard.module.css";

export type BoardLogo =
  | { kind: "image"; src: string; width: number; height: number; plate: "light" | "dark" }
  | { kind: "letters"; text: string };

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
  logo: BoardLogo;
};

type ProjectBoardProps = {
  projects: BoardProject[];
  locale: string;
  rtl: boolean;
  labels: {
    label: string;
    pick: string;
    sector: string;
    place: string;
    year: string;
    contractor: string;
    approvedBy: string;
    weBuilt: string;
    sentenceApproved: string;
    sentenceBuilt: string;
    tourPause: string;
    tourPlay: string;
  };
};

const TOUR = 4200;
type Wire = { d: string; key: string };

/**
 * The project board, built to be read at a glance: a wall of landmark logos; choose one and
 * clear lines run from it to who approved it and what we built there, with the same facts in
 * one plain sentence. Left alone it tours the landmarks; any choice or the pause button stops it.
 */
export function ProjectBoard({ projects, locale, rtl, labels }: ProjectBoardProps) {
  const [active, setActive] = useState(0);
  const [touring, setTouring] = useState(false);
  const [wires, setWires] = useState<Wire[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const visible = useRef(false);
  const p = projects[active];

  /* draw a wire from the chosen card's foot to each thing it connects to */
  const measure = useCallback(() => {
    const root = rootRef.current;
    const card = cardRefs.current[active];
    if (!root || !card) return;
    const r = root.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const from = { x: c.left + c.width / 2 - r.left, y: c.bottom - r.top };
    const ends = Array.from(root.querySelectorAll<HTMLElement>("[data-end]"));
    setBox({ w: r.width, h: r.height });
    setWires(
      ends.map((el) => {
        const e = el.getBoundingClientRect();
        const to = { x: e.left + e.width / 2 - r.left, y: e.top - r.top };
        const mid = (from.y + to.y) / 2;
        return { key: el.dataset.end!, d: `M${from.x},${from.y} C${from.x},${mid} ${to.x},${mid} ${to.x},${to.y}` };
      }),
    );
  }, [active]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  /* on phones the logos are a swipe row: keep the chosen one in view, without moving the page */
  useEffect(() => {
    const card = cardRefs.current[active];
    const row = card?.closest("ul");
    if (!card || !row || row.scrollWidth <= row.clientWidth) return;
    const left = card.parentElement!.offsetLeft - (row.clientWidth - card.offsetWidth) / 2;
    row.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.25 });
    io.observe(root);
    setTouring(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [measure]);

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

  const list = new Intl.ListFormat(locale, { style: "long", type: "conjunction" });
  // mid-sentence: "Gypsum board ceilings" -> "gypsum board ceilings", but "GRG ceilings" stays
  const lower = (t: string) => (/^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t);
  const built = list.format(p.scopes.map((s) => lower(s.label)));

  return (
    <div ref={rootRef} className={styles.board} data-rtl={rtl || undefined}>
      {/* the wires sit behind everything */}
      <svg className={styles.wires} width={box.w} height={box.h} viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} aria-hidden="true">
        {wires.map((w) => (
          <path key={`${p.id}-${w.key}`} d={w.d} />
        ))}
      </svg>

      <p className={styles.pickHead} id="pb-pick">
        {labels.pick}
      </p>
      <ul className={styles.cards} aria-labelledby="pb-pick">
        {projects.map((x, i) => (
          <li key={x.id}>
            <button
              type="button"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={styles.card}
              aria-pressed={i === active}
              onClick={() => choose(i)}
              style={{ "--i": i } as CSSProperties}
            >
              <span className={styles.plate} data-plate={x.logo.kind === "image" ? x.logo.plate : "letters"}>
                {x.logo.kind === "image" ? (
                  <Image src={x.logo.src} alt="" width={x.logo.width} height={x.logo.height} className={styles.logo} unoptimized />
                ) : (
                  <span className={styles.letters} dir="ltr">
                    {x.logo.text}
                  </span>
                )}
              </span>
              <span className={styles.cardName}>{x.short}</span>
              <span className={styles.cardYear} dir="ltr">
                {x.period}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* what the chosen landmark connects to */}
      <div className={styles.strip} key={p.id}>
        <div className={styles.groups}>
          {p.consultant ? (
            <div className={styles.group}>
              <p className={styles.groupHead}>{labels.approvedBy}</p>
              <span className={styles.chip} data-kind="consultant" data-end="consultant" lang="en">
                <span className={styles.diamond} aria-hidden="true" />
                {p.consultant}
              </span>
            </div>
          ) : null}
          <div className={styles.group}>
            <p className={styles.groupHead}>{labels.weBuilt}</p>
            <ul className={styles.chipList}>
              {p.scopes.map((s) => (
                <li key={s.key} className={styles.chip} data-kind="scope" data-end={s.key}>
                  <span className={styles.ring} aria-hidden="true" />
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={styles.sentence} aria-live={touring ? "off" : "polite"}>
          <strong>{p.title}</strong> <span dir="ltr">({p.period})</span>
          {p.consultant ? (
            <>
              {locale === "ar" ? "، " : ", "}
              {labels.sentenceApproved} <span lang="en">{p.consultant}</span>
            </>
          ) : null}
          {". "}
          {labels.sentenceBuilt} {built}.
        </p>

        <dl className={styles.facts}>
          {p.place ? (
            <div>
              <dt>{labels.place}</dt>
              <dd lang="en">{p.place}</dd>
            </div>
          ) : null}
          <div>
            <dt>{labels.sector}</dt>
            <dd>{p.sector}</dd>
          </div>
          {p.contractor ? (
            <div>
              <dt>{labels.contractor}</dt>
              <dd lang="en">{p.contractor}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <button type="button" className={styles.tour} onClick={() => setTouring((t) => !t)} aria-pressed={touring}>
        <span className={styles.tourIcon} data-on={touring || undefined} aria-hidden="true" />
        {touring ? labels.tourPause : labels.tourPlay}
      </button>
    </div>
  );
}
