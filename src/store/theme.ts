import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  maxCustomThemes,
  type StyleConfiguration,
  type StyleSystemCommand,
  type StyleSystemState,
  styleSystem,
} from "@/lib/style-system/style-system";
import { estimatePersistedSize, maxPersistedSize } from "./persist-size";

// ============================================================
// Content Theme (Image/Markdown styling)
// ============================================================

/** 保存失败的原因：已达上限、名称非法、本地存储放不下 */
export type SaveCustomThemeResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: "limit" | "name" | "quota" };

interface ContentThemeState extends StyleSystemState {
  deleteCustomTheme: (id: string) => void;
  resetConfiguration: () => void;
  resetConfigurationField: (field: keyof StyleConfiguration) => void;
  saveCustomTheme: (name: string) => SaveCustomThemeResult;
  selectPresetTheme: (themeId: string) => void;
  undoThemeSelection: () => void;
  updateConfiguration: (patch: Partial<StyleConfiguration>) => void;
  updateCustomTheme: () => void;
}

const initialStyleState = styleSystem.hydrate(undefined);

export const useContentThemeStore = create<ContentThemeState>()(
  devtools(
    persist(
      (set, get) => {
        const toStyleState = (next: StyleSystemState) => ({
          currentThemeId: next.currentThemeId,
          customThemes: next.customThemes,
          overrides: next.overrides,
          previousSelection: next.previousSelection,
        });
        const applyTransition = (
          state: ContentThemeState,
          command: StyleSystemCommand
        ) => toStyleState(styleSystem.transition(state, command));

        return {
          ...initialStyleState,

          deleteCustomTheme: (id: string) =>
            set((state) =>
              applyTransition(state, { id, type: "delete-custom-theme" })
            ),

          resetConfiguration: () =>
            set((state) =>
              applyTransition(state, { type: "reset-configuration" })
            ),

          resetConfigurationField: (field: keyof StyleConfiguration) =>
            set((state) =>
              applyTransition(state, { field, type: "reset-field" })
            ),

          // 保存前先算出「保存之后」的持久化体积：写进去再失败无法回滚，
          // persist 中间件会吞掉 localStorage 的配额异常
          saveCustomTheme: (name: string): SaveCustomThemeResult => {
            const state = get();
            if (state.customThemes.length >= maxCustomThemes) {
              return { ok: false, reason: "limit" };
            }
            const next = styleSystem.transition(state, {
              name,
              type: "save-custom-theme",
            });
            if (next.customThemes.length === state.customThemes.length) {
              return { ok: false, reason: "name" };
            }
            if (estimatePersistedSize(next) > maxPersistedSize) {
              return { ok: false, reason: "quota" };
            }
            set(toStyleState(next));
            return { ok: true };
          },

          selectPresetTheme: (themeId: string) =>
            set((state) =>
              applyTransition(state, { themeId, type: "select-theme" })
            ),

          undoThemeSelection: () =>
            set((state) =>
              applyTransition(state, { type: "undo-theme-selection" })
            ),

          updateConfiguration: (patch: Partial<StyleConfiguration>) =>
            set((state) =>
              applyTransition(state, { patch, type: "update-configuration" })
            ),

          updateCustomTheme: () =>
            set((state) =>
              applyTransition(state, { type: "update-custom-theme" })
            ),
        };
      },
      {
        merge: (persisted, current) => ({
          ...current,
          ...styleSystem.hydrate(persisted),
        }),
        migrate: styleSystem.hydrate,
        name: "redbook-content-theme",
        partialize: (state) => ({
          currentThemeId: state.currentThemeId,
          customThemes: state.customThemes,
          overrides: state.overrides,
        }),
        version: 6,
      }
    ),
    { enabled: process.env.NODE_ENV === "development" }
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
        setShowPageNumber: (showPageNumber: boolean) => set({ showPageNumber }),

        setSignature: (signature: string) => set({ signature }),
        showPageNumber: true,
        signature: "",
      }),
      {
        name: "redbook-watermark",
        partialize: (state) => ({
          showPageNumber: state.showPageNumber,
          signature: state.signature,
        }),
      }
    ),
    { enabled: process.env.NODE_ENV === "development" }
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
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
