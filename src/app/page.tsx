"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { semesterConfigs } from "@/lib/commonFunctions";

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

  const searchWithoutTerm = async (searchQuery: string) => {
    const mostRecentTerm = `${semesterConfigs[0].semester} ${semesterConfigs[0].year}`;
    const isSubjectSearch = !/\d{3}/.test(searchQuery);
    const formattedQuery = isSubjectSearch
      ? searchQuery
      : searchQuery.replace(/([a-zA-Z])(\d)/, "$1 $2");
  
    try {
      const url = isSubjectSearch
        ? `/subject?subject=${searchQuery}&term=${encodeURIComponent(
            mostRecentTerm
          )}`
        : `/class?class=${formattedQuery}&term=${encodeURIComponent(
            mostRecentTerm
          )}`;
  
      const res = await fetch(
        `https://uiuc-course-api-production.up.railway.app/search?query=${formattedQuery}+fall+2024`
      );
      const data = await res.json();
  
      if (data && data.length > 0) {
        router.push(url);
      } else {
        toast.error("No results found");
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
              value={search.toUpperCase()}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchWithoutTerm(search);
                }
              }}
              style={{ color: "white", fontWeight: "bold" }}
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
            className="bg-black text-white p-2 rounded-lg hover:bg-black/80 w-full"
          >
            Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}
