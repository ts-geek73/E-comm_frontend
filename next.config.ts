import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',          // Make sure the protocol is https
        hostname: 'img.clerk.com',  // The hostname of the image server
        port: '',                   // No port specified, so leave it as an empty string
        pathname: '/**',            // This pattern will match any pathname under img.clerk.com
      },
    ],
  },
};

export default nextConfig;
