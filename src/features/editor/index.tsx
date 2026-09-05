"use client";

import type { EditorView } from "@codemirror/view";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { EditorToolbar } from "./editor-toolbar";
import { useCursorSegment } from "./use-cursor-segment";

const MarkdownEditor = dynamic(
  () =>
    import("./markdown-editor").then((mod) => ({
      default: mod.MarkdownEditor,
    })),
  {
    loading: () => (
      <div className="flex h-full items-center justify-center text-ink-3 text-xs">
        编辑器加载中...
      </div>
    ),
    ssr: false,
  }
);

interface EditorCardProps {
  className?: string;
}

export const EditorCard = ({ className }: EditorCardProps) => {
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useCursorSegment(editorView);

  const handleEditorViewReady = useCallback((view: EditorView) => {
    setEditorView(view);
  }, []);

  return (
    <div
      className={cn(
        "ds-panel flex h-full min-h-0 flex-col overflow-hidden",
        className
      )}
    >
      <EditorToolbar editorView={editorView} />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <MarkdownEditor onEditorViewReady={handleEditorViewReady} />
        <div
          aria-hidden="true"
          className="ds-fade-bottom absolute inset-x-0 bottom-0 h-14"
        />
      </div>
    </div>
  );
};
