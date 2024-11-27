// src/components/GPABreakdownDialog.tsx

'use client';

import React, { useContext } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  IconButton,
  useTheme
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Brightness4, Brightness7 } from '@mui/icons-material'; // Icons for toggle
import { ThemeContext } from '@/lib/ThemeContext';

interface ProfessorGpaData {
  professor: string;
  average_gpa: number;
  total_students: number;
}

interface GPACircleProps {
  gpa: number;
}

const GPACircle: React.FC<GPACircleProps> = ({ gpa }) => {
  const { theme } = useContext(ThemeContext); // Access current theme mode

  const data = [
    { name: 'GPA', value: gpa },
    { name: 'Remaining', value: 4 - gpa },
  ];

  // Define colors based on GPA and theme mode
  const getColor = (gpa: number, themeMode: string) => {
    if (gpa > 3) return themeMode === 'dark' ? '#81C784' : '#4CAF50'; // Green variants
    if (gpa > 2.7 && gpa <= 3) return themeMode === 'dark' ? '#FFF176' : '#FFEB3B'; // Yellow variants
    return themeMode === 'dark' ? '#E57373' : '#F44336'; // Red variants
  };

  const COLORS = [getColor(gpa, theme), theme === 'dark' ? '#424242' : '#E0E0E0']; // Second color as a dark/light gray

  return (
    <ResponsiveContainer width={120} height={120}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={55}
          paddingAngle={2}
          dataKey="value"
          stroke='none'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

interface ProfessorGPACardProps {
  professor: ProfessorGpaData;
}

const ProfessorGPACard: React.FC<ProfessorGPACardProps> = ({ professor }) => {

  const { theme } = useContext(ThemeContext); // Access current theme mode

  return (
    <Card 
      sx={{ 
        minWidth: 275, 
        m: 1, 
        backgroundColor: theme === "dark" ? "black" : "white", // Adapts to theme
      }}
    >
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <GPACircle gpa={professor.average_gpa} />
          </Grid>
          <Grid item xs>
            <Typography sx={{ color: theme === "dark" ? "white" : "black"}} variant="h6" component="div">
              {professor.professor}
            </Typography>
            <Typography sx={{ mb: 1.5, color: theme === "dark" ? "white" : "black" }} color="text.secondary">
              GPA: {professor.average_gpa.toFixed(2)}
            </Typography>
            <Typography sx={{ color: theme === "dark" ? "white" : "black"}} variant="body2">
              Total Students: {professor.total_students}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

interface GPABreakdownDialogProps {
  open: boolean;
  onClose: () => void;
  professorGpaData: ProfessorGpaData[];
}

const GPABreakdownDialog: React.FC<GPABreakdownDialogProps> = ({ open, onClose, professorGpaData }) => {
  // However, if you need to customize specific styles within this component, you can use MUI's `useTheme`

  const { theme } = useContext(ThemeContext); // Access current theme mode

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: theme === "dark" ? "black" : "white", color: theme === "dark" ? "white" : "black" , display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Detailed GPA Breakdown by Professor
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: theme === "dark" ? "black" : "white"}} dividers>
        <Grid container spacing={2}>
          {professorGpaData.map((professor, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProfessorGPACard professor={professor} />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default GPABreakdownDialog;