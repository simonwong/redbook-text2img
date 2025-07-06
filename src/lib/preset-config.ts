import { TrianglifyGary } from './background-image-constants';

/**
 * label: 用户看到的文本
 * value: 内部维护的值，用于关联映射
 * relValue: 实际的值，用于 css 样式
 */

// ========== font size ==========
export const FontSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;
export type FontSize = (typeof FontSize)[keyof typeof FontSize];

export const FontSizeOptions = [
  {
    label: '小号',
    value: FontSize.sm,
    relValue: 12,
  },
  {
    label: '中号',
    value: FontSize.md,
    relValue: 14,
  },
  {
    label: '大号',
    value: FontSize.lg,
    relValue: 16,
  },
  {
    label: '特大号',
    value: FontSize.xl,
    relValue: 18,
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
};
export type FontColor = (typeof FontColor)[keyof typeof FontColor] | 'string';
export const FontColorOptions = [
  {
    label: '白色',
    value: FontColor.white,
    relValue: '#ffffff',
  },
  {
    label: '黑色',
    value: FontColor.black,
    relValue: '#000000',
  },
  {
    label: '灰色',
    value: FontColor.gray,
    relValue: '#6b7280',
  },
  {
    label: '蓝色',
    value: FontColor.blue,
    relValue: '#3b82f6',
  },
  {
    label: '红色',
    value: FontColor.red,
    relValue: '#ef4444',
  },
  {
    label: '绿色',
    value: FontColor.green,
    relValue: '#10b981',
  },
  {
    label: '紫色',
    value: FontColor.purple,
    relValue: '#8b5cf6',
  },
  {
    label: '橙色',
    value: FontColor.orange,
    relValue: '#f59e0b',
  },
  {
    label: '自定义',
    value: FontColor.custom,
    relValue: '#ffffff',
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
};
export type Background =
  | (typeof Background)[keyof typeof Background]
  | 'string';
export const BackgroundOptions = [
  // 纯色背景
  {
    label: '白色',
    value: Background.white,
    relValue: '#ffffff',
  },
  {
    label: '灰色',
    value: Background.gray,
    relValue: '#f8fafc',
  },
  {
    label: '蓝色',
    value: Background.blue,
    relValue: '#f1f5f9',
  },

  // 渐变背景
  {
    label: '渐变1',
    value: Background.linearGradient1,
    relValue:
      'linear-gradient(135deg, #fef7f0 0%, #fef3ec 25%, #fdf2f8 50%, #f3e8ff 75%, #f0f9ff 100%)',
  },
  {
    label: '渐变2',
    value: Background.linearGradient2,
    relValue:
      'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e40af 75%, #3b82f6 100%)',
  },
  // 图片背景（base64编码的简约图案）
  {
    label: '抽象三角形-灰色',
    value: Background.TrianglifyGary,
    relValue: TrianglifyGary,
  },
  {
    label: '自定义',
    value: Background.custom,
    relValue: '#ffffff',
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

export const presetModifiers = {
  body: {
    fontSize: '1em',
    lineHeight: 1.6,
  },
  h1: {
    fontSize: '1.875em',
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '1.5em',
    lineHeight: 1.2,
  },
  h3: {
    fontSize: '1.25em',
    lineHeight: 1.3,
  },
  h4: {
    fontSize: '1.125em',
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1em',
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '0.875em',
    lineHeight: 1.4,
  },
};

export const PresetConfigManager = {
  getFontSizeCss: (size: FontSize): number => {
    return FontSizeOptions.find((item) => item.value === size)?.relValue || 12;
  },
  getColorCss: (color: FontColor): string => {
    return (
      FontColorOptions.find((item) => item.value === color)?.relValue || color
    );
  },
  getBackgroundCss: (color: Background): string => {
    return (
      BackgroundOptions.find((item) => item.value === color)?.relValue || color
    );
  },
  getTypographyCss: (
    element: keyof typeof presetModifiers
  ): React.CSSProperties => {
    return presetModifiers[element];
  },
};
