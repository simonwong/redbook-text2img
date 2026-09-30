"use client";

import { DesktopLayout } from "./desktop-layout";
import { useDevice } from "./hooks/use-device";
import { LayoutSkeleton } from "./layout-skeleton";
import { MobileLayout } from "./mobile-layout";

export function Layout(): React.ReactElement {
  const { isHydrated, mode } = useDevice();

  if (!isHydrated) {
    return <LayoutSkeleton />;
  }

  return mode === "mobile" ? (
    <MobileLayout />
  ) : (
    <DesktopLayout
      settingsPresentation={mode === "wide" ? "inline" : "overlay"}
    />
  );
}
