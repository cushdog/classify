"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Search,
  Book,
  UserCircle,
  Hash,
  ALargeSmall,
  Star,
} from "lucide-react";
import { Mulish } from "next/font/google";
import { ToastLib } from "@/lib/toast";
import { semesterConfigs } from "@/types/commonTypes";

const mulish = Mulish({ subsets: ["latin"], weight: ["400", "700"] });

type SearchType =
  | "class"
  | "title"
  | "professor"
  | "crn"
  | "reviewByClass"
  | "reviewByProfessor";

interface SearchConfig {
  apiUrl: string;
  redirectUrl: string;
}

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState<string>("class");
  const router = useRouter();

  useEffect(() => {
    ToastLib.notifyAnnouncement(
      "Announcement: 2025 classes are live! 🎉 If you want to see a past course offering, click/tap on the calendar icon on a class page, and pick the term you wish to view"
    );
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (searchType === "class" || searchType === "reviewByClass") {
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
  
    // Function to perform review search by class
    const performReviewSearchByClass = async () => {
      const apiUrl = `/api/reviews/${encodeURIComponent(search)}`;
      try {
        console.log("API URL for Review by Class:", apiUrl);
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.success && data.reviews.length > 0) {
          router.push(`/reviews/${encodeURIComponent(search)}`);
          return true;
        } else {
          ToastLib.notifyError("No reviews found for this class");
        }
      } catch (error) {
        console.error("Error fetching class reviews:", error);
        ToastLib.notifyError("Error fetching reviews");
      }
      return false;
    };
  
    // Function to perform review search by professor
    const performReviewSearchByProfessor = async () => {
      const apiUrl = `/api/reviews/${encodeURIComponent(search)}`;
      try {
        console.log("API URL for Review by Professor:", apiUrl);
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.success && data.reviews.length > 0) {
          router.push(`/reviews/${encodeURIComponent(search)}`);
          return true;
        } else {
          ToastLib.notifyError("No reviews found for this professor");
        }
      } catch (error) {
        console.error("Error fetching professor reviews:", error);
        ToastLib.notifyError("Error fetching reviews");
      }
      return false;
    };
  
    // Main search handling logic
    if (searchType === "reviewByClass") {
      const reviewFound = await performReviewSearchByClass();
      if (reviewFound) return;
    } else if (searchType === "reviewByProfessor") {
      const reviewFound = await performReviewSearchByProfessor();
      if (reviewFound) return;
    }
  
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="class"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
              onClick={() => setSearchType("class")}
            >
              <Book className="w-4 h-4 mr-2" />
              Class
            </TabsTrigger>
            <TabsTrigger
              value="title"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
              onClick={() => setSearchType("title")}
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
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              <Star className="w-4 h-4 mr-2" />
              Reviews
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
          <TabsContent value="reviews">
            <Tabs defaultValue="reviewByClass" className="w-full mb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="reviewByClass"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
                  onClick={() => setSearchType("reviewByClass")}
                >
                  By Class
                </TabsTrigger>
                <TabsTrigger
                  value="reviewByProfessor"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
                  onClick={() => setSearchType("reviewByProfessor")}
                >
                  By Professor
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-white text-sm mb-2">
              {searchType === "reviewByClass"
                ? "Search for reviews by class (e.g., CS 225)"
                : "Search for reviews by professor's last name"}
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
