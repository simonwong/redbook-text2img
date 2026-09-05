"use client";

import { Monitor, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";

type ThemeMode = "system" | "light" | "dark";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const themes: ThemeMode[] = ["system", "light", "dark"];
    const currentIndex = themes.indexOf((theme as ThemeMode) || "system");
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const icons = {
    dark: Moon02Icon,
    light: Sun03Icon,
    system: Monitor,
  };

  const labels = {
    dark: "深色模式",
    light: "浅色模式",
    system: "跟随系统",
  };

  // Wait for hydration
  if (!mounted) {
    return (
      <Button aria-label="Theme toggle" size="icon-sm" variant="raised">
        <HugeiconsIcon className="size-[13px]" icon={Monitor} />
      </Button>
    );
  }

  const currentTheme = (theme as ThemeMode) || "system";
  const iconData = icons[currentTheme];

  return (
    <Tooltip content={labels[currentTheme]}>
      <Button
        aria-label={labels[currentTheme]}
        onClick={cycleTheme}
        size="icon-sm"
        variant="raised"
      >
        <HugeiconsIcon className="size-[13px]" icon={iconData} />
      </Button>
    </Tooltip>
  );
}
