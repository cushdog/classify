"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/commonFunctions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SubjectsList = () => {
  const [subjects, setSubjects] = useState<{ code: string; name: string }[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      const url = `https://uiuc-course-api-production.up.railway.app/subject-names`;
      const data = await fetchData(url);
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  const handleSubjectClick = (subjectCode: string) => {
    router.push(`/2025/Spring/${subjectCode}`);
  };

  const filteredSubjects = subjects.filter((subject) =>
    `${subject.code} ${subject.name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Box
        sx={{
          width: "100%",
          minHeight: "200px",
          backgroundColor: "#2563EB", // Equivalent to Tailwind CSS 'bg-blue-600'
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          color: "#fff", // Set text color to white
        }}
      >
        {/* Back Button at the Top Left */}
        <IconButton
          onClick={() => router.back()}
          aria-label="Go back"
          sx={{
            color: "#fff",
            alignSelf: "flex-start",
            position: "absolute",
            top: 20,
            left: 20,
            display: { xs: "none", md: "inline-flex" }, // Hide on small screens
          }}
        >
          <ArrowBackIcon sx={{ marginRight: "8px" }} />
          <Typography variant="button" sx={{ textTransform: "none" }}>
            Back
          </Typography>
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
          }}
        >
          Browse Spring 2025 Offerings
        </Typography>
      </Box>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Search className="mr-2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubjects.map((subject, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subject.code}
                  </td>
                  <td className="px-6 py-4">{subject.name}</td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => handleSubjectClick(subject.code)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
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
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold">{subject.code}</h2>
              <p className="text-gray-600 mb-2">{subject.name}</p>
              <Button
                onClick={() => handleSubjectClick(subject.code)}
                className="bg-blue-600 text-white hover:bg-blue-700"
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
