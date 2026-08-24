/**
 * Style Generator
 * Converts AdjustedStyle to CSS properties
 */

import type { Properties as CSSProperties } from "csstype";
import type { AdjustedStyle } from "./adjustments";
import { typography } from "./tokens";
import type { CoverStyleOverride, HeadingDecoration } from "./types";

/** Generated CSS styles for Markdown rendering */
export interface GeneratedStyles {
  a: CSSProperties;
  blockquote: CSSProperties;
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
  headingInner?: CSSProperties;
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
 * 将标题装饰转换为内层 span 的 CSSProperties
 * 装饰跟随文字宽度（span 为 inline），居中/左对齐均随文字。
 * 装饰边界为 h1–h2（比 isDisplay 的 h1–h3 收窄一级：h3 尺寸接近正文，装饰过吵）。
 * 仅 html2canvas-pro 可导出的属性：linear-gradient / padding / 内联 SVG data-URI 背景图。
 */
export function createHeadingDecoration(
  decoration?: HeadingDecoration
): CSSProperties | undefined {
  if (!decoration) {
    return;
  }
  const fragmentStyle: CSSProperties = {
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
  };
  if (decoration.kind === "underline") {
    return {
      ...fragmentStyle,
      backgroundImage: `linear-gradient(${decoration.color}, ${decoration.color})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `100% ${decoration.thickness ?? "0.14em"}`,
      backgroundPosition: "0 100%",
      paddingBottom: "0.06em",
    };
  }
  if (decoration.kind === "wavy") {
    // 手绘感波浪：单元内两个振幅微差的周期（首尾同高同斜率）repeat-x 无缝平铺，
    // 波长恒定为 0.56em、不随标题长度拉伸，整条线落在字底之下（不压字）。
    // width/height 必须显式声明：html2canvas-pro 按内在尺寸栅格化背景 SVG
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='8' viewBox='0 0 28 8' preserveAspectRatio='none'><path d='M0 4 Q3.5 1.6 7 4 Q10.5 6.4 14 4.3 Q17.5 2.1 21 3.8 Q24.5 6.4 28 4' fill='none' stroke='${decoration.color}' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/></svg>`;
    return {
      ...fragmentStyle,
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
      backgroundRepeat: "repeat-x",
      backgroundPosition: "0 100%",
      backgroundSize: "1.12em 0.32em",
      paddingBottom: "0.25em",
    };
  }
  return {
    ...fragmentStyle,
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
  const {
    bodyHeadingAlignment,
    bodyHeadingScale,
    fontFamily,
    headingScale,
    letterSpacing,
  } = style;
  const coverStyle = options?.coverStyle;
  const surface = style.surface;

  // 封面标题对齐：优先使用 coverStyle 中的设置,覆盖用户调整
  const effectiveHeadingAlignment =
    coverStyle?.headingAlignment ?? bodyHeadingAlignment;
  const contextualBodyHeadingScale = coverStyle ? 1 : bodyHeadingScale;

  // 封面 h1 额外放大乘数：仅封面（coverStyle 存在）时生效，只作用于 h1
  const coverHeadingScale = coverStyle?.headingScale ?? 1;

  // Background style (handles solid, gradient, image)
  // Use backgroundImage instead of background shorthand to avoid conflicts with backgroundSize/backgroundPosition
  let backgroundStyle: CSSProperties;
  if (style.background.type === "solid") {
    backgroundStyle = { backgroundColor: style.background.value };
  } else if (style.background.type === "image") {
    backgroundStyle = { backgroundImage: `url(${style.background.value})` };
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
    fontSize: `${scale * (isDisplay ? headingScale : 1) * (useHeadingAlignment ? contextualBodyHeadingScale : 1) * extraScale}em`,
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
      // surface 变体：container 获得留白露出背景四周（innerContainer 100% 高度自动收缩）
      ...(surface && {
        padding: `${surface.margin}px`,
      }),
    },

    innerContainer: {
      width: "100%",
      height: "100%",
      padding: `${padding}px`,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      // surface 变体：innerContainer 变为浮层卡（保留原有密度 padding）
      ...(surface && {
        backgroundColor: surface.background,
        backgroundImage: surface.backgroundImage,
        backgroundPosition: surface.backgroundPosition,
        backgroundSize: surface.backgroundSize,
        borderRadius: `${surface.borderRadius}px`,
        ...(surface.boxShadow && { boxShadow: surface.boxShadow }),
      }),
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

    // 标题装饰仅作用于展示级标题 h1–h2（由 image-preview 包裹内层 span）
    headingInner: createHeadingDecoration(style.heading.decoration),
  };
}
