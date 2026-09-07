import { describe, expect, it } from "vitest";
import { imageLine } from "./image-line";

describe("图片行选项", () => {
  it("说明与标题中的地址片段不被当成引用改写", () => {
    const line = '![说明\\](image:abc)](image:abc "标题 ](image:abc)")';
    expect(imageLine.update(line, { size: "s" })).toBe(
      '![说明\\](image:abc)](image:abc?size=s "标题 ](image:abc)")'
    );
  });
  it("只替换引用参数，保留说明、标题与空白", () => {
    const line = '  ![说明\\]](<image:abc?align=center&size=full> "标题")  ';
    expect(imageLine.read(line)).toMatchObject({
      align: "center",
      id: "abc",
      size: "full",
    });
    const left = imageLine.update(line, { align: "left" });
    expect(imageLine.update(left, { size: "s" })).toBe(
      '  ![说明\\]](<image:abc?align=left&size=s> "标题")  '
    );
    expect(
      imageLine.update(imageLine.update(left, { size: "s" }), {
        align: "center",
        size: "full",
      })
    ).toBe('  ![说明\\]](<image:abc> "标题")  ');
  });
  it.each([
    "文字",
    "正文 ![图](image:abc)",
    "![图](https://example.com/a.png)",
    "`![图](image:abc)`",
    "![一](image:a) ![二](image:b)",
  ])("非独立资产图片行不提供选项：%s", (line) => {
    expect(imageLine.read(line)).toBeNull();
    expect(imageLine.update(line, { size: "s" })).toBe(line);
  });
});
