"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { IProfessor } from "@/db/Supabase Professor Reviews/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ClassWithInfo {
  class: string;
  professor: string;
  term: string;
  averageGPA: number | null;
  title: string;
  description: string;
  subject: string;
  courseNumber: string;
  year: number;
  semester: string;
}

interface ProfessorProfileProps {
  professorData: IProfessor;
  classes: ClassWithInfo[];
}

const ProfessorProfile: React.FC<ProfessorProfileProps> = ({
  professorData,
  classes,
}) => {
  const router = useRouter();

  const MetricBar = ({ label, value }: { label: string; value: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {label}
        </span>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
          {value}%
        </span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );

  return (
    <div className="min-h-screen mt-16">
      <div className="max-w-7xl mx-auto p-6">
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

        {/* Header Section */}
        <Card className="mb-8 bg-white dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                  {professorData.firstName} {professorData.lastName}
                </h1>
                {professorData.department && (
                  <p className="text-gray-500 dark:text-gray-400">
                    {professorData.department}
                  </p>
                )}
                {professorData.email && (
                  <p className="text-gray-500 dark:text-gray-400">
                    Email: {professorData.email}
                  </p>
                )}
              </div>
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <MetricBar
                  label="Preparedness"
                  value={professorData.preparednessPercentage}
                />
                <MetricBar
                  label="Clarity"
                  value={professorData.clarityPercentage}
                />
                <MetricBar
                  label="Respect"
                  value={professorData.respectPercentage}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Courses */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <BookOpen className="h-5 w-5" />
                Classes Taught
              </CardTitle>
            </CardHeader>
            <CardContent>
              {classes.length > 0 ? (
                <div className="grid gap-4">
                  {classes.map((course, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-white dark:bg-gray-800"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {course.class}: {course.title}
                          </h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">{course.term}</Badge>
                          </div>
                        </div>
                        {course.averageGPA !== null ? (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {course.averageGPA.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Average GPA
                            </div>
                          </div>
                        ) : (
                          <div className="text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              GPA Data Not Available
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Class Description */}
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {course.description}
                      </p>
                      {/* Visit Class Page Button */}
                      <Link
                        href={`/${course.year}/${course.semester}/${course.subject}/${course.courseNumber}`}
                        passHref
                      >
                        <Button variant="default">Visit Class Page</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No classes found for this professor.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessorProfile;
