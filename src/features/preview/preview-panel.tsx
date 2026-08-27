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
import { useMarkdownContentStore } from "@/store/markdownContent";
import { usePreviewNavigationStore } from "@/store/preview-navigation";
import { useSettingsPanelStore } from "@/store/theme";
import { ExportProgressBar } from "./export-progress-bar";
import { ExportSuccessOverlay } from "./export-success-overlay";
import { useContentOverflow } from "./hooks/use-content-overflow";
import { useImageExport } from "./hooks/use-image-export";
import { ImagePreview } from "./image-preview";
import { NavArrowButton } from "./nav-arrow-button";
import { OverflowWarning } from "./overflow-warning";
import { PreviewActionBar } from "./preview-action-bar";
import { SegmentFilmstrip } from "./segment-filmstrip";
import "./index.css";
import { cn, sanitizeFilename } from "@/lib/utils";

const PREVIEW_WIDTH = 375;

function usePreviewScale(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width;
      setScale(
        availableWidth < PREVIEW_WIDTH ? availableWidth / PREVIEW_WIDTH : 1
      );
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  return scale;
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

  useEffect(() => {
    setSegmentCount(segments.length);
  }, [segments.length, setSegmentCount]);

  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scaleContainerRef = useRef<HTMLDivElement>(null);
  const scale = usePreviewScale(scaleContainerRef);
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
      <div className={`flex h-full items-center justify-center ${className}`}>
        <div className="flex h-[500px] w-[375px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-muted-foreground/20 border-dashed px-8">
          <HugeiconsIcon
            className="h-10 w-10 text-muted-foreground/30"
            icon={FileText}
          />
          <p className="text-muted-foreground/60 text-sm">
            在左侧输入 Markdown
          </p>
          <p className="text-muted-foreground/40 text-xs">
            使用 --- 分割不同图片
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-3",
        className
      )}
    >
      <ExportProgressBar
        current={exportProgress.current}
        isExporting={isExporting && exportProgress.total > 0}
        total={exportProgress.total}
      />

      <div className="flex w-full items-center justify-center gap-3">
        <div className="hidden sm:block">
          <NavArrowButton
            direction="left"
            disabled={clampedIndex === 0}
            onClick={goPrev}
          />
        </div>

        <div
          className="relative w-full min-w-0 max-w-[375px] overflow-hidden"
          ref={scaleContainerRef}
        >
          <div
            className="group relative origin-top-left rounded-lg shadow-md ring-1 ring-black/5 dark:shadow-none dark:ring-white/10"
            style={{
              transform: scale < 1 ? `scale(${scale})` : undefined,
              // 缩小时保持卡片完整布局宽度参与缩放，否则内层 overflow 会先把卡片裁短
              width: scale < 1 ? PREVIEW_WIDTH : undefined,
              height: scale < 1 ? `${500 * scale}px` : undefined,
            }}
          >
            <ExportSuccessOverlay
              onDone={clearExportSuccess}
              visible={exportSuccess}
            />
            {activeSegment && (
              <div className="overflow-hidden rounded-lg transition-opacity duration-200">
                <ImagePreview
                  contentRef={contentRef}
                  pageNumber={{
                    current: clampedIndex + 1,
                    total: segments.length,
                  }}
                  ref={imageRef}
                  segment={activeSegment}
                />
              </div>
            )}
          </div>
          {/* 溢出警告挂在未缩放的外框（scale 元素之外），避免随预览缩放变形，也绝不进导出元素 */}
          {isOverflowing && (
            <div className="absolute inset-x-2 bottom-2 z-10">
              <OverflowWarning />
            </div>
          )}
        </div>

        <div className="hidden sm:block">
          <NavArrowButton
            direction="right"
            disabled={clampedIndex === segments.length - 1}
            onClick={goNext}
          />
        </div>
      </div>

      <SegmentFilmstrip
        activeIndex={clampedIndex}
        onSelect={setActiveSegmentIndex}
        segments={segments}
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
  );
};
