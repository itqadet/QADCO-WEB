/** The technical drawings used as trade illustrations, with their title-block codes. */
export const drawings = {
  design: { src: "/images/drawings/plan-interior.svg", code: "ID 00", scale: "1:50" },
  ceilings: { src: "/images/drawings/rcp-ceiling.svg", code: "RCP 01", scale: "1:50" },
  partitions: { src: "/images/drawings/plan-partitions.svg", code: "PL 02", scale: "1:50" },
  fitOut: { src: "/images/drawings/elev-panelling.svg", code: "EL 03", scale: "1:25" },
} as const;

export type TradeKey = keyof typeof drawings;
export const tradeKeys = Object.keys(drawings) as TradeKey[];

/** The building trades shown as rows on the home page; design has its own story section there. */
export const buildTrades = ["ceilings", "partitions", "fitOut"] as const satisfies readonly TradeKey[];
export type BuildTrade = (typeof buildTrades)[number];

/** Anchor ids of each trade's section on the Services page. */
export const tradeAnchor: Record<TradeKey, string> = {
  design: "design",
  ceilings: "ceilings",
  partitions: "partitions",
  fitOut: "fit-out",
};

export const DRAWING_WIDTH = 480;
export const DRAWING_HEIGHT = 360;
