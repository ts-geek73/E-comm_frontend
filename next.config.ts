import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['plus.unsplash.com','images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',          
        hostname: 'img.clerk.com',  
        port: '',                   
        pathname: '/**',            
      },
    ],
  },
};

export default nextConfig;
