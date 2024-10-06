"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchData, Course, semesterConfigs, fetchSubjectFullName } from "@/lib/commonFunctions";
import { Search, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SubjectDetails = () => {
  const [subjectData, setSubjectData] = useState<Course[][] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFullName, setSubjectFullName] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSubjectData = async () => {
      const subjectParam = searchParams.get("subject")?.split(" ");
      const termParam = searchParams.get("term")?.split(" ");
      const subj = subjectParam ? subjectParam[0] : "";
      const term = termParam ? termParam[0] : "";
      const year = termParam ? termParam[1] : "";
      const modified_search = `${subj} ${term.toLowerCase()} ${year}`;
      const url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
        modified_search
      )}`;
      const data = await fetchData(url);
      const uniqueData = data.filter(
        (item: Course[], index: number, self: Course[][]) =>
          index === self.findIndex((t) => t[2] === item[2] && t[3] === item[3])
      );
      fetchSubjectFullName(subj.toUpperCase()).then((res) => setSubjectFullName(res));
      setSubjectData(uniqueData);
    };

    fetchSubjectData();
  }, [searchParams]);

  const handleClassClick = (classNumber: string) => {
    const mostRecentTerm = `${semesterConfigs[0].semester} ${semesterConfigs[0].year}`;
    router.push(
      `/class?class=${classNumber}&term=${encodeURIComponent(mostRecentTerm)}`
    );
  };

  const filteredData = subjectData?.filter((course) =>
    `${course[2]} ${course[3]} ${course[4]}`
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
        <h1 className="text-2xl font-bold mt-16 md:mt-2">{subjectFullName && subjectFullName} Offerings</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Search className="mr-2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses..."
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
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg GPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData?.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{`${course[2]} ${course[3]}`}</td>
                  <td className="px-6 py-4">{String(course[4])}</td>
                  <td className="px-6 py-4">{String(course[6])}</td>
                  <td className="px-6 py-4">
                    {course[22] && Number(course[22]) > 0
                      ? Number(course[22]).toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() =>
                        handleClassClick(`${course[2]} ${course[3]}`)
                      }
                      className="bg-blue-600 text-white hover:bg-blue-700"
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
          {filteredData?.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold">{`${course[2]} ${course[3]}`}</h2>
              <p className="text-gray-600 mb-2">{String(course[4])}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
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
                    <Button variant="outline" size="sm">
                      <Info className="h-4 w-4 mr-2" />
                      Description
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{`${course[2]} ${course[3]}: ${String(
                        course[4]
                      )}`}</DialogTitle>
                    </DialogHeader>
                    <p className="mt-2">{String(course[5])}</p>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => handleClassClick(`${course[2]} ${course[3]}`)}
                  className="bg-blue-600 text-white hover:bg-blue-700"
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

export default SubjectDetails;
