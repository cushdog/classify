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
  CircularProgress,
  ListItemButton,
  Fab,
  // useMediaQuery,
  // useTheme,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
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
import { Mulish } from "next/font/google";
import GPAGauge from "@/Custom Components/ui/GPA Piechart/page";
import GPABreakdownDialog from "@/Custom Components/ui/Visual GPA Breakdown/page"; // Import your new GPABreakdownDialog component
import { calculateGPA } from "@/lib/commonFunctions";

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
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [openGpaDialog, setOpenGpaDialog] = useState<boolean>(false);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [professorGpaData, setProfessorGpaData] = useState<any[]>([]);

  // const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const classParam = searchParams.get("class");

  useEffect(() => {
    setSelectedTerm(searchParams.get("term"));
  }, [searchParams]);

  const handleBackClick = () => {
    router.back();
  };

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleTermSelect = (term: string) => {
    setSelectedTerm(term);
    setOpenTermDialog(false);
    updateURLWithNewTerm(term);
  };

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

  const fetchProfessorGpaData = async () => {
    if (classParam) {
      const response = await fetch(
        `https://uiuc-course-api-production.up.railway.app/professor-stats?class=${classParam}`
      );
      const data = await response.json();
      setProfessorGpaData(data);
    }
  };

  const handleFabClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleGpaBreakdownClick = () => {
    setMenuAnchor(null);
    fetchProfessorGpaData();
    setOpenGpaDialog(true);
  };

  useEffect(() => {
    setBackgroundColor(getRandomBackgroundColor());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (classParam) {
        try {
          await fetchClassData(
            classParam,
            selectedTerm ?? undefined,
            setClassData,
            setSectionsByType,
            (subject: string, courseNum: string) =>
              fetchAndGroupSections(subject, courseNum, selectedTerm ?? "")
          );
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

        <Fab
          color="primary"
          aria-label="menu"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleFabClick}
        >
          <MenuBookIcon />
        </Fab>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleGpaBreakdownClick}>
            View Detailed GPA Breakdown
          </MenuItem>
        </Menu>

        <GPABreakdownDialog
          open={openGpaDialog}
          onClose={() => setOpenGpaDialog(false)}
          professorGpaData={professorGpaData}
        />

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
      </Box>
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
