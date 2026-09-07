import { expect, it } from "vitest";
import { replaceRemoteImage, unusedImageIds } from "./markdown-images";

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
