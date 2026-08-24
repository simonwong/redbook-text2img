import { readFile } from "node:fs/promises";
import { expect, type Page, test } from "@playwright/test";

interface NormalizedPoint {
  readonly x: number;
  readonly y: number;
}

interface PixelSample {
  readonly height: number;
  readonly pixels: readonly [number, number, number, number][];
  readonly width: number;
}

interface ThemeProfile {
  readonly bodyAlign: "center" | "left";
  readonly coverAlign: "center" | "left";
  readonly coverVerticalAlign: "center" | "flex-end" | "flex-start";
  readonly decoration: "highlight" | "none" | "underline";
  readonly expectedSurface?: readonly [number, number, number];
  readonly fontSize: string;
  readonly name: string;
  readonly surface: string;
  readonly tone: "dark" | "light";
}

const linearGradientPattern = /linear-gradient/;
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

使用 \`inline code\` 验证技术内容。`;

const themeProfiles: readonly ThemeProfile[] = [
  {
    bodyAlign: "center",
    coverAlign: "center",
    coverVerticalAlign: "center",
    decoration: "none",
    fontSize: "16px",
    name: "清新白",
    surface: "rgba(0, 0, 0, 0)",
    tone: "light",
  },
  {
    bodyAlign: "left",
    coverAlign: "left",
    coverVerticalAlign: "flex-start",
    decoration: "underline",
    expectedSurface: [255, 255, 255] as const,
    fontSize: "15px",
    name: "三角极简",
    surface: "rgb(255, 255, 255)",
    tone: "light",
  },
  {
    bodyAlign: "left",
    coverAlign: "left",
    coverVerticalAlign: "flex-end",
    decoration: "underline",
    fontSize: "16px",
    name: "墨夜极光",
    surface: "rgba(0, 0, 0, 0)",
    tone: "dark",
  },
  {
    bodyAlign: "center",
    coverAlign: "center",
    coverVerticalAlign: "center",
    decoration: "highlight",
    expectedSurface: [255, 255, 255] as const,
    fontSize: "16px",
    name: "蜜光暖阳",
    surface: "rgb(255, 255, 255)",
    tone: "light",
  },
];

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
  { x: 0.12, y: 0.12 },
  { x: 0.5, y: 0.12 },
  { x: 0.88, y: 0.12 },
  { x: 0.12, y: 0.5 },
  { x: 0.5, y: 0.5 },
  { x: 0.88, y: 0.5 },
  { x: 0.12, y: 0.88 },
  { x: 0.5, y: 0.88 },
  { x: 0.88, y: 0.88 },
];

for (const profile of themeProfiles) {
  test(`${profile.name} 的封面、正文、长短内容和 PNG 一致`, async ({
    page,
  }) => {
    await page.addInitScript((content) => {
      localStorage.clear();
      localStorage.setItem(
        "redbook-markdown-content",
        JSON.stringify({ state: { content, isChange: true }, version: 0 })
      );
    }, themeContent);
    await page.setViewportSize({ height: 900, width: 1200 });
    await page.goto("/");
    await page.getByRole("button", { name: "设置样式" }).click();
    const theme = page.getByRole("radio", { name: profile.name });
    await theme.locator("..").click();
    await expect(theme).toBeChecked();

    const preview = page.locator(".img-preview");
    await expect(preview).toBeVisible();
    await expect(preview).toHaveCSS("font-size", profile.fontSize);
    await expect(preview.locator("h1")).toHaveCSS(
      "text-align",
      profile.coverAlign
    );
    await expect(preview.locator("h1 span")).toHaveCSS(
      "background-image",
      profile.decoration === "none" ? "none" : linearGradientPattern
    );
    await expect(preview.locator(":scope > div > div:first-child")).toHaveCSS(
      "justify-content",
      profile.coverVerticalAlign
    );

    await page.getByRole("button", { name: "第 2 张图片" }).click();
    await expect(preview.locator("h2")).toHaveCSS(
      "text-align",
      profile.bodyAlign
    );

    await page.getByRole("button", { name: "第 3 张图片" }).click();
    const content = preview.locator(":scope > div > div:first-child");
    await expect(content).toHaveCSS("justify-content", "flex-start");
    await expect(preview.locator(":scope > div")).toHaveCSS(
      "background-color",
      profile.surface
    );
    expect(
      await content.evaluate(
        (element) => element.scrollHeight <= element.clientHeight + 1
      )
    ).toBe(true);

    await page.getByRole("button", { name: "关闭样式设置" }).click();
    const textColors = await preview.evaluate((element) => {
      const readColor = (selector: string) => {
        const target = element.querySelector(selector);
        if (!target) {
          throw new Error(`Missing semantic element: ${selector}`);
        }
        return getComputedStyle(target).color;
      };
      const inner = element.firstElementChild;
      const footer = inner?.lastElementChild;
      if (!footer) {
        throw new Error("Missing card footer");
      }
      return [
        readColor("h2"),
        readColor("p"),
        readColor("strong"),
        readColor("em"),
        readColor("a"),
        getComputedStyle(footer).color,
      ];
    });
    await preview.evaluate((element) => {
      const inner = element.firstElementChild;
      if (!inner) {
        throw new Error("Missing preview inner container");
      }
      for (const child of inner.children) {
        (child as HTMLElement).style.visibility = "hidden";
      }
    });
    const backdropPng = await preview.screenshot();
    await preview.evaluate((element) => {
      const inner = element.firstElementChild;
      if (!inner) {
        throw new Error("Missing preview inner container");
      }
      for (const child of inner.children) {
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
      backdrop.pixels.reduce(
        (sum, pixel) => sum + relativeLuminance(pixel),
        0
      ) / backdrop.pixels.length;
    if (profile.tone === "dark") {
      expect(averageLuminance).toBeLessThan(0.08);
    } else {
      expect(averageLuminance).toBeGreaterThan(0.65);
    }

    const titlePoint = await preview.evaluate((element, decoration) => {
      const title = element.querySelector("h2 span");
      if (!title) {
        throw new Error("Missing title span");
      }
      const previewRect = element.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      let verticalRatio = 0.5;
      if (decoration === "highlight") {
        verticalRatio = 0.75;
      } else if (decoration === "underline") {
        verticalRatio = 0.94;
      }
      return {
        x:
          (titleRect.left - previewRect.left + titleRect.width / 2) /
          previewRect.width,
        y:
          (titleRect.top - previewRect.top + titleRect.height * verticalRatio) /
          previewRect.height,
      };
    }, profile.decoration);
    const comparisonPoints = [
      { x: 0.02, y: 0.5 },
      { x: 0.06, y: 0.06 },
      { x: 0.5, y: 0.5 },
      { x: 0.88, y: 0.88 },
      titlePoint,
    ] as const;
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
    for (const [index, previewPixel] of previewSample.pixels.entries()) {
      const tolerance = index === comparisonPoints.length - 1 ? 105 : 30;
      expect(
        colorDistance(previewPixel, exportedSample.pixels[index])
      ).toBeLessThanOrEqual(tolerance);
    }
    if (profile.expectedSurface) {
      expect(
        colorDistance(exportedSample.pixels[1], profile.expectedSurface)
      ).toBeLessThanOrEqual(8);
    }
  });
}
