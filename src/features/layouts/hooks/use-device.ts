"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

const getInitialIsMobile = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return window.innerWidth < MOBILE_BREAKPOINT;
};

export const useDevice = () => {
  const [isMobile, setIsMobile] = useState(getInitialIsMobile);

  useEffect(() => {
    function checkDevice(): void {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }

    checkDevice();

    window.addEventListener("resize", checkDevice);
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return {
    isMobile,
    isDesktop: !isMobile,
  };
};
