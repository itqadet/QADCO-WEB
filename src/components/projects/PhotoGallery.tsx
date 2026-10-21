"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./PhotoGallery.module.css";

export type GalleryPhoto = { src: string; width: number; height: number; caption: string };

type PhotoGalleryProps = {
  photos: GalleryPhoto[];
  rtl: boolean;
  labels: { openPhoto: string; label: string; prev: string; next: string; prevLabel: string; nextLabel: string; close: string; position: string };
};

/** Project photographs in a masonry-like column layout, opening into a keyboard-friendly lightbox. */
export function PhotoGallery({ photos, rtl, labels }: PhotoGalleryProps) {
  const [current, setCurrent] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const photo = photos[current];

  const open = (i: number) => {
    setCurrent(i);
    dialogRef.current?.showModal();
  };
  const step = (dir: 1 | -1) => setCurrent((c) => (c + dir + photos.length) % photos.length);

  return (
    <>
      <ul className={styles.grid}>
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              className={styles.tile}
              ref={(el) => {
                triggers.current[i] = el;
              }}
              onClick={() => open(i)}
              aria-label={`${labels.openPhoto}: ${p.caption}`}
            >
              <Image src={p.src} alt="" width={p.width} height={p.height} sizes="(max-width: 760px) 50vw, (max-width: 1000px) 33vw, 320px" />
            </button>
            <p className={styles.caption}>{p.caption}</p>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label={labels.label}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(rtl ? -1 : 1);
          if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
        }}
        onClose={() => triggers.current[current]?.focus()}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
      >
        <Image
          key={photo.src}
          className={styles.image}
          src={photo.src}
          alt={photo.caption}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 1032px) 100vw, 1000px"
        />
        <div className={styles.bar}>
          <p>
            {photo.caption}
            <span className={styles.position}>
              {labels.position.replace("{n}", String(current + 1)).replace("{total}", String(photos.length))}
            </span>
          </p>
          <div className={styles.controls}>
            <button type="button" aria-label={labels.prevLabel} onClick={() => step(-1)}>
              {labels.prev}
            </button>
            <button type="button" aria-label={labels.nextLabel} onClick={() => step(1)}>
              {labels.next}
            </button>
            <button type="button" onClick={() => dialogRef.current?.close()}>
              {labels.close}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
