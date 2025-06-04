import React from 'react';
import {
  StyleConfig,
  ContentConfig,
  CoverConfig,
  GeneratedStyles,
  PositionConfig,
  TypographyElement,
} from './image-style-config';
import {
  getColorValue,
  getFontSize,
  getTypographyScale,
  getLineHeight,
  calculateFontSize,
} from './preset-config';

// 获取下一级大小（用于封面默认比内容大一号）
function getNextSize(size: string, customSize?: number): { size: string; customSize?: number } {
  if (customSize) {
    // 自定义大小增加 2px，然后转换为 rem
    return { size: 'custom', customSize: customSize + 2 };
  }

  const sizeMap: Record<string, string> = {
    sm: 'md', // 0.75rem -> 0.875rem
    md: 'lg', // 0.875rem -> 1.0rem
    lg: 'xl', // 1.0rem -> 1.125rem
    xl: 'xl', // 1.125rem 已经是最大了
  };

  return { size: sizeMap[size] || 'md' };
}

// 根据位置配置生成 flex 样式
function getPositionStyles(position: PositionConfig): React.CSSProperties {
  const justifyContent = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  }[position.horizontal];

  const alignItems = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
  }[position.vertical];

  return {
    justifyContent,
    alignItems,
  };
}

// 基于 Typography 系统生成字体样式
function generateTypographyStyle(
  baseFontSize: number,
  element: TypographyElement
): React.CSSProperties {
  const scale = getTypographyScale(element);
  const lineHeight = getLineHeight(element);
  const fontSize = calculateFontSize(baseFontSize, scale);

  return {
    fontSize: `${fontSize}rem`,
    lineHeight: lineHeight.toString(),
  };
}

// 生成内容样式（优化版）
function generateContentStyles(config: ContentConfig, isCover: boolean = false): GeneratedStyles {
  const baseFontSize = getFontSize(config.size, config.customFontSize);
  const titleColor = getColorValue(config.titleColor, config.titleCustomColor);
  const contentColor = getColorValue(config.contentColor, config.contentCustomColor);

  // 容器样式 - 使用 rem 单位和现代化的设计
  const containerStyles: React.CSSProperties = {
    width: '300px',
    minWidth: '300px',
    height: '400px',
    minHeight: '400px',
    background: config.background,
    borderRadius: '12px',
    overflow: 'hidden',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    fontSize: `${baseFontSize}rem`, // 设置基础字体大小（rem）
    boxSizing: 'border-box',
  };

  const innerContainerStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    padding: `${2.3 * baseFontSize}rem ${1.9 * baseFontSize}rem`, // 基于基础字体的相对内边距
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: `${0.9 * baseFontSize}rem`,
    ...getPositionStyles(config.position),
  };

  // 如果是封面，特殊处理内容布局
  const contentStyles: React.CSSProperties = {
    flex: '1',
    overflow: 'hidden',
    ...generateTypographyStyle(baseFontSize, 'body'),
    color: contentColor,
    wordBreak: 'break-word',
    // 封面模式的特殊布局
    ...(isCover && {
      display: 'flex',
      flexDirection: 'column',
      justifyContent:
        config.position.vertical === 'top'
          ? 'flex-start'
          : config.position.vertical === 'bottom'
            ? 'flex-end'
            : 'center',
      alignItems:
        config.position.horizontal === 'left'
          ? 'flex-start'
          : config.position.horizontal === 'right'
            ? 'flex-end'
            : 'center',
      textAlign: config.position.horizontal as 'left' | 'center' | 'right',
    }),
  };

  return {
    container: containerStyles,
    innerContainer: innerContainerStyles,
    header: {
      ...generateTypographyStyle(baseFontSize, 'h2'),
      fontWeight: '700',
      color: titleColor,
      marginBottom: `${0.46 * baseFontSize}rem`,
      letterSpacing: '-0.02em',
    },
    content: contentStyles,
    footer: {
      ...generateTypographyStyle(baseFontSize, 'small'),
      color: contentColor,
      textAlign: 'right',
      marginTop: 'auto',
      paddingTop: `${0.92 * baseFontSize}rem`,
      opacity: 0.8,
    },
    // 标题元素使用 Typography 系统
    h1: {
      ...generateTypographyStyle(baseFontSize, 'h1'),
      fontWeight: '700',
      marginBottom: `${1.54 * baseFontSize}rem`,
      color: titleColor,
      letterSpacing: '-0.02em',
    },
    h2: {
      ...generateTypographyStyle(baseFontSize, 'h2'),
      fontWeight: '600',
      marginBottom: `${0.92 * baseFontSize}rem`,
      color: titleColor,
      letterSpacing: '-0.015em',
    },
    h3: {
      ...generateTypographyStyle(baseFontSize, 'h3'),
      fontWeight: '600',
      marginBottom: `${0.77 * baseFontSize}rem`,
      color: titleColor,
    },
    h4: {
      ...generateTypographyStyle(baseFontSize, 'h4'),
      fontWeight: '600',
      marginBottom: `${0.62 * baseFontSize}rem`,
      color: titleColor,
    },
    h5: {
      ...generateTypographyStyle(baseFontSize, 'h5'),
      fontWeight: '600',
      marginBottom: `${0.46 * baseFontSize}rem`,
      color: contentColor,
    },
    h6: {
      ...generateTypographyStyle(baseFontSize, 'h6'),
      fontWeight: '600',
      marginBottom: `${0.46 * baseFontSize}rem`,
      color: contentColor,
    },
    p: {
      ...generateTypographyStyle(baseFontSize, 'body'),
      marginBottom: `${0.77 * baseFontSize}rem`,
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
      marginBottom: `${0.77 * baseFontSize}rem`,
      paddingLeft: `${1.23 * baseFontSize}rem`,
      listStyle: 'disc',
    },
    li: {
      marginBottom: `${0.46 * baseFontSize}rem`,
      ...generateTypographyStyle(baseFontSize, 'body'),
      position: 'relative',
    },
  };
}

// 合并封面配置和内容配置（优化版）
function mergeCoverConfig(contentConfig: ContentConfig, coverConfig: CoverConfig): ContentConfig {
  // 如果封面没有指定大小，默认比内容大一号
  const coverSize = coverConfig.size
    ? { size: coverConfig.size, customSize: coverConfig.customFontSize }
    : getNextSize(contentConfig.size, contentConfig.customFontSize);

  // 如果封面没有指定位置，默认居中
  const coverPosition = coverConfig.position || {
    vertical: 'center',
    horizontal: 'center',
  };

  return {
    size: coverSize.size as ContentConfig['size'],
    customFontSize: coverSize.customSize,
    titleColor: coverConfig.titleColor || contentConfig.titleColor,
    titleCustomColor: coverConfig.titleCustomColor || contentConfig.titleCustomColor,
    contentColor: coverConfig.contentColor || contentConfig.contentColor,
    contentCustomColor: coverConfig.contentCustomColor || contentConfig.contentCustomColor,
    background: coverConfig.background || contentConfig.background,
    position: coverPosition,
  };
}

// 主要样式生成函数
export function generateStylesFromConfig(config: StyleConfig): {
  contentStyles: GeneratedStyles;
  coverStyles: GeneratedStyles;
} {
  const contentStyles = generateContentStyles(config.content);
  const mergedCoverConfig = mergeCoverConfig(config.content, config.cover);
  const coverStyles = generateContentStyles(mergedCoverConfig, true);

  return {
    contentStyles,
    coverStyles,
  };
}

// 兼容性函数：根据配置生成样式（供现有代码使用）
export function generateStylesForImageStyle(config: StyleConfig) {
  return generateStylesFromConfig(config);
}
