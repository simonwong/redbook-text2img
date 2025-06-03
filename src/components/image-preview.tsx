'use client';

import { forwardRef } from 'react';
import { ImageSegment } from '@/lib/markdown-parser';
import { ImageStyle } from '@/lib/image-styles';

interface ImagePreviewProps {
  segment: ImageSegment;
  style: ImageStyle;
}

export const ImagePreview = forwardRef<HTMLDivElement, ImagePreviewProps>(
  ({ segment, style }, ref) => {
    // 检测内容是否以 # 开头（封面模式）
    const content = segment.content.trim();
    const isCoverImage = content.startsWith('# ');
    const styles = isCoverImage ? style.coverStyles : style.styles;
    // 常规模式：解析 Markdown 内容
    const parseSimpleMarkdown = (content: string) => {
      return content
        .split('\n')
        .map((line, lineIndex) => {
          const trimmedLine = line.trim();
          
          // 处理标题
          if (trimmedLine.startsWith('### ')) {
            return (
              <h3 key={lineIndex} style={styles.h3}>
                {trimmedLine.substring(4)}
              </h3>
            );
          } else if (trimmedLine.startsWith('## ')) {
            return (
              <h2 key={lineIndex} style={styles.h2}>
                {trimmedLine.substring(3)}
              </h2>
            );
          } else if (trimmedLine.startsWith('# ')) {
            return (
              <h1 key={lineIndex} style={styles.h1}>
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
                <strong key={`bold-${lineIndex}-${match.index}`} style={styles.strong}>
                  {match[1]}
                </strong>
              );
              lastIndex = match.index + match[0].length;
            }
            
            if (lastIndex < processedText.length) {
              parts.push(processedText.slice(lastIndex));
            }
            
            return (
              <p key={lineIndex} style={styles.p}>
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