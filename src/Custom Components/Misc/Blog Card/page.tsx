// components/BlogCard.tsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

type BlogEntry = {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
};

interface BlogCardProps {
  entry: BlogEntry;
}

const BlogCard: React.FC<BlogCardProps> = ({ entry }) => {
  return (
    <Card sx={{ maxWidth: 345, marginBottom: 4, borderRadius: '16px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)' }}>
      <CardMedia
        component="img"
        height="200"
        image={entry.imageUrl}
        alt={entry.title}
        sx={{ borderRadius: '16px 16px 0 0' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
          {entry.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {entry.description}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ marginTop: 2, display: 'block' }}>
          {entry.date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BlogCard;