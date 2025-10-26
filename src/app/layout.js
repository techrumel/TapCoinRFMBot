// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // Next.js Script component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tapcoin Game",
  description: "A fun tapping game for Telegram.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Monetag/PropellerAds SDK Script */}
        <Script
          src="//libtl.com/sdk.js"
          data-zone="10096305" // আপনার জোন আইডি
          data-sdk="show_10096305" // আপনার SDK ফাংশন
          strategy="beforeInteractive" // পেজ লোড হওয়ার আগেই স্ক্রিপ্ট লোড হবে
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}