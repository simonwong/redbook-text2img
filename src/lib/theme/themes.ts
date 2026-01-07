/**
 * Layer 1: Preset Themes
 * 精心定制的预设主题，每个主题直接定义完整的 FullStyle
 */

import { colors, gradients, spacing, typography } from './tokens';
import type { FullStyle, PresetTheme } from './types';

// ============================================================
// 基础样式模板（内部使用）
// ============================================================

const baseTypography = {
  baseFontSize: typography.fontSize.normal,
  lineHeight: typography.lineHeight.normal,
};

const baseSpacing = {
  padding: spacing.padding.normal,
  paragraphGap: spacing.paragraphGap.normal,
  headingGap: spacing.headingGap.normal,
};

// ============================================================
// 预设主题定义
// ============================================================

export const presetThemes: PresetTheme[] = [
  // ===== 基础系列 =====
  {
    id: 'clean-light',
    name: '清新白',
    description: '简洁明亮的白色主题',
    style: {
      background: { type: 'solid', value: colors.white },
      typography: baseTypography,
      heading: { color: colors.gray[900], fontWeight: typography.fontWeight.semibold },
      paragraph: { color: colors.gray[700] },
      emphasis: {
        bold: { color: colors.gray[900], fontWeight: typography.fontWeight.semibold },
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
      link: { color: colors.accent.blue, underline: false },
      spacing: baseSpacing,
    },
  },

  {
    id: 'clean-dark',
    name: '暗夜黑',
    description: '深色极简风格',
    style: {
      background: { type: 'solid', value: colors.gray[900] },
      typography: baseTypography,
      heading: { color: colors.white, fontWeight: typography.fontWeight.semibold },
      paragraph: { color: colors.gray[300] },
      emphasis: {
        bold: { color: colors.white, fontWeight: typography.fontWeight.semibold },
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
      link: { color: colors.accent.cyan, underline: false },
      spacing: baseSpacing,
    },
  },

  // ===== 渐变系列 =====
  {
    id: 'gradient-warm',
    name: '暖阳渐变',
    description: '温暖渐变，活力四射',
    style: {
      background: { type: 'gradient', value: gradients.warmLight },
      typography: baseTypography,
      heading: { color: colors.warm.text, fontWeight: typography.fontWeight.bold },
      paragraph: { color: colors.warm.textSecondary },
      emphasis: {
        bold: { color: colors.warm.text, fontWeight: typography.fontWeight.bold },
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
      link: { color: colors.warm.accent, underline: true },
      spacing: baseSpacing,
    },
  },

  {
    id: 'gradient-cool',
    name: '冷调渐变',
    description: '清冷蓝调，知性优雅',
    style: {
      background: { type: 'gradient', value: gradients.coolLight },
      typography: baseTypography,
      heading: { color: colors.cool.text, fontWeight: typography.fontWeight.medium },
      paragraph: { color: colors.cool.textSecondary },
      emphasis: {
        bold: { color: colors.cool.text, fontWeight: typography.fontWeight.semibold },
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
      link: { color: colors.cool.accent, underline: false },
      spacing: baseSpacing,
    },
  },

  {
    id: 'gradient-nature',
    name: '自然清新',
    description: '绿色自然，清新舒适',
    style: {
      background: { type: 'gradient', value: gradients.forest },
      typography: baseTypography,
      heading: { color: colors.nature.text, fontWeight: typography.fontWeight.medium },
      paragraph: { color: colors.nature.textSecondary },
      emphasis: {
        bold: { color: colors.nature.text, fontWeight: typography.fontWeight.semibold },
        italic: { color: colors.nature.textSecondary },
        highlight: { background: colors.nature.accent, color: colors.white },
      },
      list: { color: colors.nature.textSecondary, markerColor: colors.nature.accent },
      blockquote: {
        background: colors.nature.surface,
        borderColor: colors.nature.accent,
        textColor: colors.nature.textSecondary,
      },
      code: {
        inline: { background: colors.nature.muted, color: colors.nature.text },
        block: { background: colors.nature.surface, color: colors.nature.text },
      },
      link: { color: colors.nature.accent, underline: false },
      spacing: baseSpacing,
    },
  },

  // ===== 深色渐变系列 =====
  {
    id: 'dark-blue',
    name: '暗黑科技',
    description: '深色渐变，科技感',
    style: {
      background: { type: 'gradient', value: gradients.darkBlue },
      typography: baseTypography,
      heading: { color: colors.white, fontWeight: typography.fontWeight.bold },
      paragraph: { color: colors.gray[300] },
      emphasis: {
        bold: { color: colors.white, fontWeight: typography.fontWeight.bold },
        italic: { color: colors.gray[400] },
        highlight: { background: colors.accent.blue, color: colors.white },
      },
      list: { color: colors.gray[300], markerColor: colors.accent.blue },
      blockquote: {
        background: 'rgba(59, 130, 246, 0.1)',
        borderColor: colors.accent.blue,
        textColor: colors.gray[400],
      },
      code: {
        inline: { background: 'rgba(59, 130, 246, 0.2)', color: colors.accent.cyan },
        block: { background: 'rgba(0, 0, 0, 0.3)', color: colors.gray[200] },
      },
      link: { color: colors.accent.cyan, underline: true },
      spacing: baseSpacing,
    },
  },

  {
    id: 'dark-purple',
    name: '暗夜紫',
    description: '神秘紫色渐变',
    style: {
      background: { type: 'gradient', value: gradients.darkPurple },
      typography: baseTypography,
      heading: { color: colors.white, fontWeight: typography.fontWeight.bold },
      paragraph: { color: colors.gray[300] },
      emphasis: {
        bold: { color: colors.white, fontWeight: typography.fontWeight.bold },
        italic: { color: colors.gray[400] },
        highlight: { background: colors.accent.purple, color: colors.white },
      },
      list: { color: colors.gray[300], markerColor: colors.accent.purple },
      blockquote: {
        background: 'rgba(139, 92, 246, 0.1)',
        borderColor: colors.accent.purple,
        textColor: colors.gray[400],
      },
      code: {
        inline: { background: 'rgba(139, 92, 246, 0.2)', color: colors.accent.pink },
        block: { background: 'rgba(0, 0, 0, 0.3)', color: colors.gray[200] },
      },
      link: { color: colors.accent.pink, underline: true },
      spacing: baseSpacing,
    },
  },

  // ===== 场景系列 =====
  {
    id: 'xiaohongshu-pink',
    name: '小红书粉',
    description: '粉色暖调，适合生活分享',
    style: {
      background: { type: 'gradient', value: gradients.pinkLight },
      typography: baseTypography,
      heading: { color: '#9d174d', fontWeight: typography.fontWeight.bold },
      paragraph: { color: '#831843' },
      emphasis: {
        bold: { color: '#9d174d', fontWeight: typography.fontWeight.bold },
        italic: { color: '#be185d' },
        highlight: { background: colors.accent.pink, color: colors.white },
      },
      list: { color: '#831843', markerColor: colors.accent.pink },
      blockquote: {
        background: '#fdf2f8',
        borderColor: colors.accent.pink,
        textColor: '#9d174d',
      },
      code: {
        inline: { background: '#fce7f3', color: '#9d174d' },
        block: { background: '#fdf2f8', color: '#831843' },
      },
      link: { color: colors.accent.pink, underline: true },
      spacing: baseSpacing,
    },
  },

  {
    id: 'business-blue',
    name: '商务深蓝',
    description: '专业深蓝，适合商务内容',
    style: {
      background: { type: 'solid', value: '#1e3a5f' },
      typography: baseTypography,
      heading: { color: colors.white, fontWeight: typography.fontWeight.semibold },
      paragraph: { color: '#cbd5e1' },
      emphasis: {
        bold: { color: colors.white, fontWeight: typography.fontWeight.semibold },
        italic: { color: '#94a3b8' },
        highlight: { background: '#3b82f6', color: colors.white },
      },
      list: { color: '#cbd5e1', markerColor: '#60a5fa' },
      blockquote: {
        background: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        textColor: '#94a3b8',
      },
      code: {
        inline: { background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' },
        block: { background: 'rgba(0, 0, 0, 0.2)', color: '#e2e8f0' },
      },
      link: { color: '#60a5fa', underline: false },
      spacing: baseSpacing,
    },
  },

  {
    id: 'reading-mode',
    name: '阅读模式',
    description: '护眼米色，舒适阅读',
    style: {
      background: { type: 'solid', value: '#fefcf3' },
      typography: {
        baseFontSize: typography.fontSize.spacious,
        lineHeight: typography.lineHeight.spacious,
      },
      heading: { color: '#44403c', fontWeight: typography.fontWeight.medium },
      paragraph: { color: '#57534e' },
      emphasis: {
        bold: { color: '#44403c', fontWeight: typography.fontWeight.semibold },
        italic: { color: '#78716c' },
        highlight: { background: '#fbbf24', color: '#44403c' },
      },
      list: { color: '#57534e', markerColor: '#a8a29e' },
      blockquote: {
        background: '#faf5eb',
        borderColor: '#d6d3d1',
        textColor: '#78716c',
      },
      code: {
        inline: { background: '#f5f5f4', color: '#57534e' },
        block: { background: '#faf5eb', color: '#57534e' },
      },
      link: { color: '#b45309', underline: true },
      spacing: {
        padding: spacing.padding.spacious,
        paragraphGap: spacing.paragraphGap.spacious,
        headingGap: spacing.headingGap.spacious,
      },
    },
  },
];

// ============================================================
// 工具函数
// ============================================================

/** Get a theme by ID */
export const getThemeById = (id: string): PresetTheme | undefined =>
  presetThemes.find((theme) => theme.id === id);

/** Default theme */
export const defaultTheme = presetThemes[0];

/** Get theme style by ID, with fallback to default */
export const getThemeStyle = (id: string): FullStyle =>
  getThemeById(id)?.style ?? defaultTheme.style;
