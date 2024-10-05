"use client";
import React, { useState } from "react";
import Link from 'next/link';
import styles from './Navbar.module.css';
import { MessageSquare } from "lucide-react";


export default function DesktopNavbar() {
  const [isUpdatesEnabled, setIsUpdatesEnabled] = useState(false);

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