import { expect, test } from "@playwright/test";

const linearGradientPattern = /linear-gradient/;
const radialGradientPattern = /radial-gradient/;
const svgDataUriPattern = /url\("data:image\/svg\+xml/;

test("选择受控背景后预览更新且刷新保持", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1200 });
  await page.goto("/");
  // 手动清一次再刷新：addInitScript 会在 reload 时重复执行并清掉已持久化的选择
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "设置样式" }).click();

  const backgroundSection = page.getByRole("region", { name: "背景" });
  await expect(backgroundSection.getByText("内置方案")).toBeVisible();
  await expect(backgroundSection.getByText("渐变")).toBeVisible();
  await expect(backgroundSection.getByText("图案")).toBeVisible();
  const preview = page.locator(".img-preview");

  // 受控渐变：海蓝
  await backgroundSection.getByRole("button", { name: "海蓝" }).click();
  await expect(preview).toHaveCSS("background-image", linearGradientPattern);
  await expect(preview).toHaveCSS("background-size", "cover");

  // 受控图案：圆点（平铺 + 固定尺寸）
  await backgroundSection.getByRole("button", { name: "圆点" }).click();
  await expect(preview).toHaveCSS("background-image", svgDataUriPattern);
  await expect(preview).toHaveCSS("background-repeat", "repeat");
  await expect(preview).toHaveCSS("background-size", "16px 16px");

  // 内置方案：蜜光暖阳
  await backgroundSection.getByRole("button", { name: "蜜光暖阳" }).click();
  await expect(preview).toHaveCSS("background-image", radialGradientPattern);

  // 纯色：默认白色
  await backgroundSection
    .getByRole("button", { name: "纯色", exact: true })
    .click();
  await expect(preview).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(preview).toHaveCSS("background-image", "none");

  // 刷新后选择保持
  await backgroundSection.getByRole("button", { name: "方格" }).click();
  await expect(preview).toHaveCSS("background-repeat", "repeat");
  await page.reload();
  await expect(preview).toHaveCSS("background-image", svgDataUriPattern);
  await page.getByRole("button", { name: "设置样式" }).click();
  await expect(
    page.getByRole("region", { name: "背景" }).getByRole("button", {
      name: "方格",
    })
  ).toHaveAttribute("aria-pressed", "true");
});
