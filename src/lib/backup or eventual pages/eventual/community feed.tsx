// CommunityFeed.tsx
'use client';

import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Fab,
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
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Event as EventIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#ffffff', 0.15),
  '&:hover': {
    backgroundColor: alpha('#ffffff', 0.25),
  },
  marginLeft: theme.spacing(2),
  width: 'auto',
  flexGrow: 1,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  color: 'inherit',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
}));

interface Reply {
  id: number;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: number;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'event' | 'discussion';
  title?: string; // For discussion posts
  date?: string; // For event posts
  time?: string; // For event posts
  location?: string; // For event posts
  replies?: Reply[];
}

const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([
    {
      id: 1,
      user: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      type: 'discussion',
      title: 'Midterm Results',
      content: 'Does anyone know when the midterm results will be posted?',
      timestamp: 'Just now',
      replies: [],
    },
    {
      id: 2,
      user: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      type: 'event',
      content: 'Study group meeting for the upcoming exam.',
      timestamp: '2 hours ago',
      date: '2023-10-15',
      time: '17:00',
      location: 'Library Room 101',
      replies: [],
    },
    // Additional sample posts
    {
      id: 3,
      user: 'Carol Lee',
      avatar: 'https://i.pravatar.cc/150?img=3',
      type: 'event',
      content: 'Reminder: Project proposals are due next Monday.',
      timestamp: '5 hours ago',
      date: '2023-10-20',
      time: '23:59',
      location: 'Online Submission',
      replies: [],
    },
    {
      id: 4,
      user: 'Dave Martin',
      avatar: 'https://i.pravatar.cc/150?img=4',
      type: 'discussion',
      title: 'Homework Help',
      content: 'Can someone explain how to solve question 5 on the homework?',
      timestamp: '1 day ago',
      replies: [],
    },
  ]);

  const [newPostContent, setNewPostContent] = React.useState('');
  const [newPostTitle, setNewPostTitle] = React.useState('');
  const [postType, setPostType] = React.useState<'event' | 'discussion'>('discussion');
  const [replyContent, setReplyContent] = React.useState<{ [key: number]: string }>({});
  const [expandedReplies, setExpandedReplies] = React.useState<{ [key: number]: boolean }>({});
  const [eventDate, setEventDate] = React.useState('');
  const [eventTime, setEventTime] = React.useState('');
  const [eventLocation, setEventLocation] = React.useState('');

  const handlePost = () => {
    if (newPostContent.trim() === '') return;

    const newPost: Post = {
      id: Date.now(),
      user: 'You',
      avatar: 'https://i.pravatar.cc/150?img=5',
      content: newPostContent,
      timestamp: 'Just now',
      type: postType,
      replies: [],
    };

    if (postType === 'discussion') {
      newPost.title = newPostTitle || 'Untitled Discussion';
    } else if (postType === 'event') {
      newPost.date = eventDate;
      newPost.time = eventTime;
      newPost.location = eventLocation;
    }

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostTitle('');
    setEventDate('');
    setEventTime('');
    setEventLocation('');
  };

  const handleReply = (postId: number) => {
    if (!replyContent[postId] || replyContent[postId].trim() === '') return;

    const newReply: Reply = {
      id: Date.now(),
      user: 'You',
      avatar: 'https://i.pravatar.cc/150?img=6',
      content: replyContent[postId],
      timestamp: 'Just now',
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, replies: [...(post.replies || []), newReply] } : post
      )
    );

    setReplyContent({ ...replyContent, [postId]: '' });
    setExpandedReplies({ ...expandedReplies, [postId]: true });
  };

  const toggleReplies = (postId: number) => {
    setExpandedReplies({ ...expandedReplies, [postId]: !expandedReplies[postId] });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            CS101 - Intro to Computer Science
          </Typography>
          <SearchBar>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
          </SearchBar>
        </Toolbar>
      </StyledAppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          {/* Post Creation Card */}
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
                    variant="outlined"
                    fullWidth
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                )}
                {postType === 'event' && (
                  <>
                    <TextField
                      label="Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      sx={{ minWidth: 150 }}
                    />
                    <TextField
                      label="Time"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      sx={{ minWidth: 150 }}
                    />
                    <TextField
                      label="Location"
                      variant="outlined"
                      fullWidth
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                    />
                  </>
                )}
              </Box>
              <TextField
                multiline
                rows={3}
                variant="outlined"
                placeholder={
                  postType === 'event' ? 'Describe the event...' : 'Share something with your class...'
                }
                fullWidth
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                sx={{ mt: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Fab color="primary" aria-label="add" onClick={handlePost}>
                  <SendIcon />
                </Fab>
              </Box>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <List>
            {posts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  mb: 2,
                  borderLeft: post.type === 'event' ? '5px solid #ff5722' : '5px solid #3f51b5',
                }}
              >
                <CardContent>
                  <ListItem alignItems="flex-start" disableGutters>
                    <ListItemAvatar>
                      <Avatar src={post.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1">{post.user}</Typography>
                            <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>
                              • {post.timestamp}
                            </Typography>
                          </Box>
                          {post.type === 'event' && (
                            <EventIcon sx={{ color: '#ff5722', ml: 1 }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          {post.type === 'discussion' && post.title && (
                            <Typography variant="h6" sx={{ mt: 1 }}>
                              {post.title}
                            </Typography>
                          )}
                          {post.type === 'event' && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Date: {post.date}
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Time: {post.time}
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Location: {post.location}
                              </Typography>
                            </Box>
                          )}
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            {post.content}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<ChatBubbleOutlineIcon />}
                      onClick={() => toggleReplies(post.id)}
                    >
                      {post.replies && post.replies.length > 0
                        ? `${post.replies.length} ${post.replies.length > 1 ? 'Replies' : 'Reply'}`
                        : 'Reply'}
                    </Button>
                  </Box>

                  {/* Replies */}
                  <Collapse in={expandedReplies[post.id]} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2, pl: 4 }}>
                      {post.replies &&
                        post.replies.map((reply) => (
                          <Box key={reply.id} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={reply.avatar}
                                sx={{ width: 24, height: 24, mr: 1 }}
                              />
                              <Typography variant="subtitle2">{reply.user}</Typography>
                              <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>
                                • {reply.timestamp}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ ml: 4, mt: 1 }}>
                              {reply.content}
                            </Typography>
                          </Box>
                        ))}
                      {/* Reply Input */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Avatar
                          src="https://i.pravatar.cc/150?img=6"
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <TextField
                          variant="outlined"
                          size="small"
                          placeholder="Write a reply..."
                          fullWidth
                          value={replyContent[post.id] || ''}
                          onChange={(e) =>
                            setReplyContent({ ...replyContent, [post.id]: e.target.value })
                          }
                        />
                        <IconButton color="primary" onClick={() => handleReply(post.id)}>
                          <SendIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityFeed;
