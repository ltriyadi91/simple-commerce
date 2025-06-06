import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://simple-commerce-s3.s3.ap-southeast-2.amazonaws.com/**')]
  }
};

export default nextConfig;
