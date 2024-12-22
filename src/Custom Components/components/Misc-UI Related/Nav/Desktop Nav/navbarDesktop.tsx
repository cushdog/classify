import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Moon,
  Sun,
  Rss,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeContext } from "@/lib/Theming/ThemeContext";
import styles from './Navbar.module.css';
import DarkModeToggle from "@/Custom Components/components/Misc-UI Related/Theme Toggle/ThemeToggle";

interface DropdownProps {
  isOpen: boolean;
  items: { label: string; href: string }[];
  isDarkMode: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  items,
  isDarkMode,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 py-3 bg-white dark:bg-gray-900 rounded-md shadow-lg z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "block px-6 py-3 text-base transition-colors duration-200",
            isDarkMode
              ? "text-white hover:bg-gray-800"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Courses",
    href: "/2025/Spring",
    icon: BookOpen,
    children: [
      { label: "Full Catalog", href: "/2025/Spring" },
      { label: "Gen-Eds", href: "/geneds" },
      { label: "Submit Review", href: "/review" },
    ],
  },
  {
    label: "Other",
    href: "/",
    icon: Rss,
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Feedback", href: "/feedback" },
    ],
  },
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const handleMouseEnter = (label: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
    }, 300); // 300ms delay before closing
    setTimeoutId(timeout);
  };

  return (
    <nav
      className={cn(
        "fixed top-4 left-0 right-0 mx-auto z-50 w-[calc(100%-2rem)] max-w-4xl",
        "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg rounded-full",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div className="flex justify-between items-center px-4 py-2">
        <Link href="/">
          <Image
            src="/favicon.ico"
            alt="Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
        </Link>

        <div className="flex justify-center space-x-2 flex-grow">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              {item.children ? (
                <button
                  className={cn(
                    styles.navLink,
                    isDarkMode ? styles.navLinkDark : '',
                    "flex items-center"
                  )}
                >
                  <item.icon
                    className={cn(
                      styles.navLinkIcon,
                      isDarkMode ? styles.navLinkIconDark : ''
                    )}
                  />
                  {item.label}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    styles.navLink,
                    isDarkMode ? styles.navLinkDark : '',
                    "flex items-center"
                  )}
                >
                  <item.icon
                    className={cn(
                      styles.navLinkIcon,
                      isDarkMode ? styles.navLinkIconDark : ''
                    )}
                  />
                  {item.label}
                </Link>
              )}
              {item.children && (
                <Dropdown
                  isOpen={openDropdown === item.label}
                  items={item.children}
                  isDarkMode={isDarkMode}
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
