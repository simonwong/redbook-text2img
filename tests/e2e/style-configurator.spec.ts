import { expect, type Page, test } from "@playwright/test";

const sectionNames = ["主题", "背景", "排版", "正文标题", "封面", "卡片标记"];

const resetState = async (page: Page) => {
  await page.addInitScript(() => localStorage.clear());
};

const expectNoHorizontalOverflow = async (page: Page) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
};

test("1200px 使用内嵌设置且六组常驻", async ({ page }) => {
  await resetState(page);
  await page.setViewportSize({ height: 900, width: 1200 });
  await page.goto("/");
  await page.getByRole("button", { name: "设置样式" }).click();

  await expect(page.getByRole("dialog", { name: "样式设置" })).toHaveCount(0);
  for (const name of sectionNames) {
    await expect(page.getByRole("region", { name })).toHaveCount(1);
  }
  const firstTheme = page.getByRole("radio", { name: "清新白" });
  await firstTheme.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "三角极简" })).toBeChecked();
  await expectNoHorizontalOverflow(page);
});

test("内嵌设置栏不撑高文档，点击单选控件页面不滚动", async ({ page }) => {
  await resetState(page);
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");
  await page.getByRole("button", { name: "设置样式" }).click();
  // 等待面板最后一组控件渲染完成再测量
  await expect(page.getByRole("radio", { name: "隐藏" })).toBeAttached();

  const expectNoVerticalOverflow = async () => {
    const dimensions = await page.evaluate(() => ({
      innerHeight: window.innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
      scrollY: window.scrollY,
    }));
    expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.innerHeight);
    expect(dimensions.scrollY).toBe(0);
  };

  await expectNoVerticalOverflow();

  // 点击分段控件与字体单选（label 触发，真实用户路径）
  await page.locator("label", { hasText: "宽松" }).first().click();
  await page
    .locator("label", { hasText: "衬线" })
    .filter({ hasNotText: "无衬线" })
    .click();
  await expect(page.getByRole("radio", { name: "宽松" })).toBeChecked();
  await expect(
    page.getByRole("radio", { name: "衬线", exact: true })
  ).toBeChecked();
  // 装饰颜色（先启用标题装饰，再点自定义颜色 label）
  await page.locator("label", { hasText: "波浪" }).click();
  await page
    .locator("label", { has: page.locator('input[type="color"]') })
    .last()
    .click();
  await expectNoVerticalOverflow();
});

for (const width of [768, 1199]) {
  test(`${width}px 使用右侧设置抽屉`, async ({ page }) => {
    await resetState(page);
    await page.setViewportSize({ height: 900, width });
    await page.goto("/");
    await page.getByRole("button", { name: "设置样式" }).click();

    const dialog = page.getByRole("dialog", { name: "样式设置" });
    await expect(dialog).toBeVisible();
    await expect(
      page.getByRole("button", { name: "关闭样式设置" })
    ).toBeFocused();
    await expect
      .poll(async () => {
        const box = await dialog.boundingBox();
        return (box?.x ?? 0) + (box?.width ?? 0);
      })
      .toBeLessThanOrEqual(width + 0.5);
    await expectNoHorizontalOverflow(page);

    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement)
      )
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("button", { name: "设置样式" })).toBeFocused();
  });
}

test.describe("移动端触控", () => {
  test.use({ hasTouch: true });

  test("767px 从预览切换到唯一设置抽屉", async ({ page }) => {
    await resetState(page);
    await page.setViewportSize({ height: 844, width: 767 });
    await page.goto("/");
    await page.getByRole("button", { name: "预览图片" }).tap();
    const settingsEntry = page
      .getByRole("dialog", { name: "图片预览" })
      .getByRole("button", { name: "设置样式" });
    const settingsEntryBox = await settingsEntry.boundingBox();
    expect(settingsEntryBox?.height).toBeGreaterThanOrEqual(44);
    expect(settingsEntryBox?.width).toBeGreaterThanOrEqual(44);
    await settingsEntry.tap();

    const dialog = page.getByRole("dialog", { name: "样式设置" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: "关闭样式设置" })
    ).toBeFocused();
    await expectNoHorizontalOverflow(page);

    const undersizedButtons = await dialog
      .locator("button:visible, label:has(input[type=radio])")
      .evaluateAll((targets) =>
        targets
          .map((target) => {
            const { height, width } = target.getBoundingClientRect();
            return {
              height,
              name: target.getAttribute("aria-label") ?? target.textContent,
              width,
            };
          })
          .filter(({ height, width }) => height < 43.9 || width < 43.9)
      );
    expect(undersizedButtons).toEqual([]);

    await page.getByRole("button", { name: "关闭样式设置" }).tap();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("button", { name: "预览图片" })).toBeFocused();
  });
});
