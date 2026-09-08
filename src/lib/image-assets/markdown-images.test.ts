import { expect, it } from "vitest";
import {
  findRemoteImage,
  replaceRemoteImage,
  unusedImageIds,
} from "./markdown-images";

it("定位返回可替换地址范围，忽略普通链接与代码", () => {
  expect(
    findRemoteImage(
      '![图](<https://images.example/a b.png> "标题")',
      "https://images.example/a%20b.png"
    )
  ).toEqual({ from: 6, to: 36 });
  expect(
    findRemoteImage(
      "[图](https://images.example/a.png)\n\n`![图](https://images.example/a.png)`",
      "https://images.example/a.png"
    )
  ).toBeNull();
});

it("代码说明中的右括号导致定位歧义时保留原文", () => {
  const markdown =
    '前文\n\n![a `]` b](https://images.example/a.png "标题")\n\n后文';
  expect(
    replaceRemoteImage(markdown, "https://images.example/a.png", "image:local")
  ).toBe(markdown);
});

it.each([
  [
    "https://images.example/图片.png",
    "https://images.example/%E5%9B%BE%E7%89%87.png",
  ],
  ["<https://images.example/a b.png>", "https://images.example/a%20b.png"],
])("按预览归一化地址改写 %s", (raw, url) => {
  expect(replaceRemoteImage(`![说明](${raw} "标题")`, url, "image:local")).toBe(
    `![说明](${raw.startsWith("<") ? "<image:local>" : "image:local"} "标题")`
  );
});

it("按全文 URL 改写第一条图片地址，保留分页、alt、title 与其他引用", () => {
  const markdown =
    '# 封面\n\n---\n\n`![代码](https://images.example/a.png)`\n\n![说明](https://images.example/a.png "标题")\n\n![重复](https://images.example/a.png)';
  expect(
    replaceRemoteImage(markdown, "https://images.example/a.png", "image:local")
  ).toBe(
    '# 封面\n\n---\n\n`![代码](https://images.example/a.png)`\n\n![说明](image:local "标题")\n\n![重复](https://images.example/a.png)'
  );
});

it("支持括号、尖括号、转义与嵌套说明；链接、代码与已删引用不改", () => {
  expect(
    replaceRemoteImage(
      '![外[内]](<https://images.example/a(b).png> "标题")',
      "https://images.example/a(b).png",
      "image:local"
    )
  ).toBe('![外[内]](<image:local> "标题")');
  expect(
    replaceRemoteImage(
      "![图](https://images.example/a\\(b\\).png)",
      "https://images.example/a(b).png",
      "image:local"
    )
  ).toBe("![图](image:local)");
  const markdown =
    "[链接](https://images.example/a.png)\n\n```md\n![图](https://images.example/a.png)\n```";
  expect(
    replaceRemoteImage(markdown, "https://images.example/a.png", "image:local")
  ).toBe(markdown);
});

it("清理差集保留正文引用（含参数、引用式），忽略代码", () => {
  expect(
    unusedImageIds(
      ["used", "defined", "unused"],
      "![图](image:used?size=s)\n\n![图][ref]\n\n[ref]: image:defined\n\n`![代码](image:unused)`"
    )
  ).toEqual(["unused"]);
});
