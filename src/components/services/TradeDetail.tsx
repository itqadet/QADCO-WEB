import Image from "next/image";
import { tradeAnchor, type TradeKey } from "@/content/drawings";
import { getDictionary } from "@/i18n/get-dictionary";
import { DrawingSheet } from "@/components/sections/DrawingSheet";
import { Container } from "@/components/ui/Container";
import { Split } from "@/components/ui/Split";
import styles from "./TradeDetail.module.css";

type TradeDetailProps = {
  trade: TradeKey;
  intro: string;
  photo?: { src: string; alt: string; width: number; height: number };
  children: React.ReactNode;
};

/** A Services page section: photo and drawing sheet on one side, details on the other. */
export async function TradeDetail({ trade, intro, photo, children }: TradeDetailProps) {
  const { trades } = await getDictionary();
  const headingId = `${tradeAnchor[trade]}-h`;

  return (
    <section id={tradeAnchor[trade]} className={styles.section} aria-labelledby={headingId}>
      <Container>
        <Split>
          <div className={styles.media}>
            {photo ? (
              <Image
                className={styles.photo}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 860px) 100vw, 45vw"
              />
            ) : null}
            <DrawingSheet trade={trade} />
          </div>
          <div>
            <h2 id={headingId}>{trades[trade].title}</h2>
            <p>{intro}</p>
            {children}
          </div>
        </Split>
      </Container>
    </section>
  );
}
