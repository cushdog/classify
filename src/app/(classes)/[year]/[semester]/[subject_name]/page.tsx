"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchData,
  fetchSubjectFullName,
} from "@/lib/Library Functions and Clients/commonFunctions";
import { Course } from "@/types/commonTypes";

// Shadcn UI components (assuming you've set them up in your project)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Info } from "lucide-react";

import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMediaQuery } from "@mui/system";

/**
 * Utility function to safely parse and return
 * the numeric GPA value. If no valid GPA is found,
 * returns 0 for sorting/filtering.
 */
function getGpaValue(course: Course[]): number {
  const rawGpa = course[22];
  if (rawGpa && Number(rawGpa) > 0) {
    return Number(rawGpa);
  }
  return 0;
}

const SubjectDetails = () => {
  const [subjectData, setSubjectData] = useState<Course[][] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFullName, setSubjectFullName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sorting state: "none" | "ascending" | "descending"
  const [sortOrder, setSortOrder] = useState<
    "none" | "ascending" | "descending"
  >("none");

  const router = useRouter();
  const params = useParams();
  const isMobile = useMediaQuery("(max-width:600px)");
  const minHeight = isMobile ? "14em" : "200px";

  // Extract dynamic parameters from the URL
  const { year, semester, subject_name } = params;

  // Initialize dark mode based on localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // If no preference is stored, use system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Fetch subject data and subject full name
  useEffect(() => {
    if (subject_name && year && semester) {
      const fetchSubjectData = async () => {
        const modifiedSearch = `${
          typeof subject_name === "string"
            ? subject_name.toUpperCase()
            : subject_name
        } ${
          typeof semester === "string" ? semester.toLowerCase() : semester
        } ${year}`;

        const url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
          modifiedSearch
        )}`;
        const data = await fetchData(url);

        // Filter out duplicates
        const uniqueData = data.filter(
          (item: Course[], index: number, self: Course[][]) =>
            index ===
            self.findIndex((t) => t[2] === item[2] && t[3] === item[3])
        );

        // Fetch the full subject name
        const fullName = await fetchSubjectFullName(
          typeof subject_name === "string" ? subject_name.toUpperCase() : ""
        );

        setSubjectData(uniqueData);
        setSubjectFullName(fullName);
      };

      fetchSubjectData();
    }
  }, [subject_name, year, semester]);

  /**
   * Navigate to the Class Details page.
   */
  const handleClassClick = (classNumber: string) => {
    router.push(`/${year}/${semester}/${subject_name}/${classNumber}`);
  };

  /**
   * Filter courses by search term.
   */
  const filteredData = useMemo(() => {
    if (!subjectData) return [];
    return subjectData.filter((course) =>
      `${course[2]} ${course[3]} ${course[4]}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [subjectData, searchTerm]);

  /**
   * Sort the filtered courses by chosen sort order.
   */
  const sortedData = useMemo(() => {
    const dataToSort = [...filteredData];

    if (sortOrder === "ascending") {
      return dataToSort.sort((a, b) => getGpaValue(a) - getGpaValue(b));
    } else if (sortOrder === "descending") {
      return dataToSort.sort((a, b) => getGpaValue(b) - getGpaValue(a));
    }

    // "none" => do not sort
    return dataToSort;
  }, [filteredData, sortOrder]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header Section */}
      <Box
        sx={{
          width: "100%",
          minHeight: minHeight,
          backgroundColor: isDarkMode ? "#1E3A8A" : "#3B82F6",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          color: "#fff",
        }}
        className="transition-colors duration-300"
      >
        {/* Back Button (hidden on mobile) */}
        <IconButton
          onClick={() => router.back()}
          aria-label="Go back"
          sx={{
            color: "#fff",
            alignSelf: "flex-start",
            position: "absolute",
            top: 20,
            left: 20,
            display: { xs: "none", md: "inline-flex" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Spacer to push the main title to the bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Main Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginTop: "4px",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          {subjectFullName && subjectFullName} Offerings in {semester} {year}
        </Typography>
      </Box>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        {/* 
          Rather than displaying all filters inline, 
          we use a Shadcn 'Sheet' to keep them organized and extensible.
        */}
        <div className="mb-6 flex items-center justify-between space-x-4">
          {/* Search Input is placed outside the sheet so it's always visible.
     If you want it inside the filter sheet, you can move it there. 
  */}
          <div className="flex items-center gap-2 w-full">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Button to open the filter sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 sm:w-96 bg-white dark:bg-gray-900"
            >
              <SheetHeader>
                <SheetTitle className="text-gray-900 dark:text-gray-100">
                  Filters
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 flex flex-col gap-5">
                {/* GPA Sorting Filter */}
                <div>
                  <Label
                    htmlFor="gpaSort"
                    className="text-gray-700 dark:text-gray-300 text-sm mb-2 inline-block"
                  >
                    Sort by GPA
                  </Label>
                  <Select
                    value={sortOrder}
                    onValueChange={(val) =>
                      setSortOrder(val as "none" | "ascending" | "descending")
                    }
                  >
                    <SelectTrigger
                      id="gpaSort"
                      className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <SelectValue placeholder="Select sorting" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      <SelectItem value="none">No Sorting</SelectItem>
                      <SelectItem value="ascending">
                        Lowest to Highest
                      </SelectItem>
                      <SelectItem value="descending">
                        Highest to Lowest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 
          Additional filters can go here as your application grows.
          For example, you could filter by credit hours, instructor, section type, etc.
        */}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-colors duration-300">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Credit Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Avg GPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedData.map((course, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {`${course[2]} ${course[3]}`}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {String(course[4])}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {String(course[6])}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {getGpaValue(course) > 0
                      ? getGpaValue(course).toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => handleClassClick(`${course[3]}`)}
                      className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {sortedData.map((course, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {`${course[2]} ${course[3]}`}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {String(course[4])}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>Credits: {String(course[6])}</span>
                <span>
                  Avg GPA:{" "}
                  {getGpaValue(course) > 0
                    ? getGpaValue(course).toFixed(2)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-500 text-gray-300 dark:border-gray-600 dark:text-gray-400"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Description
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-gray-100">
                        {`${course[2]} ${course[3]}: ${String(course[4])}`}
                      </DialogTitle>
                    </DialogHeader>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      {String(course[5])}
                    </p>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => handleClassClick(`${course[3]}`)}
                  className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
                  size="sm"
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const SubjectDets = () => {
  return (
    <Suspense
      fallback={
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      }
    >
      <SubjectDetails />
    </Suspense>
  );
};

export default SubjectDets;
