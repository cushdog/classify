"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { fetchData } from "@/lib/commonFunctions";
import { Button } from "@/components/ui/button";

const lightenColor = (color: string, percent: number) => {
  let num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

const getRandomBackgroundColor = () => {
  const colors = ["#FF5F05", "#13294B"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const CourseDetails: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [classData, setClassData] = useState<any | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("#3f51b5"); // Background color state

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

      let url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
        modified_search
      )}`;

      const data = await fetchData(url);

      return data;
    };

    let data = setupClassData();
    setClassData(data);
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
