"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./DesignStory.module.css";

export type StoryStep = {
  title: string;
  body: string;
  image: { src: string; width: number; height: number; alt: string };
  tag: string;
  /** Colour chips shown over the image at this stage (the materials step). */
  swatches?: string[];
};

type DesignStoryProps = {
  title: string;
  steps: StoryStep[];
  rtl: boolean;
  labels: {
    stepsLabel: string;
    goTo: string;
    prev: string;
    next: string;
    play: string;
    pause: string;
    scrub: string;
    hint: string;
  };
};

const HOLD = 3600; // ms each stage rests before autoplay moves on
const MOVE = 1100; // ms for one stage to wipe into the next
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One room, from sketch to built, as an interactive stepper. A single position `v` (0 to n-1)
 * drives everything: stage i is wiped in by how far v has passed i-1, behind a line of cove
 * light. Visitors can pick a stage, drag the scrubber to build the room themselves, swipe the
 * picture, use the arrow keys, or let it play.
 */
export function DesignStory({ title, steps, rtl, labels }: DesignStoryProps) {
  const n = steps.length;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [touched, setTouched] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const vRef = useRef(0);
  const activeRef = useRef(0);
  const tween = useRef(0);
  const visible = useRef(false);
  const hovering = useRef(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  /** Paint position v: every stage's reveal, the light line, the scrubber and the active stage. */
  const apply = useCallback(
    (v: number) => {
      const root = rootRef.current;
      if (!root) return;
      vRef.current = v;
      for (let i = 1; i < n; i++) root.style.setProperty(`--r${i}`, clamp(v - (i - 1)).toFixed(4));
      const frac = v - Math.floor(v);
      const moving = frac > 0.001 && frac < 0.999;
      root.style.setProperty("--edge", (moving ? frac : 0).toFixed(4));
      root.style.setProperty("--edge-on", moving ? "1" : "0");
      root.style.setProperty("--v", (v / (n - 1)).toFixed(4));
      if (rangeRef.current && document.activeElement !== rangeRef.current) rangeRef.current.value = String(v);
      const a = Math.round(v);
      if (a !== activeRef.current) {
        activeRef.current = a;
        setActive(a);
      }
    },
    [n],
  );

  /** Glide from where we are to stage `to`. */
  const glide = useCallback(
    (to: number, ms = MOVE) => {
      cancelAnimationFrame(tween.current);
      const from = vRef.current;
      if (reduced() || from === to) {
        apply(to);
        return;
      }
      const start = performance.now();
      const dur = ms * Math.min(1.6, Math.max(0.6, Math.abs(to - from)));
      const step = (now: number) => {
        const t = clamp((now - start) / dur);
        apply(from + (to - from) * ease(t));
        if (t < 1) tween.current = requestAnimationFrame(step);
      };
      tween.current = requestAnimationFrame(step);
    },
    [apply],
  );

  /** Any direct interaction hands control to the visitor. */
  const takeOver = () => {
    setPlaying(false);
    setTouched(true);
  };

  const goTo = (i: number) => {
    takeOver();
    glide(clamp(i, 0, n - 1));
  };

  useEffect(() => {
    apply(0);
    setPlaying(!reduced());
    return () => cancelAnimationFrame(tween.current);
  }, [apply]);

  /* autoplay: rest on a stage (the active tab fills as a timer), then wipe to the next */
  useEffect(() => {
    if (!playing) {
      rootRef.current?.style.setProperty("--hold", "0");
      return;
    }
    let frame = 0;
    let rested = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const settled = Math.abs(vRef.current - Math.round(vRef.current)) < 0.001;
      if (visible.current && !hovering.current && settled) {
        rested += dt;
        rootRef.current?.style.setProperty("--hold", clamp(rested / HOLD).toFixed(4));
        if (rested >= HOLD) {
          rested = 0;
          rootRef.current?.style.setProperty("--hold", "0");
          const next = Math.round(vRef.current) + 1;
          glide(next >= n ? 0 : next, next >= n ? 900 : MOVE);
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, glide, n]);

  /* only play while the section is on screen */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* arrow keys move between tabs, as in any tab list */
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const fwd = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let to = -1;
    if (e.key === fwd || e.key === "ArrowDown") to = (i + 1) % n;
    if (e.key === back || e.key === "ArrowUp") to = (i - 1 + n) % n;
    if (e.key === "Home") to = 0;
    if (e.key === "End") to = n - 1;
    if (to < 0) return;
    e.preventDefault();
    goTo(to);
    tabsRef.current[to]?.focus();
  };

  /* swipe the picture on touch screens */
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(e.clientY - s.y)) return;
    const forward = rtl ? dx > 0 : dx < 0;
    goTo(activeRef.current + (forward ? 1 : -1));
  };

  const pad = (v: number) => String(v).padStart(2, "0");
  const step = steps[active];

  return (
    <div
      ref={rootRef}
      className={styles.story}
      data-rtl={rtl || undefined}
      style={{ "--n": n } as CSSProperties}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <h2 id="story-h" className={styles.heading}>
        {title}
      </h2>

      {/* the stepper: vertical beside the picture on wide screens, a row of nodes on phones */}
      <div className={styles.tabs} role="tablist" aria-label={labels.stepsLabel}>
        {steps.map((s, i) => (
          <button
            key={s.title}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`story-tab-${i}`}
            aria-selected={i === active}
            aria-controls="story-panel"
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            data-done={i < active || undefined}
            onClick={() => goTo(i)}
            onKeyDown={(e) => onTabKey(e, i)}
          >
            <span className={styles.node} aria-hidden="true">
              <span>{i + 1}</span>
            </span>
            <span className={styles.tabText}>
              <span className={styles.tabNum} dir="ltr">
                {pad(i + 1)}
              </span>
              <span className={styles.tabTitle}>{s.title}</span>
              <span className={styles.tabTag}>{s.tag}</span>
            </span>
            {i < n - 1 ? (
              <span className={styles.link} aria-hidden="true">
                <span />
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* the drawing sheet */}
      <figure className={styles.stage}>
        <div className={styles.sheet}>
          <div className={styles.frame} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (swipe.current = null)}>
            {steps.map((s, i) => (
              <div key={s.title} className={styles.layer} data-layer={i} style={i > 0 ? ({ "--r": `var(--r${i}, 0)` } as CSSProperties) : undefined}>
                <Image
                  src={s.image.src}
                  alt={i === active ? s.image.alt : ""}
                  width={s.image.width}
                  height={s.image.height}
                  sizes="(max-width: 860px) 100vw, 55vw"
                  quality={85}
                  draggable={false}
                />
              </div>
            ))}
            <span className={styles.scan} aria-hidden="true" />
            {steps.map((s, i) =>
              s.swatches ? (
                <div key={`sw-${s.title}`} className={styles.swatches} data-show={i === active || undefined} aria-hidden="true">
                  {s.swatches.map((c, k) => (
                    <span key={c} style={{ background: c, "--k": k } as CSSProperties} />
                  ))}
                </div>
              ) : null,
            )}
            <span className={styles.badge} key={`b-${active}`} aria-hidden="true">
              {step.tag}
            </span>
          </div>

          {/* scrubber: drag to build the room yourself */}
          <div className={styles.scrub}>
            <div className={styles.scrubTrack}>
            <div className={styles.ticks} aria-hidden="true">
              {steps.map((s, i) => (
                <span key={s.title} data-on={i <= active || undefined} />
              ))}
            </div>
            <input
              ref={rangeRef}
              className={styles.range}
              type="range"
              min={0}
              max={n - 1}
              step={0.01}
              defaultValue={0}
              dir={rtl ? "rtl" : "ltr"}
              aria-label={labels.scrub}
              aria-valuetext={`${pad(active + 1)}: ${step.title}`}
              onPointerDown={() => {
                cancelAnimationFrame(tween.current);
                takeOver();
              }}
              onInput={(e) => {
                cancelAnimationFrame(tween.current);
                takeOver();
                apply(Number((e.target as HTMLInputElement).value));
              }}
              onChange={(e) => apply(Number(e.target.value))}
              // let go between stages and it settles on the nearest one
              onPointerUp={() => glide(Math.round(vRef.current), 500)}
              onKeyUp={() => glide(Math.round(vRef.current), 400)}
            />
            </div>
            <span className={styles.hint} data-hide={touched || undefined} aria-hidden="true">
              {labels.hint}
            </span>
          </div>
        </div>
      </figure>

      {/* the active stage, told in words */}
      <div className={styles.panel} id="story-panel" role="tabpanel" aria-labelledby={`story-tab-${active}`} aria-live={playing ? "off" : "polite"}>
        <div className={styles.panelInner} key={active}>
          <span className={styles.big} aria-hidden="true" dir="ltr">
            {pad(active + 1)}
          </span>
          <div>
            <h3 className={styles.panelTitle}>{step.title}</h3>
            <p className={styles.panelBody}>{step.body}</p>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.ctrl} onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={labels.prev}>
          <span className={styles.chev} data-dir="prev" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.play}
          onClick={() => {
            setTouched(true);
            setPlaying((p) => !p);
          }}
          aria-pressed={playing}
        >
          <span className={styles.playIcon} data-playing={playing || undefined} aria-hidden="true" />
          {playing ? labels.pause : labels.play}
        </button>
        <button type="button" className={styles.ctrl} onClick={() => goTo(active + 1)} disabled={active === n - 1} aria-label={labels.next}>
          <span className={styles.chev} data-dir="next" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
