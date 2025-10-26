// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import PropTypes from 'prop-types';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tapcoin Game",
  description: "A fun tapping game for Telegram.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Monetag SDK */}
        <Script
          src="//libtl.com/sdk.js"
          data-zone="10096305"
          data-sdk="show_10096305"
          strategy="beforeInteractive"
        />
        
        {/* Adsterra Popunder */}
        <Script
          strategy="lazyOnload"
          src="//pl27930079.effectivegatecpm.com/5a/44/24/5a442401e422cbb4c44ee4c7b33226c0.js"
        />

        {/* Adsterra Social Bar */}
        <Script
          strategy="lazyOnload"
          src="//pl27930163.effectivegatecpm.com/d9/e8/c0/d9e8c095f5de17f27c37ccb3d8e15ea9.js"
        />
      </head>
      <body className={inter.className}>
        <main className="pb-20"> {/* Add padding-bottom to avoid overlap with nav */}
          {children}
        </main>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};