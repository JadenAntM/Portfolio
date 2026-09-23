import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves static files and does not provide a Next.js runtime.
  output: "export",
  poweredByHeader: false,
  images: {
    // Static exports cannot use Next.js's server-side image optimizer.
    unoptimized: true,
  },
};

export default nextConfig;
