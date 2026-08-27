/**
 * Theme System
 *
 * Internal theme primitives used behind the Style System Interface.
 */

export type { AdjustedStyle } from "./adjustments";
// Adjustments
// biome-ignore lint/performance/noBarrelFile: stable internal theme module API
export {
  applyAdjustments,
  defaultAdjustments,
  densityPresets,
  resolveThemeDefaults,
} from "./adjustments";
// Canvas
export { canvasBackgroundsEqual } from "./canvas";
export type { FontPreset } from "./fonts";
// Fonts
export {
  defaultFontId,
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
  presetThemes,
} from "./themes";
// Tokens
export { colors, gradients, spacing, typography } from "./tokens";
// Types
export type {
  CoverLayout,
  CoverStyleOverride,
  Density,
  FullStyle,
  HeaderBarStyle,
  HeadingAlignment,
  HeadingDecorationChoice,
  PresetTheme,
  StyleAdjustments,
  ThemeInternals,
} from "./types";
