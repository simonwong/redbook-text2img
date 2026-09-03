/**
 * Style Generator
 * Converts AdjustedStyle to CSS properties
 */

import type { Properties as CSSProperties } from "csstype";
import type { AdjustedStyle } from "./adjustments";
import type { CardStyle } from "./card";
import { typography } from "./tokens";
import type { CoverStyleOverride } from "./types";

/** Generated CSS styles for Markdown rendering */
export interface GeneratedStyles {
  a: CSSProperties;
  blockquote: CSSProperties;
  /** 卡片尺寸与白边层：预览、溢出判定、缩放与导出都从这里读取 */
  card: CardStyle;
  code: CSSProperties;
  container: CSSProperties;
  content: CSSProperties;
  em: CSSProperties;
  footer: CSSProperties;
  h1: CSSProperties;
  h2: CSSProperties;
  h3: CSSProperties;
  h4: CSSProperties;
  h5: CSSProperties;
  h6: CSSProperties;
  innerContainer: CSSProperties;
  li: CSSProperties;
  mark: CSSProperties;
  p: CSSProperties;
  pre: CSSProperties;
  strong: CSSProperties;
  ul: CSSProperties;
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
): CSSProperties["justifyContent"] {
  switch (align) {
    case "center":
      return "center";
    case "bottom":
      return "flex-end";
    default:
      return "flex-start";
  }
}

/**
 * 将水平对齐转换为 CSS alignItems 值
 */
function getAlignItems(
  align?: "left" | "center" | "right"
): CSSProperties["alignItems"] {
  switch (align) {
    case "center":
      return "center";
    case "right":
      return "flex-end";
    default:
      return "flex-start";
  }
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
  const {
    bodyHeadingAlignment,
    card,
    fontFamily,
    headingScale,
    letterSpacing,
  } = style;
  const coverStyle = options?.coverStyle;

  // 封面标题对齐：优先使用 coverStyle 中的设置,覆盖用户调整
  const effectiveHeadingAlignment =
    coverStyle?.headingAlignment ?? bodyHeadingAlignment;

  // 封面 h1 额外放大乘数：仅封面（coverStyle 存在）时生效，只作用于 h1
  const coverHeadingScale = coverStyle?.headingScale ?? 1;

  // Background style (handles solid, gradient, image)
  // Use backgroundImage instead of background shorthand to avoid conflicts with backgroundSize/backgroundPosition
  // image 类背景（受控图案）可携带自己的 size/repeat，缺省保持 cover 居中
  let backgroundStyle: CSSProperties;
  if (style.background.type === "solid") {
    backgroundStyle = { backgroundColor: style.background.value };
  } else if (style.background.type === "image") {
    backgroundStyle = {
      // data-URI 含未编码的单引号，必须加双引号包裹才是合法 url()
      backgroundImage: `url("${style.background.value}")`,
      ...(style.background.repeat && {
        backgroundRepeat: style.background.repeat,
      }),
    };
  } else {
    backgroundStyle = { backgroundImage: style.background.value };
  }

  // Helper for heading styles
  // isDisplay: h1–h3 为展示级标题
  const createHeadingStyle = (
    scale: number,
    useHeadingAlignment: boolean,
    isDisplay = false,
    extraScale = 1
  ): CSSProperties => ({
    fontSize: `${scale * (isDisplay ? headingScale : 1) * extraScale}em`,
    lineHeight: 1.2,
    fontWeight: style.heading.fontWeight,
    marginBottom: `${headingGap / baseFontSize}em`,
    color: style.heading.color,
    textAlign: useHeadingAlignment ? effectiveHeadingAlignment : "left",
    letterSpacing: isDisplay ? letterSpacing.heading : undefined,
    // 长标题换行时两行字数均衡（避免"8+1"式孤字尾行）
    textWrap: "balance",
    width: "100%",
  });

  return {
    card: card.card,

    container: {
      width: `${card.content.width}px`,
      minWidth: `${card.content.width}px`,
      height: `${card.content.height}px`,
      minHeight: `${card.content.height}px`,
      ...backgroundStyle,
      backgroundSize: style.background.size ?? "cover",
      backgroundPosition: "center",
      borderRadius: `${card.content.radius}px`,
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
    h1: createHeadingStyle(
      typography.headingScale.h1,
      true,
      true,
      coverHeadingScale
    ),
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
      textWrap: "pretty",
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
  };
}
