'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Paper } from '@mui/material';
// import { Mulish } from "next/font/google";
import ReviewForm from '@/Custom Components/views/Review Form/page';

// const mulish = Mulish({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "700"],
// });

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
  },
  typography: {
    fontFamily: 'Mulish, Arial, sans-serif',
  },
});

const navbarHeight = '64px';

export default function ReviewPage() {
  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: `calc(100vh - ${navbarHeight})`,
          paddingTop: navbarHeight,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%' }}>
          <ReviewForm />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}