"use client";

import type { ImageSegment } from "@/lib/markdown-parser";
import { AutoSplitMeasurer } from "./auto-split-measurer";

interface AutoSplitLayerProps {
  onPages: (segmentId: string, pages: ImageSegment[]) => void;
  segments: ImageSegment[];
}

/** 自动拆分的隐藏层：每个文字分段放一串量高度副本，不可见、不可交互、不进导出 */
export const AutoSplitLayer = ({ onPages, segments }: AutoSplitLayerProps) => (
  <div
    aria-hidden="true"
    className="pointer-events-none invisible absolute top-0 left-0 size-0 overflow-hidden"
    inert
  >
    {segments.map((segment) =>
      segment.isImagePage ? null : (
        <AutoSplitMeasurer
          key={segment.id}
          onPages={onPages}
          rootId={segment.id}
          segment={segment}
        />
      )
    )}
  </div>
);
