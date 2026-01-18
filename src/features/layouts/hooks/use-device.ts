"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useDevice() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

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
    isDesktop: isMobile === null ? null : !isMobile,
    isHydrated: isMobile !== null,
  };
}
