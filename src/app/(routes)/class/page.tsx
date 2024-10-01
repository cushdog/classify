"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { fetchData } from "@/lib/commonFunctions";
import { Button } from "@/components/ui/button";

const CourseDetails: React.FC = () => {
  
  const [classData, setClassData] = useState<any[] | null>(null);

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
      setClassData(data);
    };

    fetchDataAndUpdateState();
  }, []);

  const handleBack = () => {
    router.back();
  }

  return ( 
  <div>
    <Button onClick={handleBack}>Back</Button>
    {classData}
  </div>
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
