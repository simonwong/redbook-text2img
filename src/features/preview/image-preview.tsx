"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import type { ImageSegment } from "@/lib/markdown-parser";
import {
  applyAdjustments,
  defaultTheme,
  generateStyles,
  getThemeById,
} from "@/lib/theme";
import { useContentThemeStore } from "@/store/theme";
import { HeaderBar } from "./header-bar";

interface ImagePreviewProps {
  segment: ImageSegment;
  ref: React.Ref<HTMLDivElement>;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ segment, ref }) => {
  const { currentThemeId, adjustments } = useContentThemeStore();

  const { styles, headerBar } = useMemo(() => {
    const theme = getThemeById(currentThemeId) ?? defaultTheme;
    const adjustedStyle = applyAdjustments(theme.style, adjustments);
    // 如果是封面图（包含 # 一级标题），使用主题的封面图样式，忽略用户的标题对齐设置
    const coverStyle = segment.isCover ? theme.coverStyle : undefined;
    return {
      styles: generateStyles(adjustedStyle, { coverStyle }),
      headerBar: theme.headerBar,
    };
  }, [currentThemeId, adjustments, segment.isCover]);

  return (
    <div className="img-preview" ref={ref} style={styles.container}>
      {headerBar && <HeaderBar config={headerBar} />}
      <div
        style={{
          ...styles.innerContainer,
          height: headerBar ? "calc(100% - 40px)" : "100%",
        }}
      >
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
                const isCodeBlock = className?.includes("language-");
                if (isCodeBlock) {
                  return <code>{children}</code>;
                }
                return <code style={styles.code}>{children}</code>;
              },
            }}
          >
            {segment.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
