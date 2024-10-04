"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchClassData,
  fetchSubjectFullName,
  fetchAndGroupSections,
  linkifyClasses,
  lightenColor,
  getRandomBackgroundColor,
} from "@/lib/commonFunctions";
import SectionDetails from "@/Custom Components/ui/SectionCard/page";
import { Suspense } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CourseDetails: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [classData, setClassData] = useState<any | null>(null);
  const [subjectFullName, setSubjectFullName] = useState<string>("");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [sectionsByType, setSectionsByType] = useState<Record<string, any[][]>>(
    {}
  );

  // const [selectedTerm, setSelectedTerm] = useState<string>("");
  const selectedTerm = "fall 2024";
  const [backgroundColor, setBackgroundColor] = useState<string>("#3f51b5"); // Background color state

  const router = useRouter();
  const searchParams = useSearchParams();
  const classParam = searchParams.get("class");
  const termParam = searchParams.get("term");
  // const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  const handleBackClick = () => {
    router.back();
  };

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    // Set random background color on load
    setBackgroundColor(getRandomBackgroundColor());

    const fetchSectionsAndClassData = async () => {
      if (classParam) {
        try {
          await fetchClassData(
            classParam,
            selectedTerm ?? termParam ?? "",
            setClassData,
            setSectionsByType,
            fetchAndGroupSections
          );

          if (classData) {
            const groupedSections = await fetchAndGroupSections(
              classData[2],
              classData[3]
            );
            setSectionsByType(groupedSections);
          }
        } catch (error) {
          console.error("Error fetching class data or sections:", error);
        }
      }

      if (classParam) {
        const subject = classParam.split(" ")[0];
        fetchSubjectFullName(subject).then(setSubjectFullName);
      }
    };

    fetchSectionsAndClassData();
  }, [classParam, selectedTerm]);

  return (
    <Box sx={{ height: "100vh", backgroundColor: "white" }}>
      {/* Apply blur effect based on the panel's open state */}

      <Box
        sx={{
          width: "100%",
          height: "200px",
          backgroundColor: backgroundColor, // Randomized background color
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          transition: "filter 0.3s ease", // Smooth transition for blur effect
          // filter: isPanelOpen ? "blur(8px)" : "none", // Blur when panel is open
        }}
      >
        <IconButton
          onClick={handleBackClick}
          aria-label="Go back"
          sx={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "#fff",
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography
          variant="subtitle1"
          sx={{ color: "#fff", fontSize: "16px", marginTop: "4px" }}
        >
          {classData
            ? `${classData[2]} ${classData[3]} | ${subjectFullName}`
            : "Loading..."}
        </Typography>
        <Typography
          variant="h4"
          sx={{ color: "#fff", fontWeight: "bold", marginTop: "4px" }}
        >
          {classData ? `${classData[4]}` : "Loading..."}
        </Typography>

        {/* {user && (
          <Button
            onClick={handleFavoriteToggle}
            sx={{ position: "absolute", right: "20px", bottom: "20px" }}
          >
            {isFavorited ? (
              <MdFavorite size={24} color="red" />
            ) : (
              <MdFavoriteBorder size={24} />
            )}
          </Button>
        )} */}
      </Box>

      {/* Apply blur effect to the main content when the panel is open */}
      <Box
        sx={{
          padding: "20px",
          transition: "filter 0.3s ease", // Smooth transition for blur effect
          // filter: isPanelOpen ? "blur(8px)" : "none", // Blur when panel is open
        }}
      >
        {classData && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              <span
                dangerouslySetInnerHTML={{
                  __html: linkifyClasses(classData[5], "/class"),
                }}
              />
            </Typography>

            <Divider sx={{ marginY: 2 }} />

            <Typography variant="body2" gutterBottom>
              {`Average GPA: ${
                classData[22] && Number(classData[22]) > 0
                  ? Number(
                      Math.floor(Number(classData[22]) * 100) / 100
                    ).toFixed(2)
                  : "Not available"
              }`}
            </Typography>

            <Divider sx={{ marginY: 2 }} />

            {/* Render sections grouped by type */}
            {Object.keys(sectionsByType).map((type) => (
              <Accordion
                key={type}
                expanded={expanded === type}
                onChange={handleChange(type)}
                sx={{
                  backgroundColor: lightenColor(backgroundColor, 20), // Slightly lighter background color
                  height: "auto", // Taller accordion height
                  padding: "10px",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    sx={{
                      fontSize: "1.2rem", // Slightly bigger font size
                      color: "white", // White text
                      fontWeight: "bold", // Bold text
                    }}
                  >
                    {type}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ maxHeight: "400px", overflowY: "auto" }} // Taller height and scrollable
                >
                  {sectionsByType[type].map((section, index) => (
                    <SectionDetails key={index} section={section} />
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </Box>
    </Box>
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
