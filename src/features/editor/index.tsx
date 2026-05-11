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
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-muted-foreground/60 text-sm">
        编辑器加载中...
      </div>
    ),
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
    <div className={cn("flex h-full flex-col", className)}>
      <EditorToolbar editorView={editorView} />
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor onEditorViewReady={handleEditorViewReady} />
      </div>
    </div>
  );
};
