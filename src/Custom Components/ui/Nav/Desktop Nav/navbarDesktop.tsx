"use client";
import React from "react";
import Link from 'next/link';
import styles from './Navbar.module.css';


export default function DesktopNavbar() {

  return (
    <div className={styles.navbarContainer}>
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