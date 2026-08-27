import { expect, type Page, test } from "@playwright/test";

const resetState = async (page: Page) => {
  await page.addInitScript(() => localStorage.clear());
};

// 卡片不被内层 overflow 裁切：缩放后卡片与直接父级的视觉宽度一致，
// 且完整落在视口内。
const expectCardFullyVisible = async (page: Page) => {
  const card = page.locator(".img-preview");
  await expect(card).toBeVisible();
  const cardBox = await card.boundingBox();
  const innerBox = await card.locator("..").boundingBox();
  const viewport = page.viewportSize();
  if (!(cardBox && innerBox && viewport)) {
    throw new Error("无法测量预览卡片几何信息");
  }
  expect(Math.abs(cardBox.width - innerBox.width)).toBeLessThanOrEqual(1);
  expect(cardBox.x).toBeGreaterThanOrEqual(-0.5);
  expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(viewport.width + 0.5);
};

test("800px 中等宽度预览卡片完整显示", async ({ page }) => {
  await resetState(page);
  await page.setViewportSize({ height: 757, width: 800 });
  await page.goto("/");
  await expectCardFullyVisible(page);
});

test("390px 移动端预览抽屉卡片完整显示", async ({ page }) => {
  await resetState(page);
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");
  await page.getByRole("button", { name: "预览图片" }).click();
  await expect(page.getByRole("dialog", { name: "图片预览" })).toBeVisible();
  await expectCardFullyVisible(page);
});
