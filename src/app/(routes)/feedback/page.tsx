"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Box, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/system';
import { ToastLib } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const GoogleFormPage: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedbackType: "",
    feedback: "",
  });

  // Dark mode initialization
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
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      feedbackType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const googleFormURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSczIeiz7eJcUZLWfW-N0hsDw5mCaS8KlHVnrUH0ogL0sQFg1g/formResponse";

    const submissionData = new FormData();
    submissionData.append("entry.966562401", formData.feedbackType);
    submissionData.append("entry.1715496086", formData.feedback);

    try {
      await fetch(googleFormURL, {
        method: "POST",
        body: submissionData,
        mode: "no-cors",
      });
      ToastLib.notifySuccess("Your feedback has been submitted!");
      setFormData({
        name: "",
        email: "",
        feedbackType: "",
        feedback: "",
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
      ToastLib.notifyError("An error occurred while submitting your feedback. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Box
        sx={{
          width: "100%",
          minHeight: isMobile ? "14em" : "200px",
          backgroundColor: isDarkMode ? "#1E3A8A" : "#3B82F6",
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
        {/* Top Bar with Back Button and Dark Mode Toggle */}
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
          Submit Feedback
        </Typography>
      </Box>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-none transition-colors duration-300">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Feedback Type<span className="text-red-500">*</span>
                </label>
                <Select
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400">
                    <SelectValue placeholder="Select Feedback Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comments">Comments</SelectItem>
                    <SelectItem value="Suggestions">Suggestions</SelectItem>
                    <SelectItem value="Questions">Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback Text */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Feedback<span className="text-red-500">*</span>
                </label>
                <Textarea
                  name="feedback"
                  id="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  required
                  placeholder="Share your thoughts with us..."
                  className="w-full min-h-[150px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg transition-all duration-200"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
              >
                Submit Feedback
              </Button>
            </form>

            {/* Footer Message */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Your feedback helps us improve our services.
                Thank you for taking the time to share your thoughts.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default GoogleFormPage;