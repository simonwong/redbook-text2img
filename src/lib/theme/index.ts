/**
 * Theme System
 *
 * Two-layer architecture:
 * - Layer 1: PresetTheme - 精心定制的预设主题，直接包含 FullStyle
 * - Layer 2: FullStyle - 底层完整样式定义
 *
 * 风格调整 (StyleAdjustments): 配合 Layer 1 的微调选项
 */

// Types
export type {
  CoverStyleOverride,
  Density,
  FullStyle,
  HeaderBarStyle,
  HeadingAlignment,
  PresetTheme,
  StyleAdjustments,
} from './types';

// Tokens
export { colors, gradients, spacing, typography } from './tokens';

// Fonts
export {
  defaultFontId,
  fontOptions,
  fontPresets,
  getFontFamily,
  getFontPreset,
} from './fonts';
export type { FontPreset } from './fonts';

// Adjustments
export {
  applyAdjustments,
  defaultAdjustments,
  densityOptions,
  densityPresets,
  headingAlignmentOptions,
} from './adjustments';
export type { AdjustedStyle } from './adjustments';

// Themes
export { defaultTheme, getThemeById, getThemeStyle, presetThemes } from './themes';

// Generator
export { generateStyles } from './generator';
export type { GeneratedStyles, GenerateStylesOptions } from './generator';
