"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./DrawingToReality.module.css";

type Props = {
  drawing: string;
  photo: string;
  width: number;
  height: number;
  alt: string;
  labels: { drawing: string; built: string; slider: string; hint: string };
};

/** Where the divider rests once the opening sequence ends (percent from the left). */
const REST = 50;

/**
 * The home page's signature moment: our drawing of a ceiling and the ceiling we built, stacked.
 * On load the drawing sketches in, then the photograph slides across to reveal the built room.
 * Afterwards the visitor can drag the divider (or use the arrow keys) to compare the two.
 * With reduced motion the sequence is skipped and the divider simply rests in the middle.
 */
export function DrawingToReality({ drawing, photo, width, height, alt, labels }: Props) {
  const [pos, setPos] = useState(100);
  const [phase, setPhase] = useState<"sketch" | "reveal" | "ready">("sketch");
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const sliderId = useId();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPos(REST);
      setPhase("ready");
      return;
    }
    const reveal = window.setTimeout(() => {
      setPhase("reveal");
      setPos(REST);
    }, 1500);
    const ready = window.setTimeout(() => setPhase("ready"), 1500 + 1400);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(ready);
    };
  }, []);

  const moveTo = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  };

  return (
    <div
      ref={frameRef}
      className={styles.frame}
      data-phase={phase}
      style={{ aspectRatio: `${width} / ${height}`, ["--pos" as string]: `${pos}%` }}
      onPointerDown={(e) => {
        dragging.current = true;
        setPhase("ready");
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image className={styles.drawing} src={drawing} alt="" width={width} height={height} sizes="(max-width: 860px) 100vw, 60vw" preload />
      <Image className={styles.photo} src={photo} alt={alt} width={width} height={height} sizes="(max-width: 860px) 100vw, 60vw" preload />

      <span className={styles.label} data-side="drawing" aria-hidden="true">
        {labels.drawing}
      </span>
      <span className={styles.label} data-side="built" aria-hidden="true">
        {labels.built}
      </span>

      <span className={styles.divider} aria-hidden="true">
        <span className={styles.handle}>
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>

      {/* The real control: a range input over the image, so keyboard and screen readers can compare too. */}
      <input
        id={sliderId}
        className={styles.range}
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        aria-label={labels.slider}
        aria-valuetext={`${Math.round(pos)}% ${labels.drawing}`}
        onChange={(e) => {
          setPhase("ready");
          setPos(Number(e.target.value));
        }}
      />
      <span className={styles.hint} aria-hidden="true">
        {labels.hint}
      </span>
    </div>
  );
}
