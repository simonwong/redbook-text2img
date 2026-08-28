import { readFile } from "node:fs/promises";
import { expect, type Page } from "@playwright/test";

interface NormalizedPoint {
  readonly x: number;
  readonly y: number;
}

interface PixelSample {
  readonly height: number;
  readonly pixels: readonly [number, number, number, number][];
  readonly width: number;
}

export interface ThemeProfile {
  readonly bodyAlign: "center" | "left";
  readonly coverAlign: "center" | "left";
  readonly coverVerticalAlign: "center" | "flex-end" | "flex-start";
  readonly expectedSurface?: readonly [number, number, number];
  readonly fontFamily: RegExp;
  readonly fontSize: string;
  readonly hasHeader?: boolean;
  readonly name: string;
  readonly surface: string;
  readonly tone: "dark" | "light";
}

const pngFilenamePattern = /\.png$/;
const themeContent = `# 用完整配置做出稳定又漂亮的小红书图片 ✨

一行副标题，也要清晰有力。

---

## 短内容

一句话，也有清楚层次。

---

## 长内容与 Mixed English

普通文本、**重点内容**、*辅助信息* 与 [可靠链接](https://example.com) 都需要清晰可读。

- 视觉层级稳定
- 中文排版自然
- PNG 导出一致

> 复杂背景不能牺牲正文可读性。

使用 \`inline code\` 验证技术内容。

---

## 代码、列表与引用

- 中文与 English 混排

> 导出的结构必须稳定。

~~~ts
const ready = true;
~~~`;

const decodePng = async (
  page: Page,
  png: Buffer,
  points: readonly NormalizedPoint[]
): Promise<PixelSample> =>
  page.evaluate(
    async ({ base64, samplePoints }) => {
      const bytes = Uint8Array.from(atob(base64), (value) =>
        value.charCodeAt(0)
      );
      const bitmap = await createImageBitmap(
        new Blob([bytes], { type: "image/png" })
      );
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas 2D context unavailable");
      }
      context.drawImage(bitmap, 0, 0);
      return {
        height: bitmap.height,
        pixels: samplePoints.map(({ x, y }) => {
          const pixel = context.getImageData(
            Math.min(bitmap.width - 1, Math.floor(x * bitmap.width)),
            Math.min(bitmap.height - 1, Math.floor(y * bitmap.height)),
            1,
            1
          ).data;
          return [pixel[0], pixel[1], pixel[2], pixel[3]] as const;
        }),
        width: bitmap.width,
      };
    },
    { base64: png.toString("base64"), samplePoints: points }
  );

const relativeLuminance = (pixel: readonly number[]): number => {
  const channels = pixel.slice(0, 3).map((channel) => {
    const value = channel / 255;
    return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrastRatio = (
  first: readonly number[],
  second: readonly number[]
): number => {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
};

const parseCssColor = (color: string): readonly number[] => {
  const channels = color
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number);
  if (channels?.length !== 3) {
    throw new Error(`Unsupported computed color: ${color}`);
  }
  return channels;
};

const colorDistance = (
  first: readonly number[],
  second: readonly number[]
): number =>
  Math.sqrt(
    first.slice(0, 3).reduce((sum, channel, index) => {
      const difference = channel - second[index];
      return sum + difference * difference;
    }, 0)
  );

const backdropPoints: readonly NormalizedPoint[] = [
  { x: 0.12, y: 0.14 },
  { x: 0.5, y: 0.14 },
  { x: 0.88, y: 0.14 },
  { x: 0.12, y: 0.5 },
  { x: 0.5, y: 0.5 },
  { x: 0.88, y: 0.5 },
  { x: 0.12, y: 0.86 },
  { x: 0.5, y: 0.86 },
  { x: 0.88, y: 0.86 },
];

export const assertThemePreset = async (
  page: Page,
  profile: ThemeProfile
): Promise<void> => {
  await page.addInitScript((content) => {
    localStorage.clear();
    localStorage.setItem(
      "redbook-markdown-content",
      JSON.stringify({ state: { content, isChange: true }, version: 0 })
    );
    localStorage.setItem(
      "redbook-watermark",
      JSON.stringify({
        state: { showPageNumber: true, signature: "@theme-audit" },
        version: 0,
      })
    );
  }, themeContent);
  await page.setViewportSize({ height: 900, width: 1200 });
  await page.goto("/");
  await page.getByRole("button", { name: "设置样式" }).click();
  const theme = page.getByRole("radio", { name: profile.name });
  await theme.locator("..").click();
  await expect(theme).toBeChecked();

  const preview = page.locator(".img-preview");
  const inner = preview.locator(":scope > div:last-child");
  await expect(preview).toBeVisible();
  await expect(preview).toHaveCSS("font-family", profile.fontFamily);
  await expect(preview).toHaveCSS("font-size", profile.fontSize);
  await expect(preview.locator("h1")).toHaveCSS(
    "text-align",
    profile.coverAlign
  );
  await expect(inner.locator(":scope > div:first-child")).toHaveCSS(
    "justify-content",
    profile.coverVerticalAlign
  );
  const header = preview.locator(":scope > div").first();
  if (profile.hasHeader) {
    await expect(header).toHaveAttribute("aria-hidden", "true");
    await expect(header.locator("svg")).toHaveCount(3);
    await expect(header.getByRole("button")).toHaveCount(0);
  } else {
    await expect(header).not.toHaveAttribute("aria-hidden", "true");
  }

  await page.getByRole("button", { name: "第 2 张图片" }).click();
  await expect(preview.locator("h2")).toHaveCSS(
    "text-align",
    profile.bodyAlign
  );

  await page.getByRole("button", { name: "第 3 张图片" }).click();
  const content = inner.locator(":scope > div:first-child");
  await expect(content).toHaveCSS("justify-content", "flex-start");
  await expect(inner).toHaveCSS("background-color", profile.surface);
  expect(
    await content.evaluate(
      (element) => element.scrollHeight <= element.clientHeight + 1
    )
  ).toBe(true);
  await expect(inner.getByText("@theme-audit", { exact: true })).toBeVisible();
  await expect(inner.getByText("03 / 04", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "第 4 张图片" }).click();
  await expect(preview.locator("pre code")).toContainText(
    "const ready = true;"
  );
  expect(
    await content.evaluate(
      (element) => element.scrollHeight <= element.clientHeight + 1
    )
  ).toBe(true);
  await page.getByRole("button", { name: "第 3 张图片" }).click();

  await page.getByRole("button", { name: "关闭样式设置" }).click();
  const { containedPairs, textColors } = await preview.evaluate((element) => {
    const readColor = (selector: string) => {
      const target = element.querySelector(selector);
      if (!target) {
        throw new Error(`Missing semantic element: ${selector}`);
      }
      return getComputedStyle(target).color;
    };
    const innerContainer = element.lastElementChild;
    const footer = innerContainer?.lastElementChild;
    const blockquote = element.querySelector("blockquote");
    const quoteText = blockquote?.querySelector("p");
    const code = element.querySelector("code");
    if (!(footer && blockquote && quoteText && code)) {
      throw new Error("Missing semantic preview content");
    }
    return {
      containedPairs: [
        [
          getComputedStyle(quoteText).color,
          getComputedStyle(blockquote).backgroundColor,
        ],
        [getComputedStyle(code).color, getComputedStyle(code).backgroundColor],
      ],
      textColors: [
        readColor("h2"),
        readColor("p"),
        readColor("strong"),
        readColor("em"),
        readColor("a"),
        getComputedStyle(footer).color,
      ],
    };
  });
  for (const [foreground, background] of containedPairs) {
    expect(
      contrastRatio(parseCssColor(foreground), parseCssColor(background))
    ).toBeGreaterThanOrEqual(4.5);
  }

  await preview.evaluate((element) => {
    const innerContainer = element.lastElementChild;
    if (!innerContainer) {
      throw new Error("Missing preview inner container");
    }
    for (const child of innerContainer.children) {
      (child as HTMLElement).style.visibility = "hidden";
    }
  });
  const backdropPng = await preview.screenshot();
  await preview.evaluate((element) => {
    const innerContainer = element.lastElementChild;
    if (!innerContainer) {
      throw new Error("Missing preview inner container");
    }
    for (const child of innerContainer.children) {
      (child as HTMLElement).style.visibility = "";
    }
  });
  const backdrop = await decodePng(page, backdropPng, backdropPoints);
  for (const color of textColors.map(parseCssColor)) {
    for (const pixel of backdrop.pixels) {
      expect(contrastRatio(color, pixel)).toBeGreaterThanOrEqual(4.5);
    }
  }
  const averageLuminance =
    backdrop.pixels.reduce((sum, pixel) => sum + relativeLuminance(pixel), 0) /
    backdrop.pixels.length;
  if (profile.tone === "dark") {
    expect(averageLuminance).toBeLessThan(0.08);
  } else {
    expect(averageLuminance).toBeGreaterThan(0.65);
  }

  const titlePoint = await preview.evaluate((element) => {
    const title = element.querySelector("h2");
    if (!title) {
      throw new Error("Missing title element");
    }
    // h2 是 100% 宽块级盒，容器几何中心可能落在文字之外（左对齐短行尤其如此），
    // 改取首个文本行的 client rect，其中点必落在标题墨迹内，跨渲染器稳定。
    const range = document.createRange();
    range.selectNodeContents(title);
    const firstLine = range.getClientRects()[0];
    if (!firstLine) {
      throw new Error("Missing title text box");
    }
    const previewRect = element.getBoundingClientRect();
    return {
      x:
        (firstLine.left - previewRect.left + firstLine.width / 2) /
        previewRect.width,
      y:
        (firstLine.top - previewRect.top + firstLine.height / 2) /
        previewRect.height,
    };
  });
  const footerRegions = await preview.evaluate((element) => {
    const previewRect = element.getBoundingClientRect();
    const footer = element.lastElementChild?.lastElementChild;
    const spans = footer?.querySelectorAll(":scope > span");
    if (spans?.length !== 2) {
      throw new Error("Missing signature or page number");
    }
    return Array.from(spans).map((span) => {
      const rect = span.getBoundingClientRect();
      const points: NormalizedPoint[] = [];
      for (let row = 0; row < 8; row += 1) {
        for (let column = 0; column < 20; column += 1) {
          points.push({
            x:
              (rect.left -
                previewRect.left +
                (rect.width * (column + 0.5)) / 20) /
              previewRect.width,
            y:
              (rect.top - previewRect.top + (rect.height * (row + 0.5)) / 8) /
              previewRect.height,
          });
        }
      }
      return { color: getComputedStyle(span).color, points };
    });
  });
  const baseComparisonPoints = [
    { x: 0.02, y: 0.5 },
    { x: 0.06, y: 0.12 },
    { x: 0.5, y: 0.5 },
    { x: 0.88, y: 0.86 },
    titlePoint,
  ] as const;
  const comparisonPoints = [
    ...baseComparisonPoints,
    ...footerRegions.flatMap(({ points }) => points),
  ];
  const previewPng = await preview.screenshot();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { exact: true, name: "导出" }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(download.suggestedFilename()).toMatch(pngFilenamePattern);
  expect(downloadPath).not.toBeNull();
  if (!downloadPath) {
    return;
  }
  const exportedPng = await readFile(downloadPath);
  const [previewSample, exportedSample] = await Promise.all([
    decodePng(page, previewPng, comparisonPoints),
    decodePng(page, exportedPng, comparisonPoints),
  ]);

  expect(exportedSample).toMatchObject({ height: 1500, width: 1125 });
  expect(previewSample.height).toBe(500);
  expect(previewSample.width).toBeGreaterThanOrEqual(375);
  expect(previewSample.width).toBeLessThanOrEqual(376);
  for (const [index, previewPixel] of previewSample.pixels
    .slice(0, baseComparisonPoints.length)
    .entries()) {
    const tolerance = index === baseComparisonPoints.length - 1 ? 105 : 30;
    expect(
      colorDistance(previewPixel, exportedSample.pixels[index])
    ).toBeLessThanOrEqual(tolerance);
  }
  let footerOffset = baseComparisonPoints.length;
  for (const region of footerRegions) {
    const targetColor = parseCssColor(region.color);
    const previewPixels = previewSample.pixels.slice(
      footerOffset,
      footerOffset + region.points.length
    );
    const exportedPixels = exportedSample.pixels.slice(
      footerOffset,
      footerOffset + region.points.length
    );
    const previewInk = previewPixels.filter(
      (pixel) => colorDistance(pixel, targetColor) <= 65
    ).length;
    const exportedInk = exportedPixels.filter(
      (pixel) => colorDistance(pixel, targetColor) <= 65
    ).length;

    expect(previewInk).toBeGreaterThan(2);
    expect(exportedInk).toBeGreaterThan(2);
    expect(
      Math.abs(previewInk - exportedInk) / region.points.length
    ).toBeLessThanOrEqual(0.12);
    footerOffset += region.points.length;
  }
  if (profile.expectedSurface) {
    expect(
      colorDistance(exportedSample.pixels[1], profile.expectedSurface)
    ).toBeLessThanOrEqual(12);
  }
};
