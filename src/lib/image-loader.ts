/**
 * Image loader for the static (Bluehost) build, which has no image server. Files are served
 * as they are; local paths get the sub-folder prefix when the site lives in one (/preview).
 * The width is added as a harmless query so each srcset entry is distinct.
 */
export default function staticImageLoader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith("/")) return src;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}?w=${width}`;
}
