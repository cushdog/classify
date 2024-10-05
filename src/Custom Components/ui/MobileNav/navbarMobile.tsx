"use client";
import React, { useState } from "react";
import Link from 'next/link';
import styles from './MobileNav.module.css';

export default function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <div className={styles.mobileNavbarContainer}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="./favicon.ico" alt="Logo" className={styles.logo} />
        </Link>
      </div>
      <button className={styles.menuToggle} onClick={toggleMenu}>
        {isMenuOpen ? '✖' : '☰'}
      </button>
      <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavList}>
          <li>
            <Link href="/" onClick={toggleMenu}>Home</Link>
          </li>
          <li>
            <Link href="/geneds" onClick={toggleMenu}>Gen-Eds</Link>
          </li>
          <li>
            <Link href="/feedback" onClick={toggleMenu}>Feedback</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}