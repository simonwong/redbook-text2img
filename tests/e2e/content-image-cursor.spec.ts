import { expect, test } from "@playwright/test";

test("切换两次明暗主题后图片选项与第三页光标追踪仍有效", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => {
    localStorage.setItem("theme", "system");
    localStorage.setItem(
      "redbook-markdown-content",
      JSON.stringify({
        state: {
          content:
            "第一页\n\n![配图](image:missing)\n\n---\n\n第二页\n\n---\n\n第三页",
          isChange: true,
        },
        version: 0,
      })
    );
  });
  await page.clock.install();
  await page.goto("/");
  const editor = page.locator(".cm-content");
  await expect(editor).toBeVisible();
  await page.getByRole("button", { exact: true, name: "跟随系统" }).click();
  await expect(page.locator("html")).toContainClass("light");
  await page.getByRole("button", { exact: true, name: "浅色模式" }).click();
  await expect(page.locator("html")).toContainClass("dark");
  await editor.locator(".cm-line").filter({ hasText: "![配图]" }).click();
  await expect(page.getByRole("region", { name: "图片选项" })).toBeVisible();
  await editor.getByText("第三页", { exact: true }).click();
  await expect(page.locator(".img-preview")).toContainText("第三页");
});

test("切模板更新行文本但不把手动选择的第三页拉回光标页", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  const editor = page.locator(".cm-content");
  await editor.fill("第一页\n\n---\n\n第二页\n\n---\n\n第三页");
  await editor.getByText("第一页", { exact: true }).click();
  await expect(page.locator(".img-preview")).toContainText("第一页");
  await page.clock.runFor(400);
  await page.getByRole("button", { exact: true, name: "第 3 张图片" }).click();
  await page.getByRole("button", { exact: true, name: "模板" }).click();
  await page.getByRole("button", { name: "产品测评" }).click();
  await expect(editor).toContainText("Sony WH-1000XM5");
  await page.clock.runFor(400);
  await expect(
    page.getByRole("button", { exact: true, name: "第 3 张图片" })
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".img-preview")).toContainText("最满意的地方");
});
