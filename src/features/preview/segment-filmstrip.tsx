"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ImageSegment } from "@/lib/markdown-parser";
import {
  applyAdjustments,
  defaultTheme,
  generateStyles,
  getThemeById,
} from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useContentThemeStore } from "@/store/theme";

interface SegmentFilmstripProps {
  activeIndex: number;
  onSelect: (index: number) => void;
  segments: ImageSegment[];
}

export const SegmentFilmstrip = ({
  segments,
  activeIndex,
  onSelect,
}: SegmentFilmstripProps) => {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { currentThemeId, adjustments } = useContentThemeStore();

  const containerStyle = useMemo(() => {
    const theme = getThemeById(currentThemeId) ?? defaultTheme;
    const adjustedStyle = applyAdjustments(theme.style, adjustments);
    return generateStyles(adjustedStyle, {}).container;
  }, [currentThemeId, adjustments]);

  useEffect(() => {
    const activeItem = itemRefs.current[activeIndex];
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex]);

  if (segments.length <= 1) {
    return null;
  }

  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto px-2 py-2">
      {segments.map((segment, index) => (
        <button
          aria-label={`第 ${index + 1} 张图片`}
          className={cn(
            "relative flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
            index === activeIndex
              ? "border-primary shadow-sm"
              : "border-transparent opacity-60 hover:opacity-90"
          )}
          key={segment.id}
          onClick={() => onSelect(index)}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          style={{
            width: 48,
            height: 64,
            background: containerStyle.background as string,
            borderRadius: 6,
          }}
          type="button"
        >
          <div className="flex h-full items-center justify-center">
            <span
              className="font-medium text-[10px]"
              style={{ color: containerStyle.color as string }}
            >
              {index + 1}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
