import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "streplestorage.s3.eu-north-1.amazonaws.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "d38slanwovjv7z.cloudfront.net",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
