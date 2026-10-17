"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
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
  labels: { stepsLabel: string; goTo: string };
};

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * One room, from sketch to built, told as the visitor scrolls. On wide screens the section
 * pins: each stage wipes across the last behind a line of warm cove light, so the drawing is
 * modelled, coloured and finally built in place, while the steps beside it follow along.
 * On narrow screens, and without JavaScript, the steps simply stack with their own images.
 */
export function DesignStory({ title, steps, rtl, labels }: DesignStoryProps) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const n = steps.length;

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const box = track.getBoundingClientRect();
    const run = box.height - window.innerHeight;
    const t = run > 0 ? clamp(-box.top / run) : 0;
    const seg = t * (n - 1);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let current = 0;
    for (let i = 1; i < n; i++) {
      // each change takes the middle 60% of its stretch; the rest holds the finished stage
      const raw = clamp((seg - (i - 1) - 0.2) / 0.6);
      const reveal = still ? (seg >= i - 0.5 ? 1 : 0) : ease(raw);
      track.style.setProperty(`--r${i}`, reveal.toFixed(4));
      if (reveal > 0.5) current = i;
    }
    track.style.setProperty("--t", t.toFixed(4));
    // the light line rides the edge of whichever stage is moving
    const moving = Math.min(n - 1, Math.max(1, Math.floor(seg - 0.2) + 1));
    const edge = parseFloat(track.style.getPropertyValue(`--r${moving}`) || "0");
    track.style.setProperty("--edge", edge.toFixed(4));
    track.style.setProperty("--edge-on", edge > 0.01 && edge < 0.99 ? "1" : "0");
    setActive(current);
  }, [n]);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  /** Jump the page to where a stage is fully shown. */
  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    // stacked layout (phones): just bring that step into view
    if (window.innerWidth <= 860) {
      track.querySelectorAll("li")[i]?.scrollIntoView({ block: "start" });
      return;
    }
    const top = track.getBoundingClientRect().top + window.scrollY;
    const run = track.offsetHeight - window.innerHeight;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + (run * i) / (n - 1), behavior: smooth ? "smooth" : "auto" });
  };

  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <div ref={trackRef} className={styles.track} data-rtl={rtl || undefined} style={{ "--n": n } as CSSProperties}>
      <div className={styles.pin}>
        <div className={styles.copy}>
          <h2 id="story-h" className={styles.heading}>
            {title}
          </h2>

          <div className={styles.counter} aria-hidden="true" dir="ltr">
            <span className={styles.big}>{pad(active + 1)}</span>
            <span className={styles.of}>/ {pad(n)}</span>
          </div>

          <ol className={styles.steps} aria-label={labels.stepsLabel}>
            {steps.map((s, i) => (
              <li key={s.title} className={styles.step} data-active={i === active || undefined} data-done={i < active || undefined}>
                <button
                  type="button"
                  className={styles.stepHead}
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "step" : undefined}
                  aria-label={`${labels.goTo}: ${s.title}`}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.num} dir="ltr">
                    {pad(i + 1)}
                  </span>
                  <span className={styles.title}>{s.title}</span>
                </button>
                <div className={styles.bodyWrap}>
                  <p className={styles.body}>{s.body}</p>
                </div>
                {/* phones: each step carries its own picture */}
                <div className={styles.inline}>
                  <Image src={s.image.src} alt={s.image.alt} width={s.image.width} height={s.image.height} sizes="100vw" />
                  <span className={styles.inlineTag}>{s.tag}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <figure className={styles.visual} aria-hidden="true">
          <div className={styles.sheet}>
            <div className={styles.frame}>
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  className={styles.layer}
                  data-layer={i}
                  style={i > 0 ? ({ "--r": `var(--r${i}, 0)` } as CSSProperties) : undefined}
                >
                  <Image
                    src={s.image.src}
                    alt=""
                    width={s.image.width}
                    height={s.image.height}
                    sizes="(max-width: 860px) 1px, 50vw"
                    quality={85}
                  />
                </div>
              ))}
              <span className={styles.scan} />
              {steps.map((s, i) =>
                s.swatches ? (
                  <div key={`sw-${s.title}`} className={styles.swatches} data-show={i === active || undefined}>
                    {s.swatches.map((c, k) => (
                      <span key={c} style={{ background: c, "--k": k } as CSSProperties} />
                    ))}
                  </div>
                ) : null,
              )}
            </div>
            <figcaption className={styles.strip}>
              <span className={styles.stripTag} key={active}>
                {steps[active].tag}
              </span>
              <span className={styles.stripCount} dir="ltr">
                {pad(active + 1)} / {pad(n)}
              </span>
            </figcaption>
            <div className={styles.rail}>
              <span />
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
}
