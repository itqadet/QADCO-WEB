import Image from "next/image";
import { getDictionary } from "@/i18n/get-dictionary";
import { drawings, DRAWING_HEIGHT, DRAWING_WIDTH, type TradeKey } from "@/content/drawings";
import styles from "./DrawingSheet.module.css";

/** A trade drawing presented as a sheet with an architectural title block. */
export async function DrawingSheet({ trade }: { trade: TradeKey }) {
  const { trades, drawingsAlt } = await getDictionary();
  const drawing = drawings[trade];

  return (
    <figure className={styles.sheet}>
      <Image
        src={drawing.src}
        alt={drawingsAlt[trade]}
        width={DRAWING_WIDTH}
        height={DRAWING_HEIGHT}
        unoptimized
      />
      <figcaption className={styles.titleBlock}>
        <span>
          <strong>{trades[trade].sheetTitle}</strong>
        </span>
        <span dir="ltr">{drawing.code}</span>
        <span dir="ltr">{drawing.scale}</span>
      </figcaption>
    </figure>
  );
}
