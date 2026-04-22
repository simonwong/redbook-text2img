import type { EditorView } from "@codemirror/view";

function wrapSelection(view: EditorView, before: string, after: string) {
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to);

  if (selected.startsWith(before) && selected.endsWith(after)) {
    view.dispatch({
      changes: {
        from,
        to,
        insert: selected.slice(before.length, -after.length || undefined),
      },
    });
  } else {
    view.dispatch({
      changes: { from, to, insert: `${before}${selected}${after}` },
      selection: { anchor: from + before.length, head: to + before.length },
    });
  }
  view.focus();
}

function insertAtLineStart(view: EditorView, prefix: string) {
  const { from } = view.state.selection.main;
  const line = view.state.doc.lineAt(from);
  const lineText = line.text;

  if (lineText.startsWith(prefix)) {
    view.dispatch({
      changes: { from: line.from, to: line.from + prefix.length, insert: "" },
    });
  } else {
    view.dispatch({
      changes: { from: line.from, insert: prefix },
    });
  }
  view.focus();
}

export function toggleBold(view: EditorView) {
  wrapSelection(view, "**", "**");
}

export function toggleItalic(view: EditorView) {
  wrapSelection(view, "*", "*");
}

export function toggleInlineCode(view: EditorView) {
  wrapSelection(view, "`", "`");
}

export function insertHeading(view: EditorView, level: number) {
  const prefix = `${"#".repeat(level)} `;
  const { from } = view.state.selection.main;
  const line = view.state.doc.lineAt(from);
  const headingMatch = line.text.match(/^#{1,6}\s/);

  if (headingMatch) {
    view.dispatch({
      changes: {
        from: line.from,
        to: line.from + headingMatch[0].length,
        insert: prefix,
      },
    });
  } else {
    view.dispatch({
      changes: { from: line.from, insert: prefix },
    });
  }
  view.focus();
}

export function toggleList(view: EditorView) {
  insertAtLineStart(view, "- ");
}

export function toggleBlockquote(view: EditorView) {
  insertAtLineStart(view, "> ");
}

export function insertHorizontalRule(view: EditorView) {
  const { from } = view.state.selection.main;
  const line = view.state.doc.lineAt(from);
  const insertText = line.text.length > 0 ? "\n\n---\n\n" : "---\n\n";

  view.dispatch({
    changes: { from: line.to, insert: insertText },
  });
  view.focus();
}
