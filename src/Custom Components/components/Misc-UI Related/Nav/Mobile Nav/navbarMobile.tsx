"use client";
import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import styles from "./MobileNav.module.css";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { ThemeContext } from "@/lib/Theming/ThemeContext"; // Import ThemeContext
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/Custom Components/components/Misc-UI Related/Theme Toggle/ThemeToggle";

export default function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext); // Access theme and toggle function
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  // Update dark mode state whenever theme changes
  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div
      className={`${styles.mobileNavbarContainer} ${
        isDarkMode ? styles.darkMode : styles.lightMode
      }`}
    >
      {/* Logo Section */}
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="/favicon.ico" alt="Logo" className={styles.logo} />
        </Link>
      </div>

      {/* Toggle Buttons Section */}
      <div className={styles.toggleButtonsContainer}>
        <DarkModeToggle />
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? (
            <AiOutlineClose style={{ color: "white" }} />
          ) : (
            <AiOutlineMenu style={{ color: "white" }} />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ""}`}>
        <ul className={styles.mobileNavList}>
          <li>
            <Link href="/" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/geneds" onClick={toggleMenu}>
              Gen-Eds
            </Link>
          </li>
          <li>
            <Link href="/feedback" onClick={toggleMenu}>
              Feedback
            </Link>
          </li>
          <li>
            <Link href="/blog" onClick={toggleMenu}>
              Blog
            </Link>
          </li>
          <li>
            <Link href="/2025/Spring" onClick={toggleMenu}>
              Full Catalog
            </Link>
          </li>
          <li>
            <Link href="/review" onClick={toggleMenu}>
              Submit Review
            </Link>
          </li>
          <li>
            <Link href="/support" onClick={toggleMenu}>
              Support Us
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
