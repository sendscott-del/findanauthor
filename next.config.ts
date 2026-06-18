import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow overriding the build output dir (used for sandboxed CI builds).
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
