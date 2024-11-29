"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sun, Moon } from "lucide-react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMediaQuery } from "@mui/system";

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

const ProfessorSearchResults = () => {
  const [professors, setProfessors] = useState<ProfessorData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("searchQuery") || "";
  const isMobile = useMediaQuery("(max-width:600px)");

  // Initialize dark mode
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
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  // Fetch professors matching the last name
  useEffect(() => {
    const fetchProfessorData = async () => {
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

    fetchProfessorData();
  }, [searchParams]);

  const handleProfessorClick = (professor: ProfessorData) => {
    const professorName = `${professor.firstname} ${professor.lastname}`;
    router.push(`/professors/${encodeURIComponent(professorName)}`);
  };

  const filteredProfessors = Array.isArray(professors)
    ? professors.filter((professor) =>
        `${professor.firstname} ${professor.lastname} ${professor.departmentname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
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
        <div className="flex justify-end">
          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            aria-label="Toggle Dark Mode"
            className="text-gray-300 hover:text-gray-100"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

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
          Professors Matching &quot;{searchQuery}&quot;
        </Typography>
      </Box>

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6 flex items-center">
          <Search className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-300" />
          <Input
            type="text"
            placeholder="Search professors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {isLoading ? (
          // Loading Indicator
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : filteredProfessors && filteredProfessors.length > 0 ? (
          <>
            {/* Desktop View */}
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

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {filteredProfessors.map((professor, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{`${professor.firstname} ${professor.lastname}`}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{professor.departmentname}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span>Email: {professor.email}</span>
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
      </main>
    </div>
  );
};

const ProfPage = () => {
  return (
    <Suspense fallback={<div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>}>
      <ProfessorSearchResults />
    </Suspense>
  );
};

export default ProfPage;
