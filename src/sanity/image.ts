import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** A Sanity image field as returned by our queries, with the asset's original size. */
export type SanityImage = {
  asset: { _ref?: string; _id?: string; url?: string; originalFilename?: string; metadata?: { dimensions?: { width: number; height: number } } };
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; width: number; height: number };
};

/**
 * Resolves a Sanity image into a URL plus the width and height of the (cropped) result,
 * so next/image can reserve the right space. Large uploads are capped at `maxWidth`.
 */
export function resolveImage(image: SanityImage, maxWidth = 1600) {
  const dims = image.asset.metadata?.dimensions ?? { width: 1200, height: 800 };
  const crop = image.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const cropW = Math.round(dims.width * (1 - crop.left - crop.right));
  const cropH = Math.round(dims.height * (1 - crop.top - crop.bottom));
  const width = Math.min(cropW, maxWidth);
  const height = Math.round((cropH * width) / cropW);
  const src = builder.image(image).width(width).fit("max").auto("format").url();
  return { src, width, height };
}
