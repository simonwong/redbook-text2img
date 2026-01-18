import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  type Density,
  defaultAdjustments,
  defaultTheme,
  getThemeById,
  type HeadingAlignment,
  type StyleAdjustments,
} from "@/lib/theme";

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
}

export const useContentThemeStore = create<ContentThemeState>()(
  devtools(
    persist(
      (set) => ({
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
      }),
      {
        name: "redbook-content-theme",
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
  setIsOpen: (isOpen: boolean) => void;
}

export const useSettingsPanelStore = create<SettingsPanelState>()((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
