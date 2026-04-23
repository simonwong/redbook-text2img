"use client";

import type { EditorView } from "@codemirror/view";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { EditorToolbar } from "./editor-toolbar";
import { MarkdownEditor } from "./markdown-editor";
import { useCursorSegment } from "./use-cursor-segment";

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
