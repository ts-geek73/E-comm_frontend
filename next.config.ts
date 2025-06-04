import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '12f4-2405-201-2023-33bc-e4dd-1fc4-d917-b65c.ngrok-free.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.croma.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '5.imimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.lg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.samsung.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.croma.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.acer.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.lenovo.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.hp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'store.storeimages.cdn-apple.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.dell.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.asus.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.apple.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.microsoft.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.productz.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.jbl.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.sony.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.realme.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mi.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aws-obg-image-lb-1.tcl.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
