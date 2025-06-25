import path from "path";
import { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@lib": path.resolve(__dirname, "src/lib")
    };
    return config;
  }
};

export default nextConfig;



