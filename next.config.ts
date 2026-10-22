import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 (npm run build:static) builds plain HTML/CSS/JS for shared hosting
 * (Bluehost): no Node.js server, so images are served as they are, and pages end in a slash
 * so Apache serves each one as folder/index.html. The normal build is unchanged for Vercel.
 */
const isStatic = process.env.STATIC_EXPORT === "1";
/** For a site in a sub-folder, e.g. qasralandalusco.com/preview: BASE_PATH=/preview */
const basePath = isStatic ? (process.env.BASE_PATH ?? "").replace(/\/$/, "") : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStatic ? { output: "export", trailingSlash: true, basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    ...(isStatic ? { loader: "custom", loaderFile: "./src/lib/image-loader.ts" } : {}),
    // 85 is used for the home banner, where sharpness matters most.
    qualities: [75, 85],
    // Photos and logos uploaded in the Studio are served from Sanity's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/vj2fsewo/**" }],
  },
};

export default nextConfig;
