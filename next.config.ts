import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api-bigboy.duthanhduoc.com",
        port: "", // HTTPS mặc định không cần port, để rỗng cũng được
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
