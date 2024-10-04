'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Course {
  subject: string;
  number: string;
  title: string;
  description: string;
  creditHours: string;
  gpa: number;
}

const genEdMap: { [key: string]: string } = {
  SBS_SOC: "Social & Beh Sci - Soc Sci, and Cultural Studies - US Minority course",
  CS_US: "Cultural Studies - US Minority course",
  HUM_HIST_CS_US: "Humanities - Hist & Phil, and Cultural Studies - US Minority course",
  HUM_LIT_CS_US: "Humanities - Lit & Arts, and Cultural Studies - US Minority course",
  ACP_CS_US: "Advanced Composition, and Cultural Studies - US Minority course",
  CS_NONWEST_SBS_SOC: "Cultural Studies - Non-West, and Social & Beh Sci - Soc Sci course",
  QR1: "Quantitative Reasoning I course",
  HUM_HIST: "Humanities - Hist & Phil course",
  ACP_HUM_HIST_CS_US: "Advanced Composition, Humanities - Hist & Phil, and Cultural Studies - US Minority course",
  HUM_HIST_CS_NONWEST: "Humanities - Hist & Phil, and Cultural Studies - Non-West course",
  JS: "James Scholars course",
  NAT_LIFE: "Nat Sci & Tech - Life Sciences course",
  CS_WEST: "Cultural Studies - Western course",
  SBS_SOC_CS_WEST: "Social & Beh Sci - Soc Sci, and Cultural Studies - Western course",
  HUM_HIST_CS_WEST: "Humanities - Hist & Phil, and Cultural Studies - Western course",
  CS_NONWEST: "Cultural Studies - Non-West course",
  HUM_LIT: "Humanities - Lit & Arts course",
  CH_HUM_HIST: "Camp Honors/Chanc Schol, and Humanities - Hist & Phil course",
  HUM_LIT_CS_WEST: "Humanities - Lit & Arts, and Cultural Studies - Western course",
  HUM_LIT_CS_NONWEST: "Humanities - Lit & Arts, and Cultural Studies - Non-West course",
  NAT_PHYS: "Nat Sci & Tech - Phys Sciences course",
  NAT_PHYS_QR2: "Nat Sci & Tech - Phys Sciences, and Quantitative Reasoning II course",
  CH_NAT_PHYS: "Camp Honors/Chanc Schol, and Nat Sci & Tech - Phys Sciences course",
  SBS_BEH: "Social & Beh Sci - Beh Sci course",
  NAT_PHYS_CS_WEST: "Nat Sci & Tech - Phys Sciences, and Cultural Studies - Western course",
  COMP_I: "Composition I course"
};

const GenEdRecommender = () => {
  const [category, setCategory] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    if (category) {
      fetchCourses(category);
    }
  }, [category]);

  const fetchCourses = async (category: string) => {
    try {
      const response = await fetch(`https://uiuc-course-api-production.up.railway.app/requirements?query=${encodeURIComponent(genEdMap[category])}`);
      const data = (await response.json()) as any[]; // Type assertion to 'any[]' to satisfy TypeScript

      // Parsing and narrowing down to distinct courses based on subject and number
      const distinctCourses: Course[] = Array.from(
        new Map(data.map((course: any[]) => [
          `${course[2]} ${course[3]}`, // Unique key combining subject and number
          {
            subject: course[2],
            number: course[3],
            title: course[4],
            description: course[5],
            creditHours: course[6],
            gpa: course[22],
          }
        ])).values()
      );

      setCourses(distinctCourses.sort((a, b) => b.gpa - a.gpa));
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleVisitClass = (subject: string, number: string) => {
    router.push(`/class?class=${encodeURIComponent(subject)}%20${encodeURIComponent(number)}&term=fall%202024`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="bg-orange-500 text-white py-4">
          <h1 className="text-2xl font-bold">Gen-Ed Course Recommender</h1>
        </CardHeader>
        <CardContent className="p-4">
          <Select onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Gen-Ed category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(genEdMap).map(([key, value_i]) => (
                <SelectItem key={key} value={key}>
                  {value_i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {courses.length > 0 && (
        <Card>
          <CardHeader className="bg-orange-500 text-white py-4">
            <h2 className="text-xl font-semibold">Recommended Courses</h2>
          </CardHeader>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Credit Hours</TableHead>
                  <TableHead>Average GPA</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={`${course.subject}${course.number}`}>
                    <TableCell>{`${course.subject} ${course.number}`}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.creditHours}</TableCell>
                    <TableCell>{course.gpa ? course.gpa.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleVisitClass(course.subject, course.number)}
                      >
                        Visit Class
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GenEdRecommender;