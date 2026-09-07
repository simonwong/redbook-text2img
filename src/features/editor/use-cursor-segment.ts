import { useEffect, useRef } from "react";
import { usePreviewNavigationStore } from "@/store/preview-navigation";

import type { CursorLine } from "./use-cursor-line";

const SEPARATOR_PATTERN = /^-{3,}$/;

function computeSegmentIndex(doc: string, cursorPos: number): number {
  const lines = doc.split("\n");
  let charCount = 0;
  let segmentIndex = 0;
  let hasContentSinceLastSep = false;

  for (const line of lines) {
    if (charCount >= cursorPos) {
      break;
    }

    const trimmed = line.trim();

    if (trimmed.match(SEPARATOR_PATTERN)) {
      if (hasContentSinceLastSep) {
        segmentIndex += 1;
        hasContentSinceLastSep = false;
      }
    } else if (trimmed) {
      hasContentSinceLastSep = true;
    }

    charCount += line.length + 1;
  }

  return segmentIndex;
}

export function useCursorSegment(cursor: CursorLine | null) {
  const initialized = useRef(false);
  const setActiveSegmentIndex = usePreviewNavigationStore(
    (s) => s.setActiveSegmentIndex
  );
  useEffect(() => {
    if (!cursor) {
      return;
    }
    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref 在后续光标更新的 effect 中保留 true。
    if (!initialized.current) {
      // 初次读取光标不能覆盖用户在编辑器加载期间选择的预览页。
      initialized.current = true;
      return;
    }
    const timer = setTimeout(() => {
      setActiveSegmentIndex(computeSegmentIndex(cursor.doc, cursor.cursorPos));
    }, 150);
    return () => clearTimeout(timer);
  }, [cursor, setActiveSegmentIndex]);
}
