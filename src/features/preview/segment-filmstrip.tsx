"use client";

import { useEffect, useRef } from "react";
import type { ImageSegment } from "@/lib/markdown-parser";
import { cn } from "@/lib/utils";
import { ImagePreview } from "./image-preview";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
    <div
      className="scrollbar-none flex gap-2 overflow-x-auto px-2 py-2"
      ref={containerRef}
    >
      {segments.map((segment, index) => (
        <button
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
          style={{ width: 48, height: 64 }}
          type="button"
        >
          <div
            className="pointer-events-none origin-top-left"
            style={{
              width: 375,
              height: 500,
              transform: "scale(0.128)",
              transformOrigin: "top left",
            }}
          >
            <ImagePreview segment={segment} />
          </div>
        </button>
      ))}
    </div>
  );
};
