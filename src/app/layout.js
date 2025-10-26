import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // <-- Import Script

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tapcoin Game",
  description: "A fun tapping game for Telegram.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* --- 1. Monetag SDK (Rewarded Ad-er jonno) --- */}
        {/* Eke age load hote hoy */}
        <Script
          id="monetag-sdk"
          src="//libtl.com/sdk.js"
          data-zone="10096305"
          data-sdk="show_10096305"
          strategy="beforeInteractive" 
        />
        
        {/* --- 2. Adsterra Popunder (Aggressive) --- */}
        <Script
          id="adsterra-popunder"
          strategy="lazyOnload"
          src="//pl27930079.effectivegatecpm.com/5a/44/24/5a442401e422cbb4c44ee4c7b33226c0.js"
        />

        {/* --- 3. Adsterra Social Bar (Aggressive) --- */}
        <Script
          id="adsterra-social"
          strategy="lazyOnload"
          src="//pl27930163.effectivegatecpm.com/d9/e8/c0/d9e8c095f5de17f27c37ccb3d8e15ea9.js"
        />

        {/* --- 4. Monetag Vignette/Interstitial (Aggressive) --- */}
        {/* Page navigation-er majhe pop-up hobe */}
        <Script
          id="monetag-vignette"
          strategy="lazyOnload"
          src="https://gizokraijaw.net/vignette.min.js"
          data-zone="10092140"
        />
      </head>

      <body className={inter.className}>
        {/* BottomNav-er sathe overlap na korar jonno padding-bottom */}
        <main className="pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}