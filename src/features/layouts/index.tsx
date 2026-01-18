"use client";

import { DesktopLayout } from "./desktop-layout";
import { useDevice } from "./hooks/use-device";
import { MobileLayout } from "./mobile-layout";

export const Layout = () => {
  const { isMobile } = useDevice();
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};
