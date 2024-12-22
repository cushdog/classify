"use client";

import React, { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeContext } from "@/lib/Theming/ThemeContext"; // Adjust the import path as needed

const DarkModeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      aria-label="Toggle Dark Mode"
      // Conditionally set text color based on theme
      className={`transition-colors duration-300 ${
        theme === "dark"
          ? "text-white hover:text-gray-300"
          : "text-black"
      }`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
};

export default DarkModeToggle;
