"use client";

import { useEffect } from "react";
import { useContentThemeStore } from "@/store/theme";
import { DesktopLayout } from "./desktop-layout";
import { useDevice } from "./hooks/use-device";
import { MobileLayout } from "./mobile-layout";

export function Layout(): React.ReactElement | null {
  const { isMobile, isHydrated } = useDevice();
  const { hydrateCustomThemes } = useContentThemeStore();

  useEffect(() => {
    hydrateCustomThemes().catch(() => undefined);
  }, [hydrateCustomThemes]);

  if (!isHydrated) {
    return null;
  }

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
