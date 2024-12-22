"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  semesterConfigs,
  fetchData,
} from "@/lib/Library Functions and Clients/commonFunctions";

// ==================
// Type Declarations
// ==================

// For your professor data
interface ProfessorData {
  collegename: string;
  departmentname: string;
  email: string;
  firstname: string;
  lastname: string;
  link: string;
  middlename: string;
  name: string;
  netid: string;
  role: string;
}

// For your course data
//
// For example, from your snippet, the API returns an array of arrays,
// each representing a course with many indices. e.g.:
// [
//   0: ???,
//   1: ???,
//   2: subject,
//   3: courseNumber,
//   4: title,
//   5: description,
//   6: creditHours,
//   ...
//   22: avgGpa
// ]
//
interface Course {
  [index: number]: string | number | undefined | null;
}

// ==============
// Combined Page
// ==============
const CombinedSearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // We expect one of: "professor", "title", "class", or "crn".
  const searchType = searchParams.get("searchType") || "";
  const searchQuery = searchParams.get("searchQuery") || "";
  // If the user is searching by title, you mentioned passing a "term" (e.g. "Spring 2024").
  // If not relevant, it can remain an empty string.
  const term = searchParams.get("term") || "";

  const [professors, setProfessors] = useState<ProfessorData[] | null>(null);
  const [courses, setCourses] = useState<Course[][] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // For responsiveness: we can detect if viewport is < 600px, for mobile layout
  const isMobile = useMediaQuery("(max-width:600px)");

  // ============
  // Dark Mode
  // ============
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
      // If no theme is stored, prefer system color scheme
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

  // ====================
  // Fetch Data (effect)
  // ====================
  useEffect(() => {
    const fetchProfessors = async () => {
      setIsLoading(true);
      const url = `https://uiuc-course-api-production.up.railway.app/last-search?last_name=${encodeURIComponent(
        searchQuery
      )}`;
      try {
        const response = await fetch(url);
        const data: ProfessorData[] = await response.json();
        setProfessors(data);
      } catch (error) {
        console.error("Error fetching professor data:", error);
        setProfessors(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTitles = async () => {
      setIsLoading(true);
      // For "Spring 2024", we'll do the same logic you had:
      //   const search_term = "spring 2024"
      // Then fetch `https://uiuc-course-api-production.up.railway.app/description?query=...&term=spring 2024`
      const [semester, year] = term.split(" ");
      const search_term = `${semester?.toLowerCase()} ${year}`;

      const url = `https://uiuc-course-api-production.up.railway.app/description?query=${encodeURIComponent(
        searchQuery
      )}&term=${search_term}`;
      try {
        const data: Course[][] = await fetchData(url);
        // Filter out duplicates based on subject/course# if needed
        const uniqueData = data.filter(
          (item, index, self) =>
            index ===
            self.findIndex((t) => t[2] === item[2] && t[3] === item[3])
        );
        setCourses(uniqueData);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourses(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchClassSearch = async () => {
      // If you want to replicate the logic that tries each semester in `semesterConfigs`,
      // you can do so. But for simplicity, let's just store data in courses.
      // Or you could do the search in the "SearchPage" and pass found data here.
      // For demonstration, let’s do a minimal approach.
      setIsLoading(true);
      try {
        // We'll just pick a default or do something else.
        // If you want the same “loop through semesterConfigs until found” logic, you can do it here.
        //
        // For now, let’s just pick the first config as an example:
        const { semester, year } = semesterConfigs[0];
        const termString = `${semester.toLowerCase()}+${year}`;
        const url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
          searchQuery
        )}+${termString}`;
        const rawData: Course[][] = await fetchData(url);
        setCourses(rawData);
      } catch (error) {
        console.error("Error fetching class data:", error);
        setCourses(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCrnSearch = async () => {
      setIsLoading(true);
      // For a CRN search, your original code did something like:
      //   "https://uiuc-course-api-production.up.railway.app/crn-search?crn=..."
      // Then you used data[2], data[3] to route, etc. Let’s do something similar:
      const url = `https://uiuc-course-api-production.up.railway.app/crn-search?crn=${encodeURIComponent(
        searchQuery
      )}`;
      try {
        // The CRN endpoint presumably returns a single course’s data array, or maybe none
        // For consistency, let’s assume it returns Course[] or Course[][]:
        const data: Course[] | Course[][] = await fetchData(url);

        // If it returns a single array, we can wrap it to keep consistent
        let newData: Course[][] = [];
        if (Array.isArray(data[0])) {
          // It's already Course[][]
          newData = data as Course[][];
        } else {
          // It's a single Course[], wrap it
          newData = [data as Course[]];
        }
        setCourses(newData);
      } catch (error) {
        console.error("Error fetching CRN data:", error);
        setCourses(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Clear previous data so we don't show stale results
    setProfessors(null);
    setCourses(null);

    // Decide which fetch to run
    if (searchType === "professor") {
      fetchProfessors();
    } else if (searchType === "title") {
      fetchTitles();
    } else if (searchType === "class") {
      fetchClassSearch();
    } else if (searchType === "crn") {
      fetchCrnSearch();
    }
  }, [searchType, searchQuery, term]);

  // ======================
  // Handling "View" Click
  // ======================
  const handleProfessorClick = (professor: ProfessorData) => {
    const professorName = `${professor.firstname} ${professor.lastname}`;
    router.push(`/professors/${encodeURIComponent(professorName)}`);
  };

  const handleClassClick = (course: Course[]) => {
    // In your old code, you might do something like:
    //   const subject = String(course[2]);
    //   const courseNumber = String(course[3]);
    //   router.push(`/${year}/${semester}/${subject}/${courseNumber}`);
    // We'll replicate something similar, picking the first config or doing something else:
    const subject = String(course[2]);
    const courseNumber = String(course[3]);
    const { semester, year } = semesterConfigs[0];
    router.push(`/${year}/${semester}/${subject}/${courseNumber}`);
  };

  // ===============
  // Local Filtering
  // ===============
  // This is the user’s local in-page search box, different from the original “global” search
  // They can refine results here with partial text matching.
  const handleLocalFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  let filteredProfessors: ProfessorData[] = [];
  if (professors) {
    filteredProfessors = professors.filter((prof) =>
      `${prof.firstname} ${prof.lastname} ${prof.departmentname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

  let filteredCourses: Course[][] = [];
  if (courses) {
    filteredCourses = courses.filter((singleCourseArr: Course[]) =>
      `${singleCourseArr[2]} ${singleCourseArr[3]} ${singleCourseArr[4]}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

  // ==============
  // JSX Rendering
  // ==============
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header banner */}

      <Box
        sx={{
          width: "100%",
          minHeight: isMobile ? "14em" : "200px",
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
        {/* Dark Mode Toggle Button */}
        <div className="flex justify-end"></div>

        {/* Back Button */}
        <IconButton
          onClick={() => router.back()}
          aria-label="Go back"
          sx={{
            color: "#fff",
            position: "absolute",
            top: 20,
            left: 20,
            display: { xs: "none", md: "inline-flex" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          {searchType === "professor"
            ? `Professors Matching "${searchQuery}"`
            : searchType === "crn"
            ? `CRN: ${searchQuery}`
            : searchType === "class"
            ? `Courses Matching "${searchQuery}"`
            : `Courses Matching "${searchQuery}" (${term})`}
        </Typography>
      </Box>

      <main className="container mx-auto px-4 py-8">
        {/* Local Search Bar */}
        <div className="mb-6 flex items-center">
          <Search className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-300" />
          <Input
            type="text"
            placeholder="Refine search results..."
            value={searchTerm}
            onChange={handleLocalFilter}
            className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        )}

        {/* If searching for professors */}
        {!isLoading && searchType === "professor" && (
          <>
            {filteredProfessors && filteredProfessors.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-colors duration-300">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredProfessors.map((professor, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                            {`${professor.firstname} ${professor.lastname}`}
                          </td>
                          <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                            {professor.departmentname}
                          </td>
                          <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                            {professor.email}
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              onClick={() => handleProfessorClick(professor)}
                              className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
                            >
                              View Profile
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {filteredProfessors.map((professor, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300"
                    >
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {`${professor.firstname} ${professor.lastname}`}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {professor.departmentname}
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Email: {professor.email}
                      </div>
                      <Button
                        onClick={() => handleProfessorClick(professor)}
                        className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
                        size="sm"
                      >
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No professors found matching your search.
              </p>
            )}
          </>
        )}

        {/* If searching for courses (title, class, or crn) */}
        {!isLoading &&
          (searchType === "title" ||
            searchType === "class" ||
            searchType === "crn") && (
            <>
              {filteredCourses && filteredCourses.length > 0 ? (
                <>
                  {/* Desktop Table */}
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
                        {filteredCourses.map((course, index) => (
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
                              {course[22] && Number(course[22]) > 0
                                ? Number(course[22]).toFixed(2)
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                onClick={() => handleClassClick(course)}
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

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {filteredCourses.map((course, index) => (
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
                            {course[22] && Number(course[22]) > 0
                              ? Number(course[22]).toFixed(2)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-500 dark:border-gray-600 text-gray-300 dark:text-gray-400"
                              >
                                <Info className="h-4 w-4 mr-2" />
                                Description
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-gray-900 dark:text-gray-100">
                                  {`${course[2]} ${course[3]}: ${String(
                                    course[4]
                                  )}`}
                                </DialogTitle>
                              </DialogHeader>
                              <p className="mt-2 text-gray-700 dark:text-gray-300">
                                {String(course[5])}
                              </p>
                            </DialogContent>
                          </Dialog>
                          <Button
                            onClick={() => handleClassClick(course)}
                            className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
                            size="sm"
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No courses found matching your search.
                </p>
              )}
            </>
          )}
      </main>
    </div>
  );
};

const CombinedSearchResultsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      }
    >
      <CombinedSearchResults />
    </Suspense>
  );
};

export default CombinedSearchResultsPage;
