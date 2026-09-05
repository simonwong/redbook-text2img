import { GraphiteLowPoly } from "./backgroundSet";
import { hexToRgb, relativeLuminance } from "./color-contrast";
import { gradients } from "./tokens";
import type {
  BackgroundPreset,
  BackgroundStyle,
  CanvasBackground,
  FullStyle,
  GradientDirection,
} from "./types";

/** 背景明暗基调：决定语义色取深底还是浅底，也决定强调色向哪个方向调整 */
export type CanvasTone = "dark" | "light";
const lightToneLuminanceThreshold = 0.179;

interface BackgroundDefinition {
  background: BackgroundStyle;
  tone: CanvasTone;
}

export const backgroundPresetIds: readonly BackgroundPreset[] = [
  "clean-light",
  "trianglify-gray",
  "night-aurora",
  "warm-sun",
  "cool-mist",
  "cherry-cream",
];

const gradientDirectionAngles: Record<GradientDirection, number> = {
  diagonal: 135,
  horizontal: 90,
  vertical: 180,
};

/**
 * 自定义双色渐变：两端都是不透明实色，没有跨区间透明淡出，
 * html2canvas-pro 导出与浏览器一致（见 docs/html2canvas-pitfalls.md 第 6 条）。
 */
export const customGradientValue = (
  from: string,
  to: string,
  direction: GradientDirection
): string =>
  `linear-gradient(${gradientDirectionAngles[direction]}deg, ${from} 0%, ${to} 100%)`;

const backgroundDefinitions: Record<BackgroundPreset, BackgroundDefinition> = {
  "cherry-cream": {
    background: { type: "gradient", value: gradients.cherryCream },
    tone: "light",
  },
  "clean-light": {
    background: { type: "gradient", value: gradients.cleanLight },
    tone: "light",
  },
  "cool-mist": {
    background: { type: "gradient", value: gradients.coolMist },
    tone: "light",
  },
  "night-aurora": {
    background: { type: "gradient", value: gradients.darkNight },
    tone: "dark",
  },
  // 石墨低多边形是深色图案：基调 dark，语义色与强调色都按深底派生
  "trianglify-gray": {
    background: { type: "image", value: GraphiteLowPoly },
    tone: "dark",
  },
  "warm-sun": {
    background: { type: "gradient", value: gradients.warmSun },
    tone: "light",
  },
};

const getSolidTone = (color: string): CanvasTone =>
  relativeLuminance(hexToRgb(color)) > lightToneLuminanceThreshold
    ? "light"
    : "dark";

const getGradientTone = (from: string, to: string): CanvasTone =>
  (relativeLuminance(hexToRgb(from)) + relativeLuminance(hexToRgb(to))) / 2 >
  lightToneLuminanceThreshold
    ? "light"
    : "dark";

const getBackgroundDefinition = (
  choice: CanvasBackground
): BackgroundDefinition => {
  if (choice.kind === "preset") {
    return backgroundDefinitions[choice.preset];
  }
  if (choice.kind === "custom-gradient") {
    return {
      background: {
        type: "gradient",
        value: customGradientValue(choice.from, choice.to, choice.direction),
      },
      tone: getGradientTone(choice.from, choice.to),
    };
  }
  if (choice.kind === "image") {
    return {
      background: { type: "image", value: choice.dataUrl },
      tone: choice.tone,
    };
  }
  return {
    background: { type: "solid", value: choice.color },
    tone: getSolidTone(choice.color),
  };
};

/** 背景的明暗基调；强调色的对比度保障按它取代表色 */
export const canvasTone = (choice: CanvasBackground): CanvasTone =>
  getBackgroundDefinition(choice).tone;

const sameBackgroundStyle = (
  first: BackgroundStyle,
  second: BackgroundStyle
): boolean =>
  first.type === second.type &&
  first.value === second.value &&
  first.repeat === second.repeat &&
  first.size === second.size;

export const canvasBackgroundsEqual = (
  first: CanvasBackground,
  second: CanvasBackground
): boolean => {
  if (first.kind === "preset" && second.kind === "preset") {
    return first.preset === second.preset;
  }
  if (first.kind === "solid" && second.kind === "solid") {
    return first.color === second.color;
  }
  if (first.kind === "custom-gradient" && second.kind === "custom-gradient") {
    return (
      first.direction === second.direction &&
      first.from === second.from &&
      first.to === second.to
    );
  }
  if (first.kind === "image" && second.kind === "image") {
    // 磨砂档位是图片背景的一部分：只切档也要算作背景被修改
    return first.dataUrl === second.dataUrl && first.frost === second.frost;
  }
  return false;
};

const applySemanticPalette = (style: FullStyle, tone: CanvasTone): FullStyle => {
  if (tone === "dark") {
    return {
      ...style,
      blockquote: {
        background: "rgba(255, 255, 255, 0.08)",
        borderColor: "#9ca3af",
        textColor: "#ffffff",
      },
      code: {
        block: { background: "rgba(255, 255, 255, 0.08)", color: "#ffffff" },
        inline: { background: "rgba(255, 255, 255, 0.1)", color: "#ffffff" },
      },
      emphasis: {
        bold: { color: "#ffffff", fontWeight: style.emphasis.bold.fontWeight },
        highlight: { background: "#fbbf24", color: "#111827" },
        italic: { color: "#ffffff" },
      },
      heading: { ...style.heading, color: "#ffffff" },
      link: { color: "#ffffff", underline: true },
      list: { color: "#ffffff", markerColor: "#d1d5db" },
      paragraph: { color: "#ffffff" },
    };
  }

  return {
    ...style,
    blockquote: {
      background: "rgba(255, 255, 255, 0.58)",
      borderColor: "#9ca3af",
      textColor: "#000000",
    },
    code: {
      block: { background: "rgba(255, 255, 255, 0.62)", color: "#000000" },
      inline: { background: "rgba(255, 255, 255, 0.72)", color: "#000000" },
    },
    emphasis: {
      bold: { color: "#000000", fontWeight: style.emphasis.bold.fontWeight },
      highlight: { background: "#fbbf24", color: "#111827" },
      italic: { color: "#000000" },
    },
    heading: { ...style.heading, color: "#000000" },
    link: { color: "#000000", underline: true },
    list: { color: "#000000", markerColor: "#374151" },
    paragraph: { color: "#000000" },
  };
};

export const applyCanvasConfiguration = (
  baseStyle: FullStyle,
  backgroundChoice: CanvasBackground
): FullStyle => {
  const definition = getBackgroundDefinition(backgroundChoice);

  // 幂等：foundation 与 adjustments 会连续套用同一背景，第二次直接返回，
  // 避免重复覆盖语义色；自定义渐变/图片值无法反查标识，直接比对样式值。
  if (sameBackgroundStyle(baseStyle.background, definition.background)) {
    return baseStyle;
  }

  return applySemanticPalette(
    { ...baseStyle, background: definition.background },
    definition.tone
  );
};
