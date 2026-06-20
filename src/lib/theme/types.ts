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

export interface HeadingStyle {
  color: string;
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

/** Layer 2: Complete style configuration for Markdown rendering */
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
  typography: TypographyStyle;
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
  /** 内容水平对齐方式 */
  contentHorizontalAlign?: "left" | "center" | "right";
  /** 内容垂直对齐方式 */
  contentVerticalAlign?: "top" | "center" | "bottom";
  /** 标题对齐方式（优先级高于用户调整） */
  headingAlignment?: HeadingAlignment;
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

/** Layer 1: Preset theme with complete FullStyle */
export interface PresetTheme {
  /** 封面图特有的样式覆盖（继承 style，仅覆盖指定属性） */
  coverStyle?: CoverStyleOverride;
  description?: string;
  /** 装饰性顶部导航栏 */
  headerBar?: HeaderBarStyle;
  id: string;
  name: string;
  style: FullStyle; // 直接包含完整样式，不再是 config
}

export interface CustomThemeCrop {
  scale: number;
  sourceHeight: number;
  sourceWidth: number;
  x: number;
  y: number;
}

export interface CustomThemeRecord {
  backgroundImageDataUrl?: string;
  basePresetThemeId: string;
  createdAt: number;
  crop: CustomThemeCrop;
  id: string;
  imageStorageKey: string;
  name: string;
}

export interface PendingCustomThemeUpload {
  basePresetThemeId: string;
  crop: CustomThemeCrop;
  imageDataUrl: string;
  themeName: string;
}

export interface ResolvedTheme extends PresetTheme {
  basePresetThemeId: string;
  source: "preset" | "custom";
}
