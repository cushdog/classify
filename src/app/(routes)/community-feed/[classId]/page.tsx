'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import {
  Send as SendIcon,
  Event as EventIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useRouter, useParams } from 'next/navigation';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

interface Reply {
  id: number;
  postId: number;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  id: number;
  classTitle: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  title?: string;
  postType: 'event' | 'discussion';
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  createdAt: string;
  updatedAt: string;
  replies?: Reply[];
}

interface Class {
  id: number;
  name: string;
  description?: string;
}

const CommunityFeed: React.FC = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [postType, setPostType] = useState<'event' | 'discussion'>('discussion');
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
  const [expandedReplies, setExpandedReplies] = useState<{ [key: number]: boolean }>({});
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const classTitle = classId.replace('+', ' ');

  useEffect(() => {
    if (classTitle) {
      fetchPosts();
    }
  }, [classTitle]);

  const fetchPosts = async () => {
    if (!classTitle) {
      console.log("No class title provided");
      return;
    }
    setLoading(true);
    try {
      console.log(`Fetching posts for classTitle: ${classTitle}`);
      const response = await fetch(`/api/community-feed?classTitle=${encodeURIComponent(classTitle)}`);
      console.log("API response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched posts data:", data);
        setPosts(data);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!session || !newPostContent.trim() || !classTitle) {
      console.log("Missing session, newPostContent, or classTitle");
      return;
    }

    const postData = {
      classTitle,
      content: newPostContent,
      postType,
      title: postType === 'discussion' ? newPostTitle : undefined,
      eventDate: postType === 'event' ? eventDate : undefined,
      eventTime: postType === 'event' ? eventTime : undefined,
      eventLocation: postType === 'event' ? eventLocation : undefined,
    };

    try {
      console.log("Posting data:", postData);
      const response = await fetch('/api/community-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', data: postData }),
      });

      console.log("API response status (POST):", response.status);
      if (response.ok) {
        const newPost = await response.json();
        console.log("New post created:", newPost);
        setPosts([newPost, ...posts]);
        setNewPostContent('');
        setNewPostTitle('');
        setEventDate('');
        setEventTime('');
        setEventLocation('');
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleReply = async (postId: number) => {
    if (!session || !replyContent[postId] || !replyContent[postId].trim()) {
      console.log("Missing session or reply content");
      return;
    }

    const replyData = {
      postId,
      content: replyContent[postId],
    };

    try {
      console.log("Posting reply data:", replyData);
      const response = await fetch('/api/community-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'reply', data: replyData }),
      });

      console.log("API response status (Reply POST):", response.status);
      if (response.ok) {
        const newReply = await response.json();
        console.log("New reply created:", newReply);
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, replies: [...(post.replies || []), newReply] } : post
        ));
        setReplyContent({ ...replyContent, [postId]: '' });
        setExpandedReplies({ ...expandedReplies, [postId]: true });
      } else {
        console.error('Failed to create reply');
      }
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const toggleReplies = (postId: number) => {
    setExpandedReplies({ ...expandedReplies, [postId]: !expandedReplies[postId] });
  };

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'unauthenticated') {
    return <Typography>Please sign in to access the community feed.</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Community Feed
          </Typography>
          <Autocomplete
            options={classes}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for a class"
                variant="outlined"
              />
            )}
            onInputChange={(event, value) => {
              if (value.length > 2) {
                fetch(`/api/community-feed?search=${encodeURIComponent(value)}`)
                  .then(res => res.json())
                  .then(data => setClasses(data));
              }
            }}
            onChange={(event, newValue) => {
              if (newValue) {
                router.push(`/community-feed/${encodeURIComponent(newValue.name)}`);
              }
            }}
          />
        </Toolbar>
      </StyledAppBar>

      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Create a Post</Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  select
                  label="Post Type"
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as 'event' | 'discussion')}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="discussion">Discussion</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                </TextField>
                {postType === 'discussion' && (
                  <TextField
                    label="Title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    fullWidth
                  />
                )}
                {postType === 'event' && (
                  <>
                    <TextField
                      label="Event Date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Event Time"
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Event Location"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      fullWidth
                    />
                  </>
                )}
              </Box>
              <TextField
                label="Content"
                multiline
                rows={4}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handlePost}
                sx={{ mt: 2 }}
              >
                Post
              </Button>
            </CardContent>
          </Card>

          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {posts.map((post) => (
                <ListItem key={post.id} alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                  <Card sx={{ width: '100%', mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar src={post.avatar} alt={post.username} />
                        <Typography variant="subtitle1" sx={{ ml: 1 }}>
                          {post.username}
                        </Typography>
                        <Typography variant="caption" sx={{ ml: 'auto' }}>
                          {new Date(post.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      {post.postType === 'event' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EventIcon sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {post.eventDate} at {post.eventTime}, {post.eventLocation}
                          </Typography>
                        </Box>
                      )}
                      {post.title && (
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {post.title}
                        </Typography>
                      )}
                      <Typography variant="body1">{post.content}</Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          startIcon={<ChatBubbleOutlineIcon />}
                          onClick={() => toggleReplies(post.id)}
                        >
                          {expandedReplies[post.id] ? 'Hide' : 'Show'} Replies ({post.replies?.length || 0})
                        </Button>
                      </Box>
                      <Collapse in={expandedReplies[post.id]}>
                        <List>
                          {(post.replies || []).map((reply) => (
                            <ListItem key={reply.id} alignItems="flex-start">
                              <ListItemAvatar>
                                <Avatar src={reply.avatar} alt={reply.username} />
                              </ListItemAvatar>
                              <ListItemText
                                primary={reply.username}
                                secondary={
                                  <>
                                    <Typography component="span" variant="body2" color="text.primary">
                                      {reply.content}
                                    </Typography>
                                    <br />
                                    <Typography component="span" variant="caption">
                                      {new Date(reply.createdAt).toLocaleString()}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Box sx={{ display: 'flex', mt: 2 }}>
                          <TextField
                            label="Reply"
                            value={replyContent[post.id] || ''}
                            onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                            fullWidth
                          />
                          <IconButton onClick={() => handleReply(post.id)}>
                            <SendIcon />
                          </IconButton>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityFeed;
