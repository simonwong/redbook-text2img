import { TrianglifyGary } from './background-image-constants';

// ========== font size ==========
export enum FontSizeEnum {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

export const fontSizeStyleMap: Record<FontSizeEnum, number> = {
  [FontSizeEnum.sm]: 12,
  [FontSizeEnum.md]: 14,
  [FontSizeEnum.lg]: 16,
  [FontSizeEnum.xl]: 18,
};

export const FontSizeOptions = [
  {
    label: 'sm',
    value: FontSizeEnum.sm,
  },
  {
    label: 'md',
    value: FontSizeEnum.md,
  },
  {
    label: 'lg',
    value: FontSizeEnum.lg,
  },
  {
    label: 'xl',
    value: FontSizeEnum.xl,
  },
];

// ========== font color ==========
export enum FontColorEnum {
  white = 'white',
  black = 'black',
  gray = 'gray',
  blue = 'blue',
  red = 'red',
  green = 'green',
  purple = 'purple',
  orange = 'orange',
  custom = 'custom',
}
export const fontColorStyleMap: Record<FontColorEnum, string> = {
  [FontColorEnum.white]: '#ffffff',
  [FontColorEnum.black]: '#000000',
  [FontColorEnum.gray]: '#6b7280',
  [FontColorEnum.blue]: '#3b82f6',
  [FontColorEnum.red]: '#ef4444',
  [FontColorEnum.green]: '#10b981',
  [FontColorEnum.purple]: '#8b5cf6',
  [FontColorEnum.orange]: '#f59e0b',
  [FontColorEnum.custom]: 'custom',
};
export const FontColorOptions = [
  {
    label: '白色',
    value: FontColorEnum.white,
  },
  {
    label: '黑色',
    value: FontColorEnum.black,
  },
  {
    label: '灰色',
    value: FontColorEnum.gray,
  },
  {
    label: '蓝色',
    value: FontColorEnum.blue,
  },
  {
    label: '红色',
    value: FontColorEnum.red,
  },
  {
    label: '绿色',
    value: FontColorEnum.green,
  },
  {
    label: '紫色',
    value: FontColorEnum.purple,
  },
  {
    label: '橙色',
    value: FontColorEnum.orange,
  },
  {
    label: '自定义',
    value: FontColorEnum.custom,
  },
];

// ========== background color ==========
export enum BackgroundEnum {
  white = 'white',
  gray = 'gray',
  blue = 'blue',
  linearGradient1 = 'linearGradient1',
  linearGradient2 = 'linearGradient2',
  linearGradient3 = 'linearGradient3',
  linearGradient4 = 'linearGradient4',
  TrianglifyGary = 'TrianglifyGary',
  custom = 'custom',
}

export const backgroundStyleMap: Record<BackgroundEnum, string> = {
  [BackgroundEnum.white]: '#ffffff',
  [BackgroundEnum.gray]: '#f8fafc',
  [BackgroundEnum.blue]: '#f1f5f9',
  [BackgroundEnum.linearGradient1]:
    'linear-gradient(135deg, #fef7f0 0%, #fef3ec 25%, #fdf2f8 50%, #f3e8ff 75%, #f0f9ff 100%)',
  [BackgroundEnum.linearGradient2]:
    'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e40af 75%, #3b82f6 100%)',
  [BackgroundEnum.linearGradient3]: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
  [BackgroundEnum.linearGradient4]: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  [BackgroundEnum.TrianglifyGary]: TrianglifyGary,
  [BackgroundEnum.custom]: 'custom',
};

export const BackgroundOptions = [
  // 纯色背景
  {
    label: '白色',
    value: BackgroundEnum.white,
  },
  {
    label: '灰色',
    value: BackgroundEnum.gray,
  },
  {
    label: '蓝色',
    value: BackgroundEnum.blue,
  },

  // 渐变背景
  {
    label: '渐变1',
    value: BackgroundEnum.linearGradient1,
  },
  {
    label: '渐变2',
    value: BackgroundEnum.linearGradient2,
  },
  {
    label: '渐变3',
    value: BackgroundEnum.linearGradient3,
  },
  {
    label: '渐变4',
    value: BackgroundEnum.linearGradient4,
  },

  // 图片背景（base64编码的简约图案）
  {
    label: '抽象三角形-灰色',
    value: BackgroundEnum.TrianglifyGary,
  },
  {
    label: '自定义',
    value: BackgroundEnum.custom,
  },
];

// ========== vertical ==========
export enum VerticalEnum {
  top = 'top',
  center = 'center',
  bottom = 'bottom',
}

export const verticalStyleMap: Record<VerticalEnum, string> = {
  [VerticalEnum.top]: 'flex-start',
  [VerticalEnum.center]: 'center',
  [VerticalEnum.bottom]: 'flex-end',
};

export const VerticalOptions = [
  {
    label: '顶部',
    value: VerticalEnum.top,
  },
  {
    label: '居中',
    value: VerticalEnum.center,
  },
  {
    label: '底部',
    value: VerticalEnum.bottom,
  },
];

// ========== horizontal ==========

export enum HorizontalEnum {
  left = 'left',
  center = 'center',
  right = 'right',
}

export const horizontalStyleMap: Record<HorizontalEnum, string> = {
  [HorizontalEnum.left]: 'flex-start',
  [HorizontalEnum.center]: 'center',
  [HorizontalEnum.right]: 'flex-end',
};

export const HorizontalOptions = [
  {
    label: '左侧',
    value: HorizontalEnum.left,
  },
  {
    label: '居中',
    value: HorizontalEnum.center,
  },
  {
    label: '右侧',
    value: HorizontalEnum.right,
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
export function getFontSizeCss(size: FontSizeEnum): number {
  return fontSizeStyleMap[size];
}
// 获取实际颜色值的辅助函数
export function getColorCss(color: FontColorEnum, customColor?: string): string {
  if (color === 'custom' && customColor) {
    return customColor;
  }
  return fontColorStyleMap[color] || fontColorStyleMap[FontColorEnum.black];
}

export function getBackgroundCss(color: BackgroundEnum, customColor?: string): string {
  if (color === 'custom' && customColor) {
    return customColor;
  }
  return backgroundStyleMap[color] || backgroundStyleMap[BackgroundEnum.white];
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
