"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { fetchData, Course } from "@/lib/commonFunctions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { semesterConfigs } from "@/lib/commonFunctions";

const SubjectDetails: React.FC = () => {
  const [subjectData, setSubjectData] = useState<Course[][] | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const setupClassData = async () => {
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

      return data;
    };

    const fetchDataAndUpdateState = async () => {
      const data = await setupClassData();

      const uniqueData = data.filter(
        (item: Course[], index: number, self: Course[][]) =>
          index === self.findIndex((t) => t[2] === item[2] && t[3] === item[3])
      );

      setSubjectData(uniqueData);
    };

    fetchDataAndUpdateState();
  }, []);

  const handleClassClick = (classNumber: string) => {
    const mostRecentTerm = `${semesterConfigs[0].semester} ${semesterConfigs[0].year}`;

    router.push(
      `/class?class=${classNumber}&term=${encodeURIComponent(mostRecentTerm)}`
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <Button onClick={handleBack}>Back</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {subjectData &&
          subjectData.map((classData, index) => (
            <Card
              key={index}
              className="max-w-md mx-auto mt-8 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
            >
              <CardHeader className="bg-black bg-opacity-30 p-4">
                <h2 className="text-2xl font-bold">{`${classData[2]} ${classData[3]}`}</h2>
                <p className="text-lg">{String(classData[4])}</p>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <p>
                  <strong>Description:</strong> {String(classData[5])}
                </p>
                <p>
                  <strong>Credit Hours:</strong> {String(classData[6])}
                </p>
                <p>
                  <strong>Average GPA:</strong> {String(classData[22])}
                </p>
              </CardContent>
              <CardFooter className="bg-black bg-opacity-30 p-4">
                <Button
                  onClick={() =>
                    handleClassClick(`${classData[2]} ${classData[3]}`)
                  }
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Visit Class
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

const SubjectDets = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubjectDetails />
    </Suspense>
  );
};

export default SubjectDets;
