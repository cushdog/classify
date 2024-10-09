'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import { School, Person } from '@mui/icons-material';
import { submitReview } from '@/app/api/reviews/route';

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
        const result = await submitReview(reviewData);
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
      <div className="body1">{label}</div>
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

  return (
    <>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        sx={{ marginBottom: 2 }}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab
          label={<span className="mulish-class">Class Review</span>}
          icon={<School />}
          iconPosition="start"
        />
        <Tab
          label={<span className="mulish-class">Professor Review</span>}
          icon={<Person />}
          iconPosition="start"
        />
      </Tabs>
      <h4 className="mulish-class" style={{ fontWeight: 'bold', color: '#1976d2', fontSize: '2.5rem' }}>
        {tabIndex === 0 ? 'Class Review' : 'Professor Review'}
      </h4>
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
            className: "mulish-class",
          }}
        />
        <Box sx={{ mt: 2, mb: 2 }}>
          <div className="body1">Overall Rating</div>
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
            className: "mulish-class",
          }}
        />
        <Box sx={{ mt: 2, mb: 2 }}>
          <TextField
            label="Add Tags"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            InputProps={{
              className: "mulish-class",
            }}
          />
          <Button onClick={handleAddTag} sx={{ ml: 1 }}>
            <span className="mulish-class">Add Tag</span>
          </Button>
        </Box>
        <Box sx={{ mt: 2, mb: 2 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={<span className="mulish-class">{tag}</span>}
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
          <span className="mulish-class">Submit Review</span>
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={<span className="mulish-class">{snackbarMessage}</span>}
      />
    </>
  );
};

export default ReviewForm;