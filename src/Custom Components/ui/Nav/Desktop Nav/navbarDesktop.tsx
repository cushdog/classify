"use client";
import React from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function DesktopNavbar() {
  return (
    <header className={`${styles.navbarContainer} sticky top-0 z-50`}>
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
          <li>
            <Link href="/tutorial">Tutorial</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}