'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Box, Typography, CircularProgress, Grid, Paper, TextField, 
  Button, Snackbar, Alert, Tabs, Tab, Divider, List, ListItem, 
  ListItemText, IconButton, Tooltip, Card, CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import WarningIcon from '@mui/icons-material/Warning';
import LinkIcon from '@mui/icons-material/Link';
import CreateIcon from '@mui/icons-material/Create';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const EmptyState = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    textAlign: 'center',
  }));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

interface ICourseWiki {
  className: string;
  contentCovered?: string[];
  prerequisites?: string[];
  whenToTake?: string;
  courseStructure?: string;
  instructors?: string[];
  courseTips?: string;
  lifeAfter?: string;
  infamousTopics?: string[];
  resources?: string[];
}

export default function CourseWikiPage() {
  const router = useRouter();
  const { className } = useParams();
  const [wiki, setWiki] = useState<ICourseWiki | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    contentCovered: '',
    prerequisites: '',
    whenToTake: '',
    courseStructure: '',
    instructors: '',
    courseTips: '',
    lifeAfter: '',
    infamousTopics: '',
    resources: '',
  });

  useEffect(() => {
    if (className) {
      fetch(`/api/wiki/${className}`)
        .then((res) => res.json())
        .then((data) => {
          setWiki(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [className]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    // Merge existing wiki data with form data
    const updatedData = {
      className,
      contentCovered:
        formData.contentCovered.trim() !== ''
          ? formData.contentCovered.split(',').map((item) => item.trim())
          : wiki?.contentCovered || [],
      prerequisites:
        formData.prerequisites.trim() !== ''
          ? formData.prerequisites.split(',').map((item) => item.trim())
          : wiki?.prerequisites || [],
      whenToTake:
        formData.whenToTake.trim() !== ''
          ? formData.whenToTake
          : wiki?.whenToTake || '',
      courseStructure:
        formData.courseStructure.trim() !== ''
          ? formData.courseStructure
          : wiki?.courseStructure || '',
      instructors:
        formData.instructors.trim() !== ''
          ? formData.instructors.split(',').map((item) => item.trim())
          : wiki?.instructors || [],
      courseTips:
        formData.courseTips.trim() !== ''
          ? formData.courseTips
          : wiki?.courseTips || '',
      lifeAfter:
        formData.lifeAfter.trim() !== ''
          ? formData.lifeAfter
          : wiki?.lifeAfter || '',
      infamousTopics:
        formData.infamousTopics.trim() !== ''
          ? formData.infamousTopics.split(',').map((item) => item.trim())
          : wiki?.infamousTopics || [],
      resources:
        formData.resources.trim() !== ''
          ? formData.resources.split(',').map((item) => item.trim())
          : wiki?.resources || [],
    };

    try {
      const res = await fetch(`/api/wiki/${className}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const updatedWiki = await res.json();
      setWiki(updatedWiki);
      setFormData({
        contentCovered: '',
        prerequisites: '',
        whenToTake: '',
        courseStructure: '',
        instructors: '',
        courseTips: '',
        lifeAfter: '',
        infamousTopics: '',
        resources: '',
      });
      setSuccess(true);
      setActiveTab(0); // Switch back to the Overview tab after submission
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <StyledPaper>
              <SectionTitle variant="h5"><BookIcon /> Content Covered</SectionTitle>
              {wiki?.contentCovered && wiki.contentCovered.length > 0 ? (
                <List>
                  {wiki.contentCovered.map((topic, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={topic} />
                    </ListItem>
                  ))}
                </List>
              ) : renderEmptyState("Content Covered")}
            </StyledPaper>
            <StyledPaper>
              <SectionTitle variant="h5"><SchoolIcon /> Prerequisites</SectionTitle>
              {wiki?.prerequisites && wiki.prerequisites.length > 0 ? (
                <List>
                  {wiki.prerequisites.map((prereq, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={prereq} />
                    </ListItem>
                  ))}
                </List>
              ) : renderEmptyState("Prerequisites")}
            </StyledPaper>
          </>
        );
      case 1:
        return (
          <>
            <StyledPaper>
              <SectionTitle variant="h5"><EventIcon /> When to Take</SectionTitle>
              {wiki?.whenToTake ? (
                <Typography>{wiki.whenToTake}</Typography>
              ) : renderEmptyState("When to Take")}
            </StyledPaper>
            <StyledPaper>
              <SectionTitle variant="h5"><BuildIcon /> Course Structure</SectionTitle>
              {wiki?.courseStructure ? (
                <Typography>{wiki.courseStructure}</Typography>
              ) : renderEmptyState("Course Structure")}
            </StyledPaper>
            <StyledPaper>
              <SectionTitle variant="h5"><PeopleIcon /> Instructors</SectionTitle>
              {wiki?.instructors && wiki.instructors.length > 0 ? (
                <List>
                  {wiki.instructors.map((instructor, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={instructor} />
                    </ListItem>
                  ))}
                </List>
              ) : renderEmptyState("Instructors")}
            </StyledPaper>
          </>
        );
      case 2:
        return (
          <>
            <StyledPaper>
              <SectionTitle variant="h5"><TipsAndUpdatesIcon /> Course Tips</SectionTitle>
              {wiki?.courseTips ? (
                <Typography>{wiki.courseTips}</Typography>
              ) : renderEmptyState("Course Tips")}
            </StyledPaper>
            <StyledPaper>
              <SectionTitle variant="h5"><FlightTakeoffIcon /> Life After</SectionTitle>
              {wiki?.lifeAfter ? (
                <Typography>{wiki.lifeAfter}</Typography>
              ) : renderEmptyState("Life After")}
            </StyledPaper>
          </>
        );
      case 3:
        return (
          <>
            <StyledPaper>
              <SectionTitle variant="h5"><WarningIcon /> Infamous Topics</SectionTitle>
              {wiki?.infamousTopics && wiki.infamousTopics.length > 0 ? (
                <List>
                  {wiki.infamousTopics.map((topic, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={topic} />
                    </ListItem>
                  ))}
                </List>
              ) : renderEmptyState("Infamous Topics")}
            </StyledPaper>
            <StyledPaper>
              <SectionTitle variant="h5"><LinkIcon /> Resources</SectionTitle>
              {wiki?.resources && wiki.resources.length > 0 ? (
                <List>
                  {wiki.resources.map((resource, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={resource} />
                    </ListItem>
                  ))}
                </List>
              ) : renderEmptyState("Resources")}
            </StyledPaper>
          </>
        );
      case 4:
        return (
          <StyledPaper>
            <SectionTitle variant="h5"><CreateIcon /> Contribute to Wiki</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StyledCard>
                  <CardContent>
                    <StyledTextField
                      label="Content Covered"
                      name="contentCovered"
                      value={formData.contentCovered}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={3}
                      helperText="Separate topics with commas"
                    />
                    <StyledTextField
                      label="Prerequisites"
                      name="prerequisites"
                      value={formData.prerequisites}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={3}
                      helperText="Separate prerequisites with commas"
                    />
                    <StyledTextField
                      label="When to Take"
                      name="whenToTake"
                      value={formData.whenToTake}
                      onChange={handleInputChange}
                      fullWidth
                    />
                    <StyledTextField
                      label="Course Structure"
                      name="courseStructure"
                      value={formData.courseStructure}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledCard>
                  <CardContent>
                    <StyledTextField
                      label="Instructors"
                      name="instructors"
                      value={formData.instructors}
                      onChange={handleInputChange}
                      fullWidth
                      helperText="Separate instructors with commas"
                    />
                    <StyledTextField
                      label="Course Tips"
                      name="courseTips"
                      value={formData.courseTips}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={3}
                    />
                    <StyledTextField
                      label="Life After"
                      name="lifeAfter"
                      value={formData.lifeAfter}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={3}
                    />
                    <StyledTextField
                      label="Infamous Topics"
                      name="infamousTopics"
                      value={formData.infamousTopics}
                      onChange={handleInputChange}
                      fullWidth
                      helperText="Separate topics with commas"
                    />
                    <StyledTextField
                      label="Resources"
                      name="resources"
                      value={formData.resources}
                      onChange={handleInputChange}
                      fullWidth
                      helperText="Separate resources with commas"
                    />
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  startIcon={<AddIcon />}
                  size="large"
                >
                  Submit Contribution
                </Button>
              </Grid>
            </Grid>
          </StyledPaper>
        );
      default:
        return null;
    }
  };

  const renderEmptyState = (title: string) => (
    <EmptyState>
      <EmojiObjectsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        No {title} information yet!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Be the first to contribute and help your fellow students!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setActiveTab(4)}
        sx={{ mt: 2 }}
      >
        Add {title}
      </Button>
    </EmptyState>
  );

  return (
    <Box sx={{ padding: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Typography variant="h3">{className} Wiki</Typography>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ marginBottom: 3 }}>
        <Tab label="Overview" />
        <Tab label="Course Details" />
        <Tab label="Student Experience" />
        <Tab label="Additional Info" />
        <Tab label="Contribute" />
      </Tabs>
      <Divider sx={{ marginBottom: 3 }} />
      {renderContent()}

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Thank you for your contribution!
        </Alert>
      </Snackbar>
    </Box>
  );
}