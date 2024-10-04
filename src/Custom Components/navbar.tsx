"use client";
import React from "react";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MobileComponent from "./ui/MobileNav/navbarMobile";
import DesktopComponent from "./ui/DesktopNav/navbarDesktop";

export default function RealNavbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme?.breakpoints?.down('sm') || '(max-width:600px)');

  return (
    <>
      {isMobile ? <MobileComponent /> : <DesktopComponent />}
    </>
  );
}