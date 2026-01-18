'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Monitor, Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/tooltip';

type ThemeMode = 'system' | 'light' | 'dark';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const themes: ThemeMode[] = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf((theme as ThemeMode) || 'system');
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const icons = {
    system: Monitor,
    light: Sun03Icon,
    dark: Moon02Icon,
  };

  const labels = {
    system: '跟随系统',
    light: '浅色模式',
    dark: '深色模式',
  };

  // Wait for hydration
  if (!mounted) {
    return (
      <Button size="icon" variant="outline" aria-label="Theme toggle">
        <HugeiconsIcon icon={Monitor} className="h-4 w-4" />
      </Button>
    );
  }

  const currentTheme = (theme as ThemeMode) || 'system';
  const iconData = icons[currentTheme];

  return (
    <Tooltip content={labels[currentTheme]}>
      <Button
        onClick={cycleTheme}
        size="icon"
        variant="outline"
        aria-label={labels[currentTheme]}
      >
        <HugeiconsIcon icon={iconData} className="h-4 w-4" />
      </Button>
    </Tooltip>
  );
}
