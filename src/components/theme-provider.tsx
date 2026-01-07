'use client';

import { useEffect } from 'react';
import { useAppThemeStore } from '@/store/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, getEffectiveTheme } = useAppThemeStore();

  useEffect(() => {
    const applyTheme = () => {
      const effectiveTheme = getEffectiveTheme();
      const root = document.documentElement;

      if (effectiveTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme, getEffectiveTheme]);

  return <>{children}</>;
}
