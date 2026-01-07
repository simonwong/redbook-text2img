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
  type: 'solid' | 'gradient' | 'image';
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
export type Density = 'compact' | 'normal' | 'spacious';

/** 标题对齐方式 */
export type HeadingAlignment = 'left' | 'center';

/** 风格调整（配合 Layer 1 预设主题） */
export interface StyleAdjustments {
  density: Density;
  fontId: string; // 字体预设 ID
  headingAlignment: HeadingAlignment;
}

// ============================================================
// Layer 1: PresetTheme (精心定制的预设主题)
// ============================================================

/** Layer 1: Preset theme with complete FullStyle */
export interface PresetTheme {
  id: string;
  name: string;
  description?: string;
  style: FullStyle; // 直接包含完整样式，不再是 config
}
