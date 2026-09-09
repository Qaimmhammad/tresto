import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["tresto.loca.lt"],
  devIndicators: false 
};

export default nextConfig;
