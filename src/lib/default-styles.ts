import { StyleConfig } from './image-style-config';
import {
  BackgroundEnum,
  FontColorEnum,
  FontSizeEnum,
  HorizontalEnum,
  VerticalEnum,
} from './preset-config';

export const defaultStyles: StyleConfig[] = [
  // 1. 简约风格 - 现代简洁，适合商务和专业内容
  {
    id: 'minimal',
    name: '简约风格',
    description: '现代简洁的设计，适合商务和专业内容。采用黑白配色，干净利落。',
    content: {
      size: FontSizeEnum.md,
      titleColor: FontColorEnum.black,
      contentColor: FontColorEnum.black,
      background: BackgroundEnum.TrianglifyGary,
      vertical: VerticalEnum.top,
      horizontal: HorizontalEnum.left,
    },
    cover: {
      vertical: VerticalEnum.center,
      horizontal: HorizontalEnum.center,
    },
  },

  // 2. 温暖风格 - 暖色调，适合生活分享和个人内容
  {
    id: 'warm',
    name: '温暖风格',
    description: '温馨的暖色调设计，适合生活分享、美食、旅行等个人内容。',
    content: {
      size: FontSizeEnum.lg,
      titleColor: FontColorEnum.orange,
      contentColor: FontColorEnum.black,
      background: BackgroundEnum.linearGradient1,
      vertical: VerticalEnum.center,
      horizontal: HorizontalEnum.left,
    },
    cover: {
      vertical: VerticalEnum.center,
      horizontal: HorizontalEnum.center,
    },
  },

  // 3. 科技风格 - 冷色调，适合科技、商业、数据相关内容
  {
    id: 'tech',
    name: '科技风格',
    description: '现代科技感设计，适合科技、商业、数据分析等专业内容。',
    content: {
      size: FontSizeEnum.lg,
      titleColor: FontColorEnum.blue,
      contentColor: FontColorEnum.white,
      background: BackgroundEnum.linearGradient2,
      vertical: VerticalEnum.top,
      horizontal: HorizontalEnum.left,
    },
    cover: {
      vertical: VerticalEnum.center,
      horizontal: HorizontalEnum.center,
    },
  },
];

export const defaultStyleIds = defaultStyles.map((style) => style.id);

// 根据ID获取默认风格
export function getDefaultStyleById(id: string): StyleConfig | undefined {
  return defaultStyles.find((style) => style.id === id);
}

// 获取所有默认风格的名称和描述
export function getDefaultStyleOptions(): Array<{ id: string; name: string; description: string }> {
  return defaultStyles.map((style) => ({
    id: style.id,
    name: style.name,
    description: style.description,
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
