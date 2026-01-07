/**
 * Theme Resolver
 * Converts Layer 2 (ThemeConfig) to Layer 3 (FullStyle)
 */

import { densityPresets, moodPresets, tonePresets } from './presets';
import { typography } from './tokens';
import type { FullStyle, PresetTheme, ThemeConfig } from './types';

/**
 * Resolve ThemeConfig (Layer 2) to FullStyle (Layer 3)
 */
export function resolveThemeConfig(config: ThemeConfig): FullStyle {
  const tone = tonePresets[config.tone];
  const mood = moodPresets[config.mood];
  const density = densityPresets[config.density];

  const backgroundValue = mood.useGradient
    ? tone.background.gradient
    : tone.background.solid;

  return {
    background: {
      type: mood.useGradient ? 'gradient' : 'solid',
      value: backgroundValue,
    },

    typography: {
      baseFontSize: density.baseFontSize,
      lineHeight: density.lineHeight,
      fontFamily: typography.fontFamily.sans,
    },

    heading: {
      color: tone.heading.color,
      fontWeight: mood.headingWeight,
    },

    paragraph: {
      color: tone.paragraph.color,
    },

    emphasis: {
      bold: {
        color: tone.emphasis.bold.color,
        fontWeight: mood.boldWeight,
      },
      italic: {
        color: tone.emphasis.italic.color,
      },
      highlight: {
        background: tone.emphasis.highlight.background,
        color: tone.emphasis.highlight.color,
      },
    },

    list: {
      color: tone.list.color,
      markerColor: tone.list.markerColor,
    },

    blockquote: {
      background: tone.blockquote.background,
      borderColor: tone.blockquote.borderColor,
      textColor: tone.blockquote.textColor,
    },

    code: {
      inline: {
        background: tone.code.inline.background,
        color: tone.code.inline.color,
      },
      block: {
        background: tone.code.block.background,
        color: tone.code.block.color,
      },
    },

    link: {
      color: tone.link.color,
      underline: mood.linkUnderline,
    },

    spacing: {
      padding: density.padding,
      paragraphGap: density.paragraphGap,
      headingGap: density.headingGap,
    },
  };
}

/**
 * Resolve PresetTheme (Layer 1) to FullStyle (Layer 3)
 */
export function resolvePresetTheme(theme: PresetTheme): FullStyle {
  return resolveThemeConfig(theme.config);
}
