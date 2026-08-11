import type { NextConfig } from "next";

/**
 * No `vercel.json` is needed: a stock App Router project requires no custom
 * routing, and headers belong here instead, where they apply on any host rather
 * than only on Vercel.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    /**
     * TODO(jaden): temporary. This exists only for the placeholder project
     * images in `data/projects.ts`. Real screenshots belong in `public/`, and
     * this entry should be deleted with the last placeholder — an open remote
     * pattern is a way to end up proxying someone else's images through your
     * own optimizer.
     */
    remotePatterns: [{ protocol: "https", hostname: "placehold.co" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
