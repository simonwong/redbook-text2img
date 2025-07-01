import { TrianglifyGary } from './background-image-constants';

// ========== font size ==========
export const FontSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;
export type FontSize = (typeof FontSize)[keyof typeof FontSize];

export const fontSizeStyleMap: Record<FontSize, number> = {
  [FontSize.sm]: 12,
  [FontSize.md]: 14,
  [FontSize.lg]: 16,
  [FontSize.xl]: 18,
};

export const FontSizeOptions = [
  {
    label: '小号',
    value: FontSize.sm,
  },
  {
    label: '中号',
    value: FontSize.md,
  },
  {
    label: '大号',
    value: FontSize.lg,
  },
  {
    label: '特大号',
    value: FontSize.xl,
  },
];

// ========== font color ==========
export const FontColor = {
  white: 'white',
  black: 'black',
  gray: 'gray',
  blue: 'blue',
  red: 'red',
  green: 'green',
  purple: 'purple',
  orange: 'orange',
  custom: 'custom',
} as const;
export type FontColor = (typeof FontColor)[keyof typeof FontColor];

export const fontColorStyleMap: Record<FontColor, string> = {
  [FontColor.white]: '#ffffff',
  [FontColor.black]: '#000000',
  [FontColor.gray]: '#6b7280',
  [FontColor.blue]: '#3b82f6',
  [FontColor.red]: '#ef4444',
  [FontColor.green]: '#10b981',
  [FontColor.purple]: '#8b5cf6',
  [FontColor.orange]: '#f59e0b',
  [FontColor.custom]: 'custom',
};
export const FontColorOptions = [
  {
    label: '白色',
    value: FontColor.white,
    color: '#ffffff',
  },
  {
    label: '黑色',
    value: FontColor.black,
    color: '#000000',
  },
  {
    label: '灰色',
    value: FontColor.gray,
    color: '#6b7280',
  },
  {
    label: '蓝色',
    value: FontColor.blue,
    color: '#3b82f6',
  },
  {
    label: '红色',
    value: FontColor.red,
    color: '#ef4444',
  },
  {
    label: '绿色',
    value: FontColor.green,
    color: '#10b981',
  },
  {
    label: '紫色',
    value: FontColor.purple,
    color: '#8b5cf6',
  },
  {
    label: '橙色',
    value: FontColor.orange,
    color: '#f59e0b',
  },
  {
    label: '自定义',
    value: FontColor.custom,
    color: '#ffffff',
  },
];

// ========== background color ==========
export const Background = {
  white: 'white',
  gray: 'gray',
  blue: 'blue',
  linearGradient1: 'linearGradient1',
  linearGradient2: 'linearGradient2',
  TrianglifyGary: 'TrianglifyGary',
  custom: 'custom',
} as const;
export type Background = (typeof Background)[keyof typeof Background];

export const BackgroundOptions = [
  // 纯色背景
  {
    label: '白色',
    value: Background.white,
    color: '#ffffff',
  },
  {
    label: '灰色',
    value: Background.gray,
    color: '#f8fafc',
  },
  {
    label: '蓝色',
    value: Background.blue,
    color: '#f1f5f9',
  },

  // 渐变背景
  {
    label: '渐变1',
    value: Background.linearGradient1,
    color:
      'linear-gradient(135deg, #fef7f0 0%, #fef3ec 25%, #fdf2f8 50%, #f3e8ff 75%, #f0f9ff 100%)',
  },
  {
    label: '渐变2',
    value: Background.linearGradient2,
    color:
      'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e40af 75%, #3b82f6 100%)',
  },
  // 图片背景（base64编码的简约图案）
  {
    label: '抽象三角形-灰色',
    value: Background.TrianglifyGary,
    color: TrianglifyGary,
  },
  {
    label: '自定义',
    value: Background.custom,
    color: '#ffffff',
  },
];

// ========== vertical ==========
export const Vertical = {
  top: 'top',
  center: 'center',
  bottom: 'bottom',
} as const;
export type Vertical = (typeof Vertical)[keyof typeof Vertical];

export const verticalStyleMap: Record<Vertical, string> = {
  [Vertical.top]: 'flex-start',
  [Vertical.center]: 'center',
  [Vertical.bottom]: 'flex-end',
};

export const VerticalOptions = [
  {
    label: '居上',
    value: Vertical.top,
  },
  {
    label: '居中',
    value: Vertical.center,
  },
  {
    label: '居下',
    value: Vertical.bottom,
  },
];

// ========== horizontal ==========

export const Horizontal = {
  left: 'left',
  center: 'center',
  right: 'right',
} as const;
export type Horizontal = (typeof Horizontal)[keyof typeof Horizontal];

export const horizontalStyleMap: Record<Horizontal, string> = {
  [Horizontal.left]: 'flex-start',
  [Horizontal.center]: 'center',
  [Horizontal.right]: 'flex-end',
};

export const HorizontalOptions = [
  {
    label: '居左',
    value: Horizontal.left,
  },
  {
    label: '居中',
    value: Horizontal.center,
  },
  {
    label: '居右',
    value: Horizontal.right,
  },
];

// ========== typography ==========

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
export function getFontSizeCss(size: FontSize): number {
  return fontSizeStyleMap[size];
}
// 获取实际颜色值的辅助函数
export function getColorCss(color: FontColor | string): string {
  return FontColorOptions.find((item) => item.value === color)?.color || color;
}

export function getBackgroundCss(color: Background | string): string {
  return BackgroundOptions.find((item) => item.value === color)?.color || color;
}

// 新增：获取 Typography 比例的辅助函数
export function getTypographyScale(element: TypographyElement): number {
  return presetTypography.scales[element];
}

// 新增：获取行高比例的辅助函数
export function getLineHeight(element: TypographyElement): number {
  return presetTypography.lineHeights[element];
}

// 新增：计算基于基础字体大小的实际字体大小
export function calculateFontSize(baseSize: number, scale: number): number {
  return baseSize * scale;
}
