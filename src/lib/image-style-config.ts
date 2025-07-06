import type React from 'react';
import type {
  Background,
  FontColor,
  FontSize,
  Horizontal,
  Vertical,
} from './preset-config';

// 内容设置
export interface ContentConfig {
  size: FontSize;
  titleColor: FontColor;
  contentColor: FontColor;
  background: Background;
  vertical: Vertical;
  horizontal: Horizontal;
}
export type CoverConfig = Partial<ContentConfig>;

// 完整的样式配置
export interface StyleConfig {
  id: string;
  name: string;
  content: ContentConfig;
  cover: CoverConfig;
}

// 样式生成函数的返回类型
export interface GeneratedStyles {
  container: React.CSSProperties;
  innerContainer: React.CSSProperties;
  content: React.CSSProperties;
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
  pre: React.CSSProperties;
  code: React.CSSProperties;
}

// 图片样式接口（新版本）
export interface ImageStyleV2 {
  id: string;
  name: string;
  description: string;
  config: StyleConfig;
  // 生成的样式会通过函数计算得出
}
