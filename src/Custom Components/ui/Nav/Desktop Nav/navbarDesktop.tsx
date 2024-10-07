"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useEffect } from "react";

export default function DesktopNavbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100); // Delay before showing the navbar
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <header className={`${`${styles.navbarContainer} sticky top-0 z-50`} ${fadeIn ? 'fade-in' : ''}`}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <img src="./favicon.ico" alt="Logo" className={styles.logo} />
          </Link>
        </div>
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/geneds">Gen-Eds</Link>
              </li>
              <li>
                <Link href="/masterSubjList">Full Catalog</Link>
          </li>
          <li className={styles.dropdown}>
            <button 
              className={styles.dropdownToggle}
              onClick={toggleDropdown}
            >
              {isDropdownOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu} onClick={closeDropdown}>
                <li>
                  <Link href="/tutorial" onClick={closeDropdown}>Tutorial</Link>
                </li>
                <li>
                  <Link href="/feedback" onClick={closeDropdown}>Feedback</Link>
                </li>
              </ul>
            )}
              </li>
            </ul>
        </nav>
    </header>
  );
}
