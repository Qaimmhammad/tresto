import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["tresto.loca.lt"],
  devIndicators: false ,
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb"
    }
  }
};

export default nextConfig;
