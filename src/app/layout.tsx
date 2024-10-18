import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import theme from "@/lib/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RealNavbar from "@/Custom Components/ui/Nav/navbar";
import Head from "next/head";
import "./globals.css";
import ClientOnlyToastContainer from "@/lib/clientToast";
import AuthProvider from "@/Custom Components/Misc/Auth Provider/page";

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
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        
      </Head>
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RealNavbar />
            {children}
            <ClientOnlyToastContainer />
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}