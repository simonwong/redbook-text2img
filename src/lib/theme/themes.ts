/**
 * Built-in theme definitions.
 */

import { TrianglifyGary } from "./backgroundSet";
import { colors, gradients, spacing, typography } from "./tokens";
import type { CoverStyleOverride, FullStyle, PresetTheme } from "./types";

// ============================================================
// 基础样式模板（内部使用）
// ============================================================

const baseTypography = {
  baseFontSize: typography.fontSize.balanced,
  lineHeight: typography.lineHeight.balanced,
};

const baseSpacing = {
  padding: spacing.padding.balanced,
  paragraphGap: spacing.paragraphGap.balanced,
  headingGap: spacing.headingGap.balanced,
};

/** 默认封面图样式：垂直水平居中，标题放大 25% 强化海报感 */
const defaultCoverStyle: CoverStyleOverride = {
  contentVerticalAlign: "center",
  contentHorizontalAlign: "center",
  headingAlignment: "center",
  headingScale: 1.25,
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
    configuration: {
      background: { kind: "preset", preset: "clean-light" },
      bodyHeadingAlignment: "center",
      bodyHeadingSize: "medium",
      contentSurface: "none",
      coverLayout: "center-poster",
      decorationColor: "#64748b",
      density: "balanced",
      fontId: "auto",
      headingDecoration: "none",
    },
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
        highlight: {
          background: colors.accent.orange,
          color: colors.gray[900],
        },
      },
      list: { color: colors.gray[700], markerColor: colors.gray[500] },
      blockquote: {
        background: "#f8fafc",
        borderColor: "#94a3b8",
        textColor: "#475569",
      },
      code: {
        inline: { background: "#f1f5f9", color: "#6d28d9" },
        block: { background: "#f8fafc", color: colors.gray[800] },
      },
      link: { color: "#1d4ed8", underline: true },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },
  {
    id: "trianglify-minimalist",
    name: "三角极简",
    description: "抽象三角形为背景的极简风格",
    configuration: {
      background: { kind: "preset", preset: "trianglify-gray" },
      bodyHeadingAlignment: "left",
      bodyHeadingSize: "large",
      contentSurface: "floating-card",
      coverLayout: "top-left",
      decorationColor: "#334155",
      density: "compact",
      fontId: "sans",
      headingDecoration: "underline",
    },
    style: {
      background: { type: "image", value: TrianglifyGary },
      typography: baseTypography,
      heading: {
        color: "#0f172a",
        fontWeight: typography.fontWeight.bold,
        decoration: {
          kind: "underline",
          color: "#334155",
          thickness: "0.18em",
        },
      },
      paragraph: { color: "#334155" },
      emphasis: {
        bold: {
          color: "#0f172a",
          fontWeight: typography.fontWeight.bold,
        },
        italic: { color: "#475569" },
        highlight: { background: "#1d4ed8", color: colors.white },
      },
      list: { color: "#334155", markerColor: "#64748b" },
      blockquote: {
        background: "#e2e8f0",
        borderColor: "#64748b",
        textColor: "#334155",
      },
      code: {
        inline: {
          background: "#e2e8f0",
          color: "#334155",
        },
        block: {
          background: "#f1f5f9",
          color: "#0f172a",
        },
      },
      link: { color: "#1d4ed8", underline: true },
      spacing: baseSpacing,
      surface: {
        background: "#f8fafc",
        borderRadius: 16,
        kind: "floating-card",
        margin: 16,
        boxShadow: "0 8px 28px rgba(15, 23, 42, 0.18)",
      },
    },
    // 封面 h1 已有 typeset 1.2 放大，再叠 1.25 会挤爆卡宽，收敛到 1.1
    coverStyle: { ...defaultCoverStyle, headingScale: 1.1 },
    // 极简海报感：Inter 无衬线 + 放大标题 + 紧字距
    typeset: {
      headingScale: 1.2,
      letterSpacing: { heading: "-0.02em" },
    },
  },
  {
    id: "clean-dark",
    name: "墨夜极光",
    description: "深邃墨色配紫蓝极光，沉静而有呼吸感",
    configuration: {
      background: { kind: "preset", preset: "night-aurora" },
      bodyHeadingAlignment: "left",
      bodyHeadingSize: "medium",
      contentSurface: "none",
      coverLayout: "bottom-left",
      decorationColor: "#a78bfa",
      density: "balanced",
      fontId: "auto",
      headingDecoration: "underline",
    },
    style: {
      background: { type: "gradient", value: gradients.darkNight },
      typography: baseTypography,
      heading: {
        color: "#f5f5f7",
        fontWeight: typography.fontWeight.semibold,
        decoration: {
          kind: "underline",
          color: "#a78bfa",
          thickness: "0.16em",
        },
      },
      paragraph: { color: "#d1d5db" },
      emphasis: {
        bold: { color: "#f5f5f7", fontWeight: typography.fontWeight.semibold },
        italic: { color: "#b6bdcc" },
        highlight: { background: "#a78bfa", color: "#171321" },
      },
      list: { color: "#d1d5db", markerColor: "#c4b5fd" },
      blockquote: {
        background: "#1b1d2a",
        borderColor: "#8b7cd6",
        textColor: "#d1d5db",
        boxShadow: "0 1px 12px rgba(124, 102, 196, 0.12)",
      },
      code: {
        inline: {
          background: "#242635",
          color: "#ddd6fe",
        },
        block: { background: "#171923", color: "#e5e7eb" },
      },
      link: { color: "#c4b5fd", underline: true },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
    typeset: {
      letterSpacing: { heading: "0" },
    },
  },

  // ===== 渐变系列 =====
  {
    id: "gradient-warm",
    name: "蜜光暖阳",
    description: "奶油蜜桃光晕，温柔包裹的午后阳光",
    configuration: {
      background: { kind: "preset", preset: "warm-sun" },
      bodyHeadingAlignment: "center",
      bodyHeadingSize: "large",
      contentSurface: "floating-card",
      coverLayout: "center-poster",
      decorationColor: "#f4b76a",
      density: "balanced",
      fontId: "sans",
      headingDecoration: "highlight",
    },
    style: {
      background: { type: "gradient", value: gradients.warmSun },
      typography: baseTypography,
      heading: {
        color: "#4a2a15",
        fontWeight: typography.fontWeight.bold,
        decoration: { kind: "highlight", color: "#f4b76a" },
      },
      paragraph: { color: "#713715" },
      emphasis: {
        bold: { color: "#4a2a15", fontWeight: typography.fontWeight.bold },
        italic: { color: "#8a4719" },
        highlight: { background: "#9a4512", color: colors.white },
      },
      list: { color: "#713715", markerColor: "#a34f17" },
      blockquote: {
        background: "#fff3e8",
        borderColor: "#c56a24",
        textColor: "#713715",
        boxShadow: "0 1px 14px rgba(202, 110, 50, 0.1)",
      },
      code: {
        inline: { background: "#ffedd5", color: "#713715" },
        block: { background: "#fff3e8", color: "#4a2a15" },
      },
      link: { color: "#93400d", underline: true },
      spacing: baseSpacing,
      surface: {
        background: "#fffaf2",
        borderRadius: 24,
        boxShadow: "0 10px 30px rgba(120, 53, 15, 0.14)",
        kind: "floating-card",
        margin: 12,
      },
    },
    // 封面 h1 已有 typeset 1.1 放大，再叠 1.25 常见标题会换行，收敛到 1.15
    coverStyle: { ...defaultCoverStyle, headingScale: 1.15 },
    // 温暖亲和：可靠中文无衬线 + 略放大标题
    typeset: {
      headingScale: 1.1,
    },
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
    // 清晨薄雾的书卷气：可靠中文衬线回退
    typeset: {
      fontId: "serif",
    },
  },
  {
    id: "xiaohongshu-pink",
    name: "樱花奶霜",
    description: "蜜桃粉与奶油白交融，奶霜质感的温柔粉调",
    style: {
      background: { type: "gradient", value: gradients.cherryCream },
      typography: baseTypography,
      heading: {
        color: "#6e1530",
        fontWeight: typography.fontWeight.bold,
        decoration: { kind: "highlight", color: "#ff9dbe" },
      },
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
    // 封面 h1 已有 typeset 1.1 放大，再叠 1.25 常见标题会换行，收敛到 1.15
    coverStyle: { ...defaultCoverStyle, headingScale: 1.15 },
    // 奶霜甜感：可靠中文无衬线 + 标题稍大
    typeset: {
      fontId: "sans",
      headingScale: 1.1,
    },
  },
  {
    id: "reading-mode",
    name: "阅读模式",
    description: "护眼米色，舒适阅读",
    style: {
      background: { type: "solid", value: "#fefcf3" },
      typography: baseTypography,
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
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
    // 长文阅读：衬线护眼 + 正文稍大
    typeset: {
      fontId: "serif",
      bodyScale: 1.05,
    },
    // 阅读靠版心节奏而非留白，密度用正常档；正文页标题左对齐（长文更自然）
    defaults: { bodyHeadingAlignment: "left" },
  },

  // ===== 特色系列 =====
  {
    id: "apple-notes",
    name: "Apple 备忘录",
    description: "简洁的苹果备忘录风格",
    style: {
      background: { type: "solid", value: "#fbfbfb" },
      typography: {
        baseFontSize: typography.fontSize.balanced,
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
    // 备忘录记录感：略紧密度 + 标题左对齐
    defaults: { bodyHeadingAlignment: "left", density: "compact" },
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
