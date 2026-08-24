import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  type StyleConfiguration,
  styleSystem,
} from "@/lib/style-system/style-system";

// ============================================================
// Content Theme (Image/Markdown styling)
// ============================================================

interface ContentThemeState {
  adjustments: StyleConfiguration;
  currentThemeId: string;
  resetAdjustments: () => void;
  selectPresetTheme: (themeId: string) => void;
  setAccentColor: (accentColor: string | undefined) => void;
  setAdjustments: (adjustments: Partial<StyleConfiguration>) => void;
  setDensity: (density: StyleConfiguration["density"]) => void;
  setFont: (fontId: string) => void;
  setHeadingAlignment: (
    alignment: StyleConfiguration["headingAlignment"]
  ) => void;
  setHeadingDecoration: (
    choice: StyleConfiguration["headingDecoration"]
  ) => void;
}

const initialStyleState = styleSystem.hydrate(undefined);

export const useContentThemeStore = create<ContentThemeState>()(
  devtools(
    persist(
      (set) => ({
        ...initialStyleState,

        // 切换主题：把风格调整重置为新主题的默认配置（密度/对齐等随主题联动）
        selectPresetTheme: (themeId: string) =>
          set((state) =>
            styleSystem.transition(state, { themeId, type: "select-theme" })
          ),

        setDensity: (density: StyleConfiguration["density"]) =>
          set((state) =>
            styleSystem.transition(state, {
              patch: { density },
              type: "update-configuration",
            })
          ),

        setFont: (fontId: string) =>
          set((state) =>
            styleSystem.transition(state, {
              patch: { fontId },
              type: "update-configuration",
            })
          ),

        setHeadingAlignment: (
          headingAlignment: StyleConfiguration["headingAlignment"]
        ) =>
          set((state) =>
            styleSystem.transition(state, {
              patch: { headingAlignment },
              type: "update-configuration",
            })
          ),

        setAccentColor: (accentColor: string | undefined) =>
          set((state) =>
            styleSystem.transition(state, {
              patch: { accentColor },
              type: "update-configuration",
            })
          ),

        setHeadingDecoration: (
          headingDecoration: StyleConfiguration["headingDecoration"]
        ) =>
          set((state) =>
            styleSystem.transition(state, {
              patch: { headingDecoration },
              type: "update-configuration",
            })
          ),

        setAdjustments: (adjustments: Partial<StyleConfiguration>) =>
          set((state) =>
            styleSystem.transition(state, {
              patch: adjustments,
              type: "update-configuration",
            })
          ),

        // 重置风格：回落到当前主题的默认配置（而非全局默认）
        resetAdjustments: () =>
          set((state) =>
            styleSystem.transition(state, { type: "reset-configuration" })
          ),
      }),
      {
        name: "redbook-content-theme",
        version: 1,
        // v0 → v1：标题装饰从"可选/跟随主题"改为必填四值。
        // - 旧数据缺 headingDecoration → 按持久化主题的精修 kind 解析（主题失效回落默认主题）；
        // - 旧数据 accentColor 为 transparent（已移除的哨兵）→ 置装饰为 "none" 且清空强调色。
        migrate: styleSystem.hydrate,
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
  setShowPageNumber: (showPageNumber: boolean) => void;
  setSignature: (signature: string) => void;
  showPageNumber: boolean;
  signature: string;
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
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const useSettingsPanelStore = create<SettingsPanelState>()((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
