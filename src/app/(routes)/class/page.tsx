"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import Typography from "@/Custom Components/ui/Typography/page";
import { Mulish } from 'next/font/google';

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '700'],
});

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
    <Box sx={{ minHeight: "100vh", backgroundColor: "white" }}>
      <Box
        sx={{
          width: "100%",
          minHeight: "200px",
          backgroundColor: backgroundColor,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Ensure the content is spaced correctly
        }}
      >
        {/* Back Button at the Top Left */}
        <IconButton
          onClick={handleBackClick}
          aria-label="Go back"
          sx={{
            color: "#fff",
            alignSelf: "flex-start", // Keeps the button aligned to the left
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Spacer to push the main title to the bottom */}
        <Box sx={{ flexGrow: 1 }} />
        {/* Subtitle Typography */}
        <Typography
          variant="subtitle1"
          sx={{
            color: "#fff",
            fontSize: "16px",
            marginTop: 2,
          }}
        >
          {classData
            ? `${classData[2]} ${classData[3]} | ${subjectFullName}`
            : "Loading..."}
        </Typography>

        {/* Main Title */}
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            marginTop: "4px",
          }}
        >
          {classData ? `${classData[4]}` : "Loading..."}
        </Typography>
      </Box>

      <Box sx={{ padding: "20px" }}>
        {classData && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              <span style={mulish.style}
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
                  backgroundColor: lightenColor(backgroundColor, 20),
                  padding: "10px",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {type}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ maxHeight: "400px", overflowY: "auto" }}
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
