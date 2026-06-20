import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  type Density,
  defaultAdjustments,
  defaultTheme,
  type HeadingAlignment,
  type StyleAdjustments,
} from "@/lib/theme";
import {
  CUSTOM_THEME_MAX_COUNT,
  clampCustomThemeCrop,
  getDefaultCustomThemeCrop,
  getThemeNameFromFile,
  readFileAsDataUrl,
  renderCroppedThemeImage,
  validateCustomThemeFile,
} from "@/lib/theme/custom-theme-image";
import {
  deleteCustomThemeImage,
  hydrateCustomThemeRecords,
  saveCustomThemeImage,
} from "@/lib/theme/custom-theme-indexed-db";
import {
  getBasePresetThemeId,
  getResolvedThemeById,
  getThemeById,
} from "@/lib/theme/themes";
import type {
  CustomThemeCrop,
  CustomThemeRecord,
  PendingCustomThemeUpload,
} from "@/lib/theme/types";

const THEME_STORAGE_KEY = "redbook-content-theme";
const CUSTOM_THEME_ASSET_ERROR = "自定义主题图片保存失败，请稍后重试";
const CUSTOM_THEME_ERROR_STORAGE = "主题配置保存失败，请清理浏览器存储后重试";
const CUSTOM_THEME_LIMIT_ERROR = "最多只能保存 20 个自定义主题";

function getImageStorageKey(themeId: string) {
  return `custom-theme-image:${themeId}`;
}

function generateCustomThemeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `custom-theme-${Date.now()}`;
}

function canPersistThemeState(value: {
  currentThemeId: string;
  adjustments: StyleAdjustments;
  customThemes: CustomThemeRecord[];
}) {
  if (typeof window === "undefined") {
    return true;
  }

  const nextValue = JSON.stringify({
    state: {
      ...value,
      customThemes: value.customThemes.map((theme) => ({
        ...theme,
        backgroundImageDataUrl: undefined,
      })),
    },
    version: 0,
  });
  const previousValue = window.localStorage.getItem(THEME_STORAGE_KEY);

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextValue);

    if (previousValue === null) {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, previousValue);
    }

    return true;
  } catch {
    return false;
  }
}

// ============================================================
// Content Theme (Image/Markdown styling)
// ============================================================

interface ContentThemeState {
  // User's style adjustments
  adjustments: StyleAdjustments;
  cancelCustomThemeUpload: () => void;
  clearThemeError: () => void;
  commitCustomThemeCrop: (
    basePresetThemeId: string,
    name?: string
  ) => Promise<void>;

  // Current theme ID
  currentThemeId: string;
  customThemes: CustomThemeRecord[];
  deleteCustomTheme: (themeId: string) => void;
  hasHydratedCustomThemes: boolean;
  hydrateCustomThemes: () => Promise<void>;
  isCropperOpen: boolean;
  pendingUpload: PendingCustomThemeUpload | null;
  resetAdjustments: () => void;

  // Actions
  selectTheme: (themeId: string) => void;
  setAdjustments: (adjustments: Partial<StyleAdjustments>) => void;
  setDensity: (density: Density) => void;
  setFont: (fontId: string) => void;
  setHeadingAlignment: (alignment: HeadingAlignment) => void;
  startCustomThemeUpload: (file: File) => Promise<void>;
  themeError: string | null;
  updatePendingCrop: (crop: Partial<CustomThemeCrop>) => void;
}

export const useContentThemeStore = create<ContentThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        currentThemeId: defaultTheme.id,
        customThemes: [],
        hasHydratedCustomThemes: false,
        pendingUpload: null,
        isCropperOpen: false,
        themeError: null,
        adjustments: { ...defaultAdjustments },

        selectTheme: (themeId: string) => {
          const { customThemes } = get();
          const theme = getResolvedThemeById(themeId, customThemes);
          if (theme) {
            set({ currentThemeId: theme.id, themeError: null });
          }
        },

        startCustomThemeUpload: async (file: File) => {
          const { currentThemeId, customThemes } = get();

          if (customThemes.length >= CUSTOM_THEME_MAX_COUNT) {
            set({ themeError: CUSTOM_THEME_LIMIT_ERROR });
            return;
          }

          try {
            validateCustomThemeFile(file);
            const imageDataUrl = await readFileAsDataUrl(file);
            const image = await new Promise<HTMLImageElement>(
              (resolve, reject) => {
                const instance = new Image();
                instance.onload = () => resolve(instance);
                instance.onerror = () =>
                  reject(new Error("图片加载失败，请更换文件"));
                instance.src = imageDataUrl;
              }
            );
            const basePresetThemeId = getBasePresetThemeId(
              currentThemeId,
              customThemes
            );

            set({
              pendingUpload: {
                imageDataUrl,
                themeName: getThemeNameFromFile(file.name),
                basePresetThemeId,
                crop: getDefaultCustomThemeCrop(
                  image.naturalWidth,
                  image.naturalHeight
                ),
              },
              isCropperOpen: true,
              themeError: null,
            });
          } catch (error) {
            set({
              pendingUpload: null,
              isCropperOpen: false,
              themeError:
                error instanceof Error ? error.message : "图片处理失败，请重试",
            });
          }
        },

        updatePendingCrop: (crop: Partial<CustomThemeCrop>) =>
          set((state) => {
            if (!state.pendingUpload) {
              return state;
            }

            return {
              pendingUpload: {
                ...state.pendingUpload,
                crop: clampCustomThemeCrop({
                  ...state.pendingUpload.crop,
                  ...crop,
                }),
              },
            };
          }),

        hydrateCustomThemes: async () => {
          const { currentThemeId, customThemes, hasHydratedCustomThemes } =
            get();

          if (hasHydratedCustomThemes) {
            return;
          }

          try {
            const hydratedThemes =
              await hydrateCustomThemeRecords(customThemes);
            const fallbackThemeId =
              getResolvedThemeById(currentThemeId, hydratedThemes)?.id ??
              getThemeById(getBasePresetThemeId(currentThemeId, hydratedThemes))
                ?.id ??
              defaultTheme.id;

            set({
              currentThemeId: fallbackThemeId,
              customThemes: hydratedThemes,
              hasHydratedCustomThemes: true,
            });
          } catch {
            set({
              hasHydratedCustomThemes: true,
              themeError: CUSTOM_THEME_ASSET_ERROR,
            });
          }
        },

        commitCustomThemeCrop: async (basePresetThemeId: string, name) => {
          const { adjustments, customThemes, pendingUpload } = get();

          if (!pendingUpload) {
            return;
          }

          try {
            const croppedImage = await renderCroppedThemeImage(
              pendingUpload.imageDataUrl,
              pendingUpload.crop
            );
            const resolvedBaseThemeId =
              getThemeById(basePresetThemeId)?.id ??
              pendingUpload.basePresetThemeId ??
              defaultTheme.id;
            const themeId = generateCustomThemeId();
            const imageStorageKey = getImageStorageKey(themeId);

            await saveCustomThemeImage(imageStorageKey, croppedImage);

            const nextTheme: CustomThemeRecord = {
              id: themeId,
              name: name?.trim() || pendingUpload.themeName,
              basePresetThemeId: resolvedBaseThemeId,
              backgroundImageDataUrl: croppedImage,
              crop: pendingUpload.crop,
              createdAt: Date.now(),
              imageStorageKey,
            };
            const nextCustomThemes = [nextTheme, ...customThemes];

            if (
              !canPersistThemeState({
                currentThemeId: nextTheme.id,
                adjustments,
                customThemes: nextCustomThemes,
              })
            ) {
              set({ themeError: CUSTOM_THEME_ERROR_STORAGE });
              return;
            }

            set({
              customThemes: nextCustomThemes,
              currentThemeId: nextTheme.id,
              pendingUpload: null,
              isCropperOpen: false,
              themeError: null,
            });
          } catch (error) {
            set({
              themeError:
                error instanceof Error
                  ? error.message
                  : CUSTOM_THEME_ASSET_ERROR,
            });
          }
        },

        cancelCustomThemeUpload: () =>
          set({
            pendingUpload: null,
            isCropperOpen: false,
          }),

        deleteCustomTheme: (themeId: string) =>
          set((state) => {
            const theme = state.customThemes.find(
              (item) => item.id === themeId
            );
            if (!theme) {
              return state;
            }

            const nextCustomThemes = state.customThemes.filter(
              (item) => item.id !== themeId
            );
            const nextThemeId =
              state.currentThemeId === themeId
                ? (getThemeById(theme.basePresetThemeId)?.id ?? defaultTheme.id)
                : state.currentThemeId;

            deleteCustomThemeImage(theme.imageStorageKey).catch(
              () => undefined
            );

            return {
              customThemes: nextCustomThemes,
              currentThemeId: nextThemeId,
              themeError: null,
            };
          }),

        clearThemeError: () => set({ themeError: null }),

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
        name: THEME_STORAGE_KEY,
        partialize: (state) => ({
          currentThemeId: state.currentThemeId,
          customThemes: state.customThemes.map((theme) => ({
            ...theme,
            backgroundImageDataUrl: undefined,
            imageStorageKey:
              theme.imageStorageKey || getImageStorageKey(theme.id),
          })),
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
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const useSettingsPanelStore = create<SettingsPanelState>()((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
