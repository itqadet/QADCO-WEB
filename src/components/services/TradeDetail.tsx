import Image from "next/image";
import { tradeAnchor, tradeKeys, type TradeKey } from "@/content/drawings";
import { getDictionary } from "@/i18n/get-dictionary";
import { DrawingSheet } from "@/components/sections/DrawingSheet";
import { Container } from "@/components/ui/Container";
import styles from "./TradeDetail.module.css";

type TradeDetailProps = {
  trade: TradeKey;
  intro: string;
  photo?: { src: string; alt: string; width: number; height: number };
  children: React.ReactNode;
};

/**
 * A Services page section: the photo with the trade's drawing pinned over its corner, and the
 * details beside it under a large outlined number. Sides alternate from one trade to the next.
 */
export async function TradeDetail({ trade, intro, photo, children }: TradeDetailProps) {
  const { trades } = await getDictionary();
  const headingId = `${tradeAnchor[trade]}-h`;
  const index = tradeKeys.indexOf(trade);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id={tradeAnchor[trade]}
      className={styles.section}
      data-flip={index % 2 === 1 || undefined}
      aria-labelledby={headingId}
    >
      <Container className={styles.grid}>
        <div className={styles.media}>
          {photo ? (
            <Image
              className={styles.photo}
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          ) : null}
          <div className={styles.sheet}>
            <DrawingSheet trade={trade} />
          </div>
        </div>

        <div className={styles.text}>
          <p className={styles.num} dir="ltr" aria-hidden="true">
            {pad(index + 1)}
            <span> / {pad(tradeKeys.length)}</span>
          </p>
          <h2 id={headingId} className={styles.title}>
            {trades[trade].title}
          </h2>
          <p className={styles.intro}>{intro}</p>
          <div className={styles.card}>{children}</div>
        </div>
      </Container>
    </section>
  );
}
