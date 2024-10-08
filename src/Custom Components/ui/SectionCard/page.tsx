"use client";

import React, { useEffect } from "react";
import { Box, Typography, Link } from "@mui/material";
import { useState } from "react";
import { fetchData } from "@/lib/commonFunctions";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* eslint-disable @typescript-eslint/no-explicit-any */
const SectionDetails = ({ section }: { section: any[] }) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [professorInfo, setProfessorInfo] = useState<any | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(
    null
  );
  const [instructors, setInstructors] = useState<string[]>([]);

  useEffect(() => {
    const instructorData =
      section[21]
        ?.split(",")
        .map((s: string) => s.trim())
        .filter(Boolean) || [];

    if (instructorData.length === 0) {
      setInstructors(["Not available"]);
    } else {
      const instructors = [];
      for (let i = 0; i < instructorData.length; i += 2) {
        const lastName = instructorData[i];
        const firstInitial = instructorData[i + 1] || "";
        if (lastName.trim().length > 0 && firstInitial.trim().length > 0) {
          instructors.push(`${lastName}, ${firstInitial}`);
        } else {
          instructors.push("Not available");
        }
      }
      setInstructors(instructors);
    }
  }, [section]);

  const handleProfessorClick = async (professor: string) => {
    const [lastName, firstName] = professor.split(", ");
    console.log(professor.split(", "));
    const url = `https://uiuc-course-api-production.up.railway.app/rmp?query=${firstName}+${lastName}`;
    let data = await fetchData(url);

    if (!data) {
      data = "Not available";
    }
    setProfessorInfo(data);
    setSelectedProfessor(professor);
  };

  const handleLocationClick = (building: string) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      building
    )}+Champaign+Illinois`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div>
      <Box
        sx={{
          border: "1px solid #E0E0E0",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
          backgroundColor: "#F9F9F9",
        }}
      >
        {/* Section Identifier */}
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", marginBottom: "8px" }}
        >
          Section {section[7]}{" "}
          {/* section[7] contains the section identifier (e.g., ADB) */}
        </Typography>

        {section[25] !== "None" && section[25] ? (
          <Typography variant="body2" sx={{ marginBottom: "4px" }}>
            <strong>Title:</strong> {section[25]}{" "}
            {/* section[8] contains the status (e.g., A) */}
          </Typography>
        ) : null}

        {section[8] ? (
          <Typography variant="body2" sx={{ marginBottom: "4px" }}>
            <strong>Status:</strong> {section[8]}{" "}
            {/* section[8] contains the status (e.g., A) */}
          </Typography>
        ) : null}

        {section[26] ? (
          <Typography variant="body2" sx={{ marginBottom: "4px" }}>
            <strong>CRN:</strong> {section[26]}{" "}
            {/* section[8] contains the status (e.g., A) */}
          </Typography>
        ) : null}

        {section[15] ? (
          <Typography variant="body2" sx={{ marginBottom: "4px" }}>
            <strong>Type:</strong> {section[15]}{" "}
            {/* section[15] contains the type (e.g., Discussion/Recitation) */}
          </Typography>
        ) : null}

        {section[18] ? (
          <Typography variant="body2" sx={{ marginBottom: "4px" }}>
            <strong>Days:</strong> {section[18]}{" "}
            {/* section[18] contains the days (e.g., WF) */}
          </Typography>
        ) : null}

        {section[16] && section[17] ? (
          <Typography variant="body2" sx={{ marginBottom: "4px" }}>
            <strong>Time:</strong> {section[16]} - {section[17]}{" "}
            {/* section[16] is start time, section[17] is end time */}
          </Typography>
        ) : null}

        {section[19] && section[20] ? (
          <Typography variant="body2" sx={{ marginBottom: "4px" }}>
            <strong>Location:</strong> {section[19]}{" "}
            <Link
              onClick={() => handleLocationClick(section[20])}
              sx={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {section[20]}{" "}
              {/* section[19] is the room number, section[20] is the building */}
            </Link>
          </Typography>
        ) : null}

        

        {/* Instructor */}
        <Typography variant="body2">
          <strong>
            {instructors.length > 1 ? "Instructors:" : "Instructor:"}
          </strong>{" "}
          {instructors.map((instructor: string, index: number) => (
            <React.Fragment key={index}>
              {instructor === "Not available" ? (
                <strong>{instructor}</strong> // Plain text for "Not available"
              ) : (
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleProfessorClick(instructor)}
                >
                  {instructor}
                </Link>
              )}
              {index < instructors.length - 1 && "; "}
            </React.Fragment>
          ))}
        </Typography>
      </Box>
      {professorInfo && (
        <Dialog
          open={selectedProfessor !== null}
          onOpenChange={() => setSelectedProfessor(null)}
        >
          {professorInfo.personal_info ? (
            <DialogContent>
              <DialogTitle>
                Professor{" "}
                {professorInfo.personal_info.first_name +
                  " " +
                  professorInfo.personal_info.last_name}
              </DialogTitle>
              <DialogDescription>
                <p>
                  <strong>Department:</strong>{" "}
                  {professorInfo.personal_info.department}
                </p>
                <p>
                  <strong>Average Rating:</strong>{" "}
                  {professorInfo.ratings.average_rating}
                </p>
                <p>
                  <strong>Average Difficulty:</strong>{" "}
                  {professorInfo.ratings.average_difficulty}
                </p>
                <p>
                  <strong>Number of Ratings:</strong>{" "}
                  {professorInfo.ratings.number_of_ratings}
                </p>
                <p>
                  <strong>Would Take Again:</strong>{" "}
                  {professorInfo.ratings.would_take_again_percent}%
                </p>
                <h4 className="mt-4 font-semibold">Recent Ratings:</h4>
                {professorInfo.recent_ratings.map(
                  /* eslint-disable @typescript-eslint/no-explicit-any */
                  (rating: any, index: number) => (
                    <div key={index} className="mb-2">
                      <p>
                        <strong>Class:</strong> {rating.class}
                      </p>
                      <p>
                        <strong>Comment:</strong> {rating.comment}
                      </p>
                    </div>
                  )
                )}
              </DialogDescription>
            </DialogContent>
          ) : (
            <DialogContent>
              <DialogTitle>
                Professor {selectedProfessor} Information
              </DialogTitle>
              <DialogDescription>
                <p>Not available</p>
              </DialogDescription>
            </DialogContent>
          )}
        </Dialog>
      )}
    </div>
  );
};

export default SectionDetails;
