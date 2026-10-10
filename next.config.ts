import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lenis"],
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
