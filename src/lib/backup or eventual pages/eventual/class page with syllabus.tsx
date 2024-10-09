"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Divider,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  ListItemButton,
  Fab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  fetchClassData,
  fetchSubjectFullName,
  fetchAndGroupSections,
  linkifyClasses,
  lightenColor,
  getRandomBackgroundColor,
} from "@/lib/commonFunctions";
import SectionDetails from "@/Custom Components/ui/SectionCard/page";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Typography from "@/Custom Components/ui/Typography/page";
import { Mulish } from "next/font/google";
import GPAGauge from "@/Custom Components/ui/GPA Piechart/page";
import { pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const termOptions = [
  "Fall 2023",
  "Spring 2024",
  "Summer 2024",
  "Fall 2024",
  "Spring 2025",
];

const CourseDetails: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [classData, setClassData] = useState<any | null>(null);
  const [subjectFullName, setSubjectFullName] = useState<string>("");
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [sectionsByType, setSectionsByType] = useState<Record<string, any[][]>>(
    {}
  );
  const [backgroundColor, setBackgroundColor] = useState<string>("#3f51b5");
  const [openTermDialog, setOpenTermDialog] = useState<boolean>(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [openSyllabus, setOpenSyllabus] = useState<boolean>(false);
  // const [numPages, setNumPages] = useState<number>(0);
  // const [pageNumber, setPageNumber] = useState<number>(1);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const classParam = searchParams.get("class");

  // Synchronize selectedTerm with URL parameter
  useEffect(() => {
    setSelectedTerm(searchParams.get("term"));
  }, [searchParams]);

  const handleBackClick = () => {
    router.back();
  };

  const calculateGPA = (
    gpaValue: string | number | null | undefined
  ): number => {
    if (
      !gpaValue ||
      (typeof gpaValue === "string" && isNaN(Number(gpaValue)))
    ) {
      return 0;
    }
    return Number((Math.floor(Number(gpaValue) * 100) / 100).toFixed(2));
  };

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // Handle term selection from dialog
  const handleTermSelect = (term: string) => {
    setSelectedTerm(term);
    setOpenTermDialog(false);
    updateURLWithNewTerm(term);
  };

  // Update URL with new term parameter
  const updateURLWithNewTerm = (term: string) => {
    const newParams = new URLSearchParams(Array.from(searchParams.entries()));

    if (term) {
      newParams.set("term", term);
    } else {
      newParams.delete("term");
    }

    const newPath = `${pathname}?${newParams.toString()}`;
    router.push(newPath);
  };

  // Set random background color on mount
  useEffect(() => {
    setBackgroundColor(getRandomBackgroundColor());
  }, []);

  // Fetch data whenever classParam or selectedTerm changes
  useEffect(() => {
    const fetchData = async () => {
      if (classParam) {
        try {
          // Fetch class data
          await fetchClassData(
            classParam,
            selectedTerm ?? undefined,
            setClassData,
            setSectionsByType,
            (subject: string, courseNum: string) =>
              fetchAndGroupSections(subject, courseNum, selectedTerm ?? "")
          );

          // Fetch subject full name
          const subject = classParam.split(" ")[0];
          const fullName = await fetchSubjectFullName(subject);
          setSubjectFullName(fullName);
        } catch (error) {
          console.error("Error fetching class data or sections:", error);
        }
      }
    };

    fetchData();
  }, [classParam, selectedTerm]);

  // Ensure body background color is white
  useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);



  return (
    <div className="classPage">
      <Box sx={{ minHeight: "100vh", backgroundColor: "white" }}>
        {/* Header Section */}
        <Box
          sx={{
            width: "100%",
            minHeight: "250px",
            background: `linear-gradient(to bottom right, ${backgroundColor}, ${lightenColor(
              backgroundColor,
              20
            )})`,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
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
                cursor: "pointer",
              }}
              onClick={() => setOpenTermDialog(true)}
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

        {/* Content Section */}
        <Box sx={{ padding: "20px" }}>
          {classData ? (
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

              {/* GPA Gauge Section */}
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

              {/* Sections Accordion */}
              {Object.keys(sectionsByType).map((type) => (
                <Accordion
                  key={`${type}-${selectedTerm}`}
                  expanded={expanded === type}
                  onChange={handleChange(type)}
                  sx={{
                    backgroundColor: lightenColor(backgroundColor, 20),
                    padding: "10px",
                    marginBottom: 2,
                    borderRadius: "8px",
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                    sx={{
                      "& .MuiAccordionSummary-content": {
                        margin: "12px 0 !important",
                      },
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
                    {/* eslint-disable @typescript-eslint/no-explicit-any */}
                    {sectionsByType[type].map((section: any, index: number) => (
                      <SectionDetails
                        key={`${selectedTerm}-${type}-${index}`}
                        section={section}
                      />
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
          ) : (
            // Loading Indicator
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "50vh",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>

        {/* Floating Action Button for Syllabus */}
        <Fab
          color="primary"
          aria-label="syllabus"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => setOpenSyllabus(true)}
        >
          <MenuBookIcon />
        </Fab>

        {/* Syllabus Dialog */}
        <Dialog
          fullScreen
          open={openSyllabus}
          onClose={() => setOpenSyllabus(false)}
          TransitionProps={{
            appear: true,
            in: openSyllabus,
            timeout: 500,
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpenSyllabus(false)}
            aria-label="close"
            sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#fafafa",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: isSmallScreen ? 2 : 8,
            }}
          >
<HTMLFlipBook
  className=""
  style={{}}
  size="fixed"
  startPage={1}
  width={isSmallScreen ? 300 : 600}
  height={isSmallScreen ? 400 : 800}
  minWidth={315}
  maxWidth={1000}
  minHeight={400}
  maxHeight={1350}
  maxShadowOpacity={0.5}
  showCover={true}
  drawShadow={true}
  flippingTime={1000}
  usePortrait={false}
  startZIndex={1}
  autoSize={true}
  mobileScrollSupport={true}
  clickEventForward={false}
  useMouseEvents={true}
  showPageCorners={true}
  swipeDistance={100}
  disableFlipByClick={false}>
              {/* Sample syllabus pages */}
              {[...Array(5)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h4" gutterBottom>
                    Syllabus Page {index + 1}
                  </Typography>
                  <Typography variant="body1">
                    This is a sample page of the syllabus. You can replace this
                    content with the actual syllabus content.
                  </Typography>
                </Box>
              ))}
            </HTMLFlipBook>
          </Box>
        </Dialog>
      </Box>

      {/* Term Selection Dialog */}
      <Dialog open={openTermDialog} onClose={() => setOpenTermDialog(false)}>
        <DialogTitle>Select Term</DialogTitle>
        <DialogContent dividers>
          <List>
            {termOptions.map((term) => (
              <ListItem key={term} disablePadding>
                <ListItemButton onClick={() => handleTermSelect(term)}>
                  <ListItemText primary={term} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CourseDets: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseDetails />
    </Suspense>
  );
};

export default CourseDets;