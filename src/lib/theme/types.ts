/**
 * Theme System Type Definitions
 *
 * Two-layer architecture:
 * - Layer 1: PresetTheme (精心定制的预设主题，直接包含 FullStyle)
 * - Layer 2: FullStyle (底层完整样式定义)
 *
 * 风格调整 (StyleAdjustments): 配合 Layer 1 的微调选项
 */

// ============================================================
// Layer 2: FullStyle (底层完整样式定义)
// ============================================================

export interface BackgroundStyle {
  type: "solid" | "gradient" | "image";
  value: string;
}

export interface TypographyStyle {
  baseFontSize: number; // 12-18
  lineHeight: number; // 1.4-2.0
  // fontFamily 由 StyleAdjustments 动态生成，不在 FullStyle 中
}

/**
 * 标题装饰变体（作用于 h1–h2 内层 span，跟随文字宽度）
 * 仅使用 html2canvas-pro 可导出的属性：linear-gradient / padding
 * - underline：文字宽度的粗下划线（linear-gradient 底部铺色）
 * - highlight：荧光笔衬底（linear-gradient 只染文字后半高）
 */
export type HeadingDecoration =
  | { color: string; kind: "underline"; thickness?: string }
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
  italic: {
    color: string;
  };
  highlight: {
    background: string;
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
  textColor: string;
  boxShadow?: string;
}

export interface CodeStyle {
  inline: {
    background: string;
    color: string;
  };
  block: {
    background: string;
    color: string;
  };
}

export interface LinkStyle {
  color: string;
  underline: boolean;
}

export interface SpacingStyle {
  padding: number;
  paragraphGap: number;
  headingGap: number;
}

/** Layer 2: Complete style configuration for Markdown rendering */
export interface FullStyle {
  background: BackgroundStyle;
  typography: TypographyStyle;
  heading: HeadingStyle;
  paragraph: ParagraphStyle;
  emphasis: EmphasisStyle;
  list: ListStyle;
  blockquote: BlockquoteStyle;
  code: CodeStyle;
  link: LinkStyle;
  spacing: SpacingStyle;
}

// ============================================================
// 风格调整 (StyleAdjustments) - 配合 Layer 1
// ============================================================

/** 密度选项 */
export type Density = "compact" | "normal" | "spacious";

/** 标题对齐方式 */
export type HeadingAlignment = "left" | "center";

/** 风格调整（配合 Layer 1 预设主题） */
export interface StyleAdjustments {
  density: Density;
  fontId: string; // 字体预设 ID
  headingAlignment: HeadingAlignment;
}

// ============================================================
// Layer 1: PresetTheme (精心定制的预设主题)
// ============================================================

/** 封面图特有的样式覆盖 */
export interface CoverStyleOverride {
  /** 内容垂直对齐方式 */
  contentVerticalAlign?: "top" | "center" | "bottom";
  /** 内容水平对齐方式 */
  contentHorizontalAlign?: "left" | "center" | "right";
  /** 标题对齐方式（优先级高于用户调整） */
  headingAlignment?: HeadingAlignment;
}

/**
 * 每主题排版个性（typeset）
 * 叠加在用户"密度"与"字体"选择之上，均为乘数/叠加，不与密度打架。
 */
export interface TypesetStyle {
  /** 主题默认字体（引用 fonts.ts 预设 id）；用户字体为 auto 时生效 */
  fontId?: string;
  /** 在 tokens.headingScale 基础上对 h1–h3 字号的乘数（如 1.15 放大标题） */
  headingScale?: number;
  /** 字间距（CSS 值） */
  letterSpacing?: { heading?: string; body?: string };
  /** 正文字号乘数（乘在密度 baseFontSize 上） */
  bodyScale?: number;
}

/** 装饰性顶部导航栏（如 Apple Notes 风格） */
export interface HeaderBarStyle {
  /** 图标颜色 */
  iconColor: string;
  /** 背景颜色（可以是透明） */
  background?: string;
  /** 显示哪些图标 */
  icons: {
    backArrow?: boolean;
    share?: boolean;
    menu?: boolean;
  };
}

/** Layer 1: Preset theme with complete FullStyle */
export interface PresetTheme {
  id: string;
  name: string;
  description?: string;
  style: FullStyle; // 直接包含完整样式，不再是 config
  /** 封面图特有的样式覆盖（继承 style，仅覆盖指定属性） */
  coverStyle?: CoverStyleOverride;
  /** 装饰性顶部导航栏 */
  headerBar?: HeaderBarStyle;
  /** 每主题排版个性（字体/标题字号/字间距/正文字号） */
  typeset?: TypesetStyle;
}
