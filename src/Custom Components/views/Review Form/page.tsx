import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  TextField,
  Rating,
  Button,
  Snackbar,
  Chip,
  Slider,
  InputAdornment,
  Tabs,
  Tab,
  Typography,
  Paper,
} from '@mui/material';
import { School, Person } from '@mui/icons-material';

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

const ReviewForm: React.FC = () => {
  const { data: session, status } = useSession();
  const [tabIndex, setTabIndex] = useState(0);
  const [name, setName] = useState('');
  const [overallRating, setOverallRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [conceptualDifficulty, setConceptualDifficulty] = useState<number>(5);
  const [weeklyWorkload, setWeeklyWorkload] = useState<number>(5);
  const [recommendability, setRecommendability] = useState<number>(5);
  const [professorEngagement, setProfessorEngagement] = useState<number>(5);
  const [lectureQuality, setLectureQuality] = useState<number>(5);
  const [assignmentQuality, setAssignmentQuality] = useState<number>(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      setSnackbarMessage('You must be signed in to submit a review.');
      setSnackbarOpen(true);
      return;
    }
    
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

      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
          throw new Error('Failed to submit review');
        }

        setSnackbarMessage('Review submitted successfully!');
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
      } catch (error) {
        console.error(error);
        setSnackbarMessage('Error submitting review. Please try again.');
        setSnackbarOpen(true);
      }
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  if (status === 'loading') {
    return <Typography>Loading...</Typography>;
  }

  if (status === 'unauthenticated') {
    return <Typography>Please sign in to submit a review.</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        sx={{ mb: 2 }}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab
          label={<Typography variant="button">Class Review</Typography>}
          icon={<School />}
          iconPosition="start"
        />
        <Tab
          label={<Typography variant="button">Professor Review</Typography>}
          icon={<Person />}
          iconPosition="start"
        />
      </Tabs>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
        {tabIndex === 0 ? 'Class Review' : 'Professor Review'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={tabIndex === 0 ? 'Class Name' : 'Professor Name'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {tabIndex === 0 ? <School /> : <Person />}
              </InputAdornment>
            ),
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
        />
        <Box sx={{ mt: 2, mb: 2 }}>
          <TextField
            label="Add Tags"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <Button onClick={handleAddTag} sx={{ ml: 1 }}>
            Add Tag
          </Button>
        </Box>
        <Box sx={{ mt: 2, mb: 2 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
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
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit Review
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Paper>
  );
};

export default ReviewForm;