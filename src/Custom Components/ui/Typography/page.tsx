import React from 'react';
import { Typography as MuiTypography, TypographyProps } from '@mui/material';
import { Mulish } from 'next/font/google';

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const Typography: React.FC<TypographyProps> = ({ children, ...props }) => {
  return (
    <MuiTypography {...props} className={mulish.className}>
      {children}
    </MuiTypography>
  );
};

export default Typography;