import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  BookImage,
  Moon,
  Sun,
  Rss,
  MessageSquareMore,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeContext } from "@/lib/ThemeContext";
import styles from './Navbar.module.css'; // Import the CSS module
import { MdRateReview } from "react-icons/md";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Full Catalog", href: "/2025/Spring", icon: BookImage },
  { label: "Blog", href: "/blog", icon: Rss },
  { label: "Feedback", href: "/feedback", icon: MessageSquareMore },
  { label: "Submit Review", href: "/review", icon: MdRateReview },
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  return (
    <nav
      className={cn(
        "fixed top-4 left-0 right-0 mx-auto z-50 w-[calc(100%-2rem)] max-w-4xl",
        "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg rounded-full",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div className="flex justify-between items-center px-4 py-2">
        {/* Logo Area */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 dark:text-white hover:text-blue-600 transition-colors"
        >
          <Image
            src="/favicon.ico"
            alt="MyPortfolio Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu className="flex-grow">
          <NavigationMenuList className="flex justify-center space-x-2">
            {NAV_ITEMS.map((item) => (
              <NavigationMenuItem key={item.label}>
                <Link href={item.href} passHref legacyBehavior>
                  <NavigationMenuLink
                    className={`
                      ${styles.navLink} 
                      ${isDarkMode ? styles.navLinkDark : ''}
                      group
                    `}
                  >
                    <item.icon
                      className={`
                        ${styles.navLinkIcon} 
                        ${isDarkMode ? styles.navLinkIconDark : ''}
                      `}
                    />
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Theme Toggle & CTA */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;