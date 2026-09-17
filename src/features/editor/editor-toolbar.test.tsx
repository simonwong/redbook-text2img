import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { EditorToolbar } from "./editor-toolbar";

it("插入图片紧随分割线，位于撤销之前", () => {
  const html = renderToStaticMarkup(<EditorToolbar editorView={null} />);
  expect(html.indexOf('aria-label="插入图片"')).toBeGreaterThan(
    html.indexOf('aria-label="分割线 ---"')
  );
  expect(html.indexOf('aria-label="插入图片"')).toBeLessThan(
    html.indexOf('aria-label="撤销"')
  );
});

it("工具栏上下留白，避免正文贴住操作栏", () => {
  const html = renderToStaticMarkup(<EditorToolbar editorView={null} />);
  expect(html).toContain("py-2.5");
});
