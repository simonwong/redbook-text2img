import { expect, type Locator, type Page, test } from "@playwright/test";

const themeNames = [
  "清新白",
  "三角极简",
  "墨夜极光",
  "蜜光暖阳",
  "晨雾微光",
  "樱花奶霜",
  "阅读模式",
  "Apple 备忘录",
] as const;

const releaseContent = `# 很长的中文 English 标题，也能稳定换行 ✨

封面副标题

---

## 正文页

短内容。`;

const overflowingContent = `# 溢出检查

封面

---

## 超长正文

${"中文、English 与 emoji ✨ 内容必须提示分页。\n\n".repeat(80)}`;

const resetState = async (page: Page, content: string) => {
  await page.addInitScript((markdown) => {
    localStorage.clear();
    localStorage.setItem(
      "redbook-markdown-content",
      JSON.stringify({
        state: { content: markdown, isChange: true },
        version: 0,
      })
    );
  }, content);
};

const selectTheme = async (page: Page, name: string): Promise<Locator> => {
  const radio = page.getByRole("radio", { name });
  const card = radio.locator("..");
  await card.click();
  await expect(radio).toBeChecked();
  return card;
};

test("8 个真实主题缩略图使用同一配置链并暴露明确状态", async ({ page }) => {
  await resetState(page, releaseContent);
  await page.setViewportSize({ height: 900, width: 1200 });
  await page.goto("/");
  await page.getByRole("button", { name: "设置样式" }).click();

  const themeRegion = page.getByRole("region", { name: "主题" });
  const themeGroup = themeRegion.getByRole("group", { name: "主题" });
  await expect(themeGroup.getByRole("radio")).toHaveCount(8);
  await expect(themeRegion.locator("fieldset")).toHaveCount(1);

  for (const name of themeNames) {
    const card = await selectTheme(page, name);
    await expect(page.getByRole("radio", { name })).toHaveAccessibleDescription(
      "当前主题"
    );
    await expect(card.getByText("当前主题", { exact: true })).toBeVisible();
    await expect(themeGroup.getByText("当前主题", { exact: true })).toHaveCount(
      1
    );

    const evidence = await card.evaluate((element) => {
      const preview = document.querySelector<HTMLElement>(".img-preview");
      const previewInner = preview?.lastElementChild as HTMLElement | null;
      const previewContent =
        previewInner?.firstElementChild as HTMLElement | null;
      const previewTitle = preview?.querySelector<HTMLElement>("h1");
      const thumbnail = element.querySelector<HTMLElement>(
        "[data-theme-thumbnail]"
      );
      const thumbnailTitle =
        element.querySelector<HTMLElement>("[data-theme-title]");
      if (
        !(
          preview &&
          previewInner &&
          previewContent &&
          previewTitle &&
          thumbnail &&
          thumbnailTitle
        )
      ) {
        throw new Error("Missing theme preview evidence");
      }

      const cardStyle = getComputedStyle(element);
      const previewStyle = getComputedStyle(preview);
      const thumbnailStyle = getComputedStyle(thumbnail);
      const innerStyle = getComputedStyle(previewInner);
      const titleStyle = getComputedStyle(thumbnailTitle);
      const previewTitleStyle = getComputedStyle(previewTitle);
      const contentStyle = getComputedStyle(previewContent);

      return {
        background: [
          cardStyle.backgroundColor,
          cardStyle.backgroundImage,
          cardStyle.backgroundPosition,
          cardStyle.backgroundSize,
        ],
        coverAlign: [
          thumbnail.dataset.coverAlign,
          contentStyle.alignItems,
          thumbnail.dataset.coverVertical,
          contentStyle.justifyContent,
        ],
        density: [thumbnail.dataset.density, previewStyle.fontSize],
        hasHeader: [
          Boolean(element.querySelector("[data-theme-header]")),
          preview.firstElementChild?.getAttribute("aria-hidden") === "true",
        ],
        previewBackground: [
          previewStyle.backgroundColor,
          previewStyle.backgroundImage,
          previewStyle.backgroundPosition,
          previewStyle.backgroundSize,
        ],
        previewSurface: [
          innerStyle.backgroundColor,
          innerStyle.backgroundImage,
          innerStyle.backgroundPosition,
          innerStyle.backgroundSize,
        ],
        previewTitle: [
          previewTitleStyle.color,
          previewTitleStyle.fontFamily,
          previewTitleStyle.fontWeight,
          previewTitleStyle.backgroundImage,
          previewTitleStyle.textAlign,
        ],
        surface: [
          thumbnailStyle.backgroundColor,
          thumbnailStyle.backgroundImage,
          thumbnailStyle.backgroundPosition,
          thumbnailStyle.backgroundSize,
        ],
        title: [
          titleStyle.color,
          titleStyle.fontFamily,
          titleStyle.fontWeight,
          titleStyle.backgroundImage,
          titleStyle.textAlign,
        ],
      };
    });

    expect(evidence.background).toEqual(evidence.previewBackground);
    expect(evidence.surface).toEqual(evidence.previewSurface);
    expect(evidence.title).toEqual(evidence.previewTitle);
    expect(evidence.density[0]).toBe(evidence.density[1]);
    expect(evidence.coverAlign[0]).toBe(evidence.coverAlign[1]);
    expect(evidence.coverAlign[2]).toBe(evidence.coverAlign[3]);
    expect(evidence.hasHeader[0]).toBe(evidence.hasHeader[1]);

    const box = await card.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  }

  const currentTheme = page.getByRole("radio", { name: "Apple 备忘录" });
  await currentTheme.focus();
  await page.keyboard.press("ArrowLeft");
  const keyboardTheme = page.getByRole("radio", { name: "阅读模式" });
  const keyboardCard = keyboardTheme.locator("..");
  await expect(keyboardTheme).toBeFocused();
  await expect(keyboardCard).toHaveCSS("outline-style", "solid");
  await expect(keyboardCard).toHaveCSS("outline-width", "2px");

  const currentCard = await selectTheme(page, "Apple 备忘录");
  await page.getByRole("radio", { name: "宽松" }).locator("..").click();
  await expect(currentTheme).toHaveAccessibleDescription("已调整");
  await expect(currentCard.getByText("已调整", { exact: true })).toBeVisible();
  await expect(currentCard.getByText("当前主题", { exact: true })).toHaveCount(
    0
  );
  await page
    .getByRole("button", { name: "恢复“Apple 备忘录”主题配置" })
    .click();
  await expect(currentTheme).toHaveAccessibleDescription("当前主题");
  await expect(
    currentCard.getByText("当前主题", { exact: true })
  ).toBeVisible();
});

test("8 个主题在超长正文上给出不进入导出卡片的分页提示", async ({ page }) => {
  await resetState(page, overflowingContent);
  await page.setViewportSize({ height: 900, width: 1200 });
  await page.goto("/");
  await page.getByRole("button", { name: "第 2 张图片" }).click();
  await page.getByRole("button", { name: "设置样式" }).click();

  const warningText = "内容超出卡片，导出将被截断，用 --- 分页";
  for (const name of themeNames) {
    await selectTheme(page, name);
    await expect(page.getByText(warningText, { exact: true })).toBeVisible();
  }
  await expect(
    page.locator(".img-preview").getByText(warningText, { exact: true })
  ).toHaveCount(0);
});
