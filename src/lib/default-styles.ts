import type { StyleConfig } from './image-style-config';
import {
  Background,
  FontColor,
  FontSize,
  Horizontal,
  Vertical,
} from './preset-config';

export const defaultStyles: StyleConfig[] = [
  {
    id: 'built-in-minimal',
    name: '基础风格',
    content: {
      size: FontSize.md,
      titleColor: FontColor.black,
      contentColor: FontColor.black,
      background: Background.gray,
      vertical: Vertical.top,
      horizontal: Horizontal.left,
    },
    cover: {
      size: FontSize.lg,
      vertical: Vertical.center,
      horizontal: Horizontal.center,
    },
  },
  {
    id: 'built-in-simple',
    name: '简约风格',
    content: {
      size: FontSize.md,
      titleColor: FontColor.black,
      contentColor: FontColor.black,
      background: Background.TrianglifyGary,
      vertical: Vertical.top,
      horizontal: Horizontal.left,
    },
    cover: {
      size: FontSize.lg,
      vertical: Vertical.center,
      horizontal: Horizontal.center,
    },
  },
  {
    id: 'built-in-warm',
    name: '温暖风格',
    content: {
      size: FontSize.md,
      titleColor: FontColor.orange,
      contentColor: FontColor.black,
      background: Background.linearGradient1,
      vertical: Vertical.top,
      horizontal: Horizontal.left,
    },
    cover: {
      size: FontSize.lg,
      vertical: Vertical.center,
      horizontal: Horizontal.center,
    },
  },
  {
    id: 'built-in-tech',
    name: '科技风格',
    content: {
      size: FontSize.md,
      titleColor: FontColor.blue,
      contentColor: FontColor.white,
      background: Background.linearGradient2,
      vertical: Vertical.top,
      horizontal: Horizontal.left,
    },
    cover: {
      size: FontSize.lg,
      vertical: Vertical.center,
      horizontal: Horizontal.center,
    },
  },
];

export const defaultStyleIds = defaultStyles.map((style) => style.id);

// 根据ID获取默认风格
export function getDefaultStyleById(id: string): StyleConfig | undefined {
  return defaultStyles.find((style) => style.id === id);
}

// 获取所有默认风格的名称和描述
export function getDefaultStyleOptions(): Array<{
  id: string;
  name: string;
}> {
  return defaultStyles.map((style) => ({
    id: style.id,
    name: style.name,
  }));
}

// 检查是否为内置风格
export function isBuiltInStyle(id: string): boolean {
  return defaultStyles.some((style) => style.id === id);
}

// 获取默认风格配置（用于初始化）
export function getDefaultStyleConfig(): StyleConfig {
  return defaultStyles[0]; // 返回简约风格作为默认配置
}
