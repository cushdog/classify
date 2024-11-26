// components/DarkModeToggle.tsx

"use client";

import React, { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeContext } from "@/lib/ThemeContext"; // Adjust the import path as needed

const DarkModeToggle: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext); // Access theme and toggleTheme from context

    return (
        <Button
            onClick={toggleTheme} // Use the context's toggleTheme function
            variant="ghost"
            aria-label="Toggle Dark Mode"
            className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
        >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    );
};

export default DarkModeToggle;
