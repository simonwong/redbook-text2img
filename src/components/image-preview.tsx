'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { ImageSegment } from '@/lib/markdown-parser';
import { generateStylesFromConfig } from '@/lib/style-generator';
import { useStyleConfigStore } from '@/store/styleConfig';

interface ImagePreviewProps {
  segment: ImageSegment;
  ref: React.Ref<HTMLDivElement>;
}

export const ImagePreview: React.FC<ImagePreviewProps> = memo(({ segment, ref }) => {
  // 使用 segment.isFirstImage 判断是否为首图（封面模式）
  const isCoverImage = segment.isFirstImage;

  const currentStyleConfig = useStyleConfigStore((state) => state.styleConfig);
  // 生成样式
  const styles = generateStylesFromConfig(currentStyleConfig);
  const currentStyles = isCoverImage ? styles.coverStyles : styles.contentStyles;

  return (
    <div
      ref={ref}
      key={`container-${currentStyleConfig.id}-${segment.id}`}
      style={currentStyles.container}
    >
      <div style={currentStyles.innerContainer}>
        {/* 内容部分 */}
        <div style={currentStyles.content}>
          <ReactMarkdown
            key={`markdown-${currentStyleConfig.id}-${segment.id}`}
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
              pre: ({ children }) => <pre style={currentStyles.pre}>{children}</pre>,
              code: ({ children }) => <code style={currentStyles.code}>{children}</code>,
            }}
          >
            {segment.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
});

ImagePreview.displayName = 'ImagePreview';
