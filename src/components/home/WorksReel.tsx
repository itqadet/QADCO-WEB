"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./WorksReel.module.css";

export type ReelPhoto = { id: string; category: string; caption: string; src: string; width: number; height: number };

type WorksReelProps = {
  photos: ReelPhoto[];
  categories: { id: string; label: string }[];
  rtl: boolean;
  labels: {
    filterLabel: string;
    all: string;
    reelLabel: string;
    prev: string;
    next: string;
    open: string;
    viewer: string;
    prevPhoto: string;
    nextPhoto: string;
    close: string;
    of: string;
  };
};

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A horizontal reel of work photos. Swipe, scroll, drag with the mouse or use the arrows; each
 * photo drifts slightly inside its frame as it travels (parallax). Filters narrow it to one
 * group, and any photo opens larger in a keyboard-friendly viewer.
 */
export function WorksReel({ photos, categories, rtl, labels }: WorksReelProps) {
  const [filter, setFilter] = useState("all");
  const [refiltered, setRefiltered] = useState(false);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });
  const [current, setCurrent] = useState(0);
  const [inView, setInView] = useState(false);
  const [viewing, setViewing] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef({ active: false, moved: false, x: 0, left: 0 });

  const shown = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  /* progress bar, "07 / 25" counter and the parallax drift, all from the track's position */
  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const progress = max > 0 ? Math.min(1, Math.abs(track.scrollLeft) / max) : 1;
    // written straight to the bar, so scrolling doesn't re-render the reel
    progressRef.current?.style.setProperty("transform", `scaleX(${Math.max(0.04, progress)})`);
    const atStart = progress <= 0.001;
    const atEnd = progress >= 0.999;
    setEdges((e) => (e.atStart === atStart && e.atEnd === atEnd ? e : { atStart, atEnd }));

    const box = track.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    const start = rtl ? box.right - pad : box.left + pad;
    const cards = Array.from(track.children) as HTMLElement[];
    const still = reducedMotion();
    let first = -1;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const farEdge = rtl ? r.left : r.right;
      if (first < 0 && (rtl ? farEdge < start - r.width / 2 : farEdge > start + r.width / 2)) first = i;
      if (!still) {
        const offset = (r.left + r.width / 2 - window.innerWidth / 2) / window.innerWidth;
        card.style.setProperty("--drift", `${(offset * -3).toFixed(2)}%`);
      }
    });
    // at the very end several photos share the screen; count the last one
    setCurrent(atEnd ? cards.length - 1 : Math.max(0, first));
  }, [rtl]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, filter]);

  /* the photos slide in once, when the section first comes into view */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollByPage = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * (rtl ? -1 : 1) * track.clientWidth * 0.8, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  const choose = (id: string) => {
    setFilter(id);
    setRefiltered(true);
    trackRef.current?.scrollTo({ left: 0 });
  };

  /* mouse drag to scroll (touch and trackpads scroll natively) */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { active: true, moved: false, x: e.clientX, left: trackRef.current.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const track = trackRef.current;
    if (!d.active || !track) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      track.setAttribute("data-dragging", "");
      track.setPointerCapture(e.pointerId);
    }
    if (d.moved) track.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
    trackRef.current?.removeAttribute("data-dragging");
  };

  /* viewer */
  const open = (i: number) => {
    setViewing(i);
    dialogRef.current?.showModal();
  };
  const step = (dir: 1 | -1) => setViewing((v) => (v + dir + shown.length) % shown.length);
  const photo = shown[viewing] ?? shown[0];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div ref={sectionRef} className={styles.reel} data-in={inView || undefined}>
      <div className={styles.bar}>
        <div className={styles.filters} role="group" aria-label={labels.filterLabel}>
          {[{ id: "all", label: labels.all }, ...categories].map((c) => (
            <button key={c.id} type="button" className={styles.chip} aria-pressed={filter === c.id} onClick={() => choose(c.id)}>
              {c.label}
              <span className={styles.chipCount}>{c.id === "all" ? photos.length : photos.filter((p) => p.category === c.id).length}</span>
            </button>
          ))}
        </div>
        <div className={styles.controls}>
          <p className={styles.counter}>
            <span className={styles.now}>{pad(current + 1)}</span>
            <span className="visually-hidden"> {labels.of} </span>
            <span aria-hidden="true"> / </span>
            {pad(shown.length)}
          </p>
          <button type="button" className={styles.arrow} onClick={() => scrollByPage(-1)} disabled={edges.atStart} aria-label={labels.prev}>
            <span className={styles.chev} data-dir="prev" aria-hidden="true" />
          </button>
          <button type="button" className={styles.arrow} onClick={() => scrollByPage(1)} disabled={edges.atEnd} aria-label={labels.next}>
            <span className={styles.chev} data-dir="next" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        key={filter}
        ref={trackRef}
        className={styles.track}
        data-refiltered={refiltered || undefined}
        aria-label={labels.reelLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {shown.map((p, i) => (
          <li
            key={p.id}
            className={styles.card}
            style={{ "--ratio": `${p.width} / ${p.height}`, "--i": Math.min(i, 7) } as CSSProperties}
          >
            <button
              type="button"
              className={styles.open}
              ref={(el) => {
                triggers.current[i] = el;
              }}
              onClick={() => open(i)}
              aria-label={`${labels.open}: ${p.caption}`}
            >
              <span className={styles.frame}>
                <Image
                  className={styles.photo}
                  src={p.src}
                  alt=""
                  width={p.width}
                  height={p.height}
                  sizes="(max-width: 700px) 70vw, 380px"
                  draggable={false}
                />
              </span>
              <span className={styles.caption}>
                <span className={styles.group}>{categories.find((c) => c.id === p.category)?.label}</span>
                <span className={styles.title}>{p.caption}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.progress} aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <dialog
        ref={dialogRef}
        className={styles.viewer}
        aria-label={labels.viewer}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(rtl ? -1 : 1);
          if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
        }}
        onClose={() => triggers.current[viewing]?.focus()}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
      >
        {photo ? (
          <figure className={styles.viewerFigure}>
            <Image
              key={photo.id}
              className={styles.viewerImage}
              src={photo.src}
              alt={photo.caption}
              width={photo.width}
              height={photo.height}
              sizes="90vw"
              // never enlarge past the photo's own size
              style={{ maxWidth: `min(100%, ${photo.width}px)` }}
            />
            <figcaption className={styles.viewerCaption}>
              <span>{photo.caption}</span>
              <span className={styles.viewerCount}>
                {viewing + 1} {labels.of} {shown.length}
              </span>
            </figcaption>
          </figure>
        ) : null}
        <div className={styles.viewerNav}>
          <button type="button" className={styles.arrow} onClick={() => step(-1)} aria-label={labels.prevPhoto}>
            <span className={styles.chev} data-dir="prev" aria-hidden="true" />
          </button>
          <button type="button" className={styles.arrow} onClick={() => step(1)} aria-label={labels.nextPhoto}>
            <span className={styles.chev} data-dir="next" aria-hidden="true" />
          </button>
          <button type="button" className={styles.closeBtn} onClick={() => dialogRef.current?.close()}>
            {labels.close}
          </button>
        </div>
      </dialog>
    </div>
  );
}
