"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Course {
  subject: string;
  number: string;
  title: string;
  description: string;
  creditHours: string;
  gpa: number;
}

const genEdMap: { [key: string]: string } = {
  SBS_SOC:
    "Social & Beh Sci - Soc Sci, and Cultural Studies - US Minority course",
  CS_US: "Cultural Studies - US Minority course",
  HUM_HIST_CS_US:
    "Humanities - Hist & Phil, and Cultural Studies - US Minority course",
  HUM_LIT_CS_US:
    "Humanities - Lit & Arts, and Cultural Studies - US Minority course",
  ACP_CS_US: "Advanced Composition, and Cultural Studies - US Minority course",
  CS_NONWEST_SBS_SOC:
    "Cultural Studies - Non-West, and Social & Beh Sci - Soc Sci course",
  QR1: "Quantitative Reasoning I course",
  HUM_HIST: "Humanities - Hist & Phil course",
  ACP_HUM_HIST_CS_US:
    "Advanced Composition, Humanities - Hist & Phil, and Cultural Studies - US Minority course",
  HUM_HIST_CS_NONWEST:
    "Humanities - Hist & Phil, and Cultural Studies - Non-West course",
  JS: "James Scholars course",
  NAT_LIFE: "Nat Sci & Tech - Life Sciences course",
  CS_WEST: "Cultural Studies - Western course",
  SBS_SOC_CS_WEST:
    "Social & Beh Sci - Soc Sci, and Cultural Studies - Western course",
  HUM_HIST_CS_WEST:
    "Humanities - Hist & Phil, and Cultural Studies - Western course",
  CS_NONWEST: "Cultural Studies - Non-West course",
  HUM_LIT: "Humanities - Lit & Arts course",
  CH_HUM_HIST: "Camp Honors/Chanc Schol, and Humanities - Hist & Phil course",
  HUM_LIT_CS_WEST:
    "Humanities - Lit & Arts, and Cultural Studies - Western course",
  HUM_LIT_CS_NONWEST:
    "Humanities - Lit & Arts, and Cultural Studies - Non-West course",
  NAT_PHYS: "Nat Sci & Tech - Phys Sciences course",
  NAT_PHYS_QR2:
    "Nat Sci & Tech - Phys Sciences, and Quantitative Reasoning II course",
  CH_NAT_PHYS:
    "Camp Honors/Chanc Schol, and Nat Sci & Tech - Phys Sciences course",
  SBS_BEH: "Social & Beh Sci - Beh Sci course",
  NAT_PHYS_CS_WEST:
    "Nat Sci & Tech - Phys Sciences, and Cultural Studies - Western course",
  COMP_I: "Composition I course",
};

const GenEdRecommender = () => {
  const [category, setCategory] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (category) {
      fetchCourses(category);
    }
  }, [category]);

  useEffect(() => {
    // Detect if the device is touch-enabled
    const checkIfTouchDevice = () => {
      setIsTouchDevice(window.matchMedia("(hover: none)").matches);
    };
    checkIfTouchDevice();
    window.matchMedia("(hover: none)").addEventListener("change", checkIfTouchDevice);

    return () => {
      window.matchMedia("(hover: none)").removeEventListener("change", checkIfTouchDevice);
    };
  }, []);

  const handleBackClick = () => {
    router.back();
  };

  const fetchCourses = async (category: string) => {
    try {
      const response = await fetch(
        `https://uiuc-course-api-production.up.railway.app/requirements?query=${encodeURIComponent(
          genEdMap[category]
        )}`
      );

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const data = (await response.json()) as any[];

      const distinctCourses: Course[] = Array.from(
        new Map(

          /* eslint-disable @typescript-eslint/no-explicit-any */
          data.map((course: any[]) => [
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

      setCourses(distinctCourses.sort((a, b) => b.gpa - a.gpa));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleVisitClass = (subject: string, number: string) => {
    const formattedQuery = `${subject} ${number}`;
    router.push(
      `/class?class=${encodeURIComponent(formattedQuery)}&term=fall%202024`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBackClick}
          className="mb-6 flex items-center text-white hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="mr-2" />
        </button>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 p-6">
            <h1 className="text-3xl font-bold text-white">
              Gen-Ed Course Recommender
            </h1>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-8">
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select a Gen-Ed category
              </label>
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger id="category-select" className="w-full">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(genEdMap).map(([key, value_i]) => (
                    <SelectItem key={key} value={key}>
                      {value_i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {courses.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Recommended Courses
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {isTouchDevice ? (
                          <button
                            className="text-gray-500"
                            onClick={(e) => e.preventDefault()} // Click to show tooltip on mobile
                          >
                            <Info />
                          </button>
                        ) : (
                          <div className="text-gray-500"> {/* Hover to show tooltip on desktop */}
                            <Info />
                          </div>
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Courses are sorted by highest average GPA</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Credit Hours</TableHead>
                        <TableHead>
                          <span className="flex items-center">
                            Average GPA
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  {isTouchDevice ? (
                                    <button
                                      className="ml-1 h-4 w-4 text-gray-500"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <Info />
                                    </button>
                                  ) : (
                                    <div className="ml-1 h-4 w-4 text-gray-500">
                                      <Info />
                                    </div>
                                  )}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Sorted from highest to lowest</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </span>
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course, index) => (
                        <TableRow
                          key={`${course.subject}${course.number}`}
                          className={
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                        >
                          <TableCell className="font-medium">{`${course.subject} ${course.number}`}</TableCell>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>{course.creditHours}</TableCell>
                          <TableCell>
                            <span className="font-semibold">
                              {course.gpa ? course.gpa.toFixed(2) : "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                              onClick={() =>
                                handleVisitClass(course.subject, course.number)
                              }
                            >
                              Visit Class
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenEdRecommender;
