'use client';

import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
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

    return (
      <div 
        ref={ref} 
        key={`container-${style.id}-${segment.id}`}
        style={{...styles.container}}
      >
        <div style={{...styles.innerContainer}}>
          {/* TODO: Title */}
          {/* <div style={styles.title}>
            {segment.title}
          </div> */}
          {/* 内容部分 */}
          <div style={{...styles.content}}>
            <ReactMarkdown
              key={`markdown-${style.id}-${segment.id}`}
              components={{
                h1: ({ children }) => (
                  <h1 style={{...styles.h1}}>{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 style={{...styles.h2}}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{...styles.h3}}>{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 style={{...styles.h4}}>{children}</h4>
                ),
                h5: ({ children }) => (
                  <h5 style={{...styles.h5}}>{children}</h5>
                ),
                h6: ({ children }) => (
                  <h6 style={{...styles.h6}}>{children}</h6>
                ),
                p: ({ children }) => (
                  <p style={{...styles.p}}>{children}</p>
                ),
                strong: ({ children }) => (
                  <strong style={{...styles.strong}}>{children}</strong>
                ),
                em: ({ children }) => (
                  <em style={{...styles.em}}>{children}</em>
                ),
                ul: ({ children }) => (
                  <ul style={{...styles.ul}}>{children}</ul>
                ),
                li: ({ children }) => (
                  <li style={{...styles.li}}>{children}</li>
                ),
              }}
            >
              {segment.content}
            </ReactMarkdown>
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