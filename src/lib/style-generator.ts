import type React from 'react';
import type {
  ContentConfig,
  CoverConfig,
  GeneratedStyles,
  StyleConfig,
} from './image-style-config';
import {
  horizontalStyleMap,
  PresetConfigManager,
  verticalStyleMap,
} from './preset-config';

// 生成内容样式（优化版）
function generateContentStyles(config: ContentConfig): GeneratedStyles {
  const baseFontSize = PresetConfigManager.getFontSizeCss(config.size);
  const titleColor = PresetConfigManager.getColorCss(config.titleColor);
  const contentColor = PresetConfigManager.getColorCss(config.contentColor);

  // 容器样式 - 使用 rem 单位和现代化的设计
  const containerStyles: React.CSSProperties = {
    width: '300px',
    minWidth: '300px',
    height: '400px',
    minHeight: '400px',
    background: PresetConfigManager.getBackgroundCss(config.background),
    borderRadius: '12px',
    overflow: 'hidden',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    position: 'relative',
    fontSize: `${baseFontSize}px`,
    boxSizing: 'border-box',
  };

  const innerContainerStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    // padding: `${2.3}em ${1.9}em`,
    // TODO: 自定义 padding
    padding: `${1.5}em ${1.5}em`,
    boxSizing: 'border-box',
  };

  const contentStyles: React.CSSProperties = {
    flex: '1',
    overflow: 'hidden',
    ...PresetConfigManager.getTypographyCss('body'),
    color: contentColor,
    wordBreak: 'break-word',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: verticalStyleMap[config.vertical],
    alignItems: horizontalStyleMap[config.horizontal],
  };

  return {
    container: containerStyles,
    innerContainer: innerContainerStyles,
    content: contentStyles,
    h1: {
      ...PresetConfigManager.getTypographyCss('h1'),
      fontWeight: '700',
      marginBottom: `${1.54}em`,
      color: titleColor,
    },
    h2: {
      ...PresetConfigManager.getTypographyCss('h2'),
      fontWeight: '600',
      marginBottom: `${0.92}em`,
      color: titleColor,
    },
    h3: {
      ...PresetConfigManager.getTypographyCss('h3'),
      fontWeight: '600',
      marginBottom: `${0.77}em`,
      color: titleColor,
    },
    h4: {
      ...PresetConfigManager.getTypographyCss('h4'),
      fontWeight: '600',
      marginBottom: `${0.62}em`,
      color: titleColor,
    },
    h5: {
      ...PresetConfigManager.getTypographyCss('h5'),
      fontWeight: '600',
      marginBottom: `${0.46}em`,
      color: contentColor,
    },
    h6: {
      ...PresetConfigManager.getTypographyCss('h6'),
      fontWeight: '600',
      marginBottom: `${0.46}em`,
      color: contentColor,
    },
    p: {
      ...PresetConfigManager.getTypographyCss('body'),
      marginBottom: `${0.77}em`,
      color: contentColor,
      wordBreak: 'break-word',
    },
    strong: {
      fontWeight: '600',
      color: titleColor,
    },
    em: {
      fontStyle: 'italic',
      color: contentColor,
      position: 'relative',
      fontWeight: '500',
      opacity: 0.9,
    },
    ul: {
      marginBottom: `${0.77}em`,
    },
    li: {
      marginBottom: `${0.46}em`,
      ...PresetConfigManager.getTypographyCss('body'),
    },
    pre: {
      marginBottom: `${0.77}em`,
      color: contentColor,
      whiteSpace: 'break-spaces',
      fontSize: '0.857em',
      lineHeight: '1.5',
      wordBreak: 'break-word',
      borderRadius: '0.4em',
      padding: '0.4em 0.6em',
      backgroundColor: 'rgba(0,0,0,0.05)',
      width: '100%',
    },
    code: {
      marginBottom: `${0.77}em`,
      color: contentColor,
      fontSize: '0.857em',
      lineHeight: '1.5',
      wordBreak: 'break-word',
      padding: '0.4em 0.6em',
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
  };
}

// 合并封面配置和内容配置（优化版）
export function mergeCoverConfig(
  contentConfig: ContentConfig,
  coverConfig: CoverConfig
): ContentConfig {
  return {
    size: coverConfig.size || contentConfig.size,
    titleColor: coverConfig.titleColor || contentConfig.titleColor,
    contentColor: coverConfig.contentColor || contentConfig.contentColor,
    background: coverConfig.background || contentConfig.background,
    vertical: coverConfig.vertical || contentConfig.vertical,
    horizontal: coverConfig.horizontal || contentConfig.horizontal,
  };
}

// 主要样式生成函数
export function generateStylesFromConfig(config: StyleConfig): {
  contentStyles: GeneratedStyles;
  coverStyles: GeneratedStyles;
} {
  const contentStyles = generateContentStyles(config.content);
  const mergedCoverConfig = mergeCoverConfig(config.content, config.cover);
  const coverStyles = generateContentStyles(mergedCoverConfig);

  return {
    contentStyles,
    coverStyles,
  };
}

// 兼容性函数：根据配置生成样式（供现有代码使用）
export function generateStylesForImageStyle(config: StyleConfig) {
  return generateStylesFromConfig(config);
}
