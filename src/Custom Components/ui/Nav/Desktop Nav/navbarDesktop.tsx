"use client";
import React, {useEffect} from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

function HighlightCurrent(curr_page: string) {
  const navLinks = document.querySelectorAll(`.${styles.navList} li a`);

  for (let i = 0; i < navLinks.length; i++) {
    let curr = navLinks[i] as HTMLElement;
    if (curr.textContent == curr_page) {
      //curr.classList.add("active");
      curr.style.color = "#0070f3";
    } else {
      //curr.classList.remove("active");
      curr.style.color = "black";
    }
  }
}

export default function DesktopNavbar() {

  //default highlight Home
  useEffect(() => {
    HighlightCurrent("Home");
  }, []);
  
  return (
    <header className={`${styles.navbarContainer} sticky top-0 z-50`}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="/favicon.ico" alt="Logo" className={styles.logo} onClick={() => HighlightCurrent("Home")}/>
        </Link>
      </div>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li>
            <Link href="/" onClick={() => HighlightCurrent("Home")}>Home</Link>
          </li>
          <li>
            <Link href="/geneds" onClick={() => HighlightCurrent("Gen-Eds")}>Gen-Eds</Link>
          </li>
          <li>
            <Link href="/feedback" onClick={() => HighlightCurrent("Feedback")}>Feedback</Link>
          </li>
          <li>
            <Link href="/tutorial" onClick={() => HighlightCurrent("Tutorial")}>Tutorial</Link>
          </li>
          <li>
            <Link href="/masterSubjList" onClick={() => HighlightCurrent("Full Catalog")}>Full Catalog</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}