import { useState } from 'react';
import Link from 'next/link';
import styles from './MobileNav.module.css'; // Import the CSS module

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      <button className={styles.hamburger} onClick={toggleMenu}>
        <div className={`${styles.bar} ${isOpen ? styles.bar1Open : ''}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.bar2Open : ''}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.bar3Open : ''}`}></div>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <nav className={styles.navMenu}>
            <Link href="/">
              <a className={styles.navLink}>Home</a>
            </Link>
            <Link href="/about">
              <a className={styles.navLink}>About</a>
            </Link>
            <Link href="/services">
              <a className={styles.navLink}>Services</a>
            </Link>
            <Link href="/contact">
              <a className={styles.navLink}>Contact</a>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
