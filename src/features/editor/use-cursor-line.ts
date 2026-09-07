import { EditorView } from "@codemirror/view";
import { Compartment, StateEffect } from "@uiw/react-codemirror";
import { useEffect, useState } from "react";

export interface CursorLine {
  cursorPos: number;
  doc: string;
  text: string;
}

export function useCursorLine(editorView: EditorView | null) {
  const [cursor, setCursor] = useState<CursorLine | null>(null);
  useEffect(() => {
    if (!editorView) {
      return;
    }
    const sync = () => {
      const { state } = editorView;
      const cursorPos = state.selection.main.head;
      setCursor({
        cursorPos,
        doc: state.doc.toString(),
        text: state.doc.lineAt(cursorPos).text,
      });
    };
    const compartment = new Compartment();
    editorView.dispatch({
      effects: StateEffect.appendConfig.of(
        compartment.of(
          EditorView.updateListener.of((update) => {
            if (update.docChanged || update.selectionSet) {
              sync();
            }
          })
        )
      ),
    });
    sync();
    return () => {
      editorView.dispatch({ effects: compartment.reconfigure([]) });
    };
  }, [editorView]);
  return cursor;
}
