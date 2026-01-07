'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ImageSegment } from '@/lib/markdown-parser';
import {
  applyAdjustments,
  defaultTheme,
  generateStyles,
  getThemeById,
} from '@/lib/theme';
import { useContentThemeStore } from '@/store/theme';

interface ImagePreviewProps {
  segment: ImageSegment;
  ref: React.Ref<HTMLDivElement>;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  segment,
  ref,
}) => {
  const { currentThemeId, adjustments } = useContentThemeStore();

  const styles = useMemo(() => {
    const theme = getThemeById(currentThemeId) ?? defaultTheme;
    const adjustedStyle = applyAdjustments(theme.style, adjustments);
    return generateStyles(adjustedStyle);
  }, [currentThemeId, adjustments]);

  return (
    <div
      className="img-preview"
      key={`container-${currentThemeId}-${segment.id}`}
      ref={ref}
      style={styles.container}
    >
      <div style={styles.innerContainer}>
        <div style={styles.content}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 style={styles.h1}>{children}</h1>,
              h2: ({ children }) => <h2 style={styles.h2}>{children}</h2>,
              h3: ({ children }) => <h3 style={styles.h3}>{children}</h3>,
              h4: ({ children }) => <h4 style={styles.h4}>{children}</h4>,
              h5: ({ children }) => <h5 style={styles.h5}>{children}</h5>,
              h6: ({ children }) => <h6 style={styles.h6}>{children}</h6>,
              p: ({ children }) => <p style={styles.p}>{children}</p>,
              strong: ({ children }) => (
                <strong style={styles.strong}>{children}</strong>
              ),
              em: ({ children }) => <em style={styles.em}>{children}</em>,
              ul: ({ children }) => <ul style={styles.ul}>{children}</ul>,
              li: ({ children }) => <li style={styles.li}>{children}</li>,
              blockquote: ({ children }) => (
                <blockquote style={styles.blockquote}>{children}</blockquote>
              ),
              a: ({ children, href }) => (
                <a href={href} style={styles.a}>
                  {children}
                </a>
              ),
              pre: ({ children }) => <pre style={styles.pre}>{children}</pre>,
              code: ({ className, children }) => {
                const isCodeBlock = className?.includes('language-');
                if (isCodeBlock) {
                  return <code>{children}</code>;
                }
                return <code style={styles.code}>{children}</code>;
              },
            }}
            key={`markdown-${currentThemeId}-${segment.id}`}
          >
            {segment.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

