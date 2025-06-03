import React from 'react';

type BaseImageStyles = {
  container?: React.CSSProperties;
  innerContainer?: React.CSSProperties;
  // 原有样式
  header?: React.CSSProperties;
  content?: React.CSSProperties;
  footer?: React.CSSProperties;
  // Markdown 元素样式
  h1?: React.CSSProperties;
  h2?: React.CSSProperties;
  h3?: React.CSSProperties;
  h4?: React.CSSProperties;
  h5?: React.CSSProperties;
  h6?: React.CSSProperties;
  p?: React.CSSProperties;
  strong?: React.CSSProperties;
  em?: React.CSSProperties;
  ul?: React.CSSProperties;
  li?: React.CSSProperties;
}
export interface ImageStyle {
  id: string;
  name: string;
  description: string;
  // 直接包含完整的样式对象
  coverStyles: BaseImageStyles;
  styles: BaseImageStyles;
}

export const baseStyle: ImageStyle = {
  id: 'base',
  name: '基础风格',
  description: '基础风格，适合各种场景扩展',
  coverStyles: {
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    p: {
      fontSize: '16px',
    }
  },
  styles: {
    container: {
      width: '300px',
      minWidth: '300px',
      height: '400px',
      minHeight: '400px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    innerContainer: {
      width: '100%',
      height: '100%',
      padding: '30px 25px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: '12px',
    },
    header: {
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '1.3',
      color: '#1a1a1a',
      marginBottom: '6px',
      letterSpacing: '-0.3px',
    },
    content: {
      flex: 1,
      overflow: 'hidden',
      lineHeight: '1.6',
      color: '#333333',
      fontSize: '13px',
    },
    footer: {
      fontSize: '10px',
      color: '#999999',
      textAlign: 'right',
      marginTop: 'auto',
      paddingTop: '12px',
      opacity: 0.8,
    },
    h1: {
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '20px',
      lineHeight: '1.3',
      color: '#1a1a1a',
      letterSpacing: '-0.3px',
    },
    h2: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '12px',
      lineHeight: '1.3',
      color: '#1a1a1a',
      letterSpacing: '-0.2px',
    },
    h3: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '10px',
      lineHeight: '1.4',
      color: '#1a1a1a',
    },
    h4: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      lineHeight: '1.4',
      color: '#1a1a1a',
    },
    h5: {
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '6px',
      lineHeight: '1.4',
      color: '#333333',
    },
    h6: {
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '6px',
      lineHeight: '1.4',
      color: '#333333',
    },
    p: {
      fontSize: '13px',
      marginBottom: '10px',
      lineHeight: '1.6',
      color: '#333333',
      wordBreak: 'break-word',
    },
    strong: {
      fontWeight: '600',
      color: '#1a1a1a',
    },
    em: {
      fontStyle: 'italic',
      color: '#555555',
    },
    ul: {
      marginBottom: '10px',
      paddingLeft: '16px',
      listStyle: 'none',
    },
    li: {
      marginBottom: '6px',
      lineHeight: '1.6',
      position: 'relative',
      paddingLeft: '14px',
    },
  }
}

export const imageStyles: ImageStyle[] = [
  {
    id: 'simple',
    name: '简约清新',
    description: '简洁明亮的设计，适合日常分享和知识类内容',
    coverStyles: {},
    styles: {
      container: {
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
      },
      content: {
        color: '#2d3748',
      },
      h1: {
        color: '#1a202c',
        fontWeight: '700',
      },
      h2: {
        color: '#1a202c',
        fontWeight: '600',
      },
      h3: {
        color: '#2d3748',
        fontWeight: '600',
      },
      p: {
        color: '#4a5568',
      },
      strong: {
        color: '#1a202c',
        fontWeight: '700',
      },
      li: {
        marginBottom: '6px',
        lineHeight: '1.6',
        position: 'relative',
        paddingLeft: '14px',
      },
    },
  },
  {
    id: 'gradient',
    name: '温暖渐变',
    description: '温柔的渐变色彩，适合生活分享和情感表达',
    coverStyles: {},
    styles: {
      container: {
        background: 'linear-gradient(135deg, #fef7f0 0%, #fef3ec 25%, #fdf2f8 50%, #f3e8ff 75%, #f0f9ff 100%)',
        boxShadow: '0 25px 50px rgba(251, 113, 133, 0.15)',
      },
      content: {
        color: '#7c2d12',
      },
      h1: {
        color: '#7c2d12',
        fontWeight: '700',
        textShadow: '0 1px 2px rgba(252, 165, 165, 0.3)',
      },
      h2: {
        color: '#92400e',
        fontWeight: '600',
      },
      h3: {
        color: '#a21caf',
        fontWeight: '600',
      },
      p: {
        color: '#7c2d12',
      },
      strong: {
        color: '#7c2d12',
        fontWeight: '700',
        background: 'linear-gradient(120deg, rgba(252, 165, 165, 0.3) 0%, rgba(251, 207, 232, 0.3) 100%)',
        padding: '2px 4px',
        borderRadius: '4px',
      },
      li: {
        marginBottom: '6px',
        lineHeight: '1.6',
        position: 'relative',
        paddingLeft: '14px',
      },
    },
  },
  {
    id: 'dark',
    name: '深邃夜色',
    description: '高级感的深色主题，适合专业内容和个性表达',
    coverStyles: {},
    styles: {
      container: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
      },
      content: {
        color: '#e2e8f0',
      },
      h1: {
        color: '#f1f5f9',
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        background: 'linear-gradient(120deg, #60a5fa, #c084fc)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
      h2: {
        color: '#f8fafc',
        fontWeight: '600',
      },
      h3: {
        color: '#e2e8f0',
        fontWeight: '600',
      },
      p: {
        color: '#cbd5e0',
      },
      strong: {
        color: '#f1f5f9',
        fontWeight: '700',
        background: 'rgba(96, 165, 250, 0.2)',
        padding: '2px 6px',
        borderRadius: '4px',
        border: '1px solid rgba(96, 165, 250, 0.3)',
      },
      li: {
        marginBottom: '6px',
        lineHeight: '1.6',
        position: 'relative',
        paddingLeft: '14px',
      },
      footer: {
        color: '#64748b',
        background: 'rgba(30, 41, 59, 0.5)',
        padding: '10px 20px',
        margin: '0 -20px -20px -20px',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
      },
    },
  },
];

export function getStyleById(styleId: string): ImageStyle {
  const {
    id,
    name,
    description,
    coverStyles,
    styles,
  } = imageStyles.find(style => style.id === styleId) || imageStyles[0];
  return {
    id,
    name,
    description,
    coverStyles: {
      container: {
        ...baseStyle.styles.container,
        ...styles.container,
        ...baseStyle.coverStyles?.container,
        ...coverStyles?.container,
      },
      innerContainer: {
        ...baseStyle.styles.innerContainer,
        ...styles.innerContainer,
        ...baseStyle.coverStyles?.innerContainer,
        ...coverStyles?.innerContainer,
      },
      header: {
        ...baseStyle.styles.header,
        ...styles.header,
        ...baseStyle.coverStyles?.header,
        ...coverStyles?.header,
      },
      content: {
        ...baseStyle.styles.content,
        ...styles.content,
        ...baseStyle.coverStyles?.content,
        ...coverStyles?.content,
      },
      footer: {
        ...baseStyle.styles.footer,
        ...styles.footer,
        ...baseStyle.coverStyles?.footer,
        ...coverStyles?.footer,
      },
      h1: {
        ...baseStyle.styles.h1,
        ...styles.h1,
        ...baseStyle.coverStyles?.h1,
        ...coverStyles?.h1,
      },
      h2: {
        ...baseStyle.styles.h2,
        ...styles.h2,
        ...baseStyle.coverStyles?.h2,
        ...coverStyles?.h2,
      },
      h3: {
        ...baseStyle.styles.h3,
        ...styles.h3,
        ...baseStyle.coverStyles?.h3,
        ...coverStyles?.h3,
      },
      h4: {
        ...baseStyle.styles.h4,
        ...styles.h4,
        ...baseStyle.coverStyles?.h4,
        ...coverStyles?.h4,
      },
      h5: {
        ...baseStyle.styles.h5,
        ...styles.h5,
        ...baseStyle.coverStyles?.h5,
        ...coverStyles?.h5,
      },
      h6: {
        ...baseStyle.styles.h6,
        ...styles.h6,
        ...baseStyle.coverStyles?.h6,
        ...coverStyles?.h6,
      },
      p: {
        ...baseStyle.styles.p,
        ...styles.p,
        ...baseStyle.coverStyles?.p,
        ...coverStyles?.p,
      },
      strong: {
        ...baseStyle.styles.strong,
        ...styles.strong,
        ...baseStyle.coverStyles?.strong,
        ...coverStyles?.strong,
      },
      em: {
        ...baseStyle.styles.em,
        ...styles.em,
        ...baseStyle.coverStyles?.em,
        ...coverStyles?.em,
      },
      ul: {
        ...baseStyle.styles.ul,
        ...styles.ul,
        ...baseStyle.coverStyles?.ul,
        ...coverStyles?.ul,
      },
      li: {
        ...baseStyle.styles.li,
        ...styles.li,
        ...baseStyle.coverStyles?.li,
        ...coverStyles?.li,
      },
    },
    styles: {
      container: {
        ...baseStyle.styles.container,
        ...styles?.container,
      },
      innerContainer: {
        ...baseStyle.styles.innerContainer,
        ...styles?.innerContainer,
      },
      header: {
        ...baseStyle.styles.header,
        ...styles?.header,
      },
      content: {
        ...baseStyle.styles.content,
        ...styles?.content,
      },
      footer: {
        ...baseStyle.styles.footer,
        ...styles?.footer,
      },
      h1: {
        ...baseStyle.styles.h1,
        ...styles?.h1,
      },
      h2: {
        ...baseStyle.styles.h2,
        ...styles?.h2,
      },
      h3: {
        ...baseStyle.styles.h3,
        ...styles?.h3,
      },
      h4: {
        ...baseStyle.styles.h4,
        ...styles?.h4,
      },
      h5: {
        ...baseStyle.styles.h5,
        ...styles?.h5,
      },
      h6: {
        ...baseStyle.styles.h6,
        ...styles?.h6,
      },
      p: {
        ...baseStyle.styles.p,
        ...styles?.p,
      },
      strong: {
        ...baseStyle.styles.strong,
        ...styles?.strong,
      },
      em: {
        ...baseStyle.styles.em,
        ...styles?.em,
      },
      ul: {
        ...baseStyle.styles.ul,
        ...styles?.ul,
      },
      li: {
        ...baseStyle.styles.li,
        ...styles?.li,
      },
    },
  }
} 