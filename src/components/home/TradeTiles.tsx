import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { drawings, tradeAnchor, tradeKeys, type TradeKey } from "@/content/drawings";
import styles from "./TradeTiles.module.css";

/** The photo or render each tile wipes to; the sharpest image we have for each trade. */
const tilePhotos: Record<TradeKey, { src: string; width: number; height: number }> = {
  design: { src: "/images/visualisations/living-feature-wide.jpg", width: 1024, height: 683 },
  ceilings: { src: "/images/work/sys-star-coffer.jpg", width: 972, height: 679 },
  partitions: { src: "/images/work/part-demountable-glazed.jpg", width: 944, height: 750 },
  fitOut: { src: "/images/work/joinery-wall-unit.jpg", width: 947, height: 714 },
};

/**
 * Four tiles, one per trade. Each starts as our drawing and, as it scrolls into view, wipes
 * to the finished room (one after another). Pointing at a tile brings the drawing back.
 */
export async function TradeTiles() {
  const [{ home, trades }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <ul className={styles.tiles}>
      {tradeKeys.map((t, i) => (
        <li key={t} className={styles.tile} data-reveal="tile" style={{ "--reveal-i": i } as CSSProperties}>
          <Link href={href(locale, routes.services, tradeAnchor[t])} className={styles.link}>
            <span className={styles.frame}>
              <Image className={styles.drawing} src={drawings[t].src} alt="" width={480} height={360} unoptimized />
              <Image
                className={styles.photo}
                src={tilePhotos[t].src}
                alt=""
                width={tilePhotos[t].width}
                height={tilePhotos[t].height}
                sizes={i === 0 ? "(max-width: 1100px) 100vw, 50vw" : "(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 50vw"}
              />
            </span>
            <span className={styles.caption}>
              <span className={styles.title}>{trades[t].title}</span>
              <span className={styles.sub}>{home.tiles[t]}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
