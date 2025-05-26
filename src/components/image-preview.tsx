'use client';

import { forwardRef } from 'react';
import { ImageSegment } from '@/lib/markdown-parser';
import { ImageStyle } from '@/lib/image-styles';

interface ImagePreviewProps {
  segment: ImageSegment;
  style: ImageStyle;
  index: number;
}

// 独立的CSS样式，不依赖Tailwind
const getImageStyles = (style: ImageStyle) => ({
  container: {
    // 必须要固定大小
    width: `${style.width}px`,
    minWidth: `${style.width}px`,
    height: `${style.height}px`,
    minHeight: `${style.height}px`,
    background: style.backgroundGradient,
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    padding: "55px 45px",
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    lineHeight: '1.2',
    color: style.id === 'dark' ? '#ffffff' : '#1f2937',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    lineHeight: '1.6',
    color: style.id === 'dark' ? '#e5e7eb' : '#374151',
  },
  footer: {
    fontSize: '12px',
    opacity: 0.5,
    textAlign: 'right' as const,
    marginTop: '16px',
    color: style.id === 'dark' ? '#ffffff' : '#000000',
  }
});

// 为Markdown内容创建独立样式
const getMarkdownStyles = (isDark: boolean) => ({
  h1: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  h2: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  h3: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '8px',
    lineHeight: '1.2',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  p: {
    fontSize: '20px',
    marginBottom: '16px',
    lineHeight: '1.6',
    color: isDark ? '#e5e7eb' : '#374151',
  },
  strong: {
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  em: {
    fontStyle: 'italic',
  },
  ul: {
    marginBottom: '16px',
    paddingLeft: '24px',
  },
  li: {
    marginBottom: '4px',
    listStyleType: 'disc',
  }
});

export const ImagePreview = forwardRef<HTMLDivElement, ImagePreviewProps>(
  ({ segment, style, index }, ref) => {
    const styles = getImageStyles(style);
    const isDark = style.id === 'dark';

    // 简单的Markdown解析函数，只处理基本语法
    const parseSimpleMarkdown = (content: string) => {
      return content
        .split('\n')
        .map((line, lineIndex) => {
          const trimmedLine = line.trim();
          
          // 处理标题
          if (trimmedLine.startsWith('### ')) {
            return (
              <h3 key={lineIndex} style={getMarkdownStyles(isDark).h3}>
                {trimmedLine.substring(4)}
              </h3>
            );
          } else if (trimmedLine.startsWith('## ')) {
            return (
              <h2 key={lineIndex} style={getMarkdownStyles(isDark).h2}>
                {trimmedLine.substring(3)}
              </h2>
            );
          } else if (trimmedLine.startsWith('# ')) {
            return (
              <h1 key={lineIndex} style={getMarkdownStyles(isDark).h1}>
                {trimmedLine.substring(2)}
              </h1>
            );
          }
          
          // 处理段落
          if (trimmedLine) {
            // 处理加粗和斜体
            const processedText = trimmedLine;
            
            // 简单的加粗处理
            const boldRegex = /\*\*(.*?)\*\*/g;
            const parts = [];
            let lastIndex = 0;
            let match;
            
            while ((match = boldRegex.exec(processedText)) !== null) {
              if (match.index > lastIndex) {
                parts.push(processedText.slice(lastIndex, match.index));
              }
              parts.push(
                <strong key={`bold-${lineIndex}-${match.index}`} style={getMarkdownStyles(isDark).strong}>
                  {match[1]}
                </strong>
              );
              lastIndex = match.index + match[0].length;
            }
            
            if (lastIndex < processedText.length) {
              parts.push(processedText.slice(lastIndex));
            }
            
            return (
              <p key={lineIndex} style={getMarkdownStyles(isDark).p}>
                {parts.length > 0 ? parts : trimmedLine}
              </p>
            );
          }
          
          return null;
        })
        .filter(Boolean);
    };

    return (
      <div ref={ref} style={styles.container}>
        <div style={styles.innerContainer}>
          {/* TODO: Title */}
          {/* <div style={styles.title}>
            {segment.title}
          </div> */}
          {/* 内容部分 */}
          <div style={styles.content}>
            {parseSimpleMarkdown(segment.content)}
          </div>
          
          {/* TODO: Footer */}
          {/* <div style={styles.footer}>
          </div> */}
        </div>
      </div>
    );
  }
);

ImagePreview.displayName = 'ImagePreview'; 