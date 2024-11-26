// components/GenEdRecommender.tsx
"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { fetchData, genEdMap, semesterConfigs } from "@/lib/commonFunctions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const GenEdRecommenderList = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const theme = useTheme();

    interface Course {
        subject: string;
        number: string;
        title: string;
        description: string;
        creditHours: string;
        gpa: number;
    }

    const categoryOptions = Array.from(
        new Set(
            Object.values(genEdMap).flatMap((value) =>
                value.split(", and ").flatMap((part) =>
                    part
                        .split(" - ")
                        .slice(1)
                        .map((category) => category.replace(" course", "").trim())
                )
            )
        )
    ).sort();

    useEffect(() => {
        if (selectedCategories.length > 0) {
            fetchCourses(selectedCategories);
        } else {
            setCourses([]);
        }
    }, [selectedCategories]);

    const fetchCourses = async (categories: string[]) => {
        const matchingKeys = Object.entries(genEdMap)
            .filter(([, value]) => categories.every((cat) => value.includes(cat)))
            .map(([key]) => key);

        const promises = matchingKeys.map((key) =>
            fetchData(
                `https://uiuc-course-api-production.up.railway.app/requirements?query=${encodeURIComponent(
                    genEdMap[key]
                )}`
            )
        );

        const results = await Promise.all(promises);
        const allCourses = results.flat();

        const distinctCourses: Course[] = Array.from(
            new Map(
                allCourses.map((course: any) => [
                    `${course[2]} ${course[3]}`,
                    {
                        subject: course[2],
                        number: course[3],
                        title: course[4],
                        description: course[5],
                        creditHours: course[6],
                        gpa: course[22],
                    },
                ])
            ).values()
        );

        setCourses(distinctCourses.sort((a, b) => (b.gpa || 0) - (a.gpa || 0)));
    };

    const handleVisitClass = useCallback(
        async (searchTerm: string) => {
            // Function to perform a class search for a specific semester
            const performClassSearch = async (semester: string, year: string) => {
                const term = `${semester.toLowerCase()}+${year}`;
                const apiUrl = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
                    searchTerm
                )}+${term}`;
                const redirectUrl = `/class?class=${searchTerm}&term=${encodeURIComponent(
                    `${semester} ${year}`
                )}`;

                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    if (data && data.length > 0) {
                        router.push(redirectUrl);
                        return true;
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
                return false;
            };

            // Iterate over the semester configurations until we find results
            for (const { semester, year } of semesterConfigs) {
                const found = await performClassSearch(semester, year);
                if (found) {
                    return; // Stop if we found a result
                }
            }

            // If no results are found after checking all semesters
            alert("No results found for this class in any semester");
        },
        [router]
    );

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const filteredCourses = courses.filter((course) =>
        `${course.subject} ${course.number} ${course.title}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Box
                sx={{
                    width: "100%",
                    minHeight: "200px",
                    backgroundColor: theme.palette.primary.main,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden",
                    color: theme.palette.primary.contrastText,
                }}
            >
                {/* Back Button at the Top Left */}
                <IconButton
                    onClick={() => router.back()}
                    aria-label="Go back"
                    sx={{
                        color: theme.palette.primary.contrastText,
                        alignSelf: "flex-start",
                        position: "absolute",
                        top: 20,
                        left: 20,
                        display: { xs: "none", md: "inline-flex" }, // Hide on small screens
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
                        fontSize: { xs: "1.5rem", md: "2rem" }, // Responsive font size
                        color: theme.palette.primary.contrastText,
                    }}
                >
                    Gen-Ed Course Offerings
                </Typography>
            </Box>

            <main className="container mx-auto px-4 py-8">
                {/* Category Selection */}
                <div
                    className="space-y-6 p-6 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Select Categories
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Choose one or more categories to view available courses
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {categoryOptions.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`
                    relative group px-4 py-2 rounded-xl transition-all duration-200
                    ${selectedCategories.includes(category)
                                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md hover:bg-blue-700 dark:hover:bg-blue-600'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }
                    hover:scale-105 active:scale-95
                    flex items-center justify-center text-sm font-medium
                `}
                            >
                                <span className="truncate">{category}</span>
                                {selectedCategories.includes(category) && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Input */}
                {courses.length > 0 && (
                    <div className="mb-6 flex items-center">
                        <Search className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-300"/>
                        <Input
                            type="text"
                            placeholder="Search courses by name or code"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                )}

                {/* Courses Table */}
                {courses.length > 0 ? (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block">
                            <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
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
                                        Avg. GPA
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
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                            {`${course.subject} ${course.number}`}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                            {course.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                            {course.creditHours}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                            {course.gpa ? course.gpa.toFixed(2) : "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                onClick={() =>
                                                    handleVisitClass(
                                                        `${course.subject} ${course.number}`
                                                    )
                                                }
                                                className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                                            >
                                                Visit
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden space-y-4">
                            {filteredCourses.map((course, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
                                >
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {`${course.subject} ${course.number}`}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                                        {course.title}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                                        Credit Hours: {course.creditHours}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                                        Avg. GPA: {course.gpa ? course.gpa.toFixed(2) : "N/A"}
                                    </p>
                                    <Button
                                        onClick={() =>
                                            handleVisitClass(`${course.subject} ${course.number}`)
                                        }
                                        className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                                        size="sm"
                                    >
                                        Visit
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : selectedCategories.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">
                        Please select at least one category to view courses.
                    </p>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                        No courses found matching your criteria.
                    </p>
                )}
            </main>
        </div>
    );
};

const GenEdRecommenderPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GenEdRecommenderList/>
        </Suspense>
    );
};

export default GenEdRecommenderPage;
