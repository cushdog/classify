"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/commonFunctions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

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
    router.push(
      `/subject?subject=${encodeURIComponent(subjectCode)}&term=fall+2024`
    );
  };

  const filteredSubjects = subjects.filter((subject) =>
    `${subject.code} ${subject.name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-white hover:bg-blue-700 hidden md:inline-flex"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold mt-16 md:mt-2">
          Browse Fall 2024 Offerings
        </h1>
      </header>

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
                  <td className="px-6 py-4 whitespace-nowrap">{subject.code}</td>
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
