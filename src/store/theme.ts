import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  defaultTheme,
  type Density,
  type FullStyle,
  generateStyles,
  type GeneratedStyles,
  getThemeById,
  type Mood,
  resolveThemeConfig,
  type ThemeConfig,
  type Tone,
} from '@/lib/theme';

// ============================================================
// App Theme (Light/Dark mode for UI)
// ============================================================

export type ThemeMode = 'system' | 'light' | 'dark';

interface AppThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useAppThemeStore = create<AppThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'system',
        setTheme: (theme) => set({ theme }),
        getEffectiveTheme: () => {
          const { theme } = get();
          if (theme === 'system') {
            if (typeof window !== 'undefined') {
              return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            }
            return 'light';
          }
          return theme;
        },
      }),
      { name: 'redbook-theme-preference' }
    )
  )
);

// ============================================================
// Content Theme (Image/Markdown styling)
// ============================================================

interface ContentThemeState {
  // Current selection
  currentThemeId: string;
  currentConfig: ThemeConfig;

  // Actions
  selectPresetTheme: (themeId: string) => void;
  setTone: (tone: Tone) => void;
  setMood: (mood: Mood) => void;
  setDensity: (density: Density) => void;
  setConfig: (config: Partial<ThemeConfig>) => void;
  resetToPreset: () => void;

  // Computed
  getFullStyle: () => FullStyle;
  getGeneratedStyles: () => GeneratedStyles;
}

export const useContentThemeStore = create<ContentThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        currentThemeId: defaultTheme.id,
        currentConfig: { ...defaultTheme.config },

        selectPresetTheme: (themeId: string) => {
          const theme = getThemeById(themeId);
          if (theme) {
            set({
              currentThemeId: theme.id,
              currentConfig: { ...theme.config },
            });
          }
        },

        setTone: (tone: Tone) =>
          set((state) => ({
            currentConfig: { ...state.currentConfig, tone },
          })),

        setMood: (mood: Mood) =>
          set((state) => ({
            currentConfig: { ...state.currentConfig, mood },
          })),

        setDensity: (density: Density) =>
          set((state) => ({
            currentConfig: { ...state.currentConfig, density },
          })),

        setConfig: (config: Partial<ThemeConfig>) =>
          set((state) => ({
            currentConfig: { ...state.currentConfig, ...config },
          })),

        resetToPreset: () => {
          const { currentThemeId } = get();
          const theme = getThemeById(currentThemeId) ?? defaultTheme;
          set({ currentConfig: { ...theme.config } });
        },

        getFullStyle: () => resolveThemeConfig(get().currentConfig),

        getGeneratedStyles: () => generateStyles(get().getFullStyle()),
      }),
      {
        name: 'redbook-content-theme',
        partialize: (state) => ({
          currentThemeId: state.currentThemeId,
          currentConfig: state.currentConfig,
        }),
      }
    )
  )
);

// ============================================================
// Settings Panel Visibility
// ============================================================

interface SettingsPanelState {
  isOpen: boolean;
  toggle: () => void;
}

export const useSettingsPanelStore = create<SettingsPanelState>()((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
