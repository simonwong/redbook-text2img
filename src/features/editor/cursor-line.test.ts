import { expect, it, vi } from "vitest";
import { readCursorLine } from "./cursor-line";

it("选区变化复用全文，文档变化刷新全文与行文本", () => {
  const serialize = vi.fn(() => "第一行\n第二行");
  const state = {
    doc: { lineAt: () => ({ text: "第二行" }), toString: serialize },
    selection: { main: { head: 4 } },
  };
  const first = readCursorLine(null, state, true, false);
  const selection = readCursorLine(first, state, false, true);
  expect(selection).toEqual({
    cursorPos: 4,
    doc: "第一行\n第二行",
    text: "第二行",
    userEvent: true,
  });
  expect(serialize).toHaveBeenCalledTimes(1);
  serialize.mockReturnValue("新正文");
  expect(readCursorLine(selection, state, true, true).doc).toBe("新正文");
});
