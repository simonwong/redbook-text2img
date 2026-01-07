/**
 * Theme System
 *
 * Three-layer architecture:
 * - Layer 1: PresetTheme - Quick selection from preset themes
 * - Layer 2: ThemeConfig - Adjust dimensions (tone, mood, density)
 * - Layer 3: FullStyle - Complete style configuration (internal)
 */

// Types
export type {
  Density,
  FullStyle,
  Mood,
  PresetTheme,
  ThemeConfig,
  Tone,
} from './types';

// Tokens
export { colors, gradients, spacing, typography } from './tokens';

// Presets
export {
  densityOptions,
  densityPresets,
  moodOptions,
  moodPresets,
  toneOptions,
  tonePresets,
} from './presets';

// Themes
export { defaultTheme, getThemeById, presetThemes } from './themes';

// Resolver
export { resolvePresetTheme, resolveThemeConfig } from './resolver';

// Generator
export { generateStyles } from './generator';
export type { GeneratedStyles } from './generator';
