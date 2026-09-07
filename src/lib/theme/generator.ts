/**
 * Style Generator
 * Converts AdjustedStyle to CSS properties
 */

import type { Properties as CSSProperties } from "csstype";
import type { ContentImageReference } from "../image-reference";
import type { AdjustedStyle } from "./adjustments";
import type { CardStyle } from "./card";
import type { FrostLayers } from "./frost";
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
  figure: CSSProperties;
  footer: CSSProperties;
  /**
   * 图片背景磨砂两层：模糊图片层与纯色蒙层，都铺在容器内、内容下方。
   * 无磨砂时缺省，容器直接铺背景图。
   */
  frost?: FrostLayers;
  h1: CSSProperties;
  h2: CSSProperties;
  h3: CSSProperties;
  h4: CSSProperties;
  h5: CSSProperties;
  h6: CSSProperties;
  imageLayout: Record<
    ContentImageReference["align"],
    Record<
      ContentImageReference["size"],
      { figure: CSSProperties; container: CSSProperties }
    >
  >;
  img: CSSProperties;
  innerContainer: CSSProperties;
  li: CSSProperties;
  mark: CSSProperties;
  p: CSSProperties;
  pre: CSSProperties;
  strong: CSSProperties;
  ul: CSSProperties;
}

function imageSizes(
  justifyContent: CSSProperties["justifyContent"],
  figure: CSSProperties
) {
  const layout = (width: string) => ({
    container: {
      display: "flex",
      justifyContent,
      minWidth: 0,
      width,
    } satisfies CSSProperties,
    figure: { ...figure, justifyContent },
  });
  return {
    full: layout("100%"),
    l: layout("80%"),
    m: layout("60%"),
    s: layout("40%"),
  };
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

  // 磨砂开启时容器不再直接铺背景图：图片交给模糊层，容器只负责裁切与层叠
  const canvasBackground: CSSProperties = style.frost
    ? {}
    : {
        ...backgroundStyle,
        backgroundPosition: "center",
        backgroundSize: style.background.size ?? "cover",
      };

  // 列表符号由 `.img-preview ul li::before` 绘制，只能经自定义属性拿到强调色；
  // 导出前 getComputedStyle 已把它解析成实色，html2canvas-pro 照常还原
  const listStyle: CSSProperties & Record<"--marker-color", string> = {
    "--marker-color": style.list.markerColor,
    color: style.list.color,
    marginBottom: `${paragraphGap / baseFontSize}em`,
    paddingLeft: 0,
  };

  // Helper for heading styles
  // isDisplay: h1–h3 为展示级标题
  const createHeadingStyle = (
    scale: number,
    useHeadingAlignment: boolean,
    isDisplay = false,
    extraScale = 1
  ): CSSProperties => ({
    // 展示级标题（h1–h3）取强调色，h4 保持基础标题色
    color: isDisplay ? style.accent : style.heading.color,
    fontSize: `${scale * (isDisplay ? headingScale : 1) * extraScale}em`,
    fontWeight: style.heading.fontWeight,
    letterSpacing: isDisplay ? letterSpacing.heading : undefined,
    lineHeight: 1.2,
    marginBottom: `${headingGap / baseFontSize}em`,
    textAlign: useHeadingAlignment ? effectiveHeadingAlignment : "left",
    // 长标题换行时两行字数均衡（避免"8+1"式孤字尾行）
    textWrap: "balance",
    width: "100%",
  });

  const figure: CSSProperties = {
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    margin: 0,
    marginBottom: `${paragraphGap / baseFontSize}em`,
    width: "100%",
  };
  return {
    card: card.card,
    figure,
    imageLayout: {
      center: imageSizes("center", figure),
      left: imageSizes("flex-start", figure),
      right: imageSizes("flex-end", figure),
    },
    img: {
      ...style.image,
      display: "block",
      height: "auto",
      maxHeight: `${card.card.height / 2}px`,
      maxWidth: "100%",
      width: "auto",
    },

    ...(style.frost ? { frost: style.frost } : {}),

    a: {
      color: style.link.color,
      textDecoration: style.link.underline ? "underline" : "none",
    },

    blockquote: {
      backgroundColor: style.blockquote.background,
      borderLeft: `3px solid ${style.blockquote.borderColor}`,
      boxSizing: "border-box",
      color: style.blockquote.textColor,
      fontStyle: "italic",
      marginBottom: `${paragraphGap / baseFontSize}em`,
      paddingLeft: "1em",
      width: "100%",
      ...(style.blockquote.boxShadow && {
        boxShadow: style.blockquote.boxShadow,
      }),
    },

    code: {
      backgroundColor: style.code.inline.background,
      borderRadius: "0.25em",
      color: style.code.inline.color,
      display: "inline-block",
      fontSize: "0.875em",
      lineHeight: "inherit",
      padding: "0.15em 0.4em",
    },

    container: {
      height: `${card.content.height}px`,
      minHeight: `${card.content.height}px`,
      minWidth: `${card.content.width}px`,
      width: `${card.content.width}px`,
      ...canvasBackground,
      borderRadius: `${card.content.radius}px`,
      boxSizing: "border-box",
      fontFamily,
      fontSize: `${baseFontSize}px`,
      overflow: "hidden",
      position: "relative",
    },

    content: {
      alignItems: getAlignItems(coverStyle?.contentHorizontalAlign),
      color: style.paragraph.color,
      display: "flex",
      flex: 1,
      flexDirection: "column",
      fontSize: "1em",
      justifyContent: getJustifyContent(coverStyle?.contentVerticalAlign),
      letterSpacing: letterSpacing.body,
      lineHeight,
      minHeight: 0,
      wordBreak: "break-word",
    },

    em: {
      color: style.emphasis.italic.color,
      fontStyle: "italic",
    },

    // 卡片底部水印颜色 token（布局在 CardWatermark 组件内）：主题斜体次要色，8 主题皆可读
    footer: {
      color: style.emphasis.italic.color,
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

    innerContainer: {
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: `${padding}px`,
      width: "100%",
    },

    li: {
      fontSize: "1em",
      lineHeight,
      marginBottom: `${paragraphGap / 2 / baseFontSize}em`,
    },

    mark: {
      backgroundColor: style.emphasis.highlight.background,
      borderRadius: "0.2em",
      color: style.emphasis.highlight.color,
      padding: "0.1em 0.3em",
    },

    p: {
      color: style.paragraph.color,
      fontSize: "1em",
      lineHeight,
      marginBottom: `${paragraphGap / baseFontSize}em`,
      textWrap: "pretty",
      wordBreak: "break-word",
    },

    pre: {
      backgroundColor: style.code.block.background,
      borderRadius: "0.4em",
      color: style.code.block.color,
      fontSize: "0.875em",
      lineHeight: 1.5,
      marginBottom: `${paragraphGap / baseFontSize}em`,
      padding: "0.6em 0.8em",
      whiteSpace: "pre-wrap",
      width: "100%",
      wordBreak: "break-word",
    },

    strong: {
      color: style.emphasis.bold.color,
      fontWeight: style.emphasis.bold.fontWeight,
    },

    ul: listStyle,
  };
}
