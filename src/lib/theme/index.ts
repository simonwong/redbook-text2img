/**
 * Theme System
 *
 * Internal theme primitives used behind the Style System Interface.
 */

export type { AdjustedStyle } from "./adjustments";
// Adjustments
// biome-ignore lint/performance/noBarrelFile: stable public theme module API
export {
  applyAdjustments,
  bodyHeadingAlignmentOptions,
  bodyHeadingSizeOptions,
  coverLayoutOptions,
  defaultAdjustments,
  densityOptions,
  densityPresets,
  resolveThemeDefaults,
} from "./adjustments";
export type { FontPreset } from "./fonts";
// Fonts
export {
  defaultFontId,
  fontOptions,
  fontPresets,
  getFontFamily,
  getFontPreset,
} from "./fonts";
export type { GeneratedStyles, GenerateStylesOptions } from "./generator";
// Generator
export { createHeadingDecoration, generateStyles } from "./generator";

// Themes
export {
  defaultTheme,
  getThemeById,
  getThemeStyle,
  presetThemes,
} from "./themes";
// Tokens
export { colors, gradients, spacing, typography } from "./tokens";
// Types
export type {
  BodyHeadingSize,
  CoverLayout,
  CoverStyleOverride,
  Density,
  FullStyle,
  HeaderBarStyle,
  HeadingAlignment,
  HeadingDecorationChoice,
  PresetTheme,
  StyleAdjustments,
  TypesetStyle,
} from "./types";
