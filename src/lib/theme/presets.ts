/**
 * Layer 2: Dimension Presets
 * Maps semantic dimensions to style values
 */

import type { Density, Mood, Tone } from './types';
import { colors, gradients, spacing, typography } from './tokens';

// ============================================================
// Tone Presets (Color scheme)
// ============================================================

interface TonePreset {
  label: string;
  background: { solid: string; gradient: string };
  heading: { color: string };
  paragraph: { color: string };
  emphasis: {
    bold: { color: string };
    italic: { color: string };
    highlight: { background: string; color: string };
  };
  list: { color: string; markerColor: string };
  blockquote: { background: string; borderColor: string; textColor: string };
  code: {
    inline: { background: string; color: string };
    block: { background: string; color: string };
  };
  link: { color: string };
}

export const tonePresets: Record<Tone, TonePreset> = {
  light: {
    label: '浅色',
    background: { solid: colors.white, gradient: gradients.coolLight },
    heading: { color: colors.gray[900] },
    paragraph: { color: colors.gray[700] },
    emphasis: {
      bold: { color: colors.gray[900] },
      italic: { color: colors.gray[600] },
      highlight: { background: colors.accent.orange, color: colors.white },
    },
    list: { color: colors.gray[700], markerColor: colors.gray[400] },
    blockquote: {
      background: colors.gray[50],
      borderColor: colors.gray[300],
      textColor: colors.gray[600],
    },
    code: {
      inline: { background: colors.gray[100], color: colors.accent.purple },
      block: { background: colors.gray[50], color: colors.gray[800] },
    },
    link: { color: colors.accent.blue },
  },

  dark: {
    label: '深色',
    background: { solid: colors.gray[900], gradient: gradients.darkBlue },
    heading: { color: colors.white },
    paragraph: { color: colors.gray[300] },
    emphasis: {
      bold: { color: colors.white },
      italic: { color: colors.gray[400] },
      highlight: { background: colors.accent.orange, color: colors.white },
    },
    list: { color: colors.gray[300], markerColor: colors.gray[500] },
    blockquote: {
      background: colors.gray[800],
      borderColor: colors.gray[600],
      textColor: colors.gray[400],
    },
    code: {
      inline: { background: colors.gray[800], color: colors.accent.cyan },
      block: { background: colors.gray[800], color: colors.gray[200] },
    },
    link: { color: colors.accent.cyan },
  },

  warm: {
    label: '暖色',
    background: { solid: colors.warm.bg, gradient: gradients.warmLight },
    heading: { color: colors.warm.text },
    paragraph: { color: colors.warm.textSecondary },
    emphasis: {
      bold: { color: colors.warm.text },
      italic: { color: colors.warm.textSecondary },
      highlight: { background: colors.warm.accent, color: colors.white },
    },
    list: { color: colors.warm.textSecondary, markerColor: colors.warm.accent },
    blockquote: {
      background: colors.warm.surface,
      borderColor: colors.warm.accent,
      textColor: colors.warm.textSecondary,
    },
    code: {
      inline: { background: colors.warm.muted, color: colors.warm.text },
      block: { background: colors.warm.surface, color: colors.warm.text },
    },
    link: { color: colors.warm.accent },
  },

  cool: {
    label: '冷色',
    background: { solid: colors.cool.bg, gradient: gradients.coolLight },
    heading: { color: colors.cool.text },
    paragraph: { color: colors.cool.textSecondary },
    emphasis: {
      bold: { color: colors.cool.text },
      italic: { color: colors.cool.textSecondary },
      highlight: { background: colors.cool.accent, color: colors.white },
    },
    list: { color: colors.cool.textSecondary, markerColor: colors.cool.accent },
    blockquote: {
      background: colors.cool.surface,
      borderColor: colors.cool.accent,
      textColor: colors.cool.textSecondary,
    },
    code: {
      inline: { background: colors.cool.muted, color: colors.cool.text },
      block: { background: colors.cool.surface, color: colors.cool.text },
    },
    link: { color: colors.cool.accent },
  },

  nature: {
    label: '自然',
    background: { solid: colors.nature.bg, gradient: gradients.forest },
    heading: { color: colors.nature.text },
    paragraph: { color: colors.nature.textSecondary },
    emphasis: {
      bold: { color: colors.nature.text },
      italic: { color: colors.nature.textSecondary },
      highlight: { background: colors.nature.accent, color: colors.white },
    },
    list: {
      color: colors.nature.textSecondary,
      markerColor: colors.nature.accent,
    },
    blockquote: {
      background: colors.nature.surface,
      borderColor: colors.nature.accent,
      textColor: colors.nature.textSecondary,
    },
    code: {
      inline: { background: colors.nature.muted, color: colors.nature.text },
      block: { background: colors.nature.surface, color: colors.nature.text },
    },
    link: { color: colors.nature.accent },
  },
};

// ============================================================
// Mood Presets (Visual style)
// ============================================================

interface MoodPreset {
  label: string;
  useGradient: boolean;
  headingWeight: number;
  boldWeight: number;
  linkUnderline: boolean;
}

export const moodPresets: Record<Mood, MoodPreset> = {
  minimal: {
    label: '极简',
    useGradient: false,
    headingWeight: typography.fontWeight.semibold,
    boldWeight: typography.fontWeight.semibold,
    linkUnderline: false,
  },
  vibrant: {
    label: '活力',
    useGradient: true,
    headingWeight: typography.fontWeight.bold,
    boldWeight: typography.fontWeight.bold,
    linkUnderline: true,
  },
  elegant: {
    label: '优雅',
    useGradient: true,
    headingWeight: typography.fontWeight.medium,
    boldWeight: typography.fontWeight.semibold,
    linkUnderline: false,
  },
};

// ============================================================
// Density Presets (Spacing and size)
// ============================================================

interface DensityPreset {
  label: string;
  baseFontSize: number;
  lineHeight: number;
  padding: number;
  paragraphGap: number;
  headingGap: number;
}

export const densityPresets: Record<Density, DensityPreset> = {
  compact: {
    label: '紧凑',
    baseFontSize: typography.fontSize.compact,
    lineHeight: typography.lineHeight.compact,
    padding: spacing.padding.compact,
    paragraphGap: spacing.paragraphGap.compact,
    headingGap: spacing.headingGap.compact,
  },
  normal: {
    label: '正常',
    baseFontSize: typography.fontSize.normal,
    lineHeight: typography.lineHeight.normal,
    padding: spacing.padding.normal,
    paragraphGap: spacing.paragraphGap.normal,
    headingGap: spacing.headingGap.normal,
  },
  spacious: {
    label: '宽松',
    baseFontSize: typography.fontSize.spacious,
    lineHeight: typography.lineHeight.spacious,
    padding: spacing.padding.spacious,
    paragraphGap: spacing.paragraphGap.spacious,
    headingGap: spacing.headingGap.spacious,
  },
};

// ============================================================
// Option lists for UI
// ============================================================

export const toneOptions = Object.entries(tonePresets).map(([value, preset]) => ({
  value: value as Tone,
  label: preset.label,
}));

export const moodOptions = Object.entries(moodPresets).map(([value, preset]) => ({
  value: value as Mood,
  label: preset.label,
}));

export const densityOptions = Object.entries(densityPresets).map(
  ([value, preset]) => ({
    value: value as Density,
    label: preset.label,
  })
);
