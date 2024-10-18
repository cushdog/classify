"use client";
import React from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useSession, signIn, signOut } from "next-auth/react";

export default function DesktopNavbar() {
  const { data: session, status } = useSession();

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
          <li>
            <Link href="/masterSubjList">Full Catalog</Link>
          </li>
          <li>
            {status === "loading" ? (
              <span>Loading...</span>
            ) : session ? (
              <div>
                <span>{session.user.name}</span>
                <button onClick={() => signOut()}>Sign Out</button>
              </div>
            ) : (
              <button onClick={() => signIn("google")}>Sign In with Google</button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}