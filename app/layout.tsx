import type { Metadata } from "next";
import HeadBar from "@/components/Header/Headbar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { ToastContainer } from "react-toastify";
import { StrictMode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      data-new-gr-c-s-check-loaded="14.1223.0"
      data-gr-ext-installed="">
      <StrictMode>
        <html lang="en" suppressHydrationWarning>
          <head>
            <title>Google Sign-In</title>
            <script src="https://accounts.google.com/gsi/client" async defer></script>
          </head>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <HeadBar />
            <header className="flex justify-end items-center"></header >
            {children}
            <ToastContainer />
          </body>
        </html>
      </StrictMode>
    </ClerkProvider >
  );
}
