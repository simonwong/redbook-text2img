"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import type { ImageSegment } from "@/lib/markdown-parser";
import { styleSystem } from "@/lib/style-system/style-system";
import { useContentThemeStore, useWatermarkStore } from "@/store/theme";
import { CardWatermark } from "./card-watermark";
import { HeaderBar } from "./header-bar";

interface ImagePreviewProps {
  contentRef?: React.Ref<HTMLDivElement>;
  pageNumber: { current: number; total: number };
  ref?: React.Ref<HTMLDivElement>;
  segment: ImageSegment;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  contentRef,
  pageNumber,
  ref,
  segment,
}) => {
  const { currentThemeId, customThemes, overrides } = useContentThemeStore();
  const { signature, showPageNumber } = useWatermarkStore();

  const { styles, headerBar } = useMemo(
    () =>
      styleSystem.resolve(
        { currentThemeId, customThemes, overrides },
        { page: segment.isCover ? "cover" : "body" }
      ),
    [currentThemeId, customThemes, overrides, segment.isCover]
  );

  // 页码只在非封面页显示（封面为第 1 张，计数含封面）；署名在所有卡片显示
  const watermarkPage =
    showPageNumber && !segment.isCover ? pageNumber : undefined;

  // 白边（cardFrame = white）是导出内容的一部分：导出节点变为白边层，卡片画布退到内层
  const cardBody = (
    <>
      {headerBar && <HeaderBar config={headerBar} />}
      <div
        style={{
          ...styles.innerContainer,
          height: headerBar ? "calc(100% - 40px)" : "100%",
        }}
      >
        <div ref={contentRef} style={styles.content}>
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
        <CardWatermark
          pageNumber={watermarkPage}
          signature={signature.trim()}
          style={styles.footer}
        />
      </div>
    </>
  );

  // 磨砂：模糊图片层与蒙层铺在卡片容器内、内容之下，全部属于导出节点
  const canvasBody = styles.frost ? (
    <>
      <div style={styles.frost.blurLayer} />
      <div style={styles.frost.veil} />
      <div style={styles.frost.contentLayer}>{cardBody}</div>
    </>
  ) : (
    cardBody
  );

  if (styles.card.frame) {
    return (
      <div className="img-preview" ref={ref} style={styles.card.frame}>
        <div style={styles.container}>{canvasBody}</div>
      </div>
    );
  }

  return (
    <div className="img-preview" ref={ref} style={styles.container}>
      {canvasBody}
    </div>
  );
};
