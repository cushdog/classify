"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { fetchData, Course } from "@/lib/commonFunctions";
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button";

const CourseDetails: React.FC = () => {
  const [classData, setClassData] = useState<Course[] | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const setupClassData = async () => {
      const classParam = searchParams.get("class")?.split(" ");
      const termParam = searchParams.get("term")?.split(" ");

      const subj = classParam ? classParam[0] : "";
      const num = classParam ? classParam[1] : "";

      const term = termParam ? termParam[0] : "";
      const year = termParam ? termParam[1] : "";

      const modified_search = `${subj} ${num} ${term.toLowerCase()} ${year}`;

      const url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
        modified_search
      )}`;

      const data = await fetchData(url);

      return data;
    };

    const fetchDataAndUpdateState = async () => {
      const data = await setupClassData();
      console.log("Fetched data:", data);
      setClassData(data);
      if (classData) {
        console.log(classData[0].description);
      }
    };

    fetchDataAndUpdateState();
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <Card className="max-w-md mx-auto mt-8 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
      <CardHeader className="bg-black bg-opacity-30 p-4">
        <h2 className="text-2xl font-bold">{classData && `${classData[2]} ${classData[3]}`}</h2>
        <p className="text-lg">{classData && String(classData[4])}</p>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <p><strong>Description:</strong> {classData && String(classData[5])}</p>
        <p><strong>Credit Hours:</strong> {classData && String(classData[6])}</p>
        <p><strong>Average GPA:</strong> {classData && String(classData[22])}</p>
      </CardContent>
      <CardFooter className="bg-black bg-opacity-30 p-4">
        <Button 
          onClick={handleBack} 
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </CardFooter>
    </Card>
  );
};

const CourseDets = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseDetails />
    </Suspense>
  );
};

export default CourseDets;
