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
      color: '#666666',
      position: 'relative',
      fontWeight: '500',
    },
    ul: {
      marginBottom: '10px',
      paddingLeft: '16px',
      listStyle: 'disc',
    },
    li: {
      marginBottom: '6px',
      lineHeight: '1.6',
      position: 'relative',
    },
  }
}

// 背景图片生成器
// https://bgjar.com/

export const imageStyles: ImageStyle[] = [
  {
    id: 'simple',
    name: '简约清新',
    description: '简洁明亮的设计，适合日常分享和知识类内容',
    coverStyles: {},
    styles: {
      container: {
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='300' height='400' preserveAspectRatio='none' viewBox='0 0 300 400'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1002%26quot%3b)' fill='none'%3e%3crect width='300' height='400' x='0' y='0' fill='url(%26quot%3b%23SvgjsLinearGradient1003%26quot%3b)'%3e%3c/rect%3e%3cpath d='M0 0L80.23 0L0 35.62z' fill='rgba(255%2c 255%2c 255%2c .1)'%3e%3c/path%3e%3cpath d='M0 35.62L80.23 0L187.59 0L0 142.12z' fill='rgba(255%2c 255%2c 255%2c .075)'%3e%3c/path%3e%3cpath d='M0 142.12L187.59 0L228.57 0L0 213.05z' fill='rgba(255%2c 255%2c 255%2c .05)'%3e%3c/path%3e%3cpath d='M0 213.05L228.57 0L265.3 0L0 313.51z' fill='rgba(255%2c 255%2c 255%2c .025)'%3e%3c/path%3e%3cpath d='M300 400L229.24 400L300 255.57z' fill='rgba(0%2c 0%2c 0%2c .1)'%3e%3c/path%3e%3cpath d='M300 255.57L229.24 400L210.94 400L300 115.41z' fill='rgba(0%2c 0%2c 0%2c .075)'%3e%3c/path%3e%3cpath d='M300 115.40999999999997L210.94 400L200.76 400L300 97.06999999999996z' fill='rgba(0%2c 0%2c 0%2c .05)'%3e%3c/path%3e%3cpath d='M300 97.07L200.76 400L114.42999999999999 400L300 55.72999999999999z' fill='rgba(0%2c 0%2c 0%2c .025)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1002'%3e%3crect width='300' height='400' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='100%25' y1='50%25' x2='0%25' y2='50%25' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1003'%3e%3cstop stop-color='rgba(162%2c 196%2c 232%2c 1)' offset='0'%3e%3c/stop%3e%3cstop stop-color='rgba(248%2c 251%2c 255%2c 1)' offset='1'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e")`,
        position: 'relative',
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
      em: {
        fontStyle: 'italic',
        color: '#5a67d8',
        fontWeight: '500',
        position: 'relative',
        padding: '0 2px',
        background: 'linear-gradient(120deg, rgba(90, 103, 216, 0.1) 0%, rgba(90, 103, 216, 0.05) 100%)',
        borderRadius: '2px',
      },
      ul: {
        marginBottom: '8px',
        paddingLeft: '16px',
        listStyle: 'circle',
      },
      li: {
        marginBottom: '3px',
        lineHeight: '1.5',
        position: 'relative',
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
      em: {
        fontStyle: 'italic',
        color: '#c2410c',
        fontWeight: '500',
        position: 'relative',
        textShadow: '0 1px 2px rgba(194, 65, 12, 0.2)',
        borderBottom: '1px solid rgba(194, 65, 12, 0.3)',
        paddingBottom: '1px',
      },
      ul: {
        marginBottom: '8px',
        paddingLeft: '16px',
        listStyle: 'circle',
      },
      li: {
        marginBottom: '3px',
        lineHeight: '1.5',
        position: 'relative',
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
        border: '1px solid rgba(148, 163, 184, 0.1)',
      },
      content: {
        color: '#e2e8f0',
      },
      h1: {
        color: '#60a5fa',
        fontWeight: '700',
        textShadow: '0 0 10px rgba(96, 165, 250, 0.5), 0 2px 4px rgba(0, 0, 0, 0.5)',
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
      em: {
        fontStyle: 'italic',
        color: '#a78bfa',
        fontWeight: '500',
        position: 'relative',
        textShadow: '0 0 8px rgba(167, 139, 250, 0.4)',
        background: 'rgba(167, 139, 250, 0.1)',
        padding: '1px 3px',
        borderRadius: '3px',
        border: '1px solid rgba(167, 139, 250, 0.2)',
      },
      ul: {
        marginBottom: '8px',
        paddingLeft: '16px',
        listStyle: 'square',
      },
      li: {
        marginBottom: '3px',
        lineHeight: '1.5',
        position: 'relative',
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
        ...baseStyle.coverStyles?.container,
        ...styles?.container,
        ...coverStyles?.container,
      },
      innerContainer: {
        ...baseStyle.styles.innerContainer,
        ...baseStyle.coverStyles?.innerContainer,
        ...styles?.innerContainer,
        ...coverStyles?.innerContainer,
      },
      header: {
        ...baseStyle.styles.header,
        ...baseStyle.coverStyles?.header,
        ...styles?.header,
        ...coverStyles?.header,
      },
      content: {
        ...baseStyle.styles.content,
        ...baseStyle.coverStyles?.content,
        ...styles?.content,
        ...coverStyles?.content,
      },
      footer: {
        ...baseStyle.styles.footer,
        ...baseStyle.coverStyles?.footer,
        ...styles?.footer,
        ...coverStyles?.footer,
      },
      h1: {
        ...baseStyle.styles.h1,
        ...baseStyle.coverStyles?.h1,
        ...styles?.h1,
        ...coverStyles?.h1,
      },
      h2: {
        ...baseStyle.styles.h2,
        ...baseStyle.coverStyles?.h2,
        ...styles?.h2,
        ...coverStyles?.h2,
      },
      h3: {
        ...baseStyle.styles.h3,
        ...baseStyle.coverStyles?.h3,
        ...styles?.h3,
        ...coverStyles?.h3,
      },
      h4: {
        ...baseStyle.styles.h4,
        ...baseStyle.coverStyles?.h4,
        ...styles?.h4,
        ...coverStyles?.h4,
      },
      h5: {
        ...baseStyle.styles.h5,
        ...baseStyle.coverStyles?.h5,
        ...styles?.h5,
        ...coverStyles?.h5,
      },
      h6: {
        ...baseStyle.styles.h6,
        ...baseStyle.coverStyles?.h6,
        ...styles?.h6,
        ...coverStyles?.h6,
      },
      p: {
        ...baseStyle.styles.p,
        ...baseStyle.coverStyles?.p,
        ...styles?.p,
        ...coverStyles?.p,
      },
      strong: {
        ...baseStyle.styles.strong,
        ...baseStyle.coverStyles?.strong,
        ...styles?.strong,
        ...coverStyles?.strong,
      },
      em: {
        ...baseStyle.styles.em,
        ...baseStyle.coverStyles?.em,
        ...styles?.em,
        ...coverStyles?.em,
      },
      ul: {
        ...baseStyle.styles.ul,
        ...baseStyle.coverStyles?.ul,
        ...styles?.ul,
        ...coverStyles?.ul,
      },
      li: {
        ...baseStyle.styles.li,
        ...baseStyle.coverStyles?.li,
        ...styles?.li,
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
  };
} 