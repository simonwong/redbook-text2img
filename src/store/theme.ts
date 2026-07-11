import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  type Density,
  defaultTheme,
  getThemeById,
  type HeadingAlignment,
  type HeadingDecorationChoice,
  resolveThemeDefaults,
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
  setHeadingDecoration: (choice: HeadingDecorationChoice) => void;
  setAdjustments: (adjustments: Partial<StyleAdjustments>) => void;
  resetAdjustments: () => void;
}

export const useContentThemeStore = create<ContentThemeState>()(
  devtools(
    persist(
      (set) => ({
        currentThemeId: defaultTheme.id,
        adjustments: resolveThemeDefaults(defaultTheme),

        // 切换主题：把风格调整重置为新主题的默认配置（密度/对齐等随主题联动）
        selectPresetTheme: (themeId: string) => {
          const theme = getThemeById(themeId);
          if (theme) {
            set({
              currentThemeId: theme.id,
              adjustments: resolveThemeDefaults(theme),
            });
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

        setHeadingDecoration: (choice: HeadingDecorationChoice) =>
          set((state) => ({
            adjustments: { ...state.adjustments, headingDecoration: choice },
          })),

        setAdjustments: (adjustments: Partial<StyleAdjustments>) =>
          set((state) => ({
            adjustments: { ...state.adjustments, ...adjustments },
          })),

        // 重置风格：回落到当前主题的默认配置（而非全局默认）
        resetAdjustments: () => {
          set((state) => ({
            adjustments: resolveThemeDefaults(
              getThemeById(state.currentThemeId)
            ),
          }));
        },
      }),
      {
        name: "redbook-content-theme",
        version: 1,
        // v0 → v1：标题装饰从"可选/跟随主题"改为必填四值。
        // - 旧数据缺 headingDecoration → 按持久化主题的精修 kind 解析（主题失效回落默认主题）；
        // - 旧数据 accentColor 为 transparent（已移除的哨兵）→ 置装饰为 "none" 且清空强调色。
        migrate: (persisted) => {
          const legacy = persisted as {
            currentThemeId?: string;
            adjustments?: Partial<StyleAdjustments>;
          };
          // 主题 id 失效时连 id 一起回落默认主题，保证 id 与 defaults 一致；
          // 缺失的 headingDecoration 由 spread 自然回落主题精修 kind（JSON 不存 undefined 键）
          const theme =
            getThemeById(legacy.currentThemeId ?? "") ?? defaultTheme;
          const adjustments: StyleAdjustments = {
            ...resolveThemeDefaults(theme),
            ...legacy.adjustments,
          };
          if (adjustments.accentColor === "transparent") {
            adjustments.headingDecoration = "none";
            adjustments.accentColor = undefined;
          }
          return { currentThemeId: theme.id, adjustments };
        },
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
