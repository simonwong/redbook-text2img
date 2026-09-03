import { expect, type Page, test } from "@playwright/test";

const radialGradientPattern = /radial-gradient/;
const diagonalGradientPattern = /linear-gradient\(135deg/;
const horizontalGradientPattern = /linear-gradient\(90deg/;
const nightGradientPattern = /rgb\(15, 23, 42\).+rgb\(30, 58, 95\)/;
const pinkStopPattern = /rgb\(255, 232, 236\)/;
const jpegDataUrlPattern = /url\("data:image\/jpeg/;
const pngFilenamePattern = /\.png$/;

// 1×1 红色 PNG，走真实上传压缩链路
const redPixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
  "base64"
);

const openSettings = async (page: Page) => {
  await page.setViewportSize({ height: 900, width: 1200 });
  await page.goto("/");
  // 手动清一次再刷新：addInitScript 会在 reload 时重复执行并清掉已持久化的选择
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "设置样式" }).click();
};

test("自定义背景：主题背景、纯色、渐变、图片上传并刷新保持", async ({
  page,
}) => {
  await openSettings(page);
  const backgroundSection = page.getByRole("region", { name: "背景" });
  const preview = page.locator(".img-preview");

  // 默认选中主题背景（清新白为 mesh 渐变）
  await expect(
    backgroundSection.getByRole("button", { name: "主题背景" })
  ).toHaveAttribute("aria-pressed", "true");
  await expect(preview).toHaveCSS("background-image", radialGradientPattern);

  // 自定义渐变：双色 + 方向
  await backgroundSection
    .getByRole("button", { exact: true, name: "渐变" })
    .click();
  await expect(preview).toHaveCSS("background-image", diagonalGradientPattern);
  await expect(preview).toHaveCSS("background-size", "cover");
  await backgroundSection
    .getByRole("radio", { name: "左右" })
    .locator("..")
    .click();
  await expect(preview).toHaveCSS(
    "background-image",
    horizontalGradientPattern
  );

  // 预设渐变 chip 直接写入色标
  await backgroundSection
    .getByRole("button", { name: "预设渐变 #0f172a 到 #1e3a5f" })
    .click();
  await expect(preview).toHaveCSS("background-image", nightGradientPattern);

  // 渐变色标共用取色弹层：终点走色板预设
  await backgroundSection.getByRole("button", { name: "渐变终点颜色" }).click();
  await page.getByRole("button", { exact: true, name: "#ffe8ec" }).click();
  await expect(preview).toHaveCSS("background-image", pinkStopPattern);
  await page.keyboard.press("Escape");

  // 纯色：默认白色，调色后跟随
  await backgroundSection
    .getByRole("button", { name: "纯色", exact: true })
    .click();
  await expect(preview).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(preview).toHaveCSS("background-image", "none");

  // 面板内不再有原生取色控件
  await expect(page.locator('input[type="color"]')).toHaveCount(0);

  // 取色弹层：非法十六进制不写入配置，合法值实时生效
  await backgroundSection.getByRole("button", { name: "纯色背景颜色" }).click();
  const hexInput = page.getByRole("textbox", {
    name: "纯色背景颜色十六进制值",
  });
  await hexInput.fill("zzzzzz");
  await hexInput.press("Enter");
  await expect(preview).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await hexInput.fill("111827");
  await hexInput.press("Enter");
  await expect(preview).toHaveCSS("background-color", "rgb(17, 24, 39)");

  // Esc 关闭弹层
  await page.keyboard.press("Escape");
  await expect(hexInput).toBeHidden();

  // 图片：上传后压缩为本地 data URL
  await backgroundSection.locator('input[type="file"]').setInputFiles({
    buffer: redPixelPng,
    mimeType: "image/png",
    name: "pixel.png",
  });
  await expect(preview).toHaveCSS("background-image", jpegDataUrlPattern);
  await expect(preview).toHaveCSS("background-size", "cover");

  // 刷新后图片背景保持，重新打开面板仍选中图片
  await page.reload();
  await expect(preview).toHaveCSS("background-image", jpegDataUrlPattern);
  await page.getByRole("button", { name: "设置样式" }).click();
  await expect(
    page
      .getByRole("region", { name: "背景" })
      .getByRole("button", { name: "图片", exact: true })
  ).toHaveAttribute("aria-pressed", "true");

  // 选回主题背景后恢复主题画布
  await page
    .getByRole("region", { name: "背景" })
    .getByRole("button", { name: "主题背景" })
    .click();
  await expect(preview).toHaveCSS("background-image", radialGradientPattern);
});

test("自定义渐变与图片背景导出 PNG 成功", async ({ page }) => {
  await openSettings(page);
  const backgroundSection = page.getByRole("region", { name: "背景" });
  const preview = page.locator(".img-preview");

  const exportAndExpectPng = async () => {
    const downloadPromise = page.waitForEvent("download", {
      timeout: 30_000,
    });
    await page
      .getByRole("button", { name: "导出", exact: true })
      .first()
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(pngFilenamePattern);
    const path = await download.path();
    const { size } = await import("node:fs/promises").then((fs) =>
      fs.stat(path)
    );
    // 非空图片（空白/失败导出通常只有几 KB）
    expect(size).toBeGreaterThan(10_000);
  };

  await backgroundSection
    .getByRole("button", { exact: true, name: "渐变" })
    .click();
  await expect(preview).toHaveCSS("background-image", diagonalGradientPattern);
  await exportAndExpectPng();

  await backgroundSection.locator('input[type="file"]').setInputFiles({
    buffer: redPixelPng,
    mimeType: "image/png",
    name: "pixel.png",
  });
  await expect(preview).toHaveCSS("background-image", jpegDataUrlPattern);
  await exportAndExpectPng();
});
