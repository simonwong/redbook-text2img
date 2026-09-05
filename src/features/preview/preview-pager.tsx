"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PreviewPagerProps {
  activeIndex: number;
  onSelect: (index: number) => void;
  segmentIds: readonly string[];
}

const navClassName =
  "flex size-[30px] shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors duration-150 ease-out hover:bg-[var(--ds-well)] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-35";

export const PreviewPager = ({
  activeIndex,
  onSelect,
  segmentIds,
}: PreviewPagerProps) => {
  const segmentCount = segmentIds.length;
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    chipRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeIndex]);

  return (
    <div className="ds-raised flex h-10 max-w-full items-center gap-0.5 rounded-full px-[5px]">
      <button
        aria-label="上一张"
        className={navClassName}
        disabled={activeIndex === 0}
        onClick={() => onSelect(activeIndex - 1)}
        type="button"
      >
        <HugeiconsIcon className="size-[14px]" icon={ArrowLeft01Icon} />
      </button>

      <div className="ds-scrollbar-none ds-fade-x flex min-w-0 items-center gap-0.5 overflow-x-auto">
        {segmentIds.map((segmentId, index) => (
          <button
            aria-label={`第 ${index + 1} 张图片`}
            aria-pressed={index === activeIndex}
            className={cn(
              "flex size-[30px] shrink-0 items-center justify-center rounded-full font-semibold text-[12px] transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
              index === activeIndex
                ? "bg-ink text-[var(--ds-on-ink)] shadow-[0_2px_6px_-2px_rgba(17,17,20,0.35)]"
                : "text-ink-2 hover:bg-[var(--ds-well)] hover:text-ink"
            )}
            key={segmentId}
            onClick={() => onSelect(index)}
            ref={(element) => {
              chipRefs.current[index] = element;
            }}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        aria-label="下一张"
        className={navClassName}
        disabled={activeIndex === segmentCount - 1}
        onClick={() => onSelect(activeIndex + 1)}
        type="button"
      >
        <HugeiconsIcon className="size-[14px]" icon={ArrowRight01Icon} />
      </button>
    </div>
  );
};
