import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable trace file to avoid OneDrive permission issues
  experimental: {
    instrumentationHook: false,
  },
  // Disable telemetry
  telemetry: false,
};

export default nextConfig;
