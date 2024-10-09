"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  LinearProgress,
  Typography,
  IconButton,
} from "@mui/material";
import {
  School,
  Person,
  ThumbUp,
  Tag,
  SentimentVerySatisfied,
  SentimentNeutral,
  SentimentVeryDissatisfied,
} from "@mui/icons-material";
import { Mulish } from "next/font/google";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

// Define custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#6200ea",
    },
    secondary: {
      main: "#03dac6",
    },
    background: {
      default: "#f9f9f9",
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
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
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

const getRatingIcon = (rating: number) => {
  if (rating >= 8) return <SentimentVerySatisfied color="success" />;
  if (rating >= 5) return <SentimentNeutral color="warning" />;
  return <SentimentVeryDissatisfied color="error" />;
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
            {review.type === "class" ? <School /> : <Person />}
          </Avatar>
          <Box>
            <Typography variant="h6">{review.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Reviewed on {new Date(review.date).toLocaleDateString()}
            </Typography>
          </Box>
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
        <Grid container spacing={2} mb={2}>
          {review.type === "class" && (
            <>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Conceptual Difficulty
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={review.conceptualDifficulty! * 10}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Weekly Workload
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={review.weeklyWorkload! * 10}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Recommendability
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={review.recommendability! * 10}
                  color="secondary"
                />
              </Grid>
            </>
          )}
          {review.type === "professor" && (
            <>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Engagement
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={review.professorEngagement! * 10}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Lecture Quality
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={review.lectureQuality! * 10}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Assignment Quality
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={review.assignmentQuality! * 10}
                  color="secondary"
                />
              </Grid>
            </>
          )}
        </Grid>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
        >
          <Box display="flex" alignItems="center">
            {getRatingIcon(review.overallRating * 2)}
            <Typography variant="body2" ml={1}>
              Overall Rating: {review.overallRating}/5
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton size="small" color="primary">
              <ThumbUp />
            </IconButton>
            <Typography variant="body2">{review.helpful}</Typography>
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          className={mulish.className}
        >
          📚 Course & Professor Reviews
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label={
              <Box display="flex" alignItems="center">
                <School sx={{ mr: 1 }} /> Classes
              </Box>
            }
            sx={{ fontWeight: "bold", textTransform: "none" }}
          />
          <Tab
            label={
              <Box display="flex" alignItems="center">
                <Person sx={{ mr: 1 }} /> Professors
              </Box>
            }
            sx={{ fontWeight: "bold", textTransform: "none" }}
          />
        </Tabs>
        <Grid container spacing={3}>
          {filteredReviews.map((review) => (
            <Grid item xs={12} key={review.id}>
              <ReviewCard review={review} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default ReviewDisplayPage;
