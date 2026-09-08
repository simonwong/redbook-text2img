import type { EditorView, ViewUpdate } from "@codemirror/view";
import { ExternalChange } from "@uiw/react-codemirror";
import { useCallback, useEffect, useState } from "react";

import { type CursorLine, readCursorLine } from "./cursor-line";

export type { CursorLine } from "./cursor-line";

export function useCursorLine(editorView: EditorView | null) {
  const [cursor, setCursor] = useState<CursorLine | null>(null);
  const sync = useCallback(
    (view: EditorView, userEvent: boolean, docChanged: boolean) => {
      const { state } = view;
      setCursor((previous) =>
        readCursorLine(previous, state, docChanged, userEvent)
      );
    },
    []
  );
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
        sync(update.view, userEvent, update.docChanged);
      }
    },
    [sync]
  );
  useEffect(() => {
    if (editorView) {
      sync(editorView, false, true);
    }
  }, [editorView, sync]);
  return { cursor, onUpdate };
}
