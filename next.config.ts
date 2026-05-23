import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the IDE browser-preview proxy (127.0.0.1) to consume HMR resources.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
