import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // 85 is used for the home banner, where sharpness matters most.
    qualities: [75, 85],
    // Photos and logos uploaded in the Studio are served from Sanity's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/vj2fsewo/**" }],
  },
};

export default nextConfig;
