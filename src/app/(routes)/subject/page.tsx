"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { fetchData } from "@/lib/commonFunctions";
import { Button } from "@/components/ui/button";

const SubjectDetails: React.FC = () => {
  const [subjectData, setSubjectData] = useState<any | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();



useEffect(() => {

    const setupClassData = async () => {

        const classParam = searchParams.get("subject")?.split(" ");
        const termParam = searchParams.get("term")?.split(" ");

        const subj = classParam ? classParam[0] : "";

        const term = termParam ? termParam[0] : "";
        const year = termParam ? termParam[1] : "";

        const modified_search = `${subj} ${term.toLowerCase()} ${year}`;

        let url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
        modified_search
        )}`;

        const data = await fetchData(url);

        return data;
        
    };

    let data = setupClassData();
    setSubjectData(data);

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