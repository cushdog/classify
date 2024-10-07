"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Divider,
  IconButton,
  Chip,
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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Typography from "@/Custom Components/ui/Typography/page";
import { Mulish } from "next/font/google";
import GPAGauge from "@/Custom Components/ui/GPA Piechart/page";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const CourseDetails: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [classData, setClassData] = useState<any | null>(null);
  const [subjectFullName, setSubjectFullName] = useState<string>("");
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [sectionsByType, setSectionsByType] = useState<Record<string, any[][]>>({});
  const [backgroundColor, setBackgroundColor] = useState<string>("#3f51b5");

  const router = useRouter();
  const searchParams = useSearchParams();
  const classParam = searchParams.get("class");
  const termParam = searchParams.get("term");

  const selectedTerm = termParam || "Fall 2024";

  const handleBackClick = () => {
    router.back();
  };

  const calculateGPA = (gpaValue: string | number | null | undefined): number => {
    if (!gpaValue || (typeof gpaValue === "string" && isNaN(Number(gpaValue)))) {
      return 0;
    }
    return Number((Math.floor(Number(gpaValue) * 100) / 100).toFixed(2));
  };

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    setBackgroundColor(getRandomBackgroundColor());

    const fetchSectionsAndClassData = async () => {
      if (classParam) {
        try {
          await fetchClassData(
            classParam,
            selectedTerm,
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

  useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <div className="classPage">
      <Box sx={{ minHeight: "100vh", backgroundColor: "white" }}>
        <Box
          sx={{
            width: "100%",
            minHeight: "250px",
            backgroundColor: backgroundColor,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleBackClick}
            aria-label="Go back"
            sx={{
              color: "#fff",
              alignSelf: "flex-start",
              position: "absolute",
              top: 20,
              left: 20,
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                marginRight: 2,
              }}
            >
              {classData ? `${classData[2]} ${classData[3]}` : "Loading..."}
            </Typography>
            <Chip
              icon={<CalendarTodayIcon />}
              label={selectedTerm}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                color: "#fff",
                fontWeight: "bold",
                padding: "4px 8px",
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              marginBottom: 1,
            }}
          >
            {classData ? `${classData[4]}` : "Loading..."}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "16px",
            }}
          >
            {subjectFullName}
          </Typography>
        </Box>

        <Box sx={{ padding: "20px" }}>
          {classData && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                <span
                  style={mulish.style}
                  dangerouslySetInnerHTML={{
                    __html: linkifyClasses(classData[5], "/class"),
                  }}
                />
              </Typography>

              <Divider sx={{ marginY: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginY: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Average GPA
                </Typography>
                {classData[22] && Number(classData[22]) > 0 ? (
                  <GPAGauge gpa={calculateGPA(classData[22])} />
                ) : (
                  <Typography variant="body1">Not available</Typography>
                )}
              </Box>

              <Divider sx={{ marginY: 2 }} />

              {Object.keys(sectionsByType).map((type) => (
                <Accordion
                  key={type}
                  expanded={expanded === type}
                  onChange={handleChange(type)}
                  sx={{
                    backgroundColor: lightenColor(backgroundColor, 20),
                    padding: "10px",
                    marginBottom: 2,
                    borderRadius: "8px",
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        margin: '12px 0 !important',
                      }
                    }}
                  >
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