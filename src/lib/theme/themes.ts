/**
 * Layer 1: Preset Themes
 * Ready-to-use theme configurations
 */

import type { PresetTheme } from './types';

export const presetThemes: PresetTheme[] = [
  // ===== 极简系列 =====
  {
    id: 'clean-light',
    name: '清新白',
    description: '简洁明亮的白色主题',
    config: { tone: 'light', mood: 'minimal', density: 'normal' },
  },
  {
    id: 'clean-dark',
    name: '暗夜黑',
    description: '深色极简风格',
    config: { tone: 'dark', mood: 'minimal', density: 'normal' },
  },
  {
    id: 'compact-light',
    name: '紧凑白',
    description: '紧凑排版，信息密集',
    config: { tone: 'light', mood: 'minimal', density: 'compact' },
  },

  // ===== 活力系列 =====
  {
    id: 'vibrant-light',
    name: '活力清新',
    description: '渐变背景，充满活力',
    config: { tone: 'light', mood: 'vibrant', density: 'normal' },
  },
  {
    id: 'vibrant-dark',
    name: '暗黑科技',
    description: '深色渐变，科技感',
    config: { tone: 'dark', mood: 'vibrant', density: 'normal' },
  },
  {
    id: 'vibrant-warm',
    name: '暖阳活力',
    description: '温暖渐变，活力四射',
    config: { tone: 'warm', mood: 'vibrant', density: 'normal' },
  },

  // ===== 优雅系列 =====
  {
    id: 'elegant-warm',
    name: '温暖优雅',
    description: '柔和暖色，优雅大气',
    config: { tone: 'warm', mood: 'elegant', density: 'spacious' },
  },
  {
    id: 'elegant-cool',
    name: '冷静优雅',
    description: '清冷蓝调，知性优雅',
    config: { tone: 'cool', mood: 'elegant', density: 'spacious' },
  },
  {
    id: 'elegant-nature',
    name: '自然清新',
    description: '绿色自然，清新舒适',
    config: { tone: 'nature', mood: 'elegant', density: 'normal' },
  },

  // ===== 特色组合 =====
  {
    id: 'xiaohongshu-pink',
    name: '小红书粉',
    description: '粉色暖调，适合生活分享',
    config: { tone: 'warm', mood: 'vibrant', density: 'normal' },
  },
  {
    id: 'business-dark',
    name: '商务深蓝',
    description: '专业深蓝，适合商务内容',
    config: { tone: 'dark', mood: 'elegant', density: 'normal' },
  },
  {
    id: 'reading-spacious',
    name: '阅读模式',
    description: '宽松排版，舒适阅读',
    config: { tone: 'light', mood: 'elegant', density: 'spacious' },
  },
];

/** Get a theme by ID */
export const getThemeById = (id: string): PresetTheme | undefined =>
  presetThemes.find((theme) => theme.id === id);

/** Default theme */
export const defaultTheme = presetThemes[0];
