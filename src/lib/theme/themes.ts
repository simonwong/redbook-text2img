import type { PresetTheme } from "./types";

export const presetThemes: readonly PresetTheme[] = [
  {
    configuration: {
      background: { kind: "preset", preset: "clean-light" },
      bodyHeadingAlignment: "center",
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
      background: { kind: "preset", preset: "trianglify-gray" },
      bodyHeadingAlignment: "left",
      coverLayout: "top-left",
      density: "snug",
      fontId: "sans",
    },
    description: "抽象三角形为背景的极简风格",
    id: "trianglify-minimalist",
    internals: { floatingCard: true },
    name: "三角极简",
  },
  {
    configuration: {
      background: { kind: "preset", preset: "night-aurora" },
      bodyHeadingAlignment: "left",
      coverLayout: "bottom-left",
      density: "normal",
      fontId: "sans",
    },
    description: "深邃墨色配紫蓝极光，沉静而有呼吸感",
    id: "clean-dark",
    name: "墨夜极光",
  },
  {
    configuration: {
      background: { kind: "preset", preset: "warm-sun" },
      bodyHeadingAlignment: "center",
      coverLayout: "center-poster",
      density: "normal",
      fontId: "sans",
    },
    description: "奶油蜜桃光晕，温柔包裹的午后阳光",
    id: "gradient-warm",
    internals: { floatingCard: true },
    name: "蜜光暖阳",
  },
  {
    configuration: {
      background: { kind: "preset", preset: "cool-mist" },
      bodyHeadingAlignment: "center",
      coverLayout: "center-poster",
      density: "normal",
      fontId: "serif",
    },
    description: "雾蓝与薰衣草交织，清晨薄雾的清雅微光",
    id: "gradient-cool",
    name: "晨雾微光",
  },
  {
    configuration: {
      background: { kind: "preset", preset: "cherry-cream" },
      bodyHeadingAlignment: "center",
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
      background: { color: "#fefcf3", kind: "solid" },
      bodyHeadingAlignment: "left",
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
      background: { color: "#fbfbfb", kind: "solid" },
      bodyHeadingAlignment: "left",
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
