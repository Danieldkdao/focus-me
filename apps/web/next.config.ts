import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/db"],
  cacheComponents: true,
  reactCompiler: true,
};

export default nextConfig;
