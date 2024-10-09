"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  Chip,
  Rating,
  Grid,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import { School, Person, ThumbUp, AccessTime, Tag } from "@mui/icons-material";
import { Mulish } from "next/font/google";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

// Define custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "Mulish, Arial, sans-serif",
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 30px 0 rgba(0,0,0,0.18)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

// Sample data structure for a review
interface Review {
  id: string;
  type: "class" | "professor";
  name: string;
  overallRating: number;
  comment: string;
  tags: string[];
  conceptualDifficulty?: number;
  weeklyWorkload?: number;
  recommendability?: number;
  professorEngagement?: number;
  lectureQuality?: number;
  assignmentQuality?: number;
  helpful: number;
  date: string;
}

// Sample data
const sampleReviews: Review[] = [
  {
    id: "1",
    type: "class",
    name: "Introduction to Computer Science",
    overallRating: 4.5,
    comment:
      "Great introductory course! The professor explains concepts clearly and the assignments are challenging but fair.",
    tags: ["Programming", "Algorithms", "Beginner-friendly"],
    conceptualDifficulty: 7,
    weeklyWorkload: 6,
    recommendability: 9,
    helpful: 42,
    date: "2023-09-15",
  },
  {
    id: "2",
    type: "professor",
    name: "Dr. Jane Smith",
    overallRating: 4.8,
    comment:
      "Dr. Smith is an exceptional professor. Her lectures are engaging and she's always available for office hours.",
    tags: ["Approachable", "Clear explanations", "Fair grading"],
    professorEngagement: 9,
    lectureQuality: 10,
    assignmentQuality: 8,
    helpful: 56,
    date: "2023-10-02",
  },
  // Add more sample reviews as needed
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const Typography = ({
  variant,
  children,
  ...props
}: {
  variant: string;
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <Box {...props} className={`${mulish.className} ${variant}`}>
    {children}
  </Box>
);

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            {review.name}
          </Typography>
          <Rating value={review.overallRating} readOnly precision={0.5} />
        </Box>
        <Typography variant="body1" mb={2}>
          {review.comment}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {review.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              icon={<Tag />}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
        <Grid container spacing={2}>
          {review.type === "class" && (
            <>
              <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                  Difficulty
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={review.conceptualDifficulty! * 10}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                  Workload
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={review.weeklyWorkload! * 10}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                  Recommendability
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={review.recommendability! * 10}
                />
              </Grid>
            </>
          )}
          {review.type === "professor" && (
            <>
              <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                  Engagement
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={review.professorEngagement! * 10}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                  Lecture Quality
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={review.lectureQuality! * 10}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                  Assignment Quality
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={review.assignmentQuality! * 10}
                />
              </Grid>
            </>
          )}
        </Grid>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Box display="flex" alignItems="center">
            <ThumbUp fontSize="small" color="action" />
            <Typography variant="body2" ml={1}>
              {review.helpful} found helpful
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" ml={1}>
              {review.date}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ReviewDisplayPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredReviews = sampleReviews.filter(
    (review) =>
      (tabValue === 0 && review.type === "class") ||
      (tabValue === 1 && review.type === "professor")
  );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Course and Professor Reviews
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab
            label={
              <Box display="flex" alignItems="center">
                <School sx={{ mr: 1 }} /> Class Reviews
              </Box>
            }
            sx={{ fontWeight: "bold" }}
          />
          <Tab
            label={
              <Box display="flex" alignItems="center">
                <Person sx={{ mr: 1 }} /> Professor Reviews
              </Box>
            }
            sx={{ fontWeight: "bold" }}
          />
        </Tabs>
        <Grid container spacing={3}>
          {filteredReviews.map((review) => (
            <Grid item xs={12} md={6} key={review.id}>
              <ReviewCard review={review} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default ReviewDisplayPage;
