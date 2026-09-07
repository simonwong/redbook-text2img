import { readFile } from "node:fs/promises";
import { expect, type Page, test } from "@playwright/test";
import JSZip from "jszip";

const radiusLabel = /^圆角/;
const shadowLabel = /^阴影/;

async function seed(page: Page, content = "正文前\n\n正文后") {
  await page.addInitScript((markdown) => {
    if (localStorage.getItem("redbook-markdown-content")) {
      return;
    }
    localStorage.setItem(
      "redbook-markdown-content",
      JSON.stringify({
        state: { content: markdown, isChange: true },
        version: 0,
      })
    );
  }, content);
  await page.goto("/");
}

async function upload(page: Page, transparent = false, portrait = false) {
  const data = await page.evaluate(
    ({ alpha, tall }) => {
      const canvas = document.createElement("canvas");
      canvas.width = tall ? 1200 : 2400;
      canvas.height = tall ? 2400 : 1200;
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas 2D unavailable");
      }
      context.fillStyle = "#ed2040";
      context.fillRect(0, 0, canvas.width, canvas.height);
      if (alpha) {
        context.clearRect(0, 0, 200, 200);
      }
      return canvas.toDataURL("image/png").split(",")[1];
    },
    { alpha: transparent, tall: portrait }
  );
  await page.getByRole("button", { exact: true, name: "插入图片" }).click();
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { exact: true, name: "选择本地文件" }).click();
  await (await chooser).setFiles({
    buffer: Buffer.from(data, "base64"),
    mimeType: "image/png",
    name: "配图.png",
  });
  await expect(page.locator(".cm-content")).toContainText("image:");
  const previewButton = page.getByRole("button", { name: "预览图片" });
  if (await previewButton.isVisible()) {
    await previewButton.click();
  }
  await expect(page.locator(".img-preview figure img")).toBeVisible();
}

function redPixels(page: Page, png: Buffer) {
  return page.evaluate(async (base64) => {
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
      throw new Error("Canvas 2D unavailable");
    }
    context.drawImage(bitmap, 0, 0);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 210 && data[i + 1] < 65 && data[i + 2] < 100) {
        count += 1;
      }
    }
    bitmap.close();
    return count;
  }, png.toString("base64"));
}

async function download(page: Page, name: string) {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { exact: true, name }).click();
  const path = await (await pending).path();
  if (!path) {
    throw new Error("Download missing");
  }
  return readFile(path);
}

test("本地上传居中等比、压缩持久化、单张与批量导出均包含像素，撤销一步恢复", async ({
  page,
}) => {
  await seed(page);
  const editor = page.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("ControlOrMeta+End");
  await upload(page);
  const img = page.locator(".img-preview figure img");
  await expect(img).toHaveCSS("max-height", "250px");
  const info = await img.evaluate(async (element: HTMLImageElement) => {
    await element.decode();
    const blob = await (await fetch(element.src)).blob();
    const figure = element.parentElement;
    if (!figure) {
      throw new Error("Image figure missing");
    }
    const box = element.getBoundingClientRect();
    const parent = figure.getBoundingClientRect();
    return {
      centered: Math.abs(box.x + box.width / 2 - parent.x - parent.width / 2),
      height: element.naturalHeight,
      ratio: box.width / box.height,
      type: blob.type,
      width: element.naturalWidth,
    };
  });
  expect(info).toMatchObject({
    height: 1000,
    ratio: 2,
    type: "image/jpeg",
    width: 2000,
  });
  expect(info.centered).toBeLessThan(1);
  expect(await redPixels(page, await download(page, "导出"))).toBeGreaterThan(
    50_000
  );
  await page.getByRole("button", { exact: true, name: "撤销" }).click();
  await expect(editor).not.toContainText("image:");
  await expect(editor).toContainText("正文前");
  await expect(editor).toContainText("正文后");
  await expect(img).toHaveCount(0);
  await editor.click();
  await page.keyboard.press("ControlOrMeta+Shift+z");
  await expect(img).toBeVisible();
  const markdown = await editor.innerText();
  await editor.fill(`${markdown}\n\n---\n\n${markdown}`);
  const zip = await JSZip.loadAsync(await download(page, "全部"));
  const images = Object.values(zip.files).filter((file) =>
    file.name.endsWith(".png")
  );
  expect(images).toHaveLength(2);
  await Promise.all(
    images.map(async (file) => {
      expect(
        await redPixels(page, await file.async("nodebuffer"))
      ).toBeGreaterThan(50_000);
    })
  );
  await page.reload();

  await expect(img).toBeVisible();
  expect(await redPixels(page, await download(page, "导出"))).toBeGreaterThan(
    50_000
  );
});

test("透明 PNG 保留透明像素，IndexedDB 不可用时会话回退并提示", async ({
  page,
}) => {
  await page.addInitScript(() => {
    IDBFactory.prototype.open = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await seed(page);
  await upload(page, true);
  await expect(page.getByRole("status")).toContainText("图片仅在本次会话保留");
  const image = page.locator(".img-preview img");
  const result = await image.evaluate(async (element: HTMLImageElement) => {
    const blob = await (await fetch(element.src)).blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D unavailable");
    }
    context.drawImage(bitmap, 0, 0);
    const [, , , alpha] = context.getImageData(10, 10, 1, 1).data;
    bitmap.close();
    return { alpha, type: blob.type };
  });
  expect(result).toEqual({ alpha: 0, type: "image/png" });
  expect(await redPixels(page, await download(page, "导出"))).toBeGreaterThan(
    50_000
  );
  await page.reload();
  await expect(page.locator(".img-preview")).toContainText(
    "图片未找到：内容图片"
  );
});

test("悬空与未导入引用显示说明占位，混排不生成非法块级嵌套", async ({
  page,
}) => {
  await seed(
    page,
    "![丢失的截图](image:missing)\n\n文字 ![外链](https://example.invalid/a.png) 后文"
  );
  await expect(page.locator(".img-preview figure")).toContainText(
    "图片未找到：丢失的截图"
  );
  await expect(page.locator(".img-preview p")).toContainText(
    "图片未导入，请先上传本地图片：外链"
  );
  await expect(
    page.locator(".img-preview img, .img-preview p figure")
  ).toHaveCount(0);
  expect((await download(page, "导出")).byteLength).toBeGreaterThan(1000);
});

test("移动端本地上传竖图，等比限高并可导出", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await seed(page);
  await upload(page, false, true);
  const geometry = await page
    .locator(".img-preview img")
    .evaluate((element: HTMLImageElement) => ({
      height: element.offsetHeight,
      width: element.offsetWidth,
    }));
  expect(geometry).toEqual({ height: 250, width: 125 });
  expect(await redPixels(page, await download(page, "导出"))).toBeGreaterThan(
    50_000
  );
});

test("图片加载挤出正文后更新溢出提示", async ({ page }) => {
  await seed(page, "正文段落。\n\n".repeat(7));
  const warning = page.getByText("以下内容导出时被截断，用 --- 分页", {
    exact: true,
  });
  await expect(warning).toHaveCount(0);
  await upload(page, false, true);
  await expect(warning).toBeVisible();
});

test("导出等待图片 decode 完成后才生成 PNG", async ({ page }) => {
  await seed(page);
  await upload(page);
  await page.evaluate(() => {
    const original = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = async function decode() {
      document.documentElement.dataset.decodeWaiting = "true";
      await new Promise<void>((resolve) => {
        document.addEventListener("release-image-decode", () => resolve(), {
          once: true,
        });
      });
      return original.call(this);
    };
  });
  let downloaded = false;
  page.once("download", () => {
    downloaded = true;
  });
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { exact: true, name: "导出" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-decode-waiting",
    "true"
  );
  expect(downloaded).toBe(false);
  await page.evaluate(() =>
    document.dispatchEvent(new Event("release-image-decode"))
  );
  const path = await (await pending).path();
  if (!path) {
    throw new Error("Download missing");
  }
  expect(await redPixels(page, await readFile(path))).toBeGreaterThan(50_000);
});

async function expectImageExportParity(page: Page) {
  const card = page.locator(".img-preview");
  const points = await card.evaluate((element) => {
    const image = element.querySelector("img");
    if (!image) {
      throw new Error("Content image missing");
    }
    const frame = element.getBoundingClientRect();
    const box = image.getBoundingClientRect();
    const scale = box.width / image.offsetWidth;
    return [
      [box.x + box.width / 2, box.y + box.height / 2],
      [box.x + 2 * scale, box.y + 2 * scale],
      [box.x + box.width / 2, box.bottom + 5 * scale],
    ].map(([x, y]) => [
      (x - frame.x) / frame.width,
      (y - frame.y) / frame.height,
    ]);
  });
  const screenshot = await card.screenshot();
  const png = await download(page, "导出");
  expect(await redPixels(page, png)).toBeGreaterThan(50_000);
  const [preview, exported] = await page.evaluate(
    async ({ images, samples }) =>
      Promise.all(
        images.map(async (base64) => {
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
            throw new Error("Canvas 2D unavailable");
          }
          context.drawImage(bitmap, 0, 0);
          const pixels = samples.map(([x, y]) =>
            Array.from(
              context.getImageData(
                Math.floor(x * bitmap.width),
                Math.floor(y * bitmap.height),
                1,
                1
              ).data
            ).slice(0, 3)
          );
          bitmap.close();
          return pixels;
        })
      ),
    {
      images: [screenshot.toString("base64"), png.toString("base64")],
      samples: points,
    }
  );
  expect(exported[0][0]).toBeGreaterThan(210);
  expect(exported[0][1]).toBeLessThan(65);
  expect(exported[1][1]).toBeGreaterThan(150);
  for (const [index, pixel] of preview.entries()) {
    for (const [channel, value] of pixel.entries()) {
      expect(
        Math.abs(value - exported[index][channel]),
        JSON.stringify({ channel, exported, index, points, preview })
      ).toBeLessThan(20);
    }
  }
}

test("图片设置随正文显隐，圆角阴影即时预览、导出并持久化", async ({ page }) => {
  await page.setViewportSize({ height: 1000, width: 1440 });
  await seed(page);
  await page.getByRole("button", { name: "设置样式" }).click();
  const group = page.getByRole("region", { exact: true, name: "图片" });
  await expect(group).toHaveCount(0);
  await upload(page);
  await expect(group).toBeVisible();
  const radius = group.getByRole("group", { name: radiusLabel });
  const shadow = group.getByRole("group", { name: shadowLabel });
  const img = page.locator(".img-preview figure img");
  await radius.getByText("无", { exact: true }).click();
  await shadow.getByText("无", { exact: true }).click();
  await expect(img).toHaveCSS("border-radius", "0px");
  await expect(img).toHaveCSS("box-shadow", "none");
  await radius.getByText("大", { exact: true }).click();
  await shadow.getByText("重", { exact: true }).click();
  await expect(img).toHaveCSS("border-radius", "20px");
  await expect(img).toHaveCSS(
    "box-shadow",
    "rgba(27, 37, 64, 0.24) 0px 6px 20px 0px"
  );
  await expectImageExportParity(page);
  const editor = page.locator(".cm-content");
  const markdown = await editor.innerText();
  await editor.fill("无图正文");
  await expect(group).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: "设置样式" }).click();
  await expect(group).toHaveCount(0);
  await editor.fill(markdown);
  await expect(group).toBeVisible();
  await expect(radius.getByLabel("大", { exact: true })).toBeChecked();
  await expect(shadow.getByLabel("重", { exact: true })).toBeChecked();
  await expect(img).toHaveCSS("border-radius", "20px");
  await expect(img).toHaveCSS(
    "box-shadow",
    "rgba(27, 37, 64, 0.24) 0px 6px 20px 0px"
  );
  await editor.fill(`# 配图封面\n\n${markdown}`);
  await expect(img).toHaveCSS("border-radius", "20px");
  await expect(img).toHaveCSS(
    "box-shadow",
    "rgba(27, 37, 64, 0.24) 0px 6px 20px 0px"
  );
});
