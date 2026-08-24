/**
 * Theme System Type Definitions
 *
 * Style Foundation internal types.
 * The public Style System Interface lives in src/lib/style-system.
 */

// ============================================================
// Style Foundation
// ============================================================

export interface BackgroundStyle {
  type: "solid" | "gradient" | "image";
  value: string;
}

export type BackgroundPreset =
  | "clean-light"
  | "trianglify-gray"
  | "night-aurora"
  | "warm-sun"
  | "cool-mist"
  | "cherry-cream";

export type CanvasBackground =
  | { readonly kind: "preset"; readonly preset: BackgroundPreset }
  | { readonly color: string; readonly kind: "solid" };

export type ContentSurface = "none" | "floating-card" | "notebook";

export interface TypographyStyle {
  baseFontSize: number; // 12-18
  lineHeight: number; // 1.4-2.0
  // fontFamily 由 StyleAdjustments 动态生成，不在 FullStyle 中
}

/**
 * 标题装饰变体（作用于 h1–h2 内层 span，跟随文字宽度）
 * 仅使用 html2canvas-pro 可导出的属性：linear-gradient / padding / 内联 SVG data-URI 背景图
 * - underline：文字宽度的粗下划线（linear-gradient 底部铺色）
 * - wavy：文字宽度的波浪下划线（repeat-x 平铺内联 SVG data-URI）
 * - highlight：荧光笔衬底（linear-gradient 只染文字后半高）
 */
export type HeadingDecoration =
  | { color: string; kind: "underline"; thickness?: string }
  | { color: string; kind: "wavy" }
  | { color: string; kind: "highlight" };

export interface HeadingStyle {
  color: string;
  decoration?: HeadingDecoration;
  fontWeight: number; // 400-900
  // alignment 由 StyleAdjustments 控制
}

export interface ParagraphStyle {
  color: string;
}

export interface EmphasisStyle {
  bold: {
    color: string;
    fontWeight: number;
  };
  highlight: {
    background: string;
    color: string;
  };
  italic: {
    color: string;
  };
}

export interface ListStyle {
  color: string;
  markerColor: string;
}

export interface BlockquoteStyle {
  background: string;
  borderColor: string;
  boxShadow?: string;
  textColor: string;
}

export interface CodeStyle {
  block: {
    background: string;
    color: string;
  };
  inline: {
    background: string;
    color: string;
  };
}

export interface LinkStyle {
  color: string;
  underline: boolean;
}

export interface SpacingStyle {
  headingGap: number;
  padding: number;
  paragraphGap: number;
}

/**
 * 卡片浮层（surface）：内容浮在圆角卡片上，背景四周露出（封面与内容页一致生效）。
 * 无此字段时文字直接铺在整卡背景上（默认行为，逐像素不变）。
 * 仅使用 html2canvas-pro 可导出属性：solid/rgba 背景、borderRadius、boxShadow；禁 backdrop-filter。
 */
export interface SurfaceStyle {
  /** 浮层卡背景（建议 rgba 半透明白，如 rgba(255,255,255,0.88)） */
  background: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
  /** 卡片圆角（px） */
  borderRadius: number;
  /** 卡片投影（柔和阴影，强化浮层层次） */
  boxShadow?: string;
  kind?: Exclude<ContentSurface, "none">;
  /** 卡片四周留白 = container padding（px），露出背景边缘 */
  margin: number;
}

/** Complete internal style definition for Markdown rendering */
export interface FullStyle {
  background: BackgroundStyle;
  blockquote: BlockquoteStyle;
  code: CodeStyle;
  emphasis: EmphasisStyle;
  heading: HeadingStyle;
  link: LinkStyle;
  list: ListStyle;
  paragraph: ParagraphStyle;
  spacing: SpacingStyle;
  /** 内容卡浮层布局变体（可选） */
  surface?: SurfaceStyle;
  typography: TypographyStyle;
}

// ============================================================
// Resolved style configuration
// ============================================================

/** 密度选项 */
export type Density = "compact" | "balanced" | "spacious";

/** 标题对齐方式 */
export type HeadingAlignment = "left" | "center";

export type BodyHeadingSize = "small" | "medium" | "large";

export type CoverLayout = "center-poster" | "top-left" | "bottom-left";

/** 标题装饰用户选项（四值封闭集合，每个取值都有明确含义） */
export type HeadingDecorationChoice =
  | "none"
  | "underline"
  | "wavy"
  | "highlight";

/** Internal shape matching the resolved public style configuration */
export interface StyleAdjustments {
  readonly background: CanvasBackground;
  readonly bodyHeadingAlignment: HeadingAlignment;
  readonly bodyHeadingSize: BodyHeadingSize;
  readonly contentSurface: ContentSurface;
  readonly coverLayout: CoverLayout;
  /** 标题装饰颜色（hex） */
  readonly decorationColor: string;
  readonly density: Density;
  readonly fontId: "sans" | "serif";
  /** 标题装饰类型（四值封闭集合，无跟随主题的哨兵语义） */
  readonly headingDecoration: HeadingDecorationChoice;
}

// ============================================================
// Built-in themes
// ============================================================

/** 封面图特有的样式覆盖 */
export interface CoverStyleOverride {
  /** 内容水平对齐方式 */
  contentHorizontalAlign?: "left" | "center" | "right";
  /** 内容垂直对齐方式 */
  contentVerticalAlign?: "top" | "center" | "bottom";
  /** 标题对齐方式（优先级高于用户调整） */
  headingAlignment?: HeadingAlignment;
  /** 封面 h1 额外字号乘数，仅作用于 h1 */
  headingScale?: number;
}

/** 装饰性顶部导航栏（如 Apple Notes 风格） */
export interface HeaderBarStyle {
  /** 背景颜色（可以是透明） */
  background?: string;
  /** 图标颜色 */
  iconColor: string;
  /** 显示哪些图标 */
  icons: {
    backArrow?: boolean;
    share?: boolean;
    menu?: boolean;
  };
}

/** Named built-in preset. Rendering details stay behind the Style Foundation. */
export interface PresetTheme {
  readonly configuration: StyleAdjustments;
  readonly description?: string;
  readonly id: string;
  readonly name: string;
}
