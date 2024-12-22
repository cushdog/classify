"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchData } from "@/lib/Library Functions and Clients/commonFunctions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Suspense } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";

const SubjectsList = () => {
    const [subjects, setSubjects] = useState<{ code: string; name: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const pathname = usePathname(); // Get the current path
    const theme = useTheme();

    // Extract year and semester from the pathname
    const [year, semester] = pathname.split("/").slice(1);

    useEffect(() => {
        const fetchSubjects = async () => {
            const url = `https://uiuc-course-api-production.up.railway.app/subject-names`;
            const data = await fetchData(url);
            setSubjects(data);
        };

        fetchSubjects();
    }, []);

    useEffect(() => {
        // Set the document title dynamically
        if (year && semester) {
            document.title = `Browse ${semester} ${year} Offerings`;
        }
    }, [year, semester]);

    const handleSubjectClick = (subjectCode: string) => {
        router.push(`/${year}/${semester}/${subjectCode}`);
    };

    const filteredSubjects = subjects.filter((subject) =>
        `${subject.code} ${subject.name}`
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
                    Browse {semester} {year} Offerings
                </Typography>
            </Box>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center">
                    <Search className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-300" />
                    <Input
                        type="text"
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                    <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                                Subject Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                                Subject Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredSubjects.map((subject, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                    {subject.code}
                                </td>
                                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                    {subject.name}
                                </td>
                                <td className="px-6 py-4">
                                    <Button
                                        onClick={() => handleSubjectClick(subject.code)}
                                        className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                                    >
                                        View Courses
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {filteredSubjects.map((subject, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
                        >
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {subject.code}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                                {subject.name}
                            </p>
                            <Button
                                onClick={() => handleSubjectClick(subject.code)}
                                className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                                size="sm"
                            >
                                View Courses
                            </Button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const SubjectsPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubjectsList />
        </Suspense>
    );
};

export default SubjectsPage;
