"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./DesignStory.module.css";

export type StoryStep = {
  title: string;
  body: string;
  image: { src: string; width: number; height: number; alt: string; kind: "drawing" | "photo" };
  tag: string;
};

/**
 * Four design stages told as the visitor scrolls: the text steps scroll past while the image
 * beside them stays pinned and changes with the active step. On narrow screens each step
 * simply shows its own image.
 */
export function DesignStory({ steps }: { steps: StoryStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      // a step becomes active as it crosses the middle band of the screen
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.story}>
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.pinned}>
          {steps.map((s, i) => (
            <div key={s.title} className={styles.visual} data-active={i === active || undefined} data-kind={s.image.kind}>
              <Image src={s.image.src} alt="" width={s.image.width} height={s.image.height} sizes="(max-width: 860px) 100vw, 50vw" />
              <span className={styles.tag}>{s.tag}</span>
            </div>
          ))}
          <div className={styles.progress}>
            {steps.map((s, i) => (
              <span key={s.title} data-done={i <= active || undefined} />
            ))}
          </div>
        </div>
      </div>

      <ol className={styles.steps}>
        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            data-active={i === active || undefined}
            className={styles.step}
          >
            <div className={styles.inlineVisual} data-kind={s.image.kind}>
              <Image src={s.image.src} alt={s.image.alt} width={s.image.width} height={s.image.height} sizes="100vw" />
            </div>
            <span className={styles.number} dir="ltr">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={styles.title}>{s.title}</h3>
            <p className={styles.body}>{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
