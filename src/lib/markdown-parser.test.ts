import { describe, expect, it } from "vitest";
import { parseMarkdownToImages } from "./markdown-parser";

describe("图片页判定", () => {
  it("单条内容图片引用忽略空行，保留参数并显示图片页标题", () => {
    const [segment] = parseMarkdownToImages(
      "\n![说明](image:abc?align=left&size=s)\n\n"
    );
    expect(segment).toMatchObject({
      isCover: false,
      isImagePage: true,
      title: "图片页",
    });
    expect(segment.content).toContain("?align=left&size=s");
    expect(segment.image).toEqual({
      alt: "说明",
      source: "image:abc?align=left&size=s",
    });
  });
  it.each([
    "文字\n\n![图](image:abc)",
    "![一](image:abc)\n![二](image:def)",
    "![一](image:abc) ![二](image:def)",
    "![远程](https://example.com/a.png)",
    "`![代码](image:abc)`",
    "```\n![代码](image:abc)\n```",
    "    ![代码](image:abc)",
    "正文 ![图](image:abc)",
  ])("非单图段落仍是正文：%s", (content) => {
    expect(parseMarkdownToImages(content)[0].isImagePage).toBe(false);
  });
  it("分割线两侧独立判定，过滤空段落", () => {
    expect(
      parseMarkdownToImages("---\n![图](image:abc)\n---\n正文\n---").map(
        (segment) => segment.isImagePage
      )
    ).toEqual([true, false]);
  });
});

describe("配图封面", () => {
  it("跳过开头多条图片与空行，提取实际一级标题", () => {
    const content =
      "\n![# 错误标题](image:abc)\n\n![图](image:def?size=s)\n\n# 正确标题\n\n正文";
    const [segment] = parseMarkdownToImages(content);
    expect(segment).toMatchObject({
      isCover: true,
      isFirstImage: true,
      isImagePage: false,
      title: "正确标题",
    });
    expect(segment.content).toContain("![# 错误标题](image:abc)");
  });
  it.each([
    "正文\n# 标题",
    "![外链](https://example.com/a.png)\n# 标题",
    "![图](image:abc)\n## 二级标题",
    "![图](image:abc)\n正文\n# 标题",
  ])("不跳过普通正文或外链：%s", (content) => {
    expect(parseMarkdownToImages(content)[0].isCover).toBe(false);
  });
  it("无前置图片的封面行为不变", () => {
    expect(parseMarkdownToImages("\n# 标题\n正文")[0]).toMatchObject({
      isCover: true,
      title: "标题",
    });
  });
});
