import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'plus.unsplash.com',
      'images.unsplash.com',
      'm.media-amazon.com',
      'upload.wikimedia.org',
      'media.croma.com',
      '5.imimg.com',
      'www.lg.com',
      'www.samsung.com',
      'www.croma.com',
      'www.acer.com',
      "plus.unsplash.com",
      'www.lenovo.com',
      'www.hp.com',
      'www.dell.com',
      'www.asus.com',
      'www.apple.com',
      'www.microsoft.com',
      'i0.wp.com',
      'encrypted-tbn0.gstatic.com',
      'cdn.shopify.com',
      'img.productz.com',
      'www.jbl.com',
      'www.sony.com',
      'www.samsung.com',
      'www.realme.com',
      'www.mi.com',
      'aws-obg-image-lb-1.tcl.com',
      'example.com',
      'img.clerk.com',
    ],
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
