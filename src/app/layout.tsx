import Providers from "@/providers/providers";
import type { Metadata, Viewport } from "next";
import { openSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streple | Copy Top Traders and Earn Smarter",
  description:
    "Mirror top traders in real time with Streple. Start trading like a pro in 3 simple steps — no experience needed. Copy verified experts, automate your trades, and earn smarter.",
  keywords: [
    "copy trading",
    "automated trading",
    "top traders",
    "crypto trading",
    "Streple",
    "mirror trades",
    "trading app",
    "earn with trading",
    "passive income",
    "crypto investing",
  ],
  openGraph: {
    title: "Streple | Copy Top Traders and Earn Smarter",
    description:
      "With Streple, you copy the exact trades of top-performing experts. Start earning with no experience — automate trades, manage risk, and grow smarter.",
    url: "https://streple.com",
    siteName: "Streple",
    images: [
      {
        url: "https://streple.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Streple - Copy Top Traders",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Streple | Copy Top Traders and Earn Smarter",
    description:
      "Start trading like a pro with Streple. No experience needed — copy top-performing experts and automate your trading journey.",
    images: ["https://streple.com/opengraph-image.png"],
    creator: "@StrepleNetwork",
  },
  metadataBase: new URL("https://streple.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${openSans.className} antialiased`}>{children}</body>
      </Providers>
    </html>
  );
}
