"use client";

import { FileText } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parseMarkdownToImages } from "@/lib/markdown-parser";
import { useMarkdownContentStore } from "@/store/markdownContent";
import { usePreviewNavigationStore } from "@/store/preview-navigation";
import { useSettingsPanelStore } from "@/store/theme";
import { ExportProgressBar, ExportSuccessOverlay } from "./export-feedback";
import { useImageExport } from "./hooks/use-image-export";
import { ImagePreview } from "./image-preview";
import { NavArrowButton } from "./nav-arrow-button";
import { PreviewActionBar } from "./preview-action-bar";
import { SegmentFilmstrip } from "./segment-filmstrip";
import "./index.css";

interface PreviewPanelProps {
  className?: string;
}

export const PreviewPanel = ({ className }: PreviewPanelProps) => {
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
    () => segments.find((s) => s.isFirstImage)?.title ?? "",
    [segments]
  );

  useEffect(() => {
    setSegmentCount(segments.length);
  }, [segments.length, setSegmentCount]);

  const imageRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportProgress, setExportProgress] = useState({
    current: 0,
    total: 0,
  });
  const { exportSingleImage } = useImageExport(title);

  const handleExportCurrent = useCallback(async () => {
    const element = imageRef.current;
    if (!element) {
      return;
    }
    setIsExporting(true);
    await exportSingleImage(element, activeSegmentIndex);
    setIsExporting(false);
    setExportSuccess(true);
  }, [activeSegmentIndex, exportSingleImage]);

  const handleExportAll = useCallback(async () => {
    setIsExporting(true);
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);

    // We need to render all segments temporarily for export
    // For now, just export the visible one if we can't get all refs
    // This is a simplified approach - we export each segment one by one
    // by switching the active index
    const total = segments.length;
    for (let i = 0; i < total; i++) {
      setExportProgress({ current: i + 1, total });
      setActiveSegmentIndex(i);
      // Wait for re-render
      await new Promise((r) => setTimeout(r, 200));
      const el = imageRef.current;
      if (el) {
        await exportSingleImage(el, i);
      }
    }
    document.body.removeChild(tempContainer);
    setIsExporting(false);
    setExportProgress({ current: 0, total: 0 });
    setExportSuccess(true);
  }, [segments.length, exportSingleImage, setActiveSegmentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") {
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

  const activeSegment = segments[activeSegmentIndex];

  if (segments.length === 0) {
    return (
      <div className={`flex h-full items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-[500px] w-[375px] items-center justify-center rounded-xl border-2 border-muted-foreground/20 border-dashed">
            <div className="flex flex-col items-center gap-3 px-8">
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
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full flex-col items-center justify-center gap-3 ${className}`}
    >
      <ExportProgressBar
        current={exportProgress.current}
        isExporting={isExporting && exportProgress.total > 0}
        total={exportProgress.total}
      />

      <div className="text-muted-foreground text-xs">
        {activeSegmentIndex + 1} / {segments.length}
      </div>

      <div className="flex items-center gap-3">
        <NavArrowButton
          direction="left"
          disabled={activeSegmentIndex === 0}
          onClick={goPrev}
        />

        <div className="group relative">
          <ExportSuccessOverlay
            onDone={() => setExportSuccess(false)}
            visible={exportSuccess}
          />
          {activeSegment && (
            <div className="transition-opacity duration-200">
              <ImagePreview ref={imageRef} segment={activeSegment} />
            </div>
          )}
        </div>

        <NavArrowButton
          direction="right"
          disabled={activeSegmentIndex === segments.length - 1}
          onClick={goNext}
        />
      </div>

      <SegmentFilmstrip
        activeIndex={activeSegmentIndex}
        onSelect={setActiveSegmentIndex}
        segments={segments}
      />

      <PreviewActionBar
        isExporting={isExporting}
        onExportAll={handleExportAll}
        onExportCurrent={handleExportCurrent}
        onToggleSettings={toggleSettings}
        segmentCount={segments.length}
      />
    </div>
  );
};
