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
  setBackground: (background: StyleConfiguration["background"]) => void;
  setBodyHeadingAlignment: (
    alignment: StyleConfiguration["bodyHeadingAlignment"]
  ) => void;
  setCoverLayout: (layout: StyleConfiguration["coverLayout"]) => void;
  setDecorationColor: (color: string) => void;
  setDensity: (density: StyleConfiguration["density"]) => void;
  setFont: (fontId: StyleConfiguration["fontId"]) => void;
  setHeadingDecoration: (
    choice: StyleConfiguration["headingDecoration"]
  ) => void;
  undoThemeSelection: () => void;
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

        const updateConfiguration = (
          patch: Partial<StyleConfiguration>
        ): void => {
          set((state) =>
            applyTransition(state, {
              patch,
              type: "update-configuration",
            })
          );
        };

        return {
          ...initialStyleState,

          selectPresetTheme: (themeId: string) =>
            set((state) =>
              applyTransition(state, { themeId, type: "select-theme" })
            ),

          setDensity: (density: StyleConfiguration["density"]) =>
            updateConfiguration({ density }),

          setFont: (fontId: StyleConfiguration["fontId"]) =>
            updateConfiguration({ fontId }),

          setBackground: (background: StyleConfiguration["background"]) =>
            updateConfiguration({ background }),

          setBodyHeadingAlignment: (
            bodyHeadingAlignment: StyleConfiguration["bodyHeadingAlignment"]
          ) => updateConfiguration({ bodyHeadingAlignment }),

          setCoverLayout: (coverLayout: StyleConfiguration["coverLayout"]) =>
            updateConfiguration({ coverLayout }),

          setDecorationColor: (decorationColor: string) =>
            updateConfiguration({ decorationColor }),

          setHeadingDecoration: (
            headingDecoration: StyleConfiguration["headingDecoration"]
          ) => updateConfiguration({ headingDecoration }),

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
