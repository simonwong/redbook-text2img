import { readFile } from "node:fs/promises";
import { expect, type Page, test } from "@playwright/test";

async function download(page: Page) {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { exact: true, name: "导出" }).click();
  const path = await (await pending).path();
  if (!path) {
    throw new Error("Download missing");
  }
  return readFile(path);
}

function edgeDifference(
  page: Page,
  shadow: Buffer,
  background: Buffer,
  edge: { left: number; right: number; top: number; bottom: number }
) {
  return page.evaluate(
    async ({ first, second, strip }) => {
      const pixels = async (base64: string) => {
        const bitmap = await createImageBitmap(
          new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], {
            type: "image/png",
          })
        );
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas unavailable");
        }
        context.drawImage(bitmap, 0, 0);
        bitmap.close();
        return context.getImageData(0, 0, canvas.width, canvas.height);
      };
      const [a, b] = await Promise.all([pixels(first), pixels(second)]);
      if (a.width !== b.width || a.height !== b.height) {
        throw new Error("Image dimensions differ");
      }
      let sum = 0;
      let count = 0;
      for (
        let y = Math.ceil(strip.top * a.height);
        y < strip.bottom * a.height;
        y += 1
      ) {
        for (
          let x = Math.ceil(strip.left * a.width);
          x < strip.right * a.width;
          x += 1
        ) {
          const offset = (y * a.width + x) * 4;
          for (let channel = 0; channel < 3; channel += 1) {
            sum += Math.abs(
              a.data[offset + channel] - b.data[offset + channel]
            );
            count += 1;
          }
        }
      }
      return sum / count;
    },
    {
      first: shadow.toString("base64"),
      second: background.toString("base64"),
      strip: edge,
    }
  );
}

test("墨夜极光引用块下沿阴影同时出现在预览与三倍 PNG 中", async ({ page }) => {
  await page.setViewportSize({ height: 1000, width: 1440 });
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem(
      "redbook-markdown-content",
      JSON.stringify({
        state: { content: "正文\n\n> 引用", isChange: true },
        version: 0,
      })
    );
  });
  await page.goto("/");
  await expect(page.locator(".cm-content")).toBeVisible();
  await page.getByRole("button", { name: "设置样式" }).click();
  await page
    .getByRole("radio", { exact: true, name: "墨夜极光" })
    .locator("..")
    .click();
  await page.getByRole("button", { exact: true, name: "关闭样式设置" }).click();
  const preview = page.locator(".img-preview");
  const quote = preview.locator("blockquote");
  await expect(quote).toHaveText("引用");
  const screenshot = await preview.screenshot();
  const geometry = await quote.evaluate((element) => {
    const card = element.closest<HTMLElement>(".img-preview");
    if (!card) {
      throw new Error("Preview missing");
    }
    const parent = card.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    const scale = parent.width / card.offsetWidth;
    return {
      edge: {
        bottom: (box.bottom - parent.top + 5 * scale) / parent.height,
        left: (box.left - parent.left + box.width * 0.2) / parent.width,
        right: (box.right - parent.left - box.width * 0.2) / parent.width,
        top: (box.bottom - parent.top + 2 * scale) / parent.height,
      },
    };
  });
  const hideShadow = await page.addStyleTag({
    content: ".img-preview blockquote { box-shadow: none !important; }",
  });
  const backgroundScreenshot = await preview.screenshot();
  await hideShadow.evaluate((element) =>
    element.parentNode?.removeChild(element)
  );
  expect(
    await edgeDifference(page, screenshot, backgroundScreenshot, geometry.edge)
  ).toBeGreaterThan(1);
  const png = await download(page);
  await page.addStyleTag({
    content: ".img-preview blockquote { box-shadow: none !important; }",
  });
  const backgroundPng = await download(page);
  expect(
    await edgeDifference(page, png, backgroundPng, geometry.edge)
  ).toBeGreaterThan(1);
});
