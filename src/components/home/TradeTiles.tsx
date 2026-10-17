import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { drawings, tradeAnchor, tradeKeys, type TradeKey } from "@/content/drawings";
import styles from "./TradeTiles.module.css";

/**
 * The photo each tile wipes to. Illustrative stock photography from Unsplash (Unsplash License,
 * free for commercial use): design by Aalo Lens, ceilings by Shahabudin Ibragimov, partitions by
 * Nastuh Abootalebi, fit-out by Rick Barrett (Ambitious Studio). Swap in our own project photos
 * of similar quality when available.
 */
const tilePhotos: Record<TradeKey, { src: string; width: number; height: number; position?: string }> = {
  design: { src: "/images/services/design-living.jpg", width: 2400, height: 1350, position: "45% center" },
  ceilings: { src: "/images/services/ceilings-cove.jpg", width: 2400, height: 1600, position: "center 35%" },
  partitions: { src: "/images/services/partitions-glass.jpg", width: 2301, height: 1536 },
  fitOut: { src: "/images/services/fitout-panelled.jpg", width: 2400, height: 1600, position: "60% center" },
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
                quality={85}
                style={tilePhotos[t].position ? { objectPosition: tilePhotos[t].position } : undefined}
                sizes={i === 1 || i === 0 ? "(max-width: 560px) 100vw, (max-width: 1100px) 100vw, 50vw" : "(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 25vw"}
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
