import { GetCommonMetadata } from "@/constant/seo";
import CustomeProvider from "@/context/client";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StrictMode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    ...GetCommonMetadata({
      title: "E-Commerce",
      description: "Create Next.js E-Commerce App",
    }),
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const queryClient =new QueryClient()
  // const landBotUrl = process.env.NEXT_PUBLIC_LANDBOT_URL
  return (
    <ClerkProvider
      data-new-gr-c-s-check-loaded="14.1223.0"
      data-gr-ext-installed=""
    >
      <StrictMode>
        <html lang="en" suppressHydrationWarning>
          <head>
            <title>E-commerce</title>
            <script
              src="https://accounts.google.com/gsi/client"
              async
              defer
            ></script>
          </head>
          <body
            className={`${geistSans.variable} relative ${geistMono.variable} antialiased`}
          >
            <CustomeProvider>{children}</CustomeProvider>
          </body>
        </html>
      </StrictMode>
    </ClerkProvider>
  );
}
