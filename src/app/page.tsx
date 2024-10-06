"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { semesterConfigs } from "@/lib/commonFunctions";
import { motion } from "framer-motion";
import { Search, Send } from "lucide-react";
import { Mulish } from "next/font/google";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const mainBoxRef = useRef<HTMLDivElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainBoxRef.current) {
      const mainBox = mainBoxRef.current;
      const windowHeight = window.innerHeight;
      const elementOffset = mainBox.getBoundingClientRect().top + window.scrollY;
      const scrollToY = elementOffset - windowHeight / 2;

      window.scrollTo({
        top: scrollToY,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (textSectionRef.current) {
      observer.observe(textSectionRef.current);
    }

    return () => {
      if (textSectionRef.current) {
        observer.unobserve(textSectionRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const searchWithoutTerm = async (searchQuery: string) => {
    const mostRecentTerm = `${semesterConfigs[0].semester} ${semesterConfigs[0].year}`;
    const isSubjectSearch = !/\d{3}/.test(searchQuery);
    const formattedQuery = isSubjectSearch
      ? searchQuery
      : searchQuery.replace(/([a-zA-Z])(\d)/, "$1 $2");

    try {
      const url = isSubjectSearch
        ? `/subject?subject=${searchQuery}&term=${encodeURIComponent(mostRecentTerm)}`
        : `/class?class=${formattedQuery}&term=${encodeURIComponent(mostRecentTerm)}`;

      const res = await fetch(
        `https://uiuc-course-api-production.up.railway.app/search?query=${formattedQuery}+fall+2024`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        router.push(url);
      } else {
        toast.error("No results found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-800 ${mulish.className}`}>
      <div className="flex flex-col md:flex-row space-x-0 md:space-x-10">
        <motion.div
          ref={mainBoxRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 rounded-xl bg-white/10 backdrop-blur-md shadow-xl"
        >
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Classify</h1>
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={search.toUpperCase()}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchWithoutTerm(search);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 text-white bg-white/20 border-2 border-white/30 rounded-full focus:outline-none focus:border-white/50 placeholder:text-white text-lg"
                placeholder="Search for a class or subject..."
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => searchWithoutTerm(search)}
                className="w-full bg-white text-purple-700 rounded-full py-2 font-semibold hover:bg-white/90 transition-colors duration-200"
              >
                <Send className="mr-2" size={18} />
                Search
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          ref={textSectionRef}
          initial={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, translateY: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center text-center text-white w-full max-w-[450px] md:max-w-[600px] mt-14 md:mt-0" // Added margin-top for mobile
        >
          <h2 className="text-2xl">Welcome to the Classify Page!</h2>
          <p className="mt-4">Here, you can search for classes and subjects easily.</p>
        </motion.div>
      </div>
    </div>
  );
}
