"use client";

import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Link } from "@mui/material";
import { fetchData } from "@/lib/Library Functions and Clients/commonFunctions";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ThemeContext } from "@/lib/Theming/ThemeContext"; // Import the ThemeContext

/* eslint-disable  @typescript-eslint/no-explicit-any */
const SectionDetails = ({ section }: { section: any[] }) => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context
  const isDarkMode = theme === "dark";

  /* eslint-disable  @typescript-eslint/no-explicit-any */
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
      const instructorsList = [];
      for (let i = 0; i < instructorData.length; i += 2) {
        const lastName = instructorData[i];
        const firstInitial = instructorData[i + 1] || "";
        if (lastName.trim().length > 0 && firstInitial.trim().length > 0) {
          instructorsList.push(`${lastName}, ${firstInitial}`);
        } else {
          instructorsList.push("Not available");
        }
      }
      setInstructors(instructorsList);
    }
  }, [section]);

  const handleProfessorClick = async (professor: string) => {
    const [lastName, firstName] = professor.split(", ");
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
              border: "1px solid",
              borderColor: isDarkMode ? "#424242" : "#CCCCCC",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              backgroundColor: isDarkMode ? "#303030" : "#FFFFFF",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            }}
        >
          {/* Section Identifier */}
          <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                marginBottom: "8px",
                color: isDarkMode ? "#FFFFFF" : "#000000",
              }}
          >
            Section {section[7]}
          </Typography>

          {section[25] && section[25] !== "None" && (
              <Typography
                  variant="body2"
                  sx={{ marginBottom: "4px", color: isDarkMode ? "#FFFFFF" : "#000000" }}
              >
                <strong>Title:</strong> {section[25]}
              </Typography>
          )}

          {section[8] && (
              <Typography
                  variant="body2"
                  sx={{ marginBottom: "4px", color: isDarkMode ? "#FFFFFF" : "#000000" }}
              >
                <strong>Status:</strong> {section[8]}
              </Typography>
          )}

          {section[26] && (
              <Typography
                  variant="body2"
                  sx={{ marginBottom: "4px", color: isDarkMode ? "#FFFFFF" : "#000000" }}
              >
                <strong>CRN:</strong> {section[26]}
              </Typography>
          )}

          {section[15] && (
              <Typography
                  variant="body2"
                  sx={{ marginBottom: "4px", color: isDarkMode ? "#FFFFFF" : "#000000" }}
              >
                <strong>Type:</strong> {section[15]}
              </Typography>
          )}

          {section[18] && (
              <Typography
                  variant="body2"
                  sx={{ marginBottom: "4px", color: isDarkMode ? "#FFFFFF" : "#000000" }}
              >
                <strong>Days:</strong> {section[18]}
              </Typography>
          )}

          {section[16] && section[17] && (
              <Typography
                  variant="body2"
                  sx={{ marginBottom: "4px", color: isDarkMode ? "#FFFFFF" : "#000000" }}
              >
                <strong>Time:</strong> {section[16]} - {section[17]}
              </Typography>
          )}

          {section[19] && section[20] && (
              <Typography
                  variant="body2"
                  sx={{ marginBottom: "4px", color: isDarkMode ? "#FFFFFF" : "#000000" }}
              >
                <strong>Location:</strong> {section[19]}{" "}
                <Link
                    onClick={() => handleLocationClick(section[20])}
                    sx={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: isDarkMode ? "#90caf9" : "#1976d2",
                    }}
                >
                  {section[20]}
                </Link>
              </Typography>
          )}

          {/* Instructor */}
          <Typography variant="body2" sx={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
            <strong>
              {instructors.length > 1 ? "Instructors:" : "Instructor:"}
            </strong>{" "}
            {instructors.map((instructor: string, index: number) => (
                <React.Fragment key={index}>
                  {instructor === "Not available" ? (
                      <strong>{instructor}</strong>
                  ) : (
                      <Link
                          sx={{
                            cursor: "pointer",
                            color: isDarkMode ? "#90caf9" : "#1976d2",
                          }}
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
                  <DialogContent
                      style={{
                        backgroundColor: isDarkMode ? "#303030" : "#FFFFFF",
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                      }}
                  >
                    <DialogTitle style={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
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
                      <h4>Recent Ratings:</h4>
                      {professorInfo.recent_ratings.map(
                        /* eslint-disable  @typescript-eslint/no-explicit-any */
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
                  <DialogContent
                      style={{
                        backgroundColor: isDarkMode ? "#303030" : "#FFFFFF",
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                      }}
                  >
                    <DialogTitle style={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
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
