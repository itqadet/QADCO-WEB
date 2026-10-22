import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 (npm run build:static) builds plain HTML/CSS/JS for shared hosting
 * (Bluehost): no Node.js server, so no image optimisation, and pages end in a slash so Apache
 * serves each one as folder/index.html. The normal build is unchanged for Vercel.
 */
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStatic ? { output: "export", trailingSlash: true } : {}),
  images: {
    unoptimized: isStatic,
    // 85 is used for the home banner, where sharpness matters most.
    qualities: [75, 85],
    // Photos and logos uploaded in the Studio are served from Sanity's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/vj2fsewo/**" }],
  },
};

export default nextConfig;
