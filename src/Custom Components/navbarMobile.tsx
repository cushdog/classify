"use client";
import React, { useState, useCallback } from "react";
import { useMediaQuery, Theme } from '@mui/material';

export default function MobileComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      {/*Mobile */}
      <nav className="">
        <div className="container px-6 py-5 flex items-center justify-between mx-auto relative">
          {/* Logo */}
          <a className="flex-shrink-0 px-5">
            <img
              src="/favicon.ico"
              alt="Classify"
              className="w-12 h-auto"
            />
          </a>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="text-gray-800 rounded bg-white py-2 px-4 hover:text-blue-600 transition">
            ☰
          </button>
          {isOpen && (
            <div
              className="fixed inset-0 bg-white opacity-30 z-40"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 bg-white shadow-lg rounded-lg transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-y-40" : "translate-y-full"
            } z-50`}
            style={{ zIndex: 50 }} // Ensure this value is higher than other elements on the page
          >
            <div className="container mx-auto px-6 py-5">
              <a href="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                Home
              </a>
              <a href="/feedback" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                Feedback
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
