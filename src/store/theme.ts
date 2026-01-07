import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  type AdjustedStyle,
  applyAdjustments,
  defaultAdjustments,
  defaultTheme,
  generateStyles,
  type GeneratedStyles,
  getThemeById,
  type Density,
  type HeadingAlignment,
  type StyleAdjustments,
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
  // Current preset theme ID
  currentThemeId: string;

  // User's style adjustments
  adjustments: StyleAdjustments;

  // Actions
  selectPresetTheme: (themeId: string) => void;
  setDensity: (density: Density) => void;
  setFont: (fontId: string) => void;
  setHeadingAlignment: (alignment: HeadingAlignment) => void;
  setAdjustments: (adjustments: Partial<StyleAdjustments>) => void;
  resetAdjustments: () => void;

  // Computed
  getAdjustedStyle: () => AdjustedStyle;
  getGeneratedStyles: () => GeneratedStyles;
}

export const useContentThemeStore = create<ContentThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        currentThemeId: defaultTheme.id,
        adjustments: { ...defaultAdjustments },

        selectPresetTheme: (themeId: string) => {
          const theme = getThemeById(themeId);
          if (theme) {
            set({ currentThemeId: theme.id });
          }
        },

        setDensity: (density: Density) =>
          set((state) => ({
            adjustments: { ...state.adjustments, density },
          })),

        setFont: (fontId: string) =>
          set((state) => ({
            adjustments: { ...state.adjustments, fontId },
          })),

        setHeadingAlignment: (headingAlignment: HeadingAlignment) =>
          set((state) => ({
            adjustments: { ...state.adjustments, headingAlignment },
          })),

        setAdjustments: (adjustments: Partial<StyleAdjustments>) =>
          set((state) => ({
            adjustments: { ...state.adjustments, ...adjustments },
          })),

        resetAdjustments: () => {
          set({ adjustments: { ...defaultAdjustments } });
        },

        getAdjustedStyle: () => {
          const { currentThemeId, adjustments } = get();
          const theme = getThemeById(currentThemeId) ?? defaultTheme;
          return applyAdjustments(theme.style, adjustments);
        },

        getGeneratedStyles: () => generateStyles(get().getAdjustedStyle()),
      }),
      {
        name: 'redbook-content-theme',
        partialize: (state) => ({
          currentThemeId: state.currentThemeId,
          adjustments: state.adjustments,
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
