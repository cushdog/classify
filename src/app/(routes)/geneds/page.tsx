"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { ArrowBack, Info, Search } from "@mui/icons-material";

interface Course {
  subject: string;
  number: string;
  title: string;
  description: string;
  creditHours: string;
  gpa: number;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const GenEdRecommender = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const genEdMap: { [key: string]: string } = {
    SBS_SOC:
      "Social & Beh Sci - Soc Sci, and Cultural Studies - US Minority course",
    CS_US: "Cultural Studies - US Minority course",
    HUM_HIST_CS_US:
      "Humanities - Hist & Phil, and Cultural Studies - US Minority course",
    HUM_LIT_CS_US:
      "Humanities - Lit & Arts, and Cultural Studies - US Minority course",
    ACP_CS_US:
      "Advanced Composition, and Cultural Studies - US Minority course",
    CS_NONWEST_SBS_SOC:
      "Cultural Studies - Non-West, and Social & Beh Sci - Soc Sci course",
    QR1: "Quantitative Reasoning I course",
    HUM_HIST: "Humanities - Hist & Phil course",
    ACP_HUM_HIST_CS_US:
      "Advanced Composition, Humanities - Hist & Phil, and Cultural Studies - US Minority course",
    HUM_HIST_CS_NONWEST:
      "Humanities - Hist & Phil, and Cultural Studies - Non-West course",
    JS: "James Scholars course",
    CS_WEST: "Cultural Studies - Western course",
    SBS_SOC_CS_WEST:
      "Social & Beh Sci - Soc Sci, and Cultural Studies - Western course",
    HUM_HIST_CS_WEST:
      "Humanities - Hist & Phil, and Cultural Studies - Western course",
    CS_NONWEST: "Cultural Studies - Non-West course",
    HUM_LIT: "Humanities - Lit & Arts course",
    CH_HUM_HIST: "Camp Honors/Chanc Schol, and Humanities - Hist & Phil course",
    HUM_LIT_CS_WEST:
      "Humanities - Lit & Arts, and Cultural Studies - Western course",
    HUM_LIT_CS_NONWEST:
      "Humanities - Lit & Arts, and Cultural Studies - Non-West course",
    CH_NAT_PHYS:
      "Camp Honors/Chanc Schol, and Nat Sci & Tech - Phys Sciences course",
    SBS_BEH: "Social & Beh Sci - Beh Sci course",
    COMP_I: "Composition I course",
    NAT_LIFE: "Nat Sci & Tech - Life Sciences course",
    NAT_PHYS: "Nat Sci & Tech - Phys Sciences course",
    NAT_PHYS_QR2:
      "Nat Sci & Tech - Phys Sciences, and Quantitative Reasoning II course",
    NAT_PHYS_CS_WEST:
      "Nat Sci & Tech - Phys Sciences, and Cultural Studies - Western course",
    NAT_SCI_US_MIN:
      "Nat Sci & Tech - Life Sciences, and Cultural Studies - US Minority course",
  };

  const categoryOptions = Array.from(
    new Set(
      Object.values(genEdMap).flatMap((value) =>
        value.split(", and ").flatMap((part) =>
          part
            .split(" - ")
            .slice(1)
            .map((category) => category.replace(" course", "").trim())
        )
      )
    )
  ).sort();

  useEffect(() => {
    if (selectedCategories.length > 0) {
      fetchCourses(selectedCategories);
    } else {
      setCourses([]);
    }
  }, [selectedCategories]);

  const fetchCourses = async (categories: string[]) => {
    try {
      const matchingKeys = Object.entries(genEdMap)
        .filter(([, value]) => categories.every((cat) => value.includes(cat)))
        .map(([key]) => key);
  
      const promises = matchingKeys.map((key) =>
        fetch(
          `https://uiuc-course-api-production.up.railway.app/requirements?query=${encodeURIComponent(
            genEdMap[key]
          )}`
        ).then((response) => response.json())
      );
  
      const results = await Promise.all(promises);
      const allCourses = results.flat();
  
      const distinctCourses: Course[] = Array.from(
        new Map(
          /* eslint-disable @typescript-eslint/no-explicit-any */
          allCourses.map((course: any) => [
            `${course[2]} ${course[3]}`,
            {
              subject: course[2],
              number: course[3],
              title: course[4],
              description: course[5],
              creditHours: course[6],
              gpa: course[22],
            },
          ])
        ).values()
      );
  
      setCourses(distinctCourses.sort((a, b) => b.gpa - a.gpa));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };  

  const handleVisitClass = (subject: string, number: string) => {
    const formattedQuery = `${subject} ${number}`;
    router.push(
      `/class?class=${encodeURIComponent(formattedQuery)}&term=fall%202024`
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredCourses = courses.filter((course) =>
    `${course.subject} ${course.number} ${course.title}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header
        className="bg-blue-600 text-white sticky top-0 z-10"
        style={{
          width: "100%",
          minHeight: "200px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() => router.back()}
          variant="text"
          className="text-white hover:bg-blue-700 hidden md:inline-flex"
          style={{
            alignSelf: "flex-start",
          }}
        >
          <ArrowBack className="mr-2 h-4 w-4" /> Back
        </Button>

        <div style={{ flexGrow: 1 }}></div>

        <h1
          style={{
            color: "#fff",
            fontWeight: "bold",
            marginTop: "4px",
            fontSize: "2rem",
          }}
        >
          Gen-Ed Course Offerings
        </h1>
      </header>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <StyledPaper elevation={3}>
          <Grid container spacing={2}>
            {categoryOptions.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      name={category}
                    />
                  }
                  label={category}
                />
              </Grid>
            ))}
          </Grid>
        </StyledPaper>

        {filteredCourses.length > 0 && (
          <StyledPaper elevation={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search courses by name or code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TableContainer>
              <Table aria-label="course table">
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell>Title</TableCell>
                    {!isMobile && <TableCell>Credit Hours</TableCell>}
                    <TableCell>
                      Avg. GPA
                      <Tooltip
                        title="Sorted from highest to lowest"
                        placement="top"
                      >
                        <IconButton size="small">
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={`${course.subject}${course.number}`}>
                      <TableCell component="th" scope="row">
                        {`${course.subject} ${course.number}`}
                      </TableCell>
                      <TableCell>{course.title}</TableCell>
                      {!isMobile && <TableCell>{course.creditHours}</TableCell>}
                      <TableCell>
                        {course.gpa ? course.gpa.toFixed(2) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() =>
                            handleVisitClass(course.subject, course.number)
                          }
                        >
                          Visit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        )}
      </Container>
    </>
  );
};

export default GenEdRecommender;
