"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { fetchData, Course } from "@/lib/commonFunctions";
import { Button } from "@/components/ui/button";

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
      setSubjectData(data);
    };

    fetchDataAndUpdateState();
  }, []);


const handleBack = () => {
  router.back();
}
  

  return (
    <div>
      <Button onClick={handleBack}>Back</Button>
        {subjectData}
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