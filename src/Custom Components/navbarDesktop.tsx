"use client";
import React, { useState, useCallback } from "react";

export default function DesktopComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
    {/* Navigation Links and Logo */}
        <nav className="container px-6 py-5 md:flex-row items-center justify-center mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Logo */}
                <a className="flex-shrink-0 px-5">
                <img
                    src="/favicon.ico"
                    alt="Classify"
                    className="w-10 h-10"
                />
                </a>

                {/* Navigation Links */}
                <div className="hidden bg-white rounded-full py-3 px-5 md:flex items-center space-x-6 flex-grow justify-center">
                <a href="/" className="text-gray-800 hover:text-blue-600 transition">
                    Home
                </a>
                {/* Dropdown Menu Button */}
                <div className="relative group">
                    <button className="text-gray-800 hover:text-blue-600 transition">
                    ☰
                    </button>
                    {/* Dropdown Menu */}
                    <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href="/feedback" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-full">
                        Feedback
                    </a>
                    </div>
                </div>
                </div>
            </div>
        </nav>
    </div>
  );
}
