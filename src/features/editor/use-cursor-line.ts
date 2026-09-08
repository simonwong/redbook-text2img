import type { EditorView, ViewUpdate } from "@codemirror/view";
import { ExternalChange } from "@uiw/react-codemirror";
import { useCallback, useEffect, useState } from "react";

export interface CursorLine {
  cursorPos: number;
  doc: string;
  text: string;
  userEvent: boolean;
}

export function useCursorLine(editorView: EditorView | null) {
  const [cursor, setCursor] = useState<CursorLine | null>(null);
  const sync = useCallback((view: EditorView, userEvent: boolean) => {
    const { state } = view;
    const cursorPos = state.selection.main.head;
    setCursor({
      cursorPos,
      doc: state.doc.toString(),
      text: state.doc.lineAt(cursorPos).text,
      userEvent,
    });
  }, []);
  const onUpdate = useCallback(
    (update: ViewUpdate) => {
      if (update.docChanged || update.selectionSet) {
        const userEvent =
          update.transactions.some(
            (tr) =>
              tr.isUserEvent("select") ||
              tr.isUserEvent("input") ||
              tr.isUserEvent("delete")
          ) && !update.transactions.some((tr) => tr.annotation(ExternalChange));
        sync(update.view, userEvent);
      }
    },
    [sync]
  );
  useEffect(() => {
    if (editorView) {
      sync(editorView, false);
    }
  }, [editorView, sync]);
  return { cursor, onUpdate };
}
