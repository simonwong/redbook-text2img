"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const WIDE_BREAKPOINT = 1200;

export type LayoutMode = "medium" | "mobile" | "wide";

export const getLayoutMode = (width: number): LayoutMode => {
  if (width < MOBILE_BREAKPOINT) {
    return "mobile";
  }
  return width < WIDE_BREAKPOINT ? "medium" : "wide";
};

export function useDevice() {
  const [mode, setMode] = useState<LayoutMode | null>(null);

  useEffect(() => {
    function checkDevice(): void {
      setMode(getLayoutMode(window.innerWidth));
    }

    checkDevice();

    window.addEventListener("resize", checkDevice);
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return {
    isHydrated: mode !== null,
    isMobile: mode === null ? null : mode === "mobile",
    mode,
  };
}
