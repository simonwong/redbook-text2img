import type { EditorView } from "@codemirror/view";
import { useEffect, useRef } from "react";
import { usePreviewNavigationStore } from "@/store/preview-navigation";

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
        segmentIndex++;
        hasContentSinceLastSep = false;
      }
    } else if (trimmed) {
      hasContentSinceLastSep = true;
    }

    charCount += line.length + 1;
  }

  return segmentIndex;
}

export function useCursorSegment(editorView: EditorView | null) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevIdxRef = useRef(-1);
  const setActiveSegmentIndex = usePreviewNavigationStore(
    (s) => s.setActiveSegmentIndex
  );

  useEffect(() => {
    if (!editorView) {
      return;
    }

    const syncSegment = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        const cursorPos = editorView.state.selection.main.head;
        const doc = editorView.state.doc.toString();
        const idx = computeSegmentIndex(doc, cursorPos);
        if (idx !== prevIdxRef.current) {
          prevIdxRef.current = idx;
          setActiveSegmentIndex(idx);
        }
      }, 150);
    };

    editorView.dom.addEventListener("keyup", syncSegment);
    editorView.dom.addEventListener("click", syncSegment);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      editorView.dom.removeEventListener("keyup", syncSegment);
      editorView.dom.removeEventListener("click", syncSegment);
    };
  }, [editorView, setActiveSegmentIndex]);
}
