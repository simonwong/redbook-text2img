import React from 'react';

// 基础大小选项
export type SizeOption = 'sm' | 'md' | 'lg' | 'xl';

// 内置颜色选项
export type ColorOption =
  | 'white'
  | 'black'
  | 'gray'
  | 'blue'
  | 'red'
  | 'green'
  | 'purple'
  | 'orange'
  | 'custom';

// Typography 元素类型
export type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'small' | 'tiny';

// Typography 配置
export interface TypographyConfig {
  scales: Record<TypographyElement, number>; // 相对于基础字体大小的比例
  lineHeights: Record<TypographyElement, number>; // 对应的行高比例
}

// 位置设置
export interface PositionConfig {
  vertical: 'top' | 'center' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

// 内容设置
export interface ContentConfig {
  // 大小设置
  size: SizeOption;
  customFontSize?: number; // 当需要手动输入时

  // 颜色设置
  titleColor: ColorOption;
  titleCustomColor?: string; // 自定义标题颜色
  contentColor: ColorOption;
  contentCustomColor?: string; // 自定义内容颜色

  // 背景设置
  background: string; // 支持背景图片、linear-gradient等

  // 位置设置
  position: PositionConfig;
}

// 封面设置（继承内容设置）
export interface CoverConfig extends Partial<ContentConfig> {
  // 封面特有的设置，如果不设置则继承内容设置
  // 位置默认居中，大小默认比内容大一号

  // 可选：封面特定的配置覆盖
  inheritFromContent?: boolean; // 是否从内容继承设置，默认 true
}

// 完整的样式配置
export interface StyleConfig {
  id: string;
  name: string;
  description: string;
  content: ContentConfig;
  cover: CoverConfig;
}

// 内置的预设配置
export interface PresetConfig {
  sizes: Record<SizeOption, number>; // 基础字体大小映射（rem值）
  colors: Record<ColorOption, string>; // 内置颜色映射
  backgrounds: string[]; // 内置背景选项
  typography: TypographyConfig; // Typography 比例系统
}

// 样式生成函数的返回类型
export interface GeneratedStyles {
  container: React.CSSProperties;
  innerContainer: React.CSSProperties;
  header: React.CSSProperties;
  content: React.CSSProperties;
  footer: React.CSSProperties;
  h1: React.CSSProperties;
  h2: React.CSSProperties;
  h3: React.CSSProperties;
  h4: React.CSSProperties;
  h5: React.CSSProperties;
  h6: React.CSSProperties;
  p: React.CSSProperties;
  strong: React.CSSProperties;
  em: React.CSSProperties;
  ul: React.CSSProperties;
  li: React.CSSProperties;
}

// 图片样式接口（新版本）
export interface ImageStyleV2 {
  id: string;
  name: string;
  description: string;
  config: StyleConfig;
  // 生成的样式会通过函数计算得出
}
