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
  configuration: StyleConfiguration;
  currentThemeId: string;
  resetConfiguration: () => void;
  selectPresetTheme: (themeId: string) => void;
  setAccentColor: (accentColor: string | undefined) => void;
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
      (set) => {
        const updateConfiguration = (
          patch: Partial<StyleConfiguration>
        ): void => {
          set((state) =>
            styleSystem.transition(state, {
              patch,
              type: "update-configuration",
            })
          );
        };

        return {
          ...initialStyleState,

          selectPresetTheme: (themeId: string) =>
            set((state) =>
              styleSystem.transition(state, { themeId, type: "select-theme" })
            ),

          setDensity: (density: StyleConfiguration["density"]) =>
            updateConfiguration({ density }),

          setFont: (fontId: string) => updateConfiguration({ fontId }),

          setHeadingAlignment: (
            headingAlignment: StyleConfiguration["headingAlignment"]
          ) => updateConfiguration({ headingAlignment }),

          setAccentColor: (accentColor: string | undefined) =>
            updateConfiguration({ accentColor }),

          setHeadingDecoration: (
            headingDecoration: StyleConfiguration["headingDecoration"]
          ) => updateConfiguration({ headingDecoration }),

          resetConfiguration: () =>
            set((state) =>
              styleSystem.transition(state, { type: "reset-configuration" })
            ),
        };
      },
      {
        name: "redbook-content-theme",
        version: 1,
        // v0 → v1：标题装饰从"可选/跟随主题"改为必填四值。
        // - 旧数据缺 headingDecoration → 按持久化主题的精修 kind 解析（主题失效回落默认主题）；
        // - 旧数据 accentColor 为 transparent（已移除的哨兵）→ 置装饰为 "none" 且清空强调色。
        migrate: styleSystem.hydrate,
        merge: (persisted, current) => ({
          ...current,
          ...styleSystem.hydrate(persisted),
        }),
        partialize: (state) => ({
          configuration: state.configuration,
          currentThemeId: state.currentThemeId,
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
