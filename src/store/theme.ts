import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  type StyleConfiguration,
  type StyleSystemCommand,
  type StyleSystemState,
  styleSystem,
} from "@/lib/style-system/style-system";

// ============================================================
// Content Theme (Image/Markdown styling)
// ============================================================

interface ContentThemeState extends StyleSystemState {
  resetConfiguration: () => void;
  resetConfigurationField: (field: keyof StyleConfiguration) => void;
  selectPresetTheme: (themeId: string) => void;
  undoThemeSelection: () => void;
  updateConfiguration: (patch: Partial<StyleConfiguration>) => void;
}

const initialStyleState = styleSystem.hydrate(undefined);

export const useContentThemeStore = create<ContentThemeState>()(
  devtools(
    persist(
      (set) => {
        const applyTransition = (
          state: ContentThemeState,
          command: StyleSystemCommand
        ) => {
          const next = styleSystem.transition(state, command);
          return {
            currentThemeId: next.currentThemeId,
            overrides: next.overrides,
            previousSelection: next.previousSelection,
          };
        };

        return {
          ...initialStyleState,

          selectPresetTheme: (themeId: string) =>
            set((state) =>
              applyTransition(state, { themeId, type: "select-theme" })
            ),

          updateConfiguration: (patch: Partial<StyleConfiguration>) =>
            set((state) =>
              applyTransition(state, { patch, type: "update-configuration" })
            ),

          resetConfiguration: () =>
            set((state) =>
              applyTransition(state, { type: "reset-configuration" })
            ),

          resetConfigurationField: (field: keyof StyleConfiguration) =>
            set((state) =>
              applyTransition(state, { field, type: "reset-field" })
            ),

          undoThemeSelection: () =>
            set((state) =>
              applyTransition(state, { type: "undo-theme-selection" })
            ),
        };
      },
      {
        name: "redbook-content-theme",
        version: 6,
        migrate: styleSystem.hydrate,
        merge: (persisted, current) => ({
          ...current,
          ...styleSystem.hydrate(persisted),
        }),
        partialize: (state) => ({
          currentThemeId: state.currentThemeId,
          overrides: state.overrides,
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
