import { expect, type Page, test } from "@playwright/test";

const paragraph =
  "这是一段用来检查自动拆分的正文，足够长，可以占满好几行，看它会不会换到下一张卡片。";

const longContent = `# 自动拆分

封面

---

## 超长正文

${`${paragraph}\n\n`.repeat(12)}
${Array.from({ length: 12 }, (_, index) => `- 第 ${index + 1} 条：${paragraph}`).join("\n")}

---

## 最后一页

短内容。`;

const pageButtonName = /^第 \d+ 张图片$/;
const warningText = "以下内容导出时被截断，用 --- 分页";

const resetState = async (page: Page, content: string) => {
  await page.addInitScript((markdown) => {
    if (localStorage.getItem("auto-split-seeded")) {
      return;
    }
    localStorage.clear();
    localStorage.setItem("auto-split-seeded", "1");
    localStorage.setItem(
      "redbook-markdown-content",
      JSON.stringify({
        state: { content: markdown, isChange: true },
        version: 0,
      })
    );
  }, content);
};

test("自动拆分默认开启，超长正文续到后面的卡片且不再截断", async ({ page }) => {
  await resetState(page, longContent);
  await page.setViewportSize({ height: 900, width: 1200 });
  await page.goto("/");

  const pages = page.getByRole("button", { name: pageButtonName });
  const toggle = page.getByRole("button", { exact: true, name: "自动拆分" });
  const warning = page.getByText(warningText, { exact: true });
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => pages.count()).toBeGreaterThan(3);
  const total = await pages.count();

  const preview = page.locator(".img-preview");
  await expect(preview).toHaveCount(1);
  for (let index = 0; index < total; index += 1) {
    // biome-ignore lint/performance/noAwaitInLoops: 逐张翻页检查，必须按顺序进行
    await pages.nth(index).click();
    await expect(warning).toHaveCount(0);
  }
  // 手动分页仍然有效：最后一个分段还是单独一张
  await expect(preview).toContainText("最后一页");
  await expect(preview).toContainText(
    `${String(total).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
  );

  // 工具栏开关关掉后回到按 --- 分的 3 张，超长那张给出截断提示
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(pages).toHaveCount(3);
  await page.getByRole("button", { name: "第 2 张图片" }).click();
  await expect(warning).toBeVisible();

  // 偏好会保存，刷新后仍是关闭
  await page.reload();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(pages).toHaveCount(3);

  // 截断提示旁的按钮可以直接重新开启
  await page.getByRole("button", { name: "第 2 张图片" }).click();
  await page.getByRole("button", { name: "开启自动拆分" }).click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(pages).toHaveCount(total);
  await expect(warning).toHaveCount(0);
});
