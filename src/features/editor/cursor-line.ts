export interface CursorLine {
  cursorPos: number;
  doc: string;
  text: string;
  userEvent: boolean;
}
interface CursorState {
  doc: {
    toString: () => string;
    lineAt: (position: number) => { text: string };
  };
  selection: { main: { head: number } };
}
export function readCursorLine(
  previous: CursorLine | null,
  state: CursorState,
  docChanged: boolean,
  userEvent: boolean
): CursorLine {
  const cursorPos = state.selection.main.head;
  return {
    cursorPos,
    doc: docChanged || !previous ? state.doc.toString() : previous.doc,
    text: state.doc.lineAt(cursorPos).text,
    userEvent,
  };
}
