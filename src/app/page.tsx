"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const semesterConfigs = [
  { semester: "Fall", year: "2024" },
  { semester: "Spring", year: "2024" },
  { semester: "Fall", year: "2023" },
  { semester: "Spring", year: "2023" },
  { semester: "Fall", year: "2022" },
];

export default function SearchPage() {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const handleFeedbackClick = () => {
    router.push("/feedback");
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const searchWithoutTerm = (searchQuery: string) => {
    const mostRecentTerm = `${semesterConfigs[0].semester} ${semesterConfigs[0].year}`;
    const isSubjectSearch = !/\d{3}/.test(searchQuery);
    const formattedQuery = isSubjectSearch
      ? searchQuery
      : searchQuery.replace(/([a-zA-Z])(\d)/, "$1 $2");
    const modified_search = `${formattedQuery} ${semesterConfigs[0].semester.toLowerCase()} ${
      semesterConfigs[0].year
    }`;

    const url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
      modified_search
    )}`;
    console.log("Searching: ", url);

    try {
      if (isSubjectSearch) {
        router.push(
          `/subject?subject=${searchQuery}&term=${encodeURIComponent(
            mostRecentTerm
          )}`
        );
      } else {
        router.push(
          `/class?class=${formattedQuery}&term=${encodeURIComponent(
            mostRecentTerm
          )}`
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data");
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl p-4 flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={search}
              onChange={handleInputChange}
              onSubmit={() => searchWithoutTerm(search)}
            />
          </div>
          <Button
            onClick={() => searchWithoutTerm(search)}
            className="bg-black text-white p-2 rounded-lg hover:bg-black/80 w-full"
          >
            Search
          </Button>
          <Button
            onClick={handleFeedbackClick}
            className="bg-black text-white p-2 rounded-lg hover:bg-black/80 w-full">Feedback</Button>
        </div>
      </div>
    </div>
  );
}
