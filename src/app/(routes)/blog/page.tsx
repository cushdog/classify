// app/blog/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Clock } from 'lucide-react';
import camelcaseKeys from 'camelcase-keys';

interface IBlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime: number;
  tags: string[];
  likes: number;
  comments: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const BlogLayout = () => {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/blog');
                if (res.ok) {
                    const data = await res.json();
                    const camelCaseData = camelcaseKeys(data, { deep: true });
                    setPosts(camelCaseData.posts);
                } else {
                    console.error('Failed to fetch posts:', res.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

  if (loading) {
    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress sx={{ color: '#fff' }} />
        </Box>
    );
  }

  if (posts.length === 0) {
    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff' }}>
          {/* Header Section */}
          <Box
              sx={{
                width: '100%',
                minHeight: '250px',
                background: 'linear-gradient(to bottom right, #3f51b5, #757de8)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                position: 'relative',
                overflow: 'hidden',
              }}
          >
            <Typography
                variant="h4"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  marginBottom: 1,
                }}
            >
              Classify Chronicles
            </Typography>
            <Typography
                variant="subtitle1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '16px',
                }}
            >
              Be the first one to share your thoughts!
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => router.push('/blog/new')}
            >
              Create First Post
            </Button>
          </Box>

          {/* No Posts Content */}
          <Box sx={{ padding: '20px', textAlign: 'center' }}>
            <BookOpen style={{ width: '64px', height: '64px', color: '#757575' }} />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              No Posts Yet
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 2 }}>
              Be the first one to share your thoughts!
            </Typography>
          </Box>
        </Box>
    );
  }

  return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', color: '#fff' }}>
        {/* Header Section */}
        <Box
            sx={{
              width: '100%',
              minHeight: '250px',
              background: 'linear-gradient(to bottom right, #3f51b5, #757de8)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              overflow: 'hidden',
            }}
        >
          <Typography
              variant="h4"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                marginBottom: 1,
              }}
          >
            Classify Chronicles
          </Typography>
          <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '16px',
              }}
          >
            Read about the latest happenings with Classify!
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ padding: '20px' }}>
          <div className="grid gap-6">
            {posts.map((post) => (
                <Card
                    key={post.id}
                    className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/blog/${post.slug}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={post.authorAvatar ?? '/api/placeholder/32/32'} />
                          <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {post.authorName}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 'bold', marginBottom: 1 }}
                        className="group-hover:text-purple-600 transition-colors duration-200"
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="body1" className="mt-2 line-clamp-2">
                      {post.excerpt}
                    </Typography>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map((tag) => (
                          <Badge
                              key={tag}
                              variant="secondary"
                              className="hover:bg-slate-200 transition-colors"
                          >
                            {tag}
                          </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </Box>
      </Box>
  );
};

export default BlogLayout;
