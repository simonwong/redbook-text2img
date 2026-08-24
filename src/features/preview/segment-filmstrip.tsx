"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ImageSegment } from "@/lib/markdown-parser";
import { styleSystem } from "@/lib/style-system/style-system";
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
  const { currentThemeId, configuration } = useContentThemeStore();

  const thumbnailStyle = useMemo(() => {
    const { styles } = styleSystem.resolve(
      { configuration, currentThemeId },
      { page: "body" }
    );
    return {
      backgroundColor: styles.container.backgroundColor,
      backgroundImage: styles.container.backgroundImage,
      backgroundSize: styles.container.backgroundSize,
      color: styles.h1.color,
    };
  }, [configuration, currentThemeId]);

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
    <div className="scrollbar-none flex gap-1.5 overflow-x-auto px-2 py-1 sm:gap-2 sm:py-2">
      {segments.map((segment, index) => (
        <button
          aria-label={`第 ${index + 1} 张图片`}
          aria-pressed={index === activeIndex}
          className={cn(
            "relative size-12 flex-shrink-0 overflow-hidden rounded border-2 transition-all sm:h-16 sm:w-12 sm:rounded-md",
            index === activeIndex
              ? "border-primary shadow-sm"
              : "border-transparent opacity-60 hover:opacity-90"
          )}
          key={segment.id}
          onClick={() => onSelect(index)}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          style={thumbnailStyle}
          type="button"
        >
          <div className="flex h-full items-center justify-center">
            <span className="font-medium text-[10px]">{index + 1}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
