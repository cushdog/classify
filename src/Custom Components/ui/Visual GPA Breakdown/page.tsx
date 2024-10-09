import React from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProfessorGpaData {
  professor: string;
  average_gpa: number;
  total_students: number;
}

interface GPACircleProps {
  gpa: number;
}

const GPACircle: React.FC<GPACircleProps> = ({ gpa }) => {
  const data = [
    { name: 'GPA', value: gpa },
    { name: 'Remaining', value: 4 - gpa },
  ];

  // Define colors based on GPA
  const getColor = (gpa: number) => {
    if (gpa > 3) return '#4CAF50'; // Green
    if (gpa > 2.7 && gpa <= 3) return '#FFEB3B'; // Yellow
    return '#F44336'; // Red
  };

  const COLORS = [getColor(gpa), '#E0E0E0']; // Second color as a light gray for the remainder

  return (
    <ResponsiveContainer width={120} height={120}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={55}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
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

const ProfessorGPACard: React.FC<ProfessorGPACardProps> = ({ professor }) => (
  <Card sx={{ minWidth: 275, m: 1 }}>
    <CardContent>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <GPACircle gpa={professor.average_gpa} />
        </Grid>
        <Grid item xs>
          <Typography variant="h6" component="div">
            {professor.professor}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            GPA: {professor.average_gpa.toFixed(2)}
          </Typography>
          <Typography variant="body2">
            Total Students: {professor.total_students}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

interface GPABreakdownDialogProps {
  open: boolean;
  onClose: () => void;
  professorGpaData: ProfessorGpaData[];
}

const GPABreakdownDialog: React.FC<GPABreakdownDialogProps> = ({ open, onClose, professorGpaData }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>Detailed GPA Breakdown by Professor</DialogTitle>
    <DialogContent dividers>
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

export default GPABreakdownDialog;
