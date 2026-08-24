import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const linearGradientPattern = /linear-gradient/;
const pngFilenamePattern = /\.png$/;
const themeContent = `# 用完整配置做出稳定又漂亮的小红书图片 ✨

一行副标题，也要清晰有力。

---

## 短内容

一句话，也有清楚层次。

---

## 长内容与 Mixed English

普通文本、**重点内容**、*辅助信息* 与 [可靠链接](https://example.com) 都需要清晰可读。

- 视觉层级稳定
- 中文排版自然
- PNG 导出一致

> 复杂背景不能牺牲正文可读性。

使用 \`inline code\` 验证技术内容。`;

const themeProfiles = [
  {
    bodyAlign: "center",
    coverAlign: "center",
    coverVerticalAlign: "center",
    decoration: "none",
    fontSize: "16px",
    name: "清新白",
    surface: "rgba(0, 0, 0, 0)",
  },
  {
    bodyAlign: "left",
    coverAlign: "left",
    coverVerticalAlign: "flex-start",
    decoration: "linear-gradient",
    fontSize: "15px",
    name: "三角极简",
    surface: "rgb(248, 250, 252)",
  },
  {
    bodyAlign: "left",
    coverAlign: "left",
    coverVerticalAlign: "flex-end",
    decoration: "linear-gradient",
    fontSize: "16px",
    name: "墨夜极光",
    surface: "rgba(0, 0, 0, 0)",
  },
  {
    bodyAlign: "center",
    coverAlign: "center",
    coverVerticalAlign: "center",
    decoration: "linear-gradient",
    fontSize: "16px",
    name: "蜜光暖阳",
    surface: "rgb(255, 250, 242)",
  },
] as const;

for (const profile of themeProfiles) {
  test(`${profile.name} 的封面、正文、长短内容和 PNG 一致`, async ({
    page,
  }) => {
    await page.addInitScript((content) => {
      localStorage.clear();
      localStorage.setItem(
        "redbook-markdown-content",
        JSON.stringify({ state: { content, isChange: true }, version: 0 })
      );
    }, themeContent);
    await page.setViewportSize({ height: 900, width: 1200 });
    await page.goto("/");
    await page.getByRole("button", { name: "设置样式" }).click();
    const theme = page.getByRole("radio", { name: profile.name });
    await theme.locator("..").click();
    await expect(theme).toBeChecked();

    const preview = page.locator(".img-preview");
    await expect(preview).toBeVisible();
    await expect(preview).toHaveCSS("font-size", profile.fontSize);
    await expect(preview.locator("h1")).toHaveCSS(
      "text-align",
      profile.coverAlign
    );
    await expect(preview.locator("h1 span")).toHaveCSS(
      "background-image",
      profile.decoration === "none" ? "none" : linearGradientPattern
    );
    await expect(preview.locator(":scope > div > div:first-child")).toHaveCSS(
      "justify-content",
      profile.coverVerticalAlign
    );

    await page.getByRole("button", { name: "第 2 张图片" }).click();
    await expect(preview.locator("h2")).toHaveCSS(
      "text-align",
      profile.bodyAlign
    );

    await page.getByRole("button", { name: "第 3 张图片" }).click();
    const content = preview.locator(":scope > div > div:first-child");
    await expect(content).toHaveCSS("justify-content", "flex-start");
    await expect(preview.locator(":scope > div")).toHaveCSS(
      "background-color",
      profile.surface
    );
    expect(
      await content.evaluate(
        (element) => element.scrollHeight <= element.clientHeight + 1
      )
    ).toBe(true);

    await page.getByRole("button", { name: "关闭样式设置" }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { exact: true, name: "导出" }).click();
    const download = await downloadPromise;
    const downloadPath = await download.path();
    expect(download.suggestedFilename()).toMatch(pngFilenamePattern);
    expect(downloadPath).not.toBeNull();
    if (!downloadPath) {
      return;
    }
    const png = await readFile(downloadPath);
    expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    expect(png.byteLength).toBeGreaterThan(10_000);
  });
}
