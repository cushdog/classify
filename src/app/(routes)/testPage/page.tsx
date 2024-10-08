'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  Button,
  Rating,
  Chip,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import MessageIcon from '@mui/icons-material/Message';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`review-tabpanel-${index}`}
      aria-labelledby={`review-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `review-tab-${index}`,
    'aria-controls': `review-tabpanel-${index}`,
  };
}

const ReviewComponent: React.FC = () => {
  const [value, setValue] = useState(0);
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setRating(null);
    setReview('');
  };

  const handleSubmit = () => {
    console.log('Submitted:', { type: value === 0 ? 'professor' : value === 1 ? 'class' : 'tip', rating, review });
    // Here you would typically send this data to your backend
    setRating(null);
    setReview('');
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '8px', overflow: 'hidden', marginTop: 4 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        aria-label="review tabs"
        sx={{
          bgcolor: (theme) => theme.palette.primary.main,
          '& .MuiTab-root': { color: '#fff' },
          '& .Mui-selected': { color: '#fff', fontWeight: 'bold' },
        }}
      >
        <Tab label="Professor Review" {...a11yProps(0)} />
        <Tab label="Class Review" {...a11yProps(1)} />
        <Tab label="Share a Tip" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ReviewForm type="professor" rating={rating} setRating={setRating} review={review} setReview={setReview} onSubmit={handleSubmit} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReviewForm type="class" rating={rating} setRating={setRating} review={review} setReview={setReview} onSubmit={handleSubmit} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReviewForm type="tip" review={review} setReview={setReview} onSubmit={handleSubmit} />
      </TabPanel>
    </Box>
  );
};

interface ReviewFormProps {
  type: 'professor' | 'class' | 'tip';
  rating?: number | null;
  setRating?: (rating: number | null) => void;
  review: string;
  setReview: (review: string) => void;
  onSubmit: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ type, rating, setRating, review, setReview, onSubmit }) => {
  return (
    <Card sx={{ boxShadow: 'none' }}>
      <CardContent>
        {type !== 'tip' && setRating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography component="legend" sx={{ mr: 2 }}>Rating:</Typography>
            <Rating
              name={`${type}-rating`}
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </Box>
        )}
        <TextField
          label={`Write your ${type === 'tip' ? 'tip' : 'review'} here`}
          multiline
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={onSubmit}
          startIcon={type === 'tip' ? <MessageIcon /> : <ThumbUpAltIcon />}
          fullWidth
        >
          Submit {type === 'tip' ? 'Tip' : 'Review'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReviewComponent;