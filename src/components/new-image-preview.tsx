'use client';

import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ImageSegment } from '@/lib/markdown-parser';
import { StyleConfig } from '@/lib/image-style-config';
import { generateStylesFromConfig } from '@/lib/style-generator';

interface NewImagePreviewProps {
  segment: ImageSegment;
  styleConfig: StyleConfig;
}

export const NewImagePreview = forwardRef<HTMLDivElement, NewImagePreviewProps>(
  ({ segment, styleConfig }, ref) => {
    // 检测内容是否以 # 开头（封面模式）
    const content = segment.content.trim();
    const isCoverImage = content.startsWith('# ');

    // 生成样式
    const styles = generateStylesFromConfig(styleConfig);
    const currentStyles = isCoverImage ? styles.coverStyles : styles.contentStyles;

    return (
      <div
        ref={ref}
        key={`container-${styleConfig.id}-${segment.id}`}
        style={currentStyles.container}
      >
        <div style={currentStyles.innerContainer}>
          {/* 内容部分 */}
          <div style={currentStyles.content}>
            <ReactMarkdown
              key={`markdown-${styleConfig.id}-${segment.id}`}
              components={{
                h1: ({ children }) => <h1 style={currentStyles.h1}>{children}</h1>,
                h2: ({ children }) => <h2 style={currentStyles.h2}>{children}</h2>,
                h3: ({ children }) => <h3 style={currentStyles.h3}>{children}</h3>,
                h4: ({ children }) => <h4 style={currentStyles.h4}>{children}</h4>,
                h5: ({ children }) => <h5 style={currentStyles.h5}>{children}</h5>,
                h6: ({ children }) => <h6 style={currentStyles.h6}>{children}</h6>,
                p: ({ children }) => <p style={currentStyles.p}>{children}</p>,
                strong: ({ children }) => <strong style={currentStyles.strong}>{children}</strong>,
                em: ({ children }) => <em style={currentStyles.em}>{children}</em>,
                ul: ({ children }) => <ul style={currentStyles.ul}>{children}</ul>,
                li: ({ children }) => <li style={currentStyles.li}>{children}</li>,
              }}
            >
              {segment.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }
);

NewImagePreview.displayName = 'NewImagePreview';
