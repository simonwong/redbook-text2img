'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useAppThemeStore, type ThemeMode } from '@/store/theme';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/tooltip';

export function ThemeToggle() {
  const { theme, setTheme } = useAppThemeStore();

  const cycleTheme = () => {
    const themes: ThemeMode[] = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const icons = {
    system: Monitor,
    light: Sun,
    dark: Moon,
  };

  const labels = {
    system: '跟随系统',
    light: '浅色模式',
    dark: '深色模式',
  };

  const Icon = icons[theme];

  return (
    <Tooltip content={labels[theme]}>
      <Button
        onClick={cycleTheme}
        size="icon"
        variant="outline"
        aria-label={labels[theme]}
      >
        <Icon className="h-4 w-4" />
      </Button>
    </Tooltip>
  );
}
