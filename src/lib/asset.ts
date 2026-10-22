/**
 * Path to a file in public/ that is used without the image loader (an unoptimized <Image> or
 * a plain link). Adds the sub-folder prefix when the site lives in one (/preview on Bluehost);
 * on Vercel the prefix is empty and the path is returned unchanged.
 */
export function asset(src: string) {
  return src.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}` : src;
}
