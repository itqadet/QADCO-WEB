import Image from "next/image";
import styles from "./CaptionedImage.module.css";

type CaptionedImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Crop ratio for the frame, e.g. "4 / 5". Defaults to the photo's own ratio. */
  ratio?: string;
  sizes?: string;
  preload?: boolean;
  className?: string;
};

export function CaptionedImage({
  src,
  alt,
  width,
  height,
  caption,
  ratio,
  sizes = "(max-width: 860px) 100vw, 45vw",
  preload,
  className,
}: CaptionedImageProps) {
  return (
    <figure className={className ? `${styles.figure} ${className}` : styles.figure}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        preload={preload}
        className={styles.image}
        style={{ aspectRatio: ratio ?? `${width} / ${height}` }}
      />
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
