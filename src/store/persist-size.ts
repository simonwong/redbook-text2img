import type { StyleSystemState } from "@/lib/style-system/style-system";

/**
 * 持久化体积上限（字符数）。localStorage 每源通常只有 5MB 左右，
 * 图片背景的 data URL 会随自定义主题一起写进去，留出余量后取 4.5M。
 */
export const maxPersistedSize = 4_500_000;

/**
 * 估算主题状态写进 localStorage 的体积。
 * 必须与 persist 的 partialize 取同样的字段，否则估算偏小。
 */
export const estimatePersistedSize = (state: StyleSystemState): number =>
  JSON.stringify({
    currentThemeId: state.currentThemeId,
    customThemes: state.customThemes,
    overrides: state.overrides,
  }).length;
