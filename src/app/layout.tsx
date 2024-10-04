import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const mulish = Mulish({ subsets: ["latin"], weight: ["200", "400", "700"], display: "swap" });


export const metadata: Metadata = {
  title: "Classify",
  description: "A redo of the old course explorer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className={mulish.className}>
        <Toaster position="top-left" reverseOrder={false} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
