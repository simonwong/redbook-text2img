"use client";

import { FileText } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { parseMarkdownToImages } from "@/lib/markdown-parser";
import { styleSystem } from "@/lib/style-system/style-system";
import { useMarkdownContentStore } from "@/store/markdownContent";
import { usePreviewNavigationStore } from "@/store/preview-navigation";
import { useContentThemeStore, useSettingsPanelStore } from "@/store/theme";
import { ExportProgressBar } from "./export-progress-bar";
import { ExportSuccessOverlay } from "./export-success-overlay";
import { useContentOverflow } from "./hooks/use-content-overflow";
import { useImageExport } from "./hooks/use-image-export";
import { ImagePreview } from "./image-preview";
import { MeshGrain } from "./mesh-grain";
import { OverflowWarning } from "./overflow-warning";
import { PreviewActionBar } from "./preview-action-bar";
import { PreviewPager } from "./preview-pager";
import "./index.css";
import { cn, sanitizeFilename } from "@/lib/utils";

interface AvailableBox {
  height: number;
  width: number;
}

/** 预览缩放：卡片尺寸来自渲染样式，按可用区域等比缩小，9:16 也能完整显示 */
function usePreviewScale(
  areaRef: React.RefObject<HTMLDivElement | null>,
  cardWidth: number,
  cardHeight: number
) {
  const [available, setAvailable] = useState<AvailableBox | null>(null);

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setAvailable({
        height: entry.contentRect.height,
        width: entry.contentRect.width,
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [areaRef]);

  if (!available || available.height <= 0 || available.width <= 0) {
    return 1;
  }

  return Math.min(
    1,
    available.width / cardWidth,
    available.height / cardHeight
  );
}

interface PreviewPanelProps {
  className?: string;
  closeDrawerOnOpenSettings?: boolean;
  onOpenSettings?: () => void;
}

export const PreviewPanel = ({
  className,
  closeDrawerOnOpenSettings,
  onOpenSettings,
}: PreviewPanelProps) => {
  const { content: markdown } = useMarkdownContentStore();
  const { toggle: toggleSettings } = useSettingsPanelStore();
  const {
    activeSegmentIndex,
    setActiveSegmentIndex,
    setSegmentCount,
    goNext,
    goPrev,
  } = usePreviewNavigationStore();

  const segments = useMemo(() => parseMarkdownToImages(markdown), [markdown]);
  const title = useMemo(
    () => sanitizeFilename(segments.find((s) => s.isFirstImage)?.title ?? ""),
    [segments]
  );

  const segmentIds = useMemo(
    () => segments.map((segment) => segment.id),
    [segments]
  );

  useEffect(() => {
    setSegmentCount(segments.length);
  }, [segments.length, setSegmentCount]);

  const { currentThemeId, customThemes, overrides } = useContentThemeStore();
  // 卡片尺寸与圆角由渲染样式决定（比例与白边），预览不再写死
  const { card, container } = useMemo(
    () =>
      styleSystem.resolve(
        { currentThemeId, customThemes, overrides },
        { page: "body" }
      ).styles,
    [currentThemeId, customThemes, overrides]
  );
  const cardRadius = String(card.frame?.borderRadius ?? container.borderRadius);

  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const scale = usePreviewScale(previewAreaRef, card.width, card.height);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportProgress, setExportProgress] = useState({
    current: 0,
    total: 0,
  });
  const { exportSingleImage, generateImageBlob, downloadZip } =
    useImageExport(title);
  const clearExportSuccess = useCallback(() => setExportSuccess(false), []);

  const handleExportCurrent = useCallback(async () => {
    const element = imageRef.current;
    if (!element) {
      return;
    }
    setIsExporting(true);
    try {
      await exportSingleImage(element, activeSegmentIndex);
      setExportSuccess(true);
    } catch (error) {
      console.error("导出图片失败", error);
    } finally {
      setIsExporting(false);
    }
  }, [activeSegmentIndex, exportSingleImage]);

  const handleExportAll = useCallback(async () => {
    const savedIndex = activeSegmentIndex;
    setIsExporting(true);

    try {
      const { default: JSZip } = await import("jszip");
      const total = segments.length;
      const zip = new JSZip();

      for (let i = 0; i < total; i++) {
        setExportProgress({ current: i + 1, total });
        setActiveSegmentIndex(i);
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        });
        const el = imageRef.current;
        if (el) {
          const blob = await generateImageBlob(el);
          zip.file(`${title}-${i + 1}.png`, blob);
        }
      }

      await downloadZip(zip);
      setExportSuccess(true);
    } catch (error) {
      console.error("批量导出失败", error);
    } finally {
      setActiveSegmentIndex(savedIndex);
      setIsExporting(false);
      setExportProgress({ current: 0, total: 0 });
    }
  }, [
    activeSegmentIndex,
    segments.length,
    title,
    generateImageBlob,
    downloadZip,
    setActiveSegmentIndex,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("role") === "textbox" ||
        target.isContentEditable ||
        target.closest(".cm-editor")
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const clampedIndex = Math.min(activeSegmentIndex, segments.length - 1);
  const activeSegment = segments[clampedIndex];
  const isOverflowing = useContentOverflow(
    contentRef,
    activeSegment?.content ?? ""
  );

  if (segments.length === 0) {
    return (
      <div className={cn("ds-frame h-full min-h-0", className)}>
        <div className="ds-pane ds-mesh relative flex min-h-0 flex-col items-center justify-center overflow-hidden">
          <div aria-hidden="true" className="ds-veil" />
          <MeshGrain />
          <div
            className="ds-card-rim relative flex max-h-full max-w-full flex-col items-center justify-center gap-3 bg-white"
            style={{
              borderRadius: cardRadius,
              height: card.height,
              width: card.width,
            }}
          >
            <HugeiconsIcon className="size-10 text-ink-3" icon={FileText} />
            <p className="text-[13px] text-ink-2">在左侧输入 Markdown</p>
            <p className="text-[11.5px] text-ink-3">使用 --- 分割不同图片</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("ds-frame h-full min-h-0", className)}>
      <div className="ds-pane ds-mesh relative flex min-h-0 flex-col overflow-hidden">
        <div aria-hidden="true" className="ds-veil" />
        <MeshGrain />

        <ExportProgressBar
          current={exportProgress.current}
          isExporting={isExporting && exportProgress.total > 0}
          total={exportProgress.total}
        />

        <div
          className="relative flex min-h-0 flex-1 items-center justify-center px-5 pt-[26px] pb-3"
          ref={previewAreaRef}
        >
          {/* 外框只有阴影与 1px 极淡描边；白边由 cardFrame 配置进入导出节点 */}
          <div
            className="ds-card-rim relative"
            style={{ borderRadius: cardRadius, width: card.width * scale }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ borderRadius: cardRadius }}
            >
              <div
                className="relative origin-top-left"
                style={{
                  height: card.height * scale,
                  transform: scale < 1 ? `scale(${scale})` : undefined,
                  // 缩小时保持卡片完整布局宽度参与缩放，否则内层 overflow 会先把卡片裁短
                  width: card.width,
                }}
              >
                <ExportSuccessOverlay
                  onDone={clearExportSuccess}
                  visible={exportSuccess}
                />
                {activeSegment && (
                  <ImagePreview
                    contentRef={contentRef}
                    pageNumber={{
                      current: clampedIndex + 1,
                      total: segments.length,
                    }}
                    ref={imageRef}
                    segment={activeSegment}
                  />
                )}
              </div>
            </div>
            {/* 溢出警告挂在未缩放的外框（scale 元素之外），避免随预览缩放变形，也绝不进导出元素 */}
            {isOverflowing && (
              <div className="absolute inset-x-3 bottom-3 z-10">
                <OverflowWarning />
              </div>
            )}
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-2 px-2.5 pb-3">
          <PreviewPager
            activeIndex={clampedIndex}
            onSelect={setActiveSegmentIndex}
            segmentIds={segmentIds}
          />
          <PreviewActionBar
            closeDrawerOnSettings={closeDrawerOnOpenSettings}
            isExporting={isExporting}
            onExportAll={handleExportAll}
            onExportCurrent={handleExportCurrent}
            onToggleSettings={onOpenSettings ?? toggleSettings}
            segmentCount={segments.length}
          />
        </div>
      </div>
    </div>
  );
};
