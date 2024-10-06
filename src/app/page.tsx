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
import { Checkbox } from "@/components/ui/checkbox";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [useDescriptionSearch, setUseDescriptionSearch] = useState(false);
  const [useProfessorSearch, setUseProfessorSearch] = useState(false);
  const router = useRouter();
  const mainBoxRef = useRef<HTMLDivElement>(null);

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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;
      // Capitalize the input only when no filters are checked
      if (!useDescriptionSearch && !useProfessorSearch) {
        inputValue = inputValue.toUpperCase();
      }
      setSearch(inputValue);
    },
    [useDescriptionSearch, useProfessorSearch] // Adding the dependencies to re-run when filters change
  );

  const handleDescriptionCheckboxChange = () => {
    setUseDescriptionSearch((prevState) => !prevState);
  };

  const handleProfessorCheckboxChange = () => {
    setUseProfessorSearch((prevState) => !prevState);
  };

  const searchWithoutTerm = async (searchQuery: string) => {
    const mostRecentTerm = `${semesterConfigs[0].semester} ${semesterConfigs[0].year}`;
    const isSubjectSearch = !/\d{3}/.test(searchQuery);
    const formattedQuery = isSubjectSearch
      ? searchQuery
      : searchQuery.replace(/([a-zA-Z])(\d)/, "$1 $2");

    try {
      let apiUrl, url;
      if (useDescriptionSearch) {
        apiUrl = `https://uiuc-course-api-production.up.railway.app/description?query=${formattedQuery}&term=fall+2024`;
        url = `/titleSearch?searchQuery=${formattedQuery}`;
      } else if (useProfessorSearch) {
        apiUrl = `https://uiuc-course-api-production.up.railway.app/prof-search?query=${formattedQuery}+fall+2024`;
        url = `/professorSearch?searchQuery=${formattedQuery}`;
      } else {
        apiUrl = `https://uiuc-course-api-production.up.railway.app/search?query=${formattedQuery}+fall+2024`;
        url = isSubjectSearch
          ? `/subject?subject=${searchQuery}&term=${encodeURIComponent(
              mostRecentTerm
            )}`
          : `/class?class=${formattedQuery}&term=${encodeURIComponent(
              mostRecentTerm
            )}`;
      }

      const res = await fetch(apiUrl);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-800">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-xl bg-white/10 backdrop-blur-md shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Classify</h1>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              value={search}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && searchWithoutTerm(search)}
              className="w-full pl-10 pr-4 py-2 text-white bg-white/20 border-2 border-white/30 rounded-full focus:outline-none focus:border-white/50 placeholder:text-white text-lg"
              placeholder="Search for a class..."
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
          </div>

          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-3">Search Filters</h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 text-white">
                <Checkbox
                  id="descriptionSearch"
                  checked={useDescriptionSearch}
                  onCheckedChange={handleDescriptionCheckboxChange}
                />
                <span>Search courses by title</span>
              </label>
              <label className="flex items-center space-x-3 text-white">
                <Checkbox
                  id="professorSearch"
                  checked={useProfessorSearch}
                  onCheckedChange={handleProfessorCheckboxChange}
                />
                <span>Search by professor (last name)</span>
              </label>
            </div>
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
    </div>
  );
}
