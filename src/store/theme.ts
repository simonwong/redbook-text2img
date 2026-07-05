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
  setAccentColor: (accentColor: string | undefined) => void;
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

        setAccentColor: (accentColor: string | undefined) =>
          set((state) => ({
            adjustments: { ...state.adjustments, accentColor },
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
// Watermark (署名/页码，卡片附属内容，独立于主题风格)
// ============================================================

interface WatermarkState {
  // 署名水印文本（如 @你的小红书名，空串不显示）
  signature: string;

  // 是否在非封面页显示页码
  showPageNumber: boolean;

  // Actions
  setSignature: (signature: string) => void;
  setShowPageNumber: (showPageNumber: boolean) => void;
}

export const useWatermarkStore = create<WatermarkState>()(
  devtools(
    persist(
      (set) => ({
        signature: "",
        showPageNumber: true,

        setSignature: (signature: string) => set({ signature }),

        setShowPageNumber: (showPageNumber: boolean) => set({ showPageNumber }),
      }),
      {
        name: "redbook-watermark",
        partialize: (state) => ({
          signature: state.signature,
          showPageNumber: state.showPageNumber,
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
