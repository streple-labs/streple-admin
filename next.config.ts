import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "streplestorage.s3.eu-north-1.amazonaws.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
