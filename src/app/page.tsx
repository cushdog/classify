"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Search, Book, UserCircle, Hash, ALargeSmall } from "lucide-react";
import { Mulish } from "next/font/google";
import { ToastLib } from "@/lib/toast";
import { semesterConfigs } from "@/lib/commonFunctions";

const mulish = Mulish({ subsets: ["latin"], weight: ["400", "700"] });

type SearchType = "class" | "title" | "professor" | "crn";

interface SearchConfig {
  apiUrl: string;
  redirectUrl: string;
}

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("class");
  const router = useRouter();

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

  const handleSearch = useCallback(async () => {
    if (!search.trim()) {
      ToastLib.notifyError("Please enter a search term");
      return;
    }
  
    console.log("Search Type:", searchType);
  
    const performClassSearch = async (semester: string, year: string) => {
      const term = `${semester.toLowerCase()}+${year}`;
      const apiUrl = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
        search
      )}+${term}`;
      let redirectUrl = `/${year}/${semester}/${encodeURIComponent(search)}`;
  
      const threeNumbersCheck = /\d{3}/;
  
      if (threeNumbersCheck.test(search)) {
        const [subject, courseNumber] = search.split(" ");
        redirectUrl = `/${year}/${semester}/${encodeURIComponent(
          subject
        )}/${encodeURIComponent(courseNumber)}`;
      }
  
      try {
        console.log("API URL for Class Search:", apiUrl);
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data && data.length > 0) {
          router.push(redirectUrl);
          return true;
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
      return false;
    };
  
    // Function to perform other types of searches for a specific semester
    const performOtherSearch = async (semester: string, year: string) => {
      const term = `${semester.toLowerCase()}+${year}`;
      const getSearchConfig = (): SearchConfig | undefined => {
        switch (searchType) {
          case "title":
            return {
              apiUrl: `https://uiuc-course-api-production.up.railway.app/description?query=${search}&term=${term}`,
              redirectUrl: `/titleSearch?searchQuery=${encodeURIComponent(
                search
              )}&term=${encodeURIComponent(`${semester} ${year}`)}`,
            };
          case "professor":
            return {
              apiUrl: `https://uiuc-course-api-production.up.railway.app/prof-search?query=${search}+${term}`,
              redirectUrl: `/professorSearch?searchQuery=${encodeURIComponent(
                search
              )}&term=${encodeURIComponent(`${semester} ${year}`)}`,
            };
          case "crn":
            return {
              apiUrl: `https://uiuc-course-api-production.up.railway.app/crn-search?crn=${search}+${term}`,
              redirectUrl: "", // CRN redirect logic remains unchanged
            };
          default:
            return undefined;
        }
      };
  
      const searchConfig = getSearchConfig();
  
      if (searchConfig) {
        const { apiUrl, redirectUrl } = searchConfig;
        try {
          console.log("API URL for Other Search:", apiUrl);
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data && data.length > 0) {
            if (searchType === "crn") {
              const subject = data[2];
              const courseNumber = data[3];
              router.push(
                `/${year}/${semester}/${encodeURIComponent(
                  subject
                )}/${encodeURIComponent(courseNumber)}`
              );
            } else {
              router.push(redirectUrl);
            }
            return true;
          }
        } catch (error) {
          console.error("Error fetching other search data:", error);
        }
      }
  
      return false;
    };
  
    // Handle other search types: class, title, professor, crn
    for (const { semester, year } of semesterConfigs) {
      const found = await performClassSearch(semester, year);
      if (found) {
        return; // Stop if a result is found
      }
    }
  
    // Handle title, professor, crn searches
    for (const { semester, year } of semesterConfigs) {
      const found = await performOtherSearch(semester, year);
      if (found) return; // Stop if a result is found
    }
  
    // If no results are found after checking all semesters
    ToastLib.notifyError("No results found in any semester");
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
              <UserCircle className="w-4 h-4 mr-2" />
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
              Search for courses by professor&apos;s last name
            </p>
          </TabsContent>
          <TabsContent value="crn">
            <p className="text-white text-sm mb-2">
              Search for a course by its unique CRN
            </p>
          </TabsContent>
        </Tabs>

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

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSearch}
            className="w-full bg-white text-purple-700 rounded-full py-2 font-semibold hover:bg-white/90 transition-colors duration-200"
          >
            <Search className="mr-2" size={18} />
            Search
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
