import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import theme from "@/lib/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RealNavbar from "@/Custom Components/ui/Nav/navbar";
import Script from "next/script";
import "./globals.css";
import ClientOnlyToastContainer from "@/lib/clientToast";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  display: "swap",
  variable: "--font-mulish",
});

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
    <html lang="en" className={mulish.variable}>
      <head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="40840f54-8943-4182-b05a-655053624927"></Script>
      </head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-CJX91GC6JV"
      ></Script>
      <Script id="google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-CJX91GC6JV');
          `}
      </Script>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RealNavbar />
          {children}
          {/* Add ToastContainer here for react-toastify */}
          <ClientOnlyToastContainer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}