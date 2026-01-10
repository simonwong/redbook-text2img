/**
 * Layer 1: Preset Themes
 * 精心定制的预设主题，每个主题直接定义完整的 FullStyle
 */

import { TrianglifyGary } from './backgroundSet';
import { colors, gradients, spacing, typography } from './tokens';
import type { CoverStyleOverride, FullStyle, PresetTheme } from './types';

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

/** 默认封面图样式：垂直水平居中 */
const defaultCoverStyle: CoverStyleOverride = {
  contentVerticalAlign: 'center',
  contentHorizontalAlign: 'center',
};

// ============================================================
// 预设主题定义
// ============================================================

export const presetThemes: PresetTheme[] = [
  // ===== 基础系列 =====
  {
    id: 'clean-light',
    name: '清新白',
    description: '简洁明亮的白色主题，带柔和光影',
    style: {
      background: { type: 'gradient', value: gradients.cleanLight },
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
    coverStyle: defaultCoverStyle,
  },
  {
    id: 'trianglify-minimalist',
    name: '三角极简',
    description: '抽象三角形为背景的极简风格',
    style: {
      background: { type: 'image', value: TrianglifyGary },
      typography: baseTypography,
      heading: { color: colors.gray[800], fontWeight: typography.fontWeight.bold },
      paragraph: { color: colors.gray[700] },
      emphasis: {
        bold: { color: colors.gray[800], fontWeight: typography.fontWeight.bold },
        italic: { color: colors.gray[600] },
        highlight: { background: colors.accent.blue, color: colors.white },
      },
      list: { color: colors.gray[700], markerColor: colors.gray[500] },
      blockquote: {
        background: 'rgba(255, 255, 255, 0.7)',
        borderColor: colors.gray[400],
        textColor: colors.gray[600],
      },
      code: {
        inline: { background: 'rgba(255, 255, 255, 0.8)', color: colors.gray[700] },
        block: { background: 'rgba(255, 255, 255, 0.85)', color: colors.gray[800] },
      },
      link: { color: colors.accent.blue, underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },
  {
    id: 'clean-dark',
    name: '暗夜黑',
    description: '月光氛围的深色主题，适合夜间阅读',
    style: {
      background: { type: 'gradient', value: gradients.darkNight },
      typography: baseTypography,
      heading: { color: '#f0f2f5', fontWeight: typography.fontWeight.semibold },
      paragraph: { color: '#c8cdd6' },
      emphasis: {
        bold: { color: '#f0f2f5', fontWeight: typography.fontWeight.semibold },
        italic: { color: '#a0a8b5' },
        highlight: { background: '#6b7280', color: colors.white },
      },
      list: { color: '#c8cdd6', markerColor: '#8090a0' },
      blockquote: {
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        textColor: '#a0a8b5',
      },
      code: {
        inline: { background: 'rgba(255, 255, 255, 0.08)', color: '#b8c8e8' },
        block: { background: 'rgba(255, 255, 255, 0.05)', color: '#d5dde8' },
      },
      link: { color: '#8ab4f8', underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },

  // ===== 渐变系列 =====
  {
    id: 'gradient-warm',
    name: '暖阳渐变',
    description: '温暖渐变，活力四射',
    style: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(145deg, #fff7ed 0%, #fef3c7 35%, #fde68a 70%, #fcd34d 100%)',
      },
      typography: baseTypography,
      heading: { color: '#92400e', fontWeight: typography.fontWeight.bold },
      paragraph: { color: '#78350f' },
      emphasis: {
        bold: { color: '#92400e', fontWeight: typography.fontWeight.bold },
        italic: { color: '#a16207' },
        highlight: { background: '#f59e0b', color: colors.white },
      },
      list: { color: '#78350f', markerColor: '#f59e0b' },
      blockquote: {
        background: 'rgba(255, 255, 255, 0.6)',
        borderColor: '#f59e0b',
        textColor: '#a16207',
      },
      code: {
        inline: { background: 'rgba(255, 255, 255, 0.7)', color: '#92400e' },
        block: { background: 'rgba(255, 255, 255, 0.6)', color: '#78350f' },
      },
      link: { color: '#d97706', underline: true },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },

  {
    id: 'gradient-cool',
    name: '冷调渐变',
    description: '清冷蓝调，知性优雅',
    style: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 35%, #bae6fd 70%, #7dd3fc 100%)',
      },
      typography: baseTypography,
      heading: { color: '#075985', fontWeight: typography.fontWeight.semibold },
      paragraph: { color: '#0c4a6e' },
      emphasis: {
        bold: { color: '#075985', fontWeight: typography.fontWeight.semibold },
        italic: { color: '#0369a1' },
        highlight: { background: '#0ea5e9', color: colors.white },
      },
      list: { color: '#0c4a6e', markerColor: '#0ea5e9' },
      blockquote: {
        background: 'rgba(255, 255, 255, 0.6)',
        borderColor: '#0ea5e9',
        textColor: '#0369a1',
      },
      code: {
        inline: { background: 'rgba(255, 255, 255, 0.7)', color: '#075985' },
        block: { background: 'rgba(255, 255, 255, 0.6)', color: '#0c4a6e' },
      },
      link: { color: '#0284c7', underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
  },
  {
    id: 'xiaohongshu-pink',
    name: '小红书粉',
    description: '粉色暖调，适合生活分享',
    style: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(145deg, #fdf2f8 0%, #fce7f3 35%, #fbcfe8 70%, #f9a8d4 100%)',
      },
      typography: baseTypography,
      heading: { color: '#9d174d', fontWeight: typography.fontWeight.bold },
      paragraph: { color: '#831843' },
      emphasis: {
        bold: { color: '#9d174d', fontWeight: typography.fontWeight.bold },
        italic: { color: '#be185d' },
        highlight: { background: '#ec4899', color: colors.white },
      },
      list: { color: '#831843', markerColor: '#ec4899' },
      blockquote: {
        background: 'rgba(255, 255, 255, 0.6)',
        borderColor: '#ec4899',
        textColor: '#9d174d',
      },
      code: {
        inline: { background: 'rgba(255, 255, 255, 0.7)', color: '#9d174d' },
        block: { background: 'rgba(255, 255, 255, 0.6)', color: '#831843' },
      },
      link: { color: '#db2777', underline: true },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
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
    coverStyle: defaultCoverStyle,
  },

  // ===== 特色系列 =====
  {
    id: 'apple-notes',
    name: 'Apple 备忘录',
    description: '简洁的苹果备忘录风格',
    style: {
      background: { type: 'solid', value: '#fbfbfb' },
      typography: {
        baseFontSize: typography.fontSize.normal,
        lineHeight: 1.65,
      },
      heading: { color: '#1d1d1f', fontWeight: typography.fontWeight.semibold },
      paragraph: { color: '#1d1d1f' },
      emphasis: {
        bold: { color: '#1d1d1f', fontWeight: typography.fontWeight.semibold },
        italic: { color: '#48484a' },
        highlight: { background: '#ffcc00', color: '#1d1d1f' },
      },
      list: { color: '#1d1d1f', markerColor: '#8e8e93' },
      blockquote: {
        background: '#f5f5f7',
        borderColor: '#d1d1d6',
        textColor: '#48484a',
      },
      code: {
        inline: { background: '#f5f5f7', color: '#1d1d1f' },
        block: { background: '#f5f5f7', color: '#1d1d1f' },
      },
      link: { color: '#007aff', underline: false },
      spacing: baseSpacing,
    },
    coverStyle: defaultCoverStyle,
    headerBar: {
      iconColor: '#d4a300',
      icons: {
        backArrow: true,
        share: true,
        menu: true,
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
