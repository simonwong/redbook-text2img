/** biome-ignore-all lint/performance/noJsxPropsBind: React Compiler caches event handlers. */
"use client";

import { isolateHistory } from "@codemirror/commands";
import type { EditorView } from "@codemirror/view";
import { useId } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { ContentImageReference } from "@/lib/image-reference";
import { imageLine } from "./image-line";

const alignOptions = [
  { label: "靠左", value: "left" },
  { label: "居中", value: "center" },
  { label: "靠右", value: "right" },
];
const sizeOptions = [
  { label: "小", value: "s" },
  { label: "中", value: "m" },
  { label: "大", value: "l" },
  { label: "通栏", value: "full" },
];

export function ImageOptionsRow({
  editorView,
  line,
}: {
  editorView: EditorView | null;
  line: string;
}) {
  const alignId = useId();
  const sizeId = useId();
  const reference = imageLine.read(line);
  if (!(reference && editorView)) {
    return null;
  }
  const update = (
    patch: Partial<Pick<ContentImageReference, "align" | "size">>
  ) => {
    const current = editorView.state.doc.lineAt(
      editorView.state.selection.main.head
    );
    const insert = imageLine.update(current.text, patch);
    if (insert === current.text) {
      return;
    }
    editorView.dispatch({
      annotations: isolateHistory.of("full"),
      changes: { from: current.from, insert, to: current.to },
      selection: { anchor: current.from + insert.length },
      userEvent: "input.image-options",
    });
  };
  return (
    <section
      aria-label="图片选项"
      className="flex shrink-0 items-center gap-3 overflow-x-auto px-3 py-2"
    >
      <span className="shrink-0 text-ink-2 text-xs" id={alignId}>
        对齐
      </span>
      <SegmentedControl
        className="shrink-0 flex-nowrap"
        labelledBy={alignId}
        onChange={(align) =>
          update({ align: align as ContentImageReference["align"] })
        }
        options={alignOptions}
        value={reference.align}
      />
      <span className="shrink-0 text-ink-2 text-xs" id={sizeId}>
        尺寸
      </span>
      <SegmentedControl
        className="shrink-0 flex-nowrap"
        labelledBy={sizeId}
        onChange={(size) =>
          update({ size: size as ContentImageReference["size"] })
        }
        options={sizeOptions}
        value={reference.size}
      />
    </section>
  );
}
