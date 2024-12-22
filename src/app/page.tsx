"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Search, Book, Hash, ALargeSmall } from "lucide-react";
import { Mulish } from "next/font/google";
import { ToastLib } from "@/lib/Theming/toast";
import { semesterConfigs } from "@/lib/Library Functions and Clients/commonFunctions";

const mulish = Mulish({ subsets: ["latin"], weight: ["400", "700"] });

// Types for clarity
type SearchType = "class" | "title" | "professor" | "crn";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("class");
  const router = useRouter();

  useEffect(() => {
    // Show announcement toast once
    const hasSeenAnnouncement = localStorage.getItem("hasSeenAnnouncement");
    if (!hasSeenAnnouncement) {
      ToastLib.notifyAnnouncement(
        "🎉 We've been busy! Check out our new support page!"
      );
      localStorage.setItem("hasSeenAnnouncement", "true");
    }
  }, []);

  // Keep your original text formatting logic for class (uppercasing subject, etc.)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (searchType === "class") {
      value = value.toUpperCase();
      const match = value.match(/^([A-Z]+)(\d{0,3})$/);
      if (match) {
        value = `${match[1]}${match[2] ? " " + match[2] : ""}`;
      }
    }
    setSearch(value);
  };

  // ==================
  // Helper Functions
  // ==================
  // 1. Class Search: try each semester until found
  const performClassSearch = async (semester: string, year: string) => {
    const term = `${semester.toLowerCase()}+${year}`;
    const apiUrl = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
      search
    )}+${term}`;
    let redirectUrl = `/${year}/${semester}/${encodeURIComponent(search)}`;

    const threeNumbersCheck = /\d{3}/;
    // If we detect a 3-digit number, parse "SUBJ 123"
    if (threeNumbersCheck.test(search)) {
      const [subject, courseNumber] = search.split(" ");
      redirectUrl = `/${year}/${semester}/${encodeURIComponent(subject)}/${encodeURIComponent(
        courseNumber
      )}`;
    }

    try {
      console.log("API URL for Class Search:", apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.length > 0) {
        // We found a matching course in this semester
        router.push(redirectUrl);
        return true;
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
    return false;
  };

  // 2. CRN Search: also try each semester until found
  const performCRNSearch = async (semester: string, year: string) => {
    // The “crn-search” endpoint might also require a `term` param; adapt if needed
    const term = `${semester.toLowerCase()}+${year}`;
    const apiUrl = `https://uiuc-course-api-production.up.railway.app/crn-search?crn=${encodeURIComponent(
      search
    )}&term=${term}`;

    try {
      console.log("API URL for CRN Search:", apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();

      // If data is an array with length > 0, we likely have a match
      // Often `data[2]` = subject, `data[3]` = courseNumber
      // If your API returns an array of arrays, adapt accordingly
      if (Array.isArray(data) && data.length > 0) {
        const subject = data[2];
        const courseNumber = data[3];
        if (subject && courseNumber) {
          router.push(
            `/${year}/${semester}/${encodeURIComponent(subject)}/${encodeURIComponent(
              courseNumber
            )}`
          );
          return true;
        }
      }
    } catch (error) {
      console.error("Error fetching CRN data:", error);
    }
    return false;
  };

  // ============
  // Main Search
  // ============
  const handleSearch = useCallback(async () => {
    // Basic validation
    if (!search.trim()) {
      ToastLib.notifyError("Please enter a search term");
      return;
    }

    // -------------------------
    // A) Professor: direct push
    // -------------------------
    if (searchType === "professor") {
      router.push(
        `/searchResults?searchType=professor&searchQuery=${encodeURIComponent(search)}`
      );
      return;
    }

    // ---------------------
    // B) Title: direct push
    // ---------------------
    if (searchType === "title") {
      // We can pick the first config for "term" or do something else
      const { semester, year } = semesterConfigs[0];
      const termString = `${semester} ${year}`;
      router.push(
        `/searchResults?searchType=title&searchQuery=${encodeURIComponent(
          search
        )}&term=${encodeURIComponent(termString)}`
      );
      return;
    }

    // ----------------------
    // C) Class: old logic
    // ----------------------
    if (searchType === "class") {
      // Loop through each semester in semesterConfigs
      for (const { semester, year } of semesterConfigs) {
        const found = await performClassSearch(semester, year);
        if (found) {
          return; // Stop searching once we find a match
        }
      }
      // If we tried all semesters and nothing matched
      ToastLib.notifyError("No results found in any semester");
      return;
    }

    // ---------------------
    // D) CRN: old logic
    // ---------------------
    if (searchType === "crn") {
      for (const { semester, year } of semesterConfigs) {
        const found = await performCRNSearch(semester, year);
        if (found) {
          return;
        }
      }
      ToastLib.notifyError("No results found in any semester");
      return;
    }
  }, [search, searchType, router]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-800 ${mulish.className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-xl bg-white/10 backdrop-blur-md shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Classify
        </h1>

        <Tabs
          defaultValue="class"
          onValueChange={(value: string) => setSearchType(value as SearchType)}
          className="w-full mb-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="class"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              <Book className="w-4 h-4 mr-2" />
              Class
            </TabsTrigger>
            <TabsTrigger
              value="title"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              <ALargeSmall className="w-4 h-4 mr-2" />
              Title
            </TabsTrigger>
            <TabsTrigger
              value="professor"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              Professor
            </TabsTrigger>
            <TabsTrigger
              value="crn"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              <Hash className="w-4 h-4 mr-2" />
              CRN
            </TabsTrigger>
          </TabsList>

          <TabsContent value="class">
            <p className="text-white text-sm mb-2">
              Search for a class (e.g., CS 225) or subject (e.g., CS)
            </p>
          </TabsContent>
          <TabsContent value="title">
            <p className="text-white text-sm mb-2">
              Search for courses by title (e.g., Data Structures)
            </p>
          </TabsContent>
          <TabsContent value="professor">
            <p className="text-white text-sm mb-2">
              Search for a professor by their last name
            </p>
          </TabsContent>
          <TabsContent value="crn">
            <p className="text-white text-sm mb-2">
              Search for a course by its unique CRN
            </p>
          </TabsContent>
        </Tabs>

        {/* Search Input */}
        <div className="relative mb-4">
          <Input
            value={search}
            onChange={handleSearchChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && handleSearch()
            }
            className="w-full pl-10 pr-4 py-2 text-white bg-white/20 border-2 border-white/30 rounded-full focus:outline-none focus:border-white/50 placeholder:text-white/50 text-lg"
            placeholder={`Search by ${searchType}...`}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
            size={18}
          />
        </div>

        {/* Search Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSearch}
            className="w-full bg-white dark:text-white text-purple-700 dark:bg-homePageButtonDark rounded-full py-2 font-semibold hover:bg-white/90 transition-colors duration-200"
          >
            <Search className="mr-2" size={18} />
            Search
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
