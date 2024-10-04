"use client";
import React, { useState } from "react";
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isUpdatesEnabled, setIsUpdatesEnabled] = useState(false);

  return (
    <nav className={styles.navbar}>
    <ul className={styles.navList}>
      <li>
        <Link href="/wearable">Wearable</Link>
      </li>
      <li>
        <Link href="/neural">Neural</Link>
      </li>
      <li>
        <Link href="/programs">Programs</Link>
      </li>
      <li>
        <Link href="/updates">Updates</Link>
      </li>
      <li>
        <Link href="/search">Search</Link>
      </li>
    </ul>
  </nav>
  );
}