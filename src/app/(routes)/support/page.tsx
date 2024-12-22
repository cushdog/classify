"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiCashapp } from "react-icons/si";
import { IoLogoVenmo } from "react-icons/io5";

/**
 * Example "Support Us" page supporting light/dark mode.
 */
const SupportUsPage: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Tracks dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On mount, read theme from localStorage or system preferences.
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header area with a gradient or solid background */}
      <Box
        sx={{
          width: "100%",
          minHeight: isMobile ? "14em" : "200px",
          backgroundColor: isDarkMode ? "#1E3A8A" : "#3B82F6", // Tailwind-like colors
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          color: "#fff",
        }}
        className="transition-colors duration-300"
      >
        {/* Top Bar with Back Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "2rem" },
            marginTop: "1rem",
          }}
        >
          Support Us
        </Typography>
      </Box>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-none transition-colors duration-300">
          <CardContent className="p-8 space-y-6">
            {/* Message */}
            <Typography
              variant="body1"
              className="text-gray-900 dark:text-gray-100 transition-colors duration-300"
            >
              Hey there! We&apos;ve poured countless hours (and cups of coffee) into
              making this the easiest way for you to discover your perfect
              classes. Whether you&apos;re trying to plan next semester&apos;s schedule,
              looking for that one amazing professor everyone talks about, or
              just exploring what courses are out there—we want to make your
              class search actually enjoyable. If our search engine has helped
              you find that perfect elective, discover a new favorite subject,
              or just made registration season a little less stressful, consider
              buying us a virtual coffee! Your support helps us keep improving
              our class finder and adding new features to make your course
              planning even easier. Every contribution, no matter how small,
              helps cover our hosting costs and keeps us running smoothly.
            </Typography>

            {/* Support Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
              >
                <a
                  href="https://account.venmo.com/pay?amount=1&note=Donation!&recipients=ClassifyUIUC&txn=pay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <IoLogoVenmo className="h-5 w-5" />
                  <span>Support via Venmo</span>
                </a>
              </Button>
              <Button
                asChild
                className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
              >
                <a
                  href="https://cash.app/$ClassifyUIUC/1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <SiCashapp className="h-5 w-5" />
                  <span>Support via CashApp</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SupportUsPage;
