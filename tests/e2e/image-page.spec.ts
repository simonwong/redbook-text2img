import { readFile } from "node:fs/promises";
import { expect, type Page, test } from "@playwright/test";

async function upload(page: Page, aspectRatio = "3:4", cardFrame = "none") {
  await page.addInitScript(
    ({ ratio, frame }) => {
      localStorage.setItem(
        "redbook-markdown-content",
        JSON.stringify({
          state: { content: "正文", isChange: true },
          version: 0,
        })
      );
      localStorage.setItem(
        "redbook-content-theme",
        JSON.stringify({
          state: {
            currentThemeId: "apple-notes",
            overrides: {
              aspectRatio: ratio,
              cardFrame: frame,
              imageRadius: "large",
              imageShadow: "strong",
            },
          },
          version: 6,
        })
      );
      localStorage.setItem(
        "redbook-watermark",
        JSON.stringify({
          state: { showPageNumber: true, signature: "测试署名" },
          version: 0,
        })
      );
    },
    { frame: cardFrame, ratio: aspectRatio }
  );
  await page.goto("/");
  const editor = page.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("ControlOrMeta+End");
  const data = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 600;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas unavailable");
    }
    context.fillStyle = "#ed2040";
    context.fillRect(0, 0, 1200, 600);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  await page.getByRole("button", { exact: true, name: "插入图片" }).click();
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { exact: true, name: "选择本地文件" }).click();
  await (await chooser).setFiles({
    buffer: Buffer.from(data, "base64"),
    mimeType: "image/png",
    name: "图片页.png",
  });
  await expect(page.locator(".img-preview img")).toBeVisible();
  return (
    await editor
      .locator(".cm-line")
      .filter({ hasText: "![内容图片]" })
      .innerText()
  ).trim();
}

for (const [ratio, frame, height] of [
  ["3:4", "none", 500],
  ["1:1", "white", 375],
  ["9:16", "none", 667],
] as const) {
  test(`图片页 ${ratio} ${frame} 满版，PNG 四角与中心保留图片像素`, async ({
    page,
  }) => {
    const reference = await upload(page, ratio, frame);
    await page
      .locator(".cm-content")
      .fill(`---\n${reference.replace(")", "?align=right&size=s)")}\n---`);
    const card = page.locator(".img-preview");
    const img = card.locator("img");
    await expect(img).toHaveCSS("object-fit", "cover");
    await expect(img).toHaveCSS("object-position", "50% 50%");
    await expect(img).toHaveCSS("border-radius", "0px");
    await expect(img).toHaveCSS("box-shadow", "none");
    await expect(card).toHaveCSS("height", `${height}px`);
    await expect(card.locator("figure, svg")).toHaveCount(0);
    const geometry = await img.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const container = element.parentElement?.getBoundingClientRect();
      return {
        height: box.height,
        parentHeight: container?.height,
        parentWidth: container?.width,
        width: box.width,
      };
    });
    expect(geometry.width).toBe(geometry.parentWidth);
    expect(geometry.height).toBe(geometry.parentHeight);
    await expect(card.getByText("测试署名")).toBeVisible();
    await expect(card.getByText("01 / 01")).toBeVisible();
    await expect(card.getByText("测试署名")).toHaveCSS(
      "text-shadow",
      "rgba(0, 0, 0, 0.6) 0px 1px 3px"
    );
    await expect(
      page.getByText("以下内容导出时被截断，用 --- 分页")
    ).toHaveCount(0);
    const screenshot = await card.screenshot();
    const download = page.waitForEvent("download");
    await page.getByRole("button", { exact: true, name: "导出" }).click();
    const path = await (await download).path();
    if (!path) {
      throw new Error("Missing download");
    }
    const png = await readFile(path);
    const pixels = await page.evaluate(
      async (images) =>
        Promise.all(
          images.map(async (base64) => {
            const bitmap = await createImageBitmap(
              new Blob(
                [Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))],
                { type: "image/png" }
              )
            );
            const canvas = document.createElement("canvas");
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              throw new Error("Canvas unavailable");
            }
            ctx.drawImage(bitmap, 0, 0);
            const inset = (bitmap.width * 12) / 375;
            const samples = [
              [inset, inset],
              [bitmap.width - inset, inset],
              [inset, bitmap.height - inset],
              [bitmap.width - inset, bitmap.height - inset],
              [bitmap.width / 2, bitmap.height / 2],
            ].map(([x, y]) =>
              Array.from(
                ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
              )
            );
            bitmap.close();
            return samples;
          })
        ),
      [screenshot.toString("base64"), png.toString("base64")]
    );
    for (const samples of pixels) {
      for (const [r, g, b, a] of samples) {
        expect(Math.abs(r - 237)).toBeLessThan(5);
        expect(Math.abs(g - 32)).toBeLessThan(5);
        expect(Math.abs(b - 64)).toBeLessThan(5);
        expect(a).toBe(255);
      }
    }
  });
}

test("封面标题上方放图仍采用封面布局，隐藏页码", async ({ page }) => {
  const reference = await upload(page);
  await page.locator(".cm-content").fill(`${reference}\n\n# 配图封面\n\n说明`);
  const card = page.locator(".img-preview");
  await expect(card.locator("h1")).toHaveText("配图封面");
  await expect(card.locator("h1")).toHaveCSS("text-align", "center");
  await expect(card.locator("figure img")).toHaveCSS("max-height", "250px");
  await expect(card.getByText("测试署名")).toBeVisible();
  await expect(card.getByText("01 / 01")).toHaveCount(0);
});
