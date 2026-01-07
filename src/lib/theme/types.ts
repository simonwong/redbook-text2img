/**
 * Theme System Type Definitions
 *
 * Three-layer architecture:
 * - Layer 1: PresetTheme (user selects a preset)
 * - Layer 2: ThemeConfig (user adjusts dimensions)
 * - Layer 3: FullStyle (complete style configuration)
 */

// ============================================================
// Layer 3: Full Style (Internal, complete capability)
// ============================================================

export interface BackgroundStyle {
  type: 'solid' | 'gradient' | 'image';
  value: string;
}

export interface TypographyStyle {
  baseFontSize: number; // 12-18
  lineHeight: number; // 1.4-2.0
  fontFamily: string;
}

export interface HeadingStyle {
  color: string;
  fontWeight: number; // 400-900
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

/** Layer 3: Complete style configuration for Markdown rendering */
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
// Layer 2: Theme Config (User-facing dimensions)
// ============================================================

export type Tone = 'light' | 'dark' | 'warm' | 'cool' | 'nature';
export type Mood = 'minimal' | 'vibrant' | 'elegant';
export type Density = 'compact' | 'normal' | 'spacious';

/** Layer 2: Semantic dimension configuration */
export interface ThemeConfig {
  tone: Tone;
  mood: Mood;
  density: Density;
}

// ============================================================
// Layer 1: Preset Theme (Quick selection)
// ============================================================

/** Layer 1: Preset theme with name and config */
export interface PresetTheme {
  id: string;
  name: string;
  description?: string;
  config: ThemeConfig;
}
