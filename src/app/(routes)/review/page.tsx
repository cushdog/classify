"use client";

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Rating,
  Button,
  Paper,
  Container,
  Snackbar,
  Chip,
  Slider,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { School, Person } from '@mui/icons-material';
import { Mulish } from "next/font/google";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

// Define the theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Mulish, Arial, sans-serif',
  },
});

// Define the props for the component
interface ReviewPageProps {
  onSubmit: (review: ReviewData) => void;
}

// Define the structure of the review data
interface ReviewData {
  isClassReview: boolean;
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
}

const ReviewPage: React.FC<ReviewPageProps> = ({ onSubmit }) => {
  const [tabIndex, setTabIndex] = useState(0); // 0 for Class Review, 1 for Professor Review
  const [name, setName] = useState('');
  const [overallRating, setOverallRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // State for additional fields
  const [conceptualDifficulty, setConceptualDifficulty] = useState<number>(5);
  const [weeklyWorkload, setWeeklyWorkload] = useState<number>(5);
  const [recommendability, setRecommendability] = useState<number>(5);
  const [professorEngagement, setProfessorEngagement] = useState<number>(5);
  const [lectureQuality, setLectureQuality] = useState<number>(5);
  const [assignmentQuality, setAssignmentQuality] = useState<number>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && overallRating && comment) {
      const isClassReview = tabIndex === 0;
      const reviewData: ReviewData = {
        isClassReview,
        name,
        overallRating,
        comment,
        tags,
        ...(isClassReview
          ? { conceptualDifficulty, weeklyWorkload, recommendability }
          : { professorEngagement, lectureQuality, assignmentQuality }),
      };
      onSubmit(reviewData);
      setSnackbarOpen(true);
      // Reset form
      setName('');
      setOverallRating(null);
      setComment('');
      setTags([]);
      setCurrentTag('');
      setConceptualDifficulty(5);
      setWeeklyWorkload(5);
      setRecommendability(5);
      setProfessorEngagement(5);
      setLectureQuality(5);
      setAssignmentQuality(5);
    }
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const Typography: React.FC<{ variant: string; children: React.ReactNode }> = ({ variant, children }) => (
    <div className={`${mulish.className} ${variant}`}>
      {children}
    </div>
  );

  const SliderWithLabel: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({
    label,
    value,
    onChange,
  }) => (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="body1">{label}</Typography>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        step={1}
        marks
        min={1}
        max={10}
        valueLabelDisplay="auto"
      />
    </Box>
  );

  // Adjust the navbar height as needed
  const navbarHeight = '64px'; // Replace with your actual navbar height

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: `calc(100vh - ${navbarHeight})`, // Adjusted minHeight
          paddingTop: navbarHeight, // Added paddingTop to push content below navbar
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            centered
            sx={{ marginBottom: 2 }}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              label={<span className={mulish.className}>Class Review</span>}
              icon={<School />}
              iconPosition="start"
            />
            <Tab
              label={<span className={mulish.className}>Professor Review</span>}
              icon={<Person />}
              iconPosition="start"
            />
          </Tabs>
          <Typography variant="h4">
            <span
              className={mulish.className}
              style={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                fontSize: '2.5rem',
              }}
            >
              {tabIndex === 0 ? 'Class Review' : 'Professor Review'}
            </span>
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={tabIndex === 0 ? 'Class Name' : 'Professor Name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 2 }}>
                    {tabIndex === 0 ? <School /> : <Person />}
                  </InputAdornment>
                ),
                className: mulish.className,
              }}
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body1">Overall Rating</Typography>
              <Rating
                name="overall-rating"
                value={overallRating}
                onChange={(_, newValue) => setOverallRating(newValue)}
                size="large"
              />
            </Box>

            {tabIndex === 0 ? (
              <>
                <SliderWithLabel
                  label="Conceptual Difficulty"
                  value={conceptualDifficulty}
                  onChange={setConceptualDifficulty}
                />
                <SliderWithLabel
                  label="Average Weekly Workload"
                  value={weeklyWorkload}
                  onChange={setWeeklyWorkload}
                />
                <SliderWithLabel
                  label="Recommendability"
                  value={recommendability}
                  onChange={setRecommendability}
                />
              </>
            ) : (
              <>
                <SliderWithLabel
                  label="Professor's Engagement"
                  value={professorEngagement}
                  onChange={setProfessorEngagement}
                />
                <SliderWithLabel
                  label="Lecture Quality"
                  value={lectureQuality}
                  onChange={setLectureQuality}
                />
                <SliderWithLabel
                  label="Assignment Quality"
                  value={assignmentQuality}
                  onChange={setAssignmentQuality}
                />
              </>
            )}

            <TextField
              fullWidth
              label="Comment"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              margin="normal"
              required
              InputProps={{
                className: mulish.className,
              }}
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <TextField
                label="Add Tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                InputProps={{
                  className: mulish.className,
                }}
              />
              <Button onClick={handleAddTag} sx={{ ml: 1 }}>
                <span className={mulish.className}>Add Tag</span>
              </Button>
            </Box>
            <Box sx={{ mt: 2, mb: 2 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={<span className={mulish.className}>{tag}</span>}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              <span className={mulish.className}>Submit Review</span>
            </Button>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={<span className={mulish.className}>Review submitted successfully!</span>}
      />
    </ThemeProvider>
  );
};

export default ReviewPage;
