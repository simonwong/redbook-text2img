export const presetFontSize = {
  sm: {
    label: 'sm',
    value: 12,
  },
  md: {
    label: 'md',
    value: 14,
  },
  lg: {
    label: 'lg',
    value: 16,
  },
  xl: {
    label: 'xl',
    value: 18,
  },
};

export const FontSizeOptions = Object.values(presetFontSize);

export type FontSize = keyof typeof presetFontSize;

export const presetFontColor = {
  white: {
    label: '白色',
    value: '#ffffff',
  },
  black: {
    label: '黑色',
    value: '#000000',
  },
  gray: {
    label: '灰色',
    value: '#6b7280',
  },
  blue: {
    label: '蓝色',
    value: '#3b82f6',
  },
  red: {
    label: '红色',
    value: '#ef4444',
  },
  green: {
    label: '绿色',
    value: '#10b981',
  },
  purple: {
    label: '紫色',
    value: '#8b5cf6',
  },
  orange: {
    label: '橙色',
    value: '#f59e0b',
  },
  custom: {
    label: '自定义',
    value: 'custom',
  },
};

export const FontColorOptions = Object.values(presetFontColor);

export type FontColor = keyof typeof presetFontColor;

export const presetBackground = {
  // 纯色背景
  white: {
    label: '白色',
    value: '#ffffff',
  },
  gray: {
    label: '灰色',
    value: '#f8fafc',
  },
  blue: {
    label: '蓝色',
    value: '#f1f5f9',
  },

  // 渐变背景
  linearGradient1: {
    label: '渐变1',
    value:
      'linear-gradient(135deg, #fef7f0 0%, #fef3ec 25%, #fdf2f8 50%, #f3e8ff 75%, #f0f9ff 100%)',
  },
  linearGradient2: {
    label: '渐变2',
    value:
      'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
  },
  linearGradient3: {
    label: '渐变3',
    value: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
  },
  linearGradient4: {
    label: '渐变4',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },

  // 图片背景（base64编码的简约图案）
  image1: {
    label: '图片1',
    value: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA4gAAAJJCAMAAADfrelZAAAATlBMVEX////e3t7k5OTa2trm5ubi4uLr6+v7+/vg4ODt7e3X19fv7+/09PTx8fH9/f3o6Oj4+PjQ0ND29vbGxsbLy8vT09PIyMjNzc3CwsK/v7/xK3EAAAB51ElEQVR42uyc0W7jIBBFu6xtjDAE+f8/dmO10cTx4JnhomofOO7L7nOPTi7E/frf8F0opWwo8YewKJi64V6sV/7omRW4CWUJraTtxN4BbyMffA14sreR2ac82WEPX4SwiM9j6vOQh/PKm/hX9zMrTXxAT1ATP560vT2HiQV+vM+2J38NEUEPyUGWcoB6SITfS6ITRcSLiDcRD2LYTqQeSfRGRhAxD/NJQT6IcBLjGTGJS6ceEiuLNojrrMP9ShAjE8SPIm473kRjEb0fIvJklYJyEcs3oIe2Jj6mDriLiI1NlEXEm0hBxCfi8c/fH4nDROtBDddAIYhQEiOh3Yk9gujemNcKQBF770RzD+nZzkU0zkR8JOb8NSZijbqB2VRE)`,
  },
  custom: {
    label: '自定义',
    value: 'custom',
  },
};

export const BackgroundOptions = Object.values(presetBackground);

export type Background = keyof typeof presetBackground;

export const presetVertical = {
  top: {
    label: '顶部',
    value: 'flex-start',
  },
  center: {
    label: '居中',
    value: 'center',
  },
  bottom: {
    label: '底部',
    value: 'flex-end',
  },
};

export const VerticalOptions = Object.values(presetVertical);

export type Vertical = keyof typeof presetVertical;

export const presetHorizontal = {
  left: {
    label: '左侧',
    value: 'flex-start',
  },
  center: {
    label: '居中',
    value: 'center',
  },
  right: {
    label: '右侧',
    value: 'flex-end',
  },
};

export const horizontalOptions = Object.values(presetHorizontal);

export type Horizontal = keyof typeof presetHorizontal;

export const presetTypography = {
  // 相对于基础字体大小的比例（使用黄金比例和 Tailwind 的标准）
  scales: {
    h1: 1.875, // 30px (1.875rem) - 对应 Tailwind text-3xl
    h2: 1.5, // 24px (1.5rem) - 对应 Tailwind text-2xl
    h3: 1.25, // 20px (1.25rem) - 对应 Tailwind text-xl
    h4: 1.125, // 18px (1.125rem) - 对应 Tailwind text-lg
    h5: 1.0, // 16px (1rem) - 对应 Tailwind text-base
    h6: 0.875, // 14px (0.875rem) - 对应 Tailwind text-sm
    body: 1.0, // 16px (1rem) - 基础字体大小
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
  },
};

export type TypographyElement = keyof typeof presetTypography.scales;

// 获取实际字体大小的辅助函数
export function getFontSize(size: FontSize): number {
  return presetFontSize[size].value;
}
// 获取实际颜色值的辅助函数
export function getColorValue(color: FontColor, customColor?: string): string {
  if (color === 'custom' && customColor) {
    return customColor;
  }
  return presetFontColor[color].value || presetFontColor.black.value;
}

export function getBackgroundValue(color: Background, customColor?: string): string {
  if (color === 'custom' && customColor) {
    return customColor;
  }
  return presetBackground[color].value || presetBackground.white.value;
}

// 新增：获取 Typography 比例的辅助函数
export function getTypographyScale(element: keyof typeof presetTypography.scales): number {
  return presetTypography.scales[element];
}

// 新增：获取行高比例的辅助函数
export function getLineHeight(element: keyof typeof presetTypography.lineHeights): number {
  return presetTypography.lineHeights[element];
}

// 新增：计算基于基础字体大小的实际字体大小
export function calculateFontSize(baseSize: number, scale: number): number {
  return baseSize * scale;
}
