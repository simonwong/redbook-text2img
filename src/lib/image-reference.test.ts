import { describe, expect, it } from "vitest";
import { imageReference } from "./image-reference";

describe("内容图片引用", () => {
  it("格式化与解析逐图参数往返，缺失或非法参数回落默认值", () => {
    const reference = { align: "right", id: "asset-1", size: "m" } as const;
    expect(imageReference.format(reference)).toBe(
      "image:asset-1?align=right&size=m"
    );
    expect(imageReference.parse(imageReference.format(reference))).toEqual(
      reference
    );
    expect(imageReference.parse("image:asset-1?align=bad&size=huge")).toEqual({
      align: "center",
      id: "asset-1",
      size: "full",
    });
    expect(imageReference.parse("image:asset-1")).toEqual({
      align: "center",
      id: "asset-1",
      size: "full",
    });
    for (const input of [
      "image:",
      "https://example.com/a.png",
      "image:../a",
      "image:a#b",
    ]) {
      expect(imageReference.parse(input)).toBeNull();
    }
  });
});

it("识别真实图片并提取去重资产 id，忽略代码和普通链接", () => {
  const markdown =
    "![图](image:a)\n\n![重复](image:a?size=s)\n\n![引用][asset]\n\n[asset]: image:b\n\n`![代码](image:c)`\n\n```md\n![代码](image:d)\n```\n\n[链接](image:e)";
  expect(imageReference.ids(markdown)).toEqual(["a", "b"]);
  expect(imageReference.hasImages(markdown)).toBe(true);
  expect(imageReference.hasImages("![外链](https://example.com/a.png)")).toBe(
    true
  );
  expect(
    imageReference.hasImages("`![代码](image:a)`\n\n[链接](image:b)")
  ).toBe(false);
});

it.each([
  ["center", "full", "image:a1b2c3d4e5"],
  ["left", "full", "image:a1b2c3d4e5?align=left"],
  ["center", "s", "image:a1b2c3d4e5?size=s"],
  ["right", "l", "image:a1b2c3d4e5?align=right&size=l"],
] as const)("格式化省略默认参数：%s / %s", (align, size, expected) => {
  const reference = { align, id: "a1b2c3d4e5", size };
  expect(imageReference.format(reference)).toBe(expected);
  expect(imageReference.parse(expected)).toEqual(reference);
});

it("兼容显式默认参数和旧资产 id", () => {
  const id = "6b4b2a90-1234-4567-890a-bcdef0123456";
  expect(imageReference.parse(`image:${id}?align=center&size=full`)).toEqual({
    align: "center",
    id,
    size: "full",
  });
  expect(imageReference.parse("image:Legacy_ID-1")).toEqual({
    align: "center",
    id: "Legacy_ID-1",
    size: "full",
  });
});
