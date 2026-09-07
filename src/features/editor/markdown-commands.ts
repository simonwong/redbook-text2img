import { isolateHistory } from "@codemirror/commands";
import type { EditorView } from "@codemirror/view";

const headingPattern = /^#{1,6}\s/;

function wrapSelection(view: EditorView, before: string, after: string) {
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to);

  if (selected.startsWith(before) && selected.endsWith(after)) {
    view.dispatch({
      changes: {
        from,
        insert: selected.slice(before.length, -after.length || undefined),
        to,
      },
    });
  } else {
    view.dispatch({
      changes: { from, insert: `${before}${selected}${after}`, to },
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
      changes: { from: line.from, insert: "", to: line.from + prefix.length },
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
  const headingMatch = line.text.match(headingPattern);

  if (headingMatch) {
    view.dispatch({
      changes: {
        from: line.from,
        insert: prefix,
        to: line.from + headingMatch[0].length,
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

export function insertContentImage(
  view: EditorView,
  source: string | string[],
  range: { from: number; to: number } = view.state.selection.main
) {
  const { from, to } = range;
  const sources = Array.isArray(source) ? source : [source];
  const insert = `\n\n${sources.map((url) => `![内容图片](${url})`).join("\n\n")}\n\n`;
  view.dispatch({
    annotations: isolateHistory.of("full"),
    changes: { from, insert, to },
    selection: { anchor: from + insert.length },
    userEvent: "input.image",
  });
  view.focus();
}
