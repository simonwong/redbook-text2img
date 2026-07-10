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

/**
 * 卡片浮层（surface）：内容浮在圆角卡片上，背景四周露出（封面与内容页一致生效）。
 * 无此字段时文字直接铺在整卡背景上（默认行为，逐像素不变）。
 * 仅使用 html2canvas-pro 可导出属性：solid/rgba 背景、borderRadius、boxShadow；禁 backdrop-filter。
 */
export interface SurfaceStyle {
  /** 浮层卡背景（建议 rgba 半透明白，如 rgba(255,255,255,0.88)） */
  background: string;
  /** 卡片圆角（px） */
  borderRadius: number;
  /** 卡片投影（柔和阴影，强化浮层层次） */
  boxShadow?: string;
  /** 卡片四周留白 = container padding（px），露出背景边缘 */
  margin: number;
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
  /** 内容卡浮层布局变体（可选） */
  surface?: SurfaceStyle;
}

// ============================================================
// 风格调整 (StyleAdjustments) - 配合 Layer 1
// ============================================================

/** 密度选项 */
export type Density = "compact" | "snug" | "normal" | "relaxed" | "spacious";

/** 标题对齐方式 */
export type HeadingAlignment = "left" | "center";

/** 标题装饰用户选项；"none" = 强制无装饰，undefined = 跟随主题默认 */
export type HeadingDecorationChoice =
  | "none"
  | "underline"
  | "wavy"
  | "highlight";

/** 风格调整（配合 Layer 1 预设主题） */
export interface StyleAdjustments {
  /** 自定义强调色（hex）；undefined = 跟随主题原色 */
  accentColor?: string;
  density: Density;
  fontId: string; // 字体预设 ID
  headingAlignment: HeadingAlignment;
  /** 标题装饰覆盖；undefined = 跟随主题原装饰 */
  headingDecoration?: HeadingDecorationChoice;
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
  /** 封面 h1 额外字号乘数（叠加于 typeset.headingScale 之上，仅作用于 h1） */
  headingScale?: number;
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
  /**
   * 该主题的默认风格调整（仅声明与全局默认不同的项）。
   * 切换到此主题时 adjustments 会重置为此默认；未声明的项回落全局默认。
   */
  defaults?: Partial<StyleAdjustments>;
}
