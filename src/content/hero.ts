import type { L } from "./localized";

/**
 * The home banner: a drawing and the matching render or photograph, compared with a divider.
 * Editors can replace it in the Studio ("Home page banner"); this is the built-in default.
 */
export type HeroImages = {
  drawing: { src: string; width: number; height: number };
  image: { src: string; width: number; height: number };
  /** Whether the image is a 3D visualisation or a photograph of finished work. Sets the label. */
  kind: "visualised" | "built";
  alt: L;
  caption: L;
};

export const defaultHero: HeroImages = {
  drawing: { src: "/images/visualisations/living-feature-wide-drawing.jpg", width: 1024, height: 683 },
  image: { src: "/images/visualisations/living-feature-wide.jpg", width: 1024, height: 683 },
  kind: "visualised",
  alt: {
    en: "3D visualisation of a living room with a recessed feature ceiling, cove lighting, panelled media wall and a sofa set.",
    ar: "تصوّر ثلاثي الأبعاد لغرفة معيشة بسقف مميز غائر وإضاءة مخفية وجدار تلفاز مكسوّ بالألواح وطقم كنب.",
  },
  caption: {
    en: "A living room by our design team: the sketch and the 3D visualisation. Drag to compare.",
    ar: "غرفة معيشة من تصميم فريقنا: الرسم والتصوّر ثلاثي الأبعاد. اسحب للمقارنة.",
  },
};
