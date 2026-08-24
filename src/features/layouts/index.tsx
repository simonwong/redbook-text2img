"use client";

import { DesktopLayout } from "./desktop-layout";
import { useDevice } from "./hooks/use-device";
import { MobileLayout } from "./mobile-layout";

export function Layout(): React.ReactElement | null {
  const { isHydrated, mode } = useDevice();

  if (!isHydrated) {
    return null;
  }

  return mode === "mobile" ? (
    <MobileLayout />
  ) : (
    <DesktopLayout
      settingsPresentation={mode === "wide" ? "inline" : "overlay"}
    />
  );
}
