"use client";

import { DesktopLayout } from "./desktop-layout";
import { useDevice } from "./hooks/use-device";
import { MobileLayout } from "./mobile-layout";

export function Layout(): React.ReactElement | null {
  const { isMobile, isHydrated } = useDevice();

  if (!isHydrated) {
    return null;
  }

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
