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
  Fab,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useRouter, useParams } from "next/navigation";
import {
  fetchClassData,
  fetchSubjectFullName,
  fetchAndGroupSections,
  linkifyClasses,
  lightenColor,
  getRandomBackgroundColor,
  calculateGPA,
} from "@/lib/commonFunctions";
import SectionDetails from "@/Custom Components/ui/SectionCard/page";
import GPABreakdownDialog from "@/Custom Components/ui/Visual GPA Breakdown/page";
import { PdfPreviewer } from "@/Custom Components/Misc/PDF Preview/page";
import { Mulish } from "next/font/google";
import { useTheme } from "@mui/material/styles";
import CourseEvaluations from "@/Custom Components/Misc/Evaulations/page";
import GPADistribution from "@/Custom Components/ui/GPA Distribution/page";

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

interface EvaluationData {
  desireToTake: number;
  understanding: number;
  workload: number;
  expectations: number;
  increasedInterest: number;
}

const CourseDetails: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const { year, semester, subject_name, courseNum } = params;

  // State variables
  const [expanded, setExpanded] = useState<string | false>(false);
  const [gpaExpanded, setGpaExpanded] = useState<string | false>(false);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [classData, setClassData] = useState<any | null>(null);
  const [subjectFullName, setSubjectFullName] = useState<string>("");
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [sectionsByType, setSectionsByType] = useState<Record<string, any[][]>>(
    {}
  );
  const [backgroundColor, setBackgroundColor] = useState<string>("#3f51b5");
  const [openTermDialog, setOpenTermDialog] = useState<boolean>(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [openGpaDialog, setOpenGpaDialog] = useState<boolean>(false);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [professorGpaData, setProfessorGpaData] = useState<any[]>([]);

  // New state variables for syllabus and more info
  const [syllabus, setSyllabus] = useState<string | null>(null);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [moreInfo, setMoreInfo] = useState<any[]>([]);

  // State for contribution dialog
  const [contributeDialogOpen, setContributeDialogOpen] =
    useState<boolean>(false);
  const [contributeType, setContributeType] = useState<
    "syllabus" | "moreInfo" | null
  >(null);
  const [contributionTitle, setContributionTitle] = useState<string>("");
  const [contributionText, setContributionText] = useState<string>("");
  const [contributionFile, setContributionFile] = useState<File | null>(null);

  // Dialogs for empty states
  const [openSyllabusDialog, setOpenSyllabusDialog] = useState<boolean>(false);
  const [openMoreInfoDialog, setOpenMoreInfoDialog] = useState<boolean>(false);

  // Snackbar for feedback
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(
    null
  );

  /*eslint-disable  @typescript-eslint/no-explicit-any*/
  const getGpaColor = (gpa: any) => {
    if (gpa >= 3.5) return "#4CAF50"; // Green
    if (gpa < 2.5) return "#F44336"; // Red
    return "#FFEB3B"; // Yellow
  };

  // Set random background color on mount
  useEffect(() => {
    setBackgroundColor(getRandomBackgroundColor());
  }, []);

  // Fetch class data and sections
  useEffect(() => {
    const fetchData = async () => {
      if (subject_name && courseNum) {
        try {
          const classParam = `${subject_name} ${courseNum}`;
          await fetchClassData(
            classParam,
            selectedTerm ?? `${semester} ${year}`,
            setClassData,
            setSectionsByType,
            (subj: string, course: string) =>
              fetchAndGroupSections(
                subj,
                course,
                selectedTerm ?? `${semester} ${year}`
              )
          );
          const fullName = await fetchSubjectFullName(subject_name as string);
          setSubjectFullName(fullName);

          // Fetch evaluation data
          const evaluationResponse = await fetch(
            `/api/reviews?subject=${subject_name}&courseNumber=${courseNum}`
          );
          const evaluationJson = await evaluationResponse.json();
          setEvaluationData(evaluationJson.averages);
        } catch (error) {
          console.error("Error fetching class data or sections:", error);
        }
      }
    };

    fetchData();
  }, [subject_name, courseNum, semester, year, selectedTerm]);

  // Fetch syllabus and more info
  useEffect(() => {
    if (subject_name && courseNum) {
      // Fetch syllabus
      fetch(`/api/syllabus?courseId=${subject_name}${courseNum}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.fileUrl) {
            setSyllabus(data.fileUrl);
          }
        })
        .catch((err) => console.error("Error fetching syllabus:", err));

      // Fetch more info
      fetch(`/api/moreInfo?courseId=${subject_name}${courseNum}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.posts && data.posts.length > 0) {
            setMoreInfo(data.posts);
          }
        })
        .catch((err) => console.error("Error fetching more info:", err));
    }
  }, [subject_name, courseNum]);

  // Set body background color
  useEffect(() => {
    document.body.style.backgroundColor = "#121212";
  }, []);

  // Handlers
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
  };

  const fetchProfessorGpaData = async () => {
    if (subject_name && courseNum) {
      const classParam = `${subject_name} ${courseNum}`;
      try {
        const response = await fetch(
          `https://uiuc-course-api-production.up.railway.app/professor-stats?class=${classParam}`
        );
        const data = await response.json();
        setProfessorGpaData(data);
      } catch (error) {
        console.error("Error fetching GPA data:", error);
      }
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

  const handleViewSyllabusClick = () => {
    setMenuAnchor(null);
    if (syllabus) {
      // If syllabus exists, open PDF preview
      setOpenSyllabusDialog(true);
    } else {
      // If no syllabus, open contribute dialog
      setContributeType("syllabus");
      setContributeDialogOpen(true);
    }
  };

  const handleViewMoreInfoClick = () => {
    setMenuAnchor(null);
    if (moreInfo.length > 0) {
      setOpenMoreInfoDialog(true);
    } else {
      setContributeType("moreInfo");
      setContributeDialogOpen(true);
    }
  };

  const handleContribute = async () => {
    try {
      if (contributeType === "syllabus" && contributionFile) {
        const formData = new FormData();
        formData.append("file", contributionFile);
        formData.append("courseId", `${subject_name}${courseNum}`);
        formData.append("uploadedBy", "UserID"); // Replace with actual user ID

        const response = await fetch(`/api/syllabus`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload syllabus");
        }

        const data = await response.json();
        setSyllabus(data.fileUrl);
        setSnackbarMessage("Syllabus uploaded successfully!");
      } else if (contributeType === "moreInfo") {
        const response = await fetch(`/api/moreInfo`, {
          method: "POST",
          body: JSON.stringify({
            courseId: `${subject_name}${courseNum}`,
            title: contributionTitle,
            content: contributionText,
            authorId: "UserID", // Replace with actual user ID
            authorName: "UserName", // Replace with actual user name
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to add information");
        }

        const data = await response.json();
        setMoreInfo((prev) => [...prev, data]);
        setSnackbarMessage("Information added successfully!");
      }

      // Reset contribution state
      setContributeDialogOpen(false);
      setContributeType(null);
      setContributionTitle("");
      setContributionText("");
      setContributionFile(null);
    } catch (error) {
      console.error("Error submitting contribution:", error);
      setSnackbarMessage("Failed to submit contribution. Please try again.");
    }
  };

  // 1) ADD THE SUBMIT REVIEW BUTTON
  //    This will push to /review, autofilling subject & courseNumber
  const handleSubmitReviewClick = () => {
    // If subject_name or courseNum might be string[] or undefined, make sure to convert them to a string
    const subject = Array.isArray(subject_name)
      ? subject_name[0]
      : subject_name;
    const courseNumber = Array.isArray(courseNum) ? courseNum[0] : courseNum;

    // If we have no valid string, just return (or handle however you like)
    if (!subject || !courseNumber) return;

    // Safely construct the query string
    const queryParams = new URLSearchParams({
      subject,
      courseNumber,
    }).toString();

    router.push(`/review?${queryParams}`);
  };

  return (
    <div className="classPage">
      <Box
        className="dark:bg-gray-900 bg-white"
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#fff",
        }}
      >
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
          {/* Back Button */}
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

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Class Title and Term Chip */}
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
              icon={<CalendarTodayIcon style={{ color: "white" }} />}
              label={selectedTerm ?? `${semester} ${year}`}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                fontWeight: "bold",
                padding: "4px 8px",
                cursor: "pointer",
              }}
              onClick={() => setOpenTermDialog(true)}
            />
          </Box>

          {/* Course Subtitle */}
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

          {/* Subject Full Name */}
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

        {/* Main Content Section */}
        <Box sx={{ padding: "20px", color: "#fff" }}>
          {classData ? (
            <>
              {/* Class Description or Links */}
              <Typography variant="subtitle1" gutterBottom>
                <span
                  style={mulish.style}
                  className="dark:text-white text-black"
                  dangerouslySetInnerHTML={{
                    __html: linkifyClasses(
                      classData[5],
                      `/${year}/${semester}/`
                    ),
                  }}
                />
              </Typography>

              <Divider
                className="dark:bg-gray-600 bg-gray-100"
                sx={{ marginY: 2 }}
              />

              {/* GPA Distribution */}
              <Box
                sx={{
                  backgroundColor: "#2E3B55",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow:
                    gpaExpanded === "gpa"
                      ? "0px 4px 20px rgba(0, 0, 0, 0.25)"
                      : "0px 2px 10px rgba(0, 0, 0, 0.15)",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  transform: gpaExpanded === "gpa" ? "scale(1.02)" : "scale(1)",
                  marginBottom: 2,
                }}
              >
                <Box
                  onClick={() =>
                    setGpaExpanded(gpaExpanded === "gpa" ? false : "gpa")
                  }
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 24px",
                    backgroundColor:
                      gpaExpanded === "gpa" ? "#1A2338" : "#2E3B55",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: getGpaColor(calculateGPA(classData[22])),
                      fontWeight: "bold",
                    }}
                  >
                    {classData[22] === "N/A" ||
                    calculateGPA(classData[22]) === 0.0
                      ? "GPA Data Not Available"
                      : `GPA Information (Average GPA: ${calculateGPA(
                          classData[22]
                        ).toFixed(2)})`}
                  </Typography>
                  <ExpandMoreIcon
                    sx={{
                      color: "#FFFFFF",
                      transform:
                        gpaExpanded === "gpa"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </Box>
                {gpaExpanded === "gpa" && (
                  <Box
                    sx={{
                      padding: "16px 24px",
                      backgroundColor: "#1A2338",
                      color: "#FFFFFF",
                    }}
                  >
                    <GPADistribution
                      apiUrl={`https://uiuc-course-api-production.up.railway.app/gpa-distribution?class=${encodeURIComponent(
                        subject_name + " " + courseNum
                      )}`}
                    />
                  </Box>
                )}
              </Box>

              <Divider
                className="dark:bg-gray-600 bg-gray-100"
                sx={{ marginY: 2 }}
              />

              {/* Course Evaluations */}
              {evaluationData ? (
                <Box
                  sx={{
                    backgroundColor: "#2E3B55",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow:
                      expanded === "evaluations"
                        ? "0px 4px 20px rgba(0, 0, 0, 0.25)"
                        : "0px 2px 10px rgba(0, 0, 0, 0.15)",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                    transform:
                      expanded === "evaluations" ? "scale(1.02)" : "scale(1)",
                    marginBottom: 2,
                  }}
                >
                  <Box
                    onClick={() =>
                      setExpanded(
                        expanded === "evaluations" ? false : "evaluations"
                      )
                    }
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 24px", // Reduced from 16px
                      backgroundColor:
                        expanded === "evaluations" ? "#1A2338" : "#2E3B55",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                      }}
                    >
                      Course Evaluations
                    </Typography>
                    <ExpandMoreIcon
                      sx={{
                        color: "#FFFFFF",
                        transform:
                          expanded === "evaluations"
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </Box>
                  {expanded === "evaluations" && (
                    <Box
                      sx={{
                        padding: "12px 24px", // Reduced from 16px
                        backgroundColor: "#1A2338",
                        color: "#FFFFFF",
                        maxHeight: "400px",
                        overflowY: "auto",
                      }}
                    >
                      <CourseEvaluations evaluationData={evaluationData} />

                      {/* Improved Submit Review button with reduced spacing */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                          marginTop: 2, // Reduced from 3
                          paddingTop: 2, // Reduced from 3
                        }}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleSubmitReviewClick}
                          sx={{
                            fontWeight: "medium",
                            padding: "6px 20px", // Slightly reduced padding
                            borderRadius: "8px",
                            textTransform: "none",
                            "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                            },
                          }}
                        >
                          Submit a Review
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "100px",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}

              <Divider
                className="dark:bg-gray-600 bg-gray-100"
                sx={{ marginY: 2 }}
              />

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
                    sx={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      color: "#fff",
                    }}
                  >
                    {/* eslint-disable  @typescript-eslint/no-explicit-any */}
                    {sectionsByType[type].map((section: any, index: number) => (
                      <SectionDetails
                        key={`${selectedTerm}-${type}-${index}`}
                        section={section}
                      />
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* You can display Syllabus / More Info sections here if desired */}
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
              <CircularProgress sx={{ color: "#fff" }} />
            </Box>
          )}
        </Box>

        {/* Floating Action Button (Menu) */}
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
          <MenuItem onClick={handleViewSyllabusClick}>View Syllabus</MenuItem>
          <MenuItem onClick={handleViewMoreInfoClick}>View More Info</MenuItem>
        </Menu>

        {/* GPA Breakdown Dialog */}
        <GPABreakdownDialog
          open={openGpaDialog}
          onClose={() => setOpenGpaDialog(false)}
          professorGpaData={professorGpaData}
        />

        {/* Syllabus PDF Previewer Dialog */}
        <Dialog
          open={!!syllabus && openSyllabusDialog}
          onClose={() => setOpenSyllabusDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <PdfPreviewer
            pdfUrl={syllabus || ""}
            onClose={() => setOpenSyllabusDialog(false)}
          />
        </Dialog>

        {/* More Information Dialog */}
        <Dialog
          open={openMoreInfoDialog}
          onClose={() => setOpenMoreInfoDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>More Information</DialogTitle>
          <DialogContent>
            {moreInfo.length > 0 ? (
              <List>
                {moreInfo.map((info) => (
                  <ListItem
                    key={info.id}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "4px",
                      marginY: 1,
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#fff" }}>
                      {info.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                    >
                      Posted on {new Date(info.datePosted).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#fff", marginTop: 1 }}
                    >
                      {info.content}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">
                No additional information available.
              </Typography>
            )}
          </DialogContent>
        </Dialog>

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

        {/* Contribution Dialog */}
        <Dialog
          open={contributeDialogOpen}
          onClose={() => setContributeDialogOpen(false)}
        >
          <DialogTitle>
            {contributeType === "syllabus"
              ? "Contribute Syllabus"
              : "Contribute Information"}
          </DialogTitle>
          <DialogContent>
            {contributeType === "syllabus" ? (
              <>
                <Typography variant="body1" gutterBottom>
                  Upload your syllabus file (PDF format preferred):
                </Typography>
                <Button variant="contained" component="label">
                  Choose File
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) =>
                      setContributionFile(e.target.files?.[0] ?? null)
                    }
                  />
                </Button>
                {contributionFile && (
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    Selected File: {contributionFile.name}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <Typography variant="body1" gutterBottom>
                  Enter additional information:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Enter additional information here..."
                  value={contributionText}
                  onChange={(e) => setContributionText(e.target.value)}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter title here..."
                  value={contributionTitle}
                  onChange={(e) => setContributionTitle(e.target.value)}
                  sx={{ marginTop: 2 }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setContributeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleContribute}
              disabled={
                (contributeType === "syllabus" && !contributionFile) ||
                (contributeType === "moreInfo" &&
                  (!contributionText.trim() || !contributionTitle.trim()))
              }
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for feedback */}
        <Snackbar
          open={!!snackbarMessage}
          onClose={() => setSnackbarMessage(null)}
          message={snackbarMessage}
          autoHideDuration={3000}
        />
      </Box>
    </div>
  );
};

// Wrapper component with Suspense
const CourseDets: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseDetails />
    </Suspense>
  );
};

export default CourseDets;
