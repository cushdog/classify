"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { ArrowBack, Info, Search } from "@mui/icons-material";
import { genEdMap } from "@/types/commonTypes";
import { ToastLib } from "@/lib/toast";
import { semesterConfigs } from "@/types/commonTypes";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    setLoading(true);
    setError(false);
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
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitClass = useCallback(
    async (searchTerm: string) => {
      // Function to perform a class search for a specific semester
      const performClassSearch = async (semester: string, year: string) => {
        const term = `${semester.toLowerCase()}+${year}`;
        const apiUrl = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
          searchTerm
        )}+${term}`;
        const redirectUrl = `/class?class=${searchTerm}&term=${encodeURIComponent(
          `${semester} ${year}`
        )}`;

        try {
          console.log("API URL", apiUrl);
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data && data.length > 0) {
            router.push(redirectUrl);
            return true;
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        return false;
      };

      // Iterate over the semester configurations until we find results
      for (const { semester, year } of semesterConfigs) {
        const found = await performClassSearch(semester, year);
        if (found) {
          return; // Stop if we found a result
        }
      }

      // If no results are found after checking all semesters
      ToastLib.notifyError("No results found for this class in any semester");
    },
    [router]
  );

  useEffect(() => {
    document.body.classList.add("no-background-gradient");
    return () => {
      document.body.classList.remove("no-background-gradient");
    };
  }, []);

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
    <div style={{ backgroundColor: "white", width: "100%", height: "100%" }}>
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

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
            }}
          >
            <CircularProgress />
            <p style={{ marginLeft: "10px" }}>
              Fetching classes, please wait...
            </p>
          </div>
        ) : error ? (
          <Alert severity="error">
            Error fetching courses. Please try again later.
          </Alert>
        ) : filteredCourses.length === 0 ? (
          <Alert severity="info">
            No courses found matching your criteria.
          </Alert>
        ) : (
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
                            handleVisitClass(
                              course.subject + " " + course.number
                            )
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
    </div>
  );
};

export default GenEdRecommender;
