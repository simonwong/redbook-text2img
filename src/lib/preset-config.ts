import { PresetConfig, SizeOption, ColorOption } from './image-style-config';

// 基于 Tailwind Typography 优化的预设配置
export const presetConfig: PresetConfig = {
  // 基础字体大小映射（使用 rem 单位，参考 Tailwind 的比例系统）
  sizes: {
    sm: 0.75, // 12px (0.75rem) - 对应 Tailwind text-xs
    md: 0.875, // 14px (0.875rem) - 对应 Tailwind text-sm
    lg: 1.0, // 16px (1rem) - 对应 Tailwind text-base
    xl: 1.125, // 18px (1.125rem) - 对应 Tailwind text-lg
  },

  // 内置颜色映射
  colors: {
    white: '#ffffff',
    black: '#000000',
    gray: '#6b7280',
    blue: '#3b82f6',
    red: '#ef4444',
    green: '#10b981',
    purple: '#8b5cf6',
    orange: '#f59e0b',
    custom: '', // 自定义颜色占位符
  },

  // 内置背景选项
  backgrounds: [
    // 纯色背景
    '#ffffff',
    '#f8fafc',
    '#f1f5f9',

    // 渐变背景
    'linear-gradient(135deg, #fef7f0 0%, #fef3ec 25%, #fdf2f8 50%, #f3e8ff 75%, #f0f9ff 100%)',
    'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
    'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

    // 图片背景（base64编码的简约图案）
    `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA4gAAAJJCAMAAADfrelZAAAATlBMVEX////e3t7k5OTa2trm5ubi4uLr6+v7+/vg4ODt7e3X19fv7+/09PTx8fH9/f3o6Oj4+PjQ0ND29vbGxsbLy8vT09PIyMjNzc3CwsK/v7/xK3EAAAB51ElEQVR42uyc0W7jIBBFu6xtjDAE+f8/dmO10cTx4JnhomofOO7L7nOPTi7E/frf8F0opWwo8YewKJi64V6sV/7omRW4CWUJraTtxN4BbyMffA14sreR2ac82WEPX4SwiM9j6vOQh/PKm/hX9zMrTXxAT1ATP560vT2HiQV+vM+2J38NEUEPyUGWcoB6SITfS6ITRcSLiDcRD2LYTqQeSfRGRhAxD/NJQT6IcBLjGTGJS6ceEiuLNojrrMP9ShAjE8SPIm473kRjEb0fIvJklYJyEcs3oIe2Jj6mDriLiI1NlEXEm0hBxCfi8c/fH4nDROtBDddAIYhQEiOh3Yk9gujemNcKQBF770RzD+nZzkU0zkR8JOb8NSZijbqB2VRE)`,
  ],

  // Typography 比例系统 - 基于 Tailwind 的字体层级
  typography: {
    // 相对于基础字体大小的比例（使用黄金比例和 Tailwind 的标准）
    scales: {
      h1: 1.875, // 30px (1.875rem) - 对应 Tailwind text-3xl
      h2: 1.5, // 24px (1.5rem) - 对应 Tailwind text-2xl
      h3: 1.25, // 20px (1.25rem) - 对应 Tailwind text-xl
      h4: 1.125, // 18px (1.125rem) - 对应 Tailwind text-lg
      h5: 1.0, // 16px (1rem) - 对应 Tailwind text-base
      h6: 0.875, // 14px (0.875rem) - 对应 Tailwind text-sm
      body: 1.0, // 16px (1rem) - 基础字体大小
      small: 0.875, // 14px (0.875rem)
      tiny: 0.75, // 12px (0.75rem) - 对应 Tailwind text-xs
    },

    // 相应的行高比例（基于 Tailwind 的 line-height 系统）
    lineHeights: {
      h1: 1.2, // 紧凑的标题行高
      h2: 1.25,
      h3: 1.3,
      h4: 1.4,
      h5: 1.4,
      h6: 1.4,
      body: 1.6, // 舒适的阅读行高
      small: 1.5,
      tiny: 1.33,
    },
  },
};

// 获取实际颜色值的辅助函数
export function getColorValue(color: ColorOption, customColor?: string): string {
  if (color === 'custom' && customColor) {
    return customColor;
  }
  return presetConfig.colors[color] || presetConfig.colors.black;
}

// 获取实际字体大小的辅助函数（返回 rem 值）
export function getFontSize(size: SizeOption, customSize?: number): number {
  if (customSize && customSize > 0) {
    // 将像素值转换为 rem（假设基础字体为 16px）
    return customSize / 16;
  }
  return presetConfig.sizes[size];
}

// 新增：获取 Typography 比例的辅助函数
export function getTypographyScale(element: keyof typeof presetConfig.typography.scales): number {
  return presetConfig.typography.scales[element];
}

// 新增：获取行高比例的辅助函数
export function getLineHeight(element: keyof typeof presetConfig.typography.lineHeights): number {
  return presetConfig.typography.lineHeights[element];
}

// 新增：计算基于基础字体大小的实际字体大小
export function calculateFontSize(baseSize: number, scale: number): number {
  return baseSize * scale;
}
