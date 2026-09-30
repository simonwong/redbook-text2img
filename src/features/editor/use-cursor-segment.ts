import { useEffect } from "react";
import { findSeparatorLines } from "@/lib/markdown-parser";
import { usePreviewNavigationStore } from "@/store/preview-navigation";

import type { CursorLine } from "./use-cursor-line";

function computeSegmentIndex(doc: string, cursorPos: number): number {
  const lines = doc.split("\n");
  const separators = findSeparatorLines(lines);
  let charCount = 0;
  let segmentIndex = 0;
  let hasContentSinceLastSep = false;

  for (const [index, line] of lines.entries()) {
    if (charCount >= cursorPos) {
      break;
    }

    if (separators[index]) {
      if (hasContentSinceLastSep) {
        segmentIndex += 1;
        hasContentSinceLastSep = false;
      }
    } else if (line.trim()) {
      hasContentSinceLastSep = true;
    }

    charCount += line.length + 1;
  }

  return segmentIndex;
}

export function useCursorSegment(cursor: CursorLine | null) {
  const setActiveSegmentIndex = usePreviewNavigationStore(
    (s) => s.setActiveSegmentIndex
  );
  useEffect(() => {
    if (!cursor?.userEvent) {
      return;
    }
    const timer = setTimeout(() => {
      setActiveSegmentIndex(computeSegmentIndex(cursor.doc, cursor.cursorPos));
    }, 150);
    return () => clearTimeout(timer);
  }, [cursor, setActiveSegmentIndex]);
}
