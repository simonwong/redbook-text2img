import { readingBackgroundColor } from "./foundation";
import type { PresetTheme } from "./types";

export const presetThemes: readonly PresetTheme[] = [
  {
    configuration: {
      accentColor: "#1b2540",
      aspectRatio: "3:4",
      background: { kind: "preset", preset: "clean-light" },
      bodyHeadingAlignment: "center",
      cardFrame: "none",
      coverLayout: "center-poster",
      density: "normal",
      fontId: "sans",
    },
    description: "简洁明亮的白色主题，带柔和光影",
    id: "clean-light",
    name: "清新白",
  },
  {
    configuration: {
      accentColor: "#f4f6fb",
      aspectRatio: "3:4",
      background: { kind: "preset", preset: "trianglify-gray" },
      bodyHeadingAlignment: "left",
      cardFrame: "none",
      coverLayout: "top-left",
      density: "snug",
      fontId: "sans",
    },
    description: "石墨低多边形背景，冷硬的极简风格",
    id: "trianglify-minimalist",
    name: "三角极简",
  },
  {
    configuration: {
      accentColor: "#8fe3c8",
      aspectRatio: "3:4",
      background: { kind: "preset", preset: "night-aurora" },
      bodyHeadingAlignment: "left",
      cardFrame: "none",
      coverLayout: "bottom-left",
      density: "normal",
      fontId: "sans",
    },
    description: "墨蓝黑配青绿极光，沉静而有呼吸感",
    id: "clean-dark",
    name: "墨夜极光",
  },
  {
    configuration: {
      accentColor: "#92530c",
      aspectRatio: "3:4",
      background: { kind: "preset", preset: "warm-sun" },
      bodyHeadingAlignment: "center",
      cardFrame: "none",
      coverLayout: "center-poster",
      density: "normal",
      fontId: "sans",
    },
    description: "奶油蜜桃光晕，温柔包裹的午后阳光",
    id: "gradient-warm",
    name: "蜜光暖阳",
  },
  {
    configuration: {
      accentColor: "#2c5aad",
      aspectRatio: "3:4",
      background: { kind: "preset", preset: "cool-mist" },
      bodyHeadingAlignment: "center",
      cardFrame: "none",
      coverLayout: "center-poster",
      density: "normal",
      fontId: "serif",
    },
    description: "近白雾底托住居中衬线标题，清晨薄雾的清雅微光",
    id: "gradient-cool",
    name: "晨雾微光",
  },
  {
    configuration: {
      accentColor: "#b32259",
      aspectRatio: "3:4",
      background: { kind: "preset", preset: "cherry-cream" },
      bodyHeadingAlignment: "center",
      cardFrame: "none",
      coverLayout: "center-poster",
      density: "normal",
      fontId: "sans",
    },
    description: "蜜桃粉与奶油白交融，奶霜质感的温柔粉调",
    id: "xiaohongshu-pink",
    name: "樱花奶霜",
  },
  {
    configuration: {
      accentColor: "#6b4a2e",
      aspectRatio: "3:4",
      background: { color: readingBackgroundColor, kind: "solid" },
      bodyHeadingAlignment: "left",
      cardFrame: "none",
      coverLayout: "top-left",
      density: "normal",
      fontId: "serif",
    },
    description: "护眼米色，舒适阅读",
    id: "reading-mode",
    name: "阅读模式",
  },
  {
    configuration: {
      accentColor: "#1d1d1f",
      aspectRatio: "3:4",
      background: { color: "#fbfbfb", kind: "solid" },
      bodyHeadingAlignment: "left",
      cardFrame: "none",
      coverLayout: "center-poster",
      density: "snug",
      fontId: "sans",
    },
    description: "简洁的苹果备忘录风格",
    id: "apple-notes",
    internals: {
      headerBar: {
        iconColor: "#8a6800",
        icons: { backArrow: true, menu: true, share: true },
      },
    },
    name: "Apple 备忘录",
  },
];

export const getThemeById = (id: string): PresetTheme | undefined =>
  presetThemes.find((theme) => theme.id === id);

export const defaultTheme = presetThemes[0];
