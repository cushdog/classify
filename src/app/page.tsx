"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Search, Book, UserCircle, Hash, ALargeSmall } from "lucide-react";
import { Mulish } from "next/font/google";
import toast from "react-hot-toast";

const mulish = Mulish({ subsets: ["latin"], weight: ["400", "700"] });

type SearchType = "class" | "title" | "professor" | "crn";

interface SearchConfig {
  apiUrl: string;
  redirectUrl: string;
}

interface SemesterConfig {
  semester: string;
  year: string;
}

const semesterConfigs: SemesterConfig[] = [
  { semester: "Fall", year: "2024" },
  { semester: "Spring", year: "2024" },
  { semester: "Fall", year: "2023" },
  { semester: "Spring", year: "2023" },
  { semester: "Fall", year: "2022" },
];

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("class");
  const router = useRouter();

  const formatSearch = (value: string) => {
    if (searchType === "class") {
      value = value.toUpperCase();
      const match = value.match(/^([A-Z]+)(\d{3})$/);
      if (match) {
        value = `${match[1]} ${match[2]}`;
      }
    }
    return value;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatSearch(e.target.value);
    setSearch(formattedValue);
  };

  const getSearchConfig = (semesterConfig: SemesterConfig): SearchConfig => {
    const term = `${semesterConfig.semester.toLowerCase()}+${semesterConfig.year}`;
    switch (searchType) {
      case "class":
        return {
          apiUrl: `https://uiuc-course-api-production.up.railway.app/search?query=${search}+${term}`,
          redirectUrl: `/class?class=${search}&term=${encodeURIComponent(
            `${semesterConfig.semester} ${semesterConfig.year}`
          )}`,
        };
      case "title":
        return {
          apiUrl: `https://uiuc-course-api-production.up.railway.app/description?query=${search}&term=${term}`,
          redirectUrl: `/titleSearch?searchQuery=${search}`,
        };
      case "professor":
        return {
          apiUrl: `https://uiuc-course-api-production.up.railway.app/prof-search?query=${search}+${term}`,
          redirectUrl: `/professorSearch?searchQuery=${search}`,
        };
      case "crn":
        return {
          apiUrl: `https://uiuc-course-api-production.up.railway.app/crn-search?crn=${search}`,
          redirectUrl: "", // We'll handle CRN redirect differently
        };
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const performSearch = async (semesterConfig: SemesterConfig): Promise<any> => {
    const { apiUrl, redirectUrl } = getSearchConfig(semesterConfig);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.length > 0) {
        if (searchType === "crn") {
          const subject = data[2];
          const courseNumber = data[3];
          router.push(
            `/class?class=${subject}+${courseNumber}&term=${encodeURIComponent(
              `${semesterConfig.semester} ${semesterConfig.year}`
            )}`
          );
        } else {
          router.push(redirectUrl);
        }
        return data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return null;
  };

  const handleSearch = useCallback(async () => {
    if (!search.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    for (const semesterConfig of semesterConfigs) {
      const result = await performSearch(semesterConfig);
      if (result) {
        return; // Stop if we found a result
      }
    }

    // If we've tried all configurations and found nothing
    toast.error("No results found in any semester");
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
              Search for courses by title or keywords
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