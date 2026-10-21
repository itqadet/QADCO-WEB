import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { drawings, tradeAnchor, tradeKeys, type TradeKey } from "@/content/drawings";
import { TileBuilder } from "./TileBuilder";
import styles from "./TradeTiles.module.css";

/**
 * The photo each tile rises to. Illustrative stock photography from Unsplash (Unsplash License,
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
 * "Built from the floor up": four tiles, one per trade. Each begins as our drawing; as it moves
 * up the screen the finished room rises over it behind a line of cove light (any device, from
 * scrolling). A button on each tile flips back to the drawing; pointing at a tile does too.
 */
export async function TradeTiles() {
  const [{ home, trades }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <TileBuilder className={styles.tiles}>
      {tradeKeys.map((t, i) => (
        <li key={t} className={styles.tile} style={{ "--i": i } as CSSProperties}>
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
                sizes={i < 2 ? "(max-width: 1100px) 100vw, 50vw" : "(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 25vw"}
              />
              <span className={styles.scan} aria-hidden="true" />
            </span>
            <span className={styles.stage} aria-hidden="true">
              <span data-when="drawn">{home.tileStage.drawn}</span>
              <span data-when="built">{home.tileStage.built}</span>
            </span>
            <span className={styles.caption}>
              <span className={styles.num} dir="ltr">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.title}>{trades[t].title}</span>
              <span className={styles.sub}>{home.tiles[t]}</span>
            </span>
          </Link>
          {/* a sibling of the link, not inside it: flips this tile between drawing and built */}
          <button type="button" className={styles.flip} data-flip-btn aria-pressed="false">
            <span className={styles.flipIcon} aria-hidden="true" />
            <span data-when="photo">{home.tileFlip.toDrawing}</span>
            <span data-when="drawing">{home.tileFlip.toBuilt}</span>
            <span className="visually-hidden">: {trades[t].title}</span>
          </button>
        </li>
      ))}
    </TileBuilder>
  );
}
