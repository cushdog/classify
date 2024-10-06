"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function DesktopNavbar() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100); // Delay before showing the navbar
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <div className={`${styles.navbarContainer} ${fadeIn ? 'fade-in' : ''}`}>
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
            <Link href="/feedback">Feedback</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
