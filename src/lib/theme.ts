'use client';
import { createTheme } from '@mui/material/styles';
import { Mulish } from 'next/font/google';

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: mulish.style.fontFamily,
  },
});

export default theme;