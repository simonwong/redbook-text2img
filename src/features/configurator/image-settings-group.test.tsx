import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { useMarkdownContentStore } from "@/store/markdownContent";
import { ImageSettingsGroup } from "./image-settings-group";

const initialState = useMarkdownContentStore.getInitialState();
const initialContent = initialState.content;
afterEach(() => {
  initialState.content = initialContent;
});

it("正文含本地图片引用时显示图片设置标题和圆角阴影", () => {
  initialState.content = "正文\n\n![配图](image:missing)";
  const html = renderToStaticMarkup(<ImageSettingsGroup />);
  expect(html).toContain('id="image-section-heading">图片设置</h2>');
  expect(html).toContain("圆角");
  expect(html).toContain("阴影");
});

it("正文无图且库为空时不渲染区块", () => {
  expect(renderToStaticMarkup(<ImageSettingsGroup />)).toBe("");
});
