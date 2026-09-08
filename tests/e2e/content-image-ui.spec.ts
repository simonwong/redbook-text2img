import { expect, test } from "@playwright/test";

for (const viewport of [
  { height: 900, width: 1400 },
  { height: 844, width: 390 },
]) {
  test(`图片设置独立居末，工具栏紧凑且插图归左 ${viewport.width}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const editor = page.locator(".cm-content");
    await expect(editor).toBeVisible();
    await editor.fill("正文\n\n![配图](image:missing)");
    const insert = page.getByRole("button", { exact: true, name: "插入图片" });
    const formatting = page.locator(".ds-raised").filter({ has: insert });
    await expect(
      formatting.getByRole("button", { exact: true, name: "加粗" })
    ).toHaveCount(1);
    await expect(
      formatting.getByRole("button", { exact: true, name: "撤销" })
    ).toHaveCount(0);
    const actions = page
      .locator(".ds-raised")
      .filter({ has: page.getByRole("button", { exact: true, name: "撤销" }) });
    const bounds = await Promise.all([
      formatting.boundingBox(),
      actions.boundingBox(),
    ]);
    expect(bounds.map((box) => box?.height)).toEqual([36, 36]);
    await insert.click();
    const dialog = page.getByRole("dialog").filter({ hasText: "选择本地文件" });
    await expect(dialog).toBeVisible();
    const popupBounds = await dialog.boundingBox();
    expect(popupBounds).not.toBeNull();
    if (viewport.width === 1400) {
      await expect(dialog).toHaveAttribute("data-align", "start");
      expect(popupBounds?.x).toBeCloseTo(
        (await insert.boundingBox())?.x ?? -1,
        0
      );
    }
    expect(popupBounds?.x).toBeGreaterThanOrEqual(0);
    expect(
      (popupBounds?.x ?? 0) + (popupBounds?.width ?? 0)
    ).toBeLessThanOrEqual(viewport.width);
    await page.keyboard.press("Escape");
    if (viewport.width === 390) {
      await page.getByRole("button", { name: "预览图片" }).click();
    }
    await page.getByRole("button", { name: "设置样式" }).click();
    const section = page.getByRole("region", { exact: true, name: "图片设置" });
    await section.scrollIntoViewIfNeeded();
    await expect(
      section.getByRole("heading", { level: 2, name: "图片设置" })
    ).toBeVisible();
    await expect(section.getByRole("group")).toHaveCount(2);
    await expect(section.locator("xpath=following-sibling::*")).toHaveCount(0);
    const mark = page.getByRole("region", { exact: true, name: "卡片标记" });
    expect(
      await mark.evaluate((element) => Boolean(element.nextElementSibling))
    ).toBe(true);
  });
}
