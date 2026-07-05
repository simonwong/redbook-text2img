/**
 * Style Generator
 * Converts AdjustedStyle to React CSSProperties
 */

import type React from "react";
import type { AdjustedStyle } from "./adjustments";
import { typography } from "./tokens";
import type { CoverStyleOverride, HeadingDecoration } from "./types";

/** Generated CSS styles for Markdown rendering */
export interface GeneratedStyles {
  container: React.CSSProperties;
  innerContainer: React.CSSProperties;
  content: React.CSSProperties;
  h1: React.CSSProperties;
  h2: React.CSSProperties;
  h3: React.CSSProperties;
  h4: React.CSSProperties;
  h5: React.CSSProperties;
  h6: React.CSSProperties;
  p: React.CSSProperties;
  strong: React.CSSProperties;
  em: React.CSSProperties;
  ul: React.CSSProperties;
  li: React.CSSProperties;
  pre: React.CSSProperties;
  code: React.CSSProperties;
  blockquote: React.CSSProperties;
  a: React.CSSProperties;
  mark: React.CSSProperties;
  /** 卡片底部水印（署名 + 页码），随主题次要色派生 */
  footer: React.CSSProperties;
  /** 标题装饰（内层 span 用），仅在主题配置了 heading.decoration 时存在 */
  headingInner?: React.CSSProperties;
}

/** 封面图样式覆盖选项 */
export interface GenerateStylesOptions {
  /** 封面图特有的样式覆盖 */
  coverStyle?: CoverStyleOverride;
}

/**
 * 将垂直对齐转换为 CSS justifyContent 值
 */
function getJustifyContent(
  align?: "top" | "center" | "bottom"
): React.CSSProperties["justifyContent"] {
  switch (align) {
    case "center":
      return "center";
    case "bottom":
      return "flex-end";
    case "top":
    default:
      return "flex-start";
  }
}

/**
 * 将水平对齐转换为 CSS alignItems 值
 */
function getAlignItems(
  align?: "left" | "center" | "right"
): React.CSSProperties["alignItems"] {
  switch (align) {
    case "center":
      return "center";
    case "right":
      return "flex-end";
    case "left":
    default:
      return "flex-start";
  }
}

/**
 * 将标题装饰转换为内层 span 的 CSSProperties
 * 装饰跟随文字宽度（span 为 inline），居中/左对齐均随文字。
 * 装饰边界为 h1–h2（比 isDisplay 的 h1–h3 收窄一级：h3 尺寸接近正文，装饰过吵）。
 * 仅 html2canvas-pro 可导出的属性：linear-gradient / padding。
 */
function createHeadingDecoration(
  decoration?: HeadingDecoration
): React.CSSProperties | undefined {
  if (!decoration) {
    return;
  }
  if (decoration.kind === "underline") {
    return {
      backgroundImage: `linear-gradient(${decoration.color}, ${decoration.color})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `100% ${decoration.thickness ?? "0.14em"}`,
      backgroundPosition: "0 100%",
      paddingBottom: "0.06em",
    };
  }
  return {
    backgroundImage: `linear-gradient(180deg, transparent 55%, ${decoration.color} 55%, ${decoration.color} 92%, transparent 92%)`,
    padding: "0 0.08em",
  };
}

/**
 * Generate React CSSProperties from AdjustedStyle
 */
export function generateStyles(
  style: AdjustedStyle,
  options?: GenerateStylesOptions
): GeneratedStyles {
  const { baseFontSize, lineHeight } = style.typography;
  const { padding, paragraphGap, headingGap } = style.spacing;
  const { fontFamily, headingAlignment, headingScale, letterSpacing } = style;
  const coverStyle = options?.coverStyle;

  // 封面标题对齐：优先使用 coverStyle 中的设置,覆盖用户调整
  const effectiveHeadingAlignment =
    coverStyle?.headingAlignment ?? headingAlignment;

  // Background style (handles solid, gradient, image)
  // Use backgroundImage instead of background shorthand to avoid conflicts with backgroundSize/backgroundPosition
  const backgroundStyle: React.CSSProperties =
    style.background.type === "solid"
      ? { backgroundColor: style.background.value }
      : style.background.type === "image"
        ? { backgroundImage: `url(${style.background.value})` }
        : { backgroundImage: style.background.value };

  // Helper for heading styles
  // isDisplay: h1–h3 为展示级标题，应用主题 typeset 的 headingScale 与 heading 字间距
  const createHeadingStyle = (
    scale: number,
    useHeadingAlignment: boolean,
    isDisplay = false
  ): React.CSSProperties => ({
    fontSize: `${scale * (isDisplay ? headingScale : 1)}em`,
    lineHeight: 1.2,
    fontWeight: style.heading.fontWeight,
    marginBottom: `${headingGap / baseFontSize}em`,
    color: style.heading.color,
    textAlign: useHeadingAlignment ? effectiveHeadingAlignment : "left",
    letterSpacing: isDisplay ? letterSpacing.heading : undefined,
    width: "100%",
  });

  return {
    container: {
      width: "375px",
      minWidth: "375px",
      height: "500px",
      minHeight: "500px",
      ...backgroundStyle,
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "12px",
      overflow: "hidden",
      fontFamily,
      position: "relative",
      fontSize: `${baseFontSize}px`,
      boxSizing: "border-box",
    },

    innerContainer: {
      width: "100%",
      height: "100%",
      padding: `${padding}px`,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    },

    content: {
      flex: 1,
      minHeight: 0,
      fontSize: "1em",
      lineHeight,
      color: style.paragraph.color,
      wordBreak: "break-word",
      display: "flex",
      flexDirection: "column",
      justifyContent: getJustifyContent(coverStyle?.contentVerticalAlign),
      alignItems: getAlignItems(coverStyle?.contentHorizontalAlign),
      letterSpacing: letterSpacing.body,
    },

    // Headings: h1-h4 use heading alignment, h5-h6 always left
    h1: createHeadingStyle(typography.headingScale.h1, true, true),
    h2: createHeadingStyle(typography.headingScale.h2, true, true),
    h3: createHeadingStyle(typography.headingScale.h3, true, true),
    h4: createHeadingStyle(typography.headingScale.h4, true),
    h5: {
      ...createHeadingStyle(typography.headingScale.h5, false),
      color: style.paragraph.color,
    },
    h6: {
      ...createHeadingStyle(typography.headingScale.h6, false),
      color: style.paragraph.color,
    },

    p: {
      fontSize: "1em",
      lineHeight,
      marginBottom: `${paragraphGap / baseFontSize}em`,
      color: style.paragraph.color,
      wordBreak: "break-word",
    },

    strong: {
      fontWeight: style.emphasis.bold.fontWeight,
      color: style.emphasis.bold.color,
    },

    em: {
      fontStyle: "italic",
      color: style.emphasis.italic.color,
    },

    mark: {
      backgroundColor: style.emphasis.highlight.background,
      color: style.emphasis.highlight.color,
      padding: "0.1em 0.3em",
      borderRadius: "0.2em",
    },

    ul: {
      marginBottom: `${paragraphGap / baseFontSize}em`,
      paddingLeft: 0,
      color: style.list.color,
    },

    li: {
      marginBottom: `${paragraphGap / 2 / baseFontSize}em`,
      fontSize: "1em",
      lineHeight,
    },

    blockquote: {
      width: "100%",
      marginBottom: `${paragraphGap / baseFontSize}em`,
      paddingLeft: "1em",
      borderLeft: `3px solid ${style.blockquote.borderColor}`,
      backgroundColor: style.blockquote.background,
      color: style.blockquote.textColor,
      fontStyle: "italic",
      boxSizing: "border-box",
      ...(style.blockquote.boxShadow && {
        boxShadow: style.blockquote.boxShadow,
      }),
    },

    pre: {
      marginBottom: `${paragraphGap / baseFontSize}em`,
      color: style.code.block.color,
      backgroundColor: style.code.block.background,
      whiteSpace: "pre-wrap",
      fontSize: "0.875em",
      lineHeight: 1.5,
      wordBreak: "break-word",
      borderRadius: "0.4em",
      padding: "0.6em 0.8em",
      width: "100%",
    },

    code: {
      color: style.code.inline.color,
      backgroundColor: style.code.inline.background,
      fontSize: "0.875em",
      padding: "0.15em 0.4em",
      borderRadius: "0.25em",
      display: "inline-block",
      lineHeight: "inherit",
    },

    a: {
      color: style.link.color,
      textDecoration: style.link.underline ? "underline" : "none",
    },

    // 卡片底部水印颜色 token（布局在 CardWatermark 组件内）：主题斜体次要色，8 主题皆可读
    footer: {
      color: style.emphasis.italic.color,
    },

    // 标题装饰仅作用于展示级标题 h1–h2（由 image-preview 包裹内层 span）
    headingInner: createHeadingDecoration(style.heading.decoration),
  };
}
