/**
 * 强调色的对比度保障（纯函数，样式基础层）。
 *
 * 用户选的强调色可能落在背景上读不清（浅背景选浅粉、深背景选深紫）。
 * 这里把强调色与背景的代表色比对，不足 WCAG AA 正文标准（4.5:1）时
 * 沿 HSL 明度向背景的反方向逐步调整，直到达标或到达明度极值。
 */

import { type CanvasTone, canvasTone } from "./canvas";
import { contrastRatio, hexToRgb, type Rgb } from "./color-contrast";
import type { CanvasBackground } from "./types";

/** 基调代表色：浅色基调按纯白算，深色基调按画布最深的墨色算 */
const toneReferenceColor: Record<CanvasTone, string> = {
  dark: "#111114",
  light: "#ffffff",
};

/**
 * 对比度比对的背景代表色。纯色背景取自身，中间调灰底才不会漏判；
 * 渐变、图案与图片没有单一颜色，取所在基调的代表色。
 */
const referenceColor = (background: CanvasBackground): string =>
  background.kind === "solid"
    ? background.color
    : toneReferenceColor[canvasTone(background)];
const minimumContrast = 4.5;
const lightnessStep = 0.04;

type Hsl = [number, number, number];

const clampLightness = (lightness: number): number =>
  Math.min(1, Math.max(0, lightness));

const rgbToHsl = ([red, green, blue]: Rgb): Hsl => {
  const [r, g, b] = [red / 255, green / 255, blue / 255];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return [0, 0, lightness];
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue: number;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  return [((hue * 60) % 360 + 360) % 360, saturation, lightness];
};

const hslToHex = ([hue, saturation, lightness]: Hsl): string => {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const second = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const offset = lightness - chroma / 2;
  const sector = Math.floor(hue / 60) % 6;
  const [r, g, b] = (
    [
      [chroma, second, 0],
      [second, chroma, 0],
      [0, chroma, second],
      [0, second, chroma],
      [second, 0, chroma],
      [chroma, 0, second],
    ] as const
  )[sector];

  return `#${[r, g, b]
    .map((channel) =>
      Math.round((channel + offset) * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
};

/**
 * 返回在该背景上可读的强调色；已达标的颜色原样返回。
 */
export const ensureAccentContrast = (
  accentColor: string,
  background: CanvasBackground
): string => {
  const reference = hexToRgb(referenceColor(background));
  const isReadable = (color: string): boolean =>
    contrastRatio(hexToRgb(color), reference) >= minimumContrast;

  if (isReadable(accentColor)) {
    return accentColor;
  }

  const [hue, saturation, lightness] = rgbToHsl(hexToRgb(accentColor));
  // 浅背景压暗、深背景提亮，色相与饱和度保持不变，强调色的性格不丢
  const direction = canvasTone(background) === "light" ? -1 : 1;
  let candidate = lightness;

  while (candidate > 0 && candidate < 1) {
    candidate = clampLightness(candidate + direction * lightnessStep);
    const color = hslToHex([hue, saturation, candidate]);
    if (isReadable(color)) {
      return color;
    }
  }

  return hslToHex([hue, saturation, candidate]);
};
