import { expect, type Page, test } from "@playwright/test";

// 扁平面板：只有「主题」是可见标题，其余分组只保留 sr-only 语义
const groupNames = [
  "主题",
  "背景",
  "排版",
  "正文标题",
  "封面",
  "颜色",
  "卡片标记",
];
const fieldLabels = [
  "背景",
  "比例",
  "边框",
  "密度",
  "字体",
  "标题对齐",
  "封面版式",
  "强调色",
];

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

test("1200px 使用内嵌设置且面板为扁平字段行", async ({ page }) => {
  await resetState(page);
  await page.setViewportSize({ height: 900, width: 1200 });
  await page.goto("/");
  await page.getByRole("button", { name: "设置样式" }).click();

  await expect(page.getByRole("dialog", { name: "样式设置" })).toHaveCount(0);

  const settingsPanel = page
    .locator("div.ds-panel")
    .filter({ hasText: "样式设置" })
    .last();
  const themeSection = page.getByRole("region", { name: "主题" });
  // 分组语义以 sr-only 标签保留，读屏仍可按 region 导航
  for (const name of groupNames) {
    await expect(page.getByRole("region", { name })).toHaveCount(1);
  }
  // 面板里可见标题只有「主题」一个（sr-only 标题被裁剪到 1px）
  const visibleHeadings = await settingsPanel
    .getByRole("heading", { level: 2 })
    .evaluateAll((headings) =>
      headings
        .filter((heading) => heading.getBoundingClientRect().width > 1)
        .map((heading) => heading.textContent?.trim())
    );
  expect(visibleHeadings).toEqual(["主题"]);

  // 每个配置各占一行，控件由行标签命名
  await Promise.all(
    fieldLabels.map((label) =>
      expect(page.getByRole("group", { name: label })).toHaveCount(1)
    )
  );

  // 「恢复主题配置」在主题标题行右侧，无修改时不可用
  const resetTheme = themeSection.getByRole("button", { name: "恢复主题配置" });
  await expect(resetTheme).toBeDisabled();

  // 署名用占位文字表意，页码是带文字的开关
  await expect(page.getByPlaceholder("署名")).toBeVisible();
  await expect(page.getByRole("switch", { name: "正文页码" })).toBeChecked();

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
  // 等待面板最后一行控件渲染完成再测量
  await expect(page.getByRole("switch", { name: "正文页码" })).toBeAttached();

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
  await expectNoVerticalOverflow();
});

test("行标签承载修改标记与单项恢复，主题标题行恢复整套配置", async ({
  page,
}) => {
  await resetState(page);
  await page.setViewportSize({ height: 900, width: 1200 });
  await page.goto("/");
  await page.getByRole("button", { name: "设置样式" }).click();

  const resetTheme = page
    .getByRole("region", { name: "主题" })
    .getByRole("button", { name: "恢复主题配置" });
  const resetDensity = page.getByRole("button", {
    name: "密度已调整，恢复主题值",
  });

  await expect(resetTheme).toBeDisabled();
  await expect(resetDensity).toHaveCount(0);

  await page.locator("label", { hasText: "宽松" }).first().click();
  await expect(page.getByRole("radio", { name: "宽松" })).toBeChecked();
  await expect(resetTheme).toBeEnabled();
  await expect(resetDensity).toBeVisible();

  // 单项恢复只影响这一行
  await page.locator("label", { hasText: "左对齐" }).first().click();
  await resetDensity.click();
  await expect(resetDensity).toHaveCount(0);
  await expect(page.getByRole("radio", { name: "左对齐" })).toBeChecked();
  await expect(resetTheme).toBeEnabled();

  // 主题标题行恢复整套配置
  await resetTheme.click();
  await expect(resetTheme).toBeDisabled();
  await expect(page.getByRole("radio", { name: "居中" })).toBeChecked();
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
