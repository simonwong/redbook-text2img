import { readFile } from "node:fs/promises";
import { expect, type Page, test } from "@playwright/test";

const importWord = /导入/g;
const remote = "https://images.example/a.png";
async function open(page: Page) {
  await page.addInitScript((url) => {
    localStorage.setItem(
      "redbook-markdown-content",
      JSON.stringify({
        state: { content: `正文\n\n![远程配图](${url})`, isChange: true },
        version: 0,
      })
    );
  }, remote);
  await page.goto("/");
  await expect(page.locator(".cm-content")).toBeVisible();
}
async function fixture(page: Page) {
  const base64 = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 16;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas unavailable");
    }
    context.fillStyle = "#ed2040";
    context.fillRect(0, 0, 32, 16);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  await page.route("https://images.example/**", (route) =>
    route.fulfill({
      body: Buffer.from(base64, "base64"),
      contentType: "image/png",
    })
  );
}
async function edit(page: Page, markdown: string) {
  await page.locator(".cm-content").fill(markdown);
}

for (const source of [
  "https://images.example/图片.png",
  "<https://images.example/a b.png>",
]) {
  test(`归一化外链可导入并保留说明与标题：${source}`, async ({ page }) => {
    await open(page);
    await fixture(page);
    await edit(page, `正文\n\n![远程配图](${source} "原始标题")`);
    await page
      .locator(".img-preview")
      .getByRole("button", { exact: true, name: "导入" })
      .click();
    await expect(page.locator(".cm-content")).toContainText("image:");
    await expect(page.locator(".cm-content")).toContainText("原始标题");
    await expect(page.locator(".img-preview img")).toBeVisible();
    await expect(page.locator(".img-preview img")).toHaveAttribute(
      "alt",
      "远程配图"
    );
  });
}

test("没有可改写的行内图片时显示原因，不抓取也不入库", async ({ page }) => {
  await open(page);
  await fixture(page);
  await edit(page, `正文\n\n![远程配图][图片]\n\n[图片]: ${remote}`);
  let requests = 0;
  page.on("request", (request) => {
    if (request.url().startsWith("https://images.example/")) {
      requests += 1;
    }
  });
  await page
    .locator(".img-preview")
    .getByRole("button", { exact: true, name: "导入" })
    .click();
  await expect(page.locator(".img-preview").getByRole("alert")).toContainText(
    "未找到可改写的图片引用"
  );
  expect(requests).toBe(0);
  await page.getByRole("button", { name: "设置样式" }).click();
  await expect(
    page.getByRole("button", { exact: true, name: "清理未使用图片" })
  ).toHaveCount(0);
});

test("抓取期间编辑正文后按最新位置改写，保留新增内容", async ({ page }) => {
  await open(page);
  await fixture(page);
  const requested = Promise.withResolvers<void>();
  const release = Promise.withResolvers<void>();
  await page.route(remote, async (route) => {
    requested.resolve();
    await release.promise;
    await route.fallback();
  });
  await page
    .locator(".img-preview")
    .getByRole("button", { exact: true, name: "导入" })
    .click();
  await requested.promise;
  await edit(page, `新增前文\n\n![新说明](${remote} "新标题")\n\n新增后文`);
  release.resolve();
  const editor = page.locator(".cm-content");
  await expect(editor).toContainText("image:");
  await expect(editor).toContainText("新增前文");
  await expect(editor).toContainText("新增后文");
  await expect(editor).toContainText("新标题");
  await expect(page.locator(".img-preview img")).toHaveAttribute(
    "alt",
    "新说明"
  );
});

test("光标在第一页，第三页导入外链后保持第三页，用户点击仍能翻页", async ({
  page,
}) => {
  await page.clock.install();
  await open(page);
  await fixture(page);
  await edit(
    page,
    `第一页\n\n---\n\n第二页\n\n---\n\n第三页\n\n![远程配图](${remote})`
  );
  await page
    .locator(".cm-content")
    .getByText("第一页", { exact: true })
    .click();
  await expect(page.locator(".img-preview")).toContainText("第一页");
  await page.clock.runFor(400);
  await page.getByRole("button", { exact: true, name: "第 3 张图片" }).click();
  const preview = page.locator(".img-preview");
  await expect(preview).toContainText("第三页");
  await preview.getByRole("button", { exact: true, name: "导入" }).click();
  await expect(page.locator(".cm-content")).toContainText("image:");
  await page.clock.runFor(400);
  await expect(preview).toContainText("第三页");
  await expect(preview.locator("img")).toBeVisible();
  await page
    .locator(".cm-content")
    .getByText("第二页", { exact: true })
    .click();
  await page.clock.runFor(400);
  await expect(preview).toContainText("第二页");
});

test("手写外链只显示占位；失败显示原因，重试入库后改写正文并出图", async ({
  page,
}) => {
  await open(page);
  const preview = page.locator(".img-preview");
  await expect(preview).toContainText("图片未导入");
  await expect(preview.locator("img")).toHaveCount(0);
  await page.route("https://images.example/**", (route) => route.abort());
  await page.route("**/api/image-proxy?*", (route) =>
    route.fulfill({ json: { error: "TOO_LARGE" }, status: 413 })
  );
  await preview.getByRole("button", { exact: true, name: "导入" }).click();
  await expect(preview.getByRole("alert")).toContainText("图片过大");
  await expect(page.locator(".cm-content")).toContainText(remote);
  await fixture(page);
  await preview.getByRole("button", { exact: true, name: "导入" }).click();
  await expect(page.locator(".cm-content")).toContainText("image:");
  await expect(page.locator(".cm-content")).not.toContainText(remote);
  await expect(preview.locator("img")).toBeVisible();
  expect(
    await preview
      .locator("img")
      .evaluate((img: HTMLImageElement) => img.naturalWidth)
  ).toBe(32);
});

test("清理列出差集、取消保留资产，确认删除后恢复引用显示缺失占位", async ({
  page,
}) => {
  await open(page);
  await fixture(page);
  await page
    .locator(".img-preview")
    .getByRole("button", { exact: true, name: "导入" })
    .click();
  const editor = page.locator(".cm-content");
  await expect(editor).toContainText("image:");
  const content = await editor.innerText();
  await edit(page, "正文");
  await page.getByRole("button", { name: "设置样式" }).click();
  await page
    .getByRole("button", { exact: true, name: "清理未使用图片" })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "发现 1 张" })
  ).toContainText("多标签页只以当前内容为准");
  await page.getByRole("button", { exact: true, name: "取消" }).click();
  await page.getByRole("button", { exact: true, name: "关闭样式设置" }).click();
  await edit(page, content);
  await expect(page.locator(".img-preview img")).toBeVisible();
  await edit(page, "正文");
  await page.getByRole("button", { name: "设置样式" }).click();
  await page
    .getByRole("button", { exact: true, name: "清理未使用图片" })
    .click();
  await page.getByRole("button", { exact: true, name: "确认清理" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "已清理 1 张图片" })
  ).toBeVisible();
  await page.getByRole("button", { exact: true, name: "知道了" }).click();
  await expect(
    page.getByRole("region", { exact: true, name: "图片" })
  ).toHaveCount(0);
  await page.getByRole("button", { exact: true, name: "关闭样式设置" }).click();
  await edit(page, content);
  await expect(page.locator(".img-preview")).toContainText("图片未找到");
  await expect(page.locator(".img-preview img")).toHaveCount(0);
  await edit(
    page,
    content
      .split("\n")
      .filter((line) => line.startsWith("!["))
      .join("\n")
  );
  const card = page.locator(".img-preview");
  const placeholder = card.getByText("图片未找到", { exact: false });
  await expect(placeholder).toBeVisible();
  const bounds = await placeholder.evaluate((element) => {
    const frame = element.closest(".img-preview");
    if (!frame) {
      throw new Error("Missing card");
    }
    const outer = frame.getBoundingClientRect();
    const inner = element.getBoundingClientRect();
    return { x: inner.x - outer.x, y: inner.y - outer.y };
  });
  await card.screenshot({
    path: test.info().outputPath("missing-image-page.png"),
  });
  expect(bounds.x).toBeGreaterThan(10);
  expect(bounds.y).toBeGreaterThan(10);
});

test("未导入占位随 PNG 导出，操作按钮不进入克隆画布", async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    const painted: string[] = [];
    Object.assign(window, { painted });
    const original = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (
      text,
      x,
      y,
      maxWidth
    ) {
      painted.push(text);
      if (maxWidth === undefined) {
        original.call(this, text, x, y);
      } else {
        original.call(this, text, x, y, maxWidth);
      }
    };
  });
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { exact: true, name: "导出" }).click();
  const path = await (await pending).path();
  if (!path) {
    throw new Error("Download missing");
  }
  const png = await readFile(path);
  expect(png.length).toBeGreaterThan(10_000);
  const painted = await page.evaluate(() =>
    (window as unknown as { painted: string[] }).painted.join("")
  );
  expect(painted).toContain("图片未导入");
  expect(painted).toContain("远程配图");
  expect(painted.match(importWord)).toHaveLength(1);
  await expect(
    page
      .locator(".img-preview")
      .getByRole("button", { exact: true, name: "导入" })
  ).toBeVisible();
});

test("图片分组随正文与资产库显隐，删引用后仅保留清理入口", async ({ page }) => {
  await page.setViewportSize({ height: 1000, width: 1440 });
  await open(page);
  await edit(page, "正文");
  await page.getByRole("button", { name: "设置样式" }).click();
  const group = page.getByRole("region", { exact: true, name: "图片" });
  const cleanup = page.getByRole("button", {
    exact: true,
    name: "清理未使用图片",
  });
  await expect(group).toHaveCount(0);
  await expect(cleanup).toHaveCount(0);
  await fixture(page);
  await edit(page, `正文\n\n![远程配图](${remote})`);
  await expect(group).toHaveCount(0);
  await expect(cleanup).toHaveCount(0);
  await page
    .locator(".img-preview")
    .getByRole("button", { exact: true, name: "导入" })
    .click();
  await expect(page.locator(".cm-content")).toContainText("image:");
  await expect(
    group.getByRole("button", { exact: true, name: "清理未使用图片" })
  ).toBeVisible();
  await expect(group.getByRole("group")).toHaveCount(2);
  await edit(page, "正文");
  await expect(group).toBeVisible();
  await expect(group.getByRole("group")).toHaveCount(0);
  await expect(group.getByRole("button")).toHaveCount(1);
  await cleanup.click();
  await expect(group.getByRole("status")).toContainText("发现 1 张");
  await group.getByRole("button", { exact: true, name: "确认清理" }).click();
  await expect(group.getByRole("status")).toHaveText("已清理 1 张图片");
  await group.getByRole("button", { exact: true, name: "知道了" }).click();
  await expect(group).toHaveCount(0);
  await expect(cleanup).toHaveCount(0);
});
