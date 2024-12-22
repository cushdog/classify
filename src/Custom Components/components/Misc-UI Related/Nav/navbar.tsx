"use client";
import React from "react";
// import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MobileComponent from "./Mobile Nav/navbarMobile";
import DesktopComponent from "./Desktop Nav/navbarDesktop";

export default function RealNavbar() {
  // const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:1250px)');

  return (
    <>
      {isMobile ? <MobileComponent /> : <DesktopComponent />}
    </>
  );
}