'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Rating,
  Chip,
  Grid,
  CircularProgress,
  List,
  ListItem,
  Divider,
  Stack,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { styled } from '@mui/system';

// Styled Components for Enhanced Visuals
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
}));

const ReviewContainer = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.background.default,
}));

const ReviewsPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  interface Review {
    id: number;
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
    createdAt: string;
  }

  const [isClassReview, setIsClassReview] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${encodeURIComponent(name as string)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        console.log("PAGE DATA: ", data);
        if (data.success && Array.isArray(data.reviews)) {
          const fetchedReviews: Review[] = data.reviews;
          if (fetchedReviews.length > 0) {
            setIsClassReview(fetchedReviews[0].isClassReview);
            setReviews(fetchedReviews);
          } else {
            setIsClassReview(null);
            setReviews([]);
          }
        } else {
          setIsClassReview(null);
          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [name]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" padding={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (reviews.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" padding={4}>
        <Typography variant="h5">
          No reviews found for {isClassReview === null ? name : isClassReview ? `Class: ${name}` : `Professor: ${name}`}.
        </Typography>
      </Box>
    );
  }

  // Calculate Average Ratings Safely
  const averageRating = reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length || 0;

  const getAverageMetric = (metric: keyof Review) => {
    const validReviews = reviews.filter(review => typeof review[metric] === 'number');
    if (validReviews.length === 0) return 0;
    return validReviews.reduce((sum, review) => sum + (review[metric] as number), 0) / validReviews.length;
  };

  const chartData = isClassReview
    ? [
        { name: 'Difficulty', value: getAverageMetric('conceptualDifficulty') },
        { name: 'Workload', value: getAverageMetric('weeklyWorkload') },
        { name: 'Recommendability', value: getAverageMetric('recommendability') },
      ]
    : [
        { name: 'Engagement', value: getAverageMetric('professorEngagement') },
        { name: 'Lecture Quality', value: getAverageMetric('lectureQuality') },
        { name: 'Assignment Quality', value: getAverageMetric('assignmentQuality') },
      ];

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 4, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h2" gutterBottom align="center" color="textPrimary">
        Reviews for {isClassReview ? `Class: ${name}` : `Professor: ${name}`}
      </Typography>

      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Average Rating</Typography>
            <Box display="flex" alignItems="center">
              <Rating value={averageRating} readOnly precision={0.1} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {averageRating.toFixed(1)} / 5
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Total Reviews</Typography>
            <Typography variant="body1">{reviews.length}</Typography>
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          Metrics
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </StyledPaper>

      <Typography variant="h4" gutterBottom>
        Individual Reviews
      </Typography>
      <List>
        {reviews.map((review, index) => (
          <React.Fragment key={review.id}>
            <ReviewContainer>
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">{review.name}</Typography>
                  <Rating value={review.overallRating} readOnly />
                </Box>
                <Typography variant="body1" paragraph>
                  {review.comment}
                </Typography>
                <Stack direction="row" spacing={1} mb={2}>
                  {review.tags.map((tag, tagIndex) => (
                    <Chip key={tagIndex} label={tag} variant="outlined" />
                  ))}
                </Stack>
                <Grid container spacing={2}>
                  {isClassReview ? (
                    <>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Difficulty:</strong> {review.conceptualDifficulty ?? 'N/A'}/10
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Workload:</strong> {review.weeklyWorkload ?? 'N/A'}/10
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Recommendability:</strong> {review.recommendability ?? 'N/A'}/10
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Engagement:</strong> {review.professorEngagement ?? 'N/A'}/10
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Lecture Quality:</strong> {review.lectureQuality ?? 'N/A'}/10
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Assignment Quality:</strong> {review.assignmentQuality ?? 'N/A'}/10
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Posted on: {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </ReviewContainer>
            {index < reviews.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ReviewsPage;
