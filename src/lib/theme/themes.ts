/**
 * Layer 1: Preset Themes
 * 精心定制的预设主题，每个主题直接定义完整的 FullStyle
 */

import { TrianglifyGary } from "./backgroundSet";
import { colors, gradients, spacing, typography } from "./tokens";
import type { CoverStyleOverride, FullStyle, PresetTheme } from "./types";

// ============================================================
// 基础样式模板（内部使用）
// ============================================================

const baseTypography = {
  baseFontSize: typography.fontSize.normal,
  lineHeight: typography.lineHeight.normal,
};

const baseSpacing = {
  padding: spacing.padding.normal,
  paragraphGap: spacing.paragraphGap.normal,
  headingGap: spacing.headingGap.normal,
};

/** 默认封面图样式：垂直水平居中 */
const defaultCoverStyle: CoverStyleOverride = {
  contentVerticalAlign: "center",
  contentHorizontalAlign: "center",
  headingAlignment: "center",
};

// ============================================================
// 预设主题定义
// ============================================================

export const presetThemes: PresetTheme[] = [
  // ===== 基础系列 =====
  {
    id: "clean-light",
    name: "清新白",
    description: "简洁明亮的白色主题，带柔和光影",
    style: {
      background: { type: "gradient", value: gradients.cleanLight },
      typography: baseTypography,
      heading: {
        color: colors.gray[900],
        fontWeight: typography.fontWeight.semibold,
      },
      paragraph: { color: colors.gray[700] },
      emphasis: {
        bold: {
          color: colors.gray[900],
          fontWeight: typography.fontWeight.semibold,
        },
        italic: { color: colors.gray[600] },
        highlight: { background: colors.accent.orange, color: colors.white },
      },
      list: { color: colors.gray[700], markerColor: colors.gray[400] },
      blockquote: {
        background: colors.gray[50],
        borderColor: colors.gray[300],
        textColor: colors.gray[600],
      },
      code: {
        inline: { background: colors.gray[100], color: colors.accent.purple },
        block: { background: colors.gray[50], color: colors.gray[800] },
      },
      link: { color: colors.accent.blue, underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },
  {
    id: "trianglify-minimalist",
    name: "三角极简",
    description: "抽象三角形为背景的极简风格",
    style: {
      background: { type: "image", value: TrianglifyGary },
      typography: baseTypography,
      heading: {
        color: colors.gray[800],
        fontWeight: typography.fontWeight.bold,
      },
      paragraph: { color: colors.gray[700] },
      emphasis: {
        bold: {
          color: colors.gray[800],
          fontWeight: typography.fontWeight.bold,
        },
        italic: { color: colors.gray[600] },
        highlight: { background: colors.accent.blue, color: colors.white },
      },
      list: { color: colors.gray[700], markerColor: colors.gray[500] },
      blockquote: {
        background: "rgba(255, 255, 255, 0.7)",
        borderColor: colors.gray[400],
        textColor: colors.gray[600],
      },
      code: {
        inline: {
          background: "rgba(255, 255, 255, 0.8)",
          color: colors.gray[700],
        },
        block: {
          background: "rgba(255, 255, 255, 0.85)",
          color: colors.gray[800],
        },
      },
      link: { color: colors.accent.blue, underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },
  {
    id: "clean-dark",
    name: "墨夜极光",
    description: "深邃墨色配紫蓝极光，沉静而有呼吸感",
    style: {
      background: { type: "gradient", value: gradients.darkNight },
      typography: baseTypography,
      heading: { color: "#f5f5f7", fontWeight: typography.fontWeight.semibold },
      paragraph: { color: "#cdd0d8" },
      emphasis: {
        bold: { color: "#f5f5f7", fontWeight: typography.fontWeight.semibold },
        italic: { color: "#a8aebd" },
        highlight: { background: "#a78bfa", color: "#1a1625" },
      },
      list: { color: "#cdd0d8", markerColor: "#a78bfa" },
      blockquote: {
        background: "rgba(167, 139, 250, 0.08)",
        borderColor: "rgba(167, 139, 250, 0.45)",
        textColor: "#b4bac7",
        boxShadow: "0 1px 12px rgba(124, 102, 196, 0.12)",
      },
      code: {
        inline: {
          background: "rgba(255, 255, 255, 0.06)",
          color: "#c4b5fd",
        },
        block: { background: "rgba(255, 255, 255, 0.04)", color: "#dde0ec" },
      },
      link: { color: "#a5b4fc", underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },

  // ===== 渐变系列 =====
  {
    id: "gradient-warm",
    name: "蜜光暖阳",
    description: "奶油蜜桃光晕，温柔包裹的午后阳光",
    style: {
      background: { type: "gradient", value: gradients.warmSun },
      typography: baseTypography,
      heading: { color: "#5b2a0a", fontWeight: typography.fontWeight.bold },
      paragraph: { color: "#7a3e16" },
      emphasis: {
        bold: { color: "#5b2a0a", fontWeight: typography.fontWeight.bold },
        italic: { color: "#a25a23" },
        highlight: { background: "#ea7e3b", color: "#fffaf2" },
      },
      list: { color: "#7a3e16", markerColor: "#ea7e3b" },
      blockquote: {
        background: "rgba(255, 250, 242, 0.72)",
        borderColor: "#ea7e3b",
        textColor: "#8a4719",
        boxShadow: "0 1px 14px rgba(202, 110, 50, 0.1)",
      },
      code: {
        inline: { background: "rgba(255, 250, 242, 0.78)", color: "#8a4719" },
        block: { background: "rgba(255, 250, 242, 0.7)", color: "#5b2a0a" },
      },
      link: { color: "#c2570f", underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },

  {
    id: "gradient-cool",
    name: "晨雾微光",
    description: "雾蓝与薰衣草交织，清晨薄雾的清雅微光",
    style: {
      background: { type: "gradient", value: gradients.coolMist },
      typography: baseTypography,
      heading: { color: "#1a3556", fontWeight: typography.fontWeight.semibold },
      paragraph: { color: "#2c486b" },
      emphasis: {
        bold: { color: "#1a3556", fontWeight: typography.fontWeight.semibold },
        italic: { color: "#4664a0" },
        highlight: { background: "#5b7bbf", color: "#f5f9fd" },
      },
      list: { color: "#2c486b", markerColor: "#5b7bbf" },
      blockquote: {
        background: "rgba(245, 249, 253, 0.72)",
        borderColor: "#5b7bbf",
        textColor: "#3a577d",
        boxShadow: "0 1px 14px rgba(60, 90, 140, 0.08)",
      },
      code: {
        inline: { background: "rgba(245, 249, 253, 0.78)", color: "#3a577d" },
        block: { background: "rgba(245, 249, 253, 0.7)", color: "#1a3556" },
      },
      link: { color: "#3a5fab", underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },
  {
    id: "xiaohongshu-pink",
    name: "樱花奶霜",
    description: "蜜桃粉与奶油白交融，奶霜质感的温柔粉调",
    style: {
      background: { type: "gradient", value: gradients.cherryCream },
      typography: baseTypography,
      heading: { color: "#6e1530", fontWeight: typography.fontWeight.bold },
      paragraph: { color: "#86283f" },
      emphasis: {
        bold: { color: "#6e1530", fontWeight: typography.fontWeight.bold },
        italic: { color: "#a83a5a" },
        highlight: { background: "#e64f7a", color: "#fff6f6" },
      },
      list: { color: "#86283f", markerColor: "#e64f7a" },
      blockquote: {
        background: "rgba(255, 246, 246, 0.72)",
        borderColor: "#e64f7a",
        textColor: "#923049",
        boxShadow: "0 1px 14px rgba(214, 78, 122, 0.1)",
      },
      code: {
        inline: { background: "rgba(255, 246, 246, 0.78)", color: "#923049" },
        block: { background: "rgba(255, 246, 246, 0.7)", color: "#6e1530" },
      },
      link: { color: "#c83768", underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },
  {
    id: "reading-mode",
    name: "阅读模式",
    description: "护眼米色，舒适阅读",
    style: {
      background: { type: "solid", value: "#fefcf3" },
      typography: {
        baseFontSize: typography.fontSize.spacious,
        lineHeight: typography.lineHeight.spacious,
      },
      heading: { color: "#44403c", fontWeight: typography.fontWeight.medium },
      paragraph: { color: "#57534e" },
      emphasis: {
        bold: { color: "#44403c", fontWeight: typography.fontWeight.semibold },
        italic: { color: "#78716c" },
        highlight: { background: "#fbbf24", color: "#44403c" },
      },
      list: { color: "#57534e", markerColor: "#a8a29e" },
      blockquote: {
        background: "#faf5eb",
        borderColor: "#d6d3d1",
        textColor: "#78716c",
      },
      code: {
        inline: { background: "#f5f5f4", color: "#57534e" },
        block: { background: "#faf5eb", color: "#57534e" },
      },
      link: { color: "#b45309", underline: true },
      spacing: {
        padding: spacing.padding.spacious,
        paragraphGap: spacing.paragraphGap.spacious,
        headingGap: spacing.headingGap.spacious,
      },
    },
    coverStyle: defaultCoverStyle,
  },

  // ===== 特色系列 =====
  {
    id: "apple-notes",
    name: "Apple 备忘录",
    description: "简洁的苹果备忘录风格",
    style: {
      background: { type: "solid", value: "#fbfbfb" },
      typography: {
        baseFontSize: typography.fontSize.normal,
        lineHeight: 1.65,
      },
      heading: { color: "#1d1d1f", fontWeight: typography.fontWeight.semibold },
      paragraph: { color: "#1d1d1f" },
      emphasis: {
        bold: { color: "#1d1d1f", fontWeight: typography.fontWeight.semibold },
        italic: { color: "#48484a" },
        highlight: { background: "#ffcc00", color: "#1d1d1f" },
      },
      list: { color: "#1d1d1f", markerColor: "#8e8e93" },
      blockquote: {
        background: "#f5f5f7",
        borderColor: "#d1d1d6",
        textColor: "#48484a",
      },
      code: {
        inline: { background: "#f5f5f7", color: "#1d1d1f" },
        block: { background: "#f5f5f7", color: "#1d1d1f" },
      },
      link: { color: "#007aff", underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
    headerBar: {
      iconColor: "#d4a300",
      icons: {
        backArrow: true,
        share: true,
        menu: true,
      },
    },
  },
];

// ============================================================
// 工具函数
// ============================================================

/** Get a theme by ID */
export const getThemeById = (id: string): PresetTheme | undefined =>
  presetThemes.find((theme) => theme.id === id);

/** Default theme */
export const defaultTheme = presetThemes[0];

/** Get theme style by ID, with fallback to default */
export const getThemeStyle = (id: string): FullStyle =>
  getThemeById(id)?.style ?? defaultTheme.style;
