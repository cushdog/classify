"use client";
import React, { useState, useCallback } from "react";

export default function RealNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      {/*Mobile */}
      <div className="block md:hidden">
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
                className="fixed inset-0 bg-black opacity-30 z-40"
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
                <a href="/class" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                  Class Home
                </a>
                <a href="/subject" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                  Subject
                </a>
                <a href="/feedback" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                  Feedback
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <nav className="hidden md:block">
        {/* Navbar container for Desktop*/}
        <div className="container px-6 py-5 flex flex-col md:flex-row items-center justify-center mx-auto">
          {/* Navigation Links and Logo */}
          <div className="">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Logo */}
              <a className="flex-shrink-0 px-5">
                <img
                  src="/favicon.ico"
                  alt="Classify"
                  className="w-12 h-auto"
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
                    <a href="/class" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-full">
                      Class Home
                    </a>
                    <a href="/subject" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-full">
                      Subject
                    </a>
                    <a href="/feedback" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-full">
                      Feedback
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
