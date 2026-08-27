import { TrianglifyGary } from "./backgroundSet";
import { hexToRgb, relativeLuminance } from "./color-contrast";
import { gradients } from "./tokens";
import type {
  BackgroundPreset,
  BackgroundStyle,
  CanvasBackground,
  FullStyle,
  SurfaceStyle,
} from "./types";

type Tone = "dark" | "light";
const hexColorPattern = /^#[\da-f]{6}$/i;

interface BackgroundDefinition {
  background: BackgroundStyle;
  tone: Tone;
}

export const backgroundPresetIds: readonly BackgroundPreset[] = [
  "clean-light",
  "trianglify-gray",
  "night-aurora",
  "warm-sun",
  "cool-mist",
  "cherry-cream",
];

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
  "trianglify-gray": {
    background: { type: "image", value: TrianglifyGary },
    tone: "light",
  },
  "warm-sun": {
    background: { type: "gradient", value: gradients.warmSun },
    tone: "light",
  },
};

const lightSurface: SurfaceStyle = {
  background: "#ffffff",
  borderRadius: 16,
  boxShadow: "0 8px 28px rgba(31, 41, 55, 0.14)",
  margin: 16,
};

const darkSurface: SurfaceStyle = {
  background: "rgba(17, 24, 39, 0.88)",
  borderRadius: 16,
  boxShadow: "0 8px 28px rgba(0, 0, 0, 0.28)",
  margin: 16,
};

const getSolidTone = (color: string): Tone =>
  relativeLuminance(hexToRgb(color)) > 0.179 ? "light" : "dark";

const getBackgroundDefinition = (
  choice: CanvasBackground
): BackgroundDefinition =>
  choice.kind === "preset"
    ? backgroundDefinitions[choice.preset]
    : {
        background: { type: "solid", value: choice.color },
        tone: getSolidTone(choice.color),
      };

export const resolveCanvasBackground = (
  background: BackgroundStyle
): CanvasBackground => {
  const preset = backgroundPresetIds.find((id) => {
    const candidate = backgroundDefinitions[id].background;
    return (
      candidate.type === background.type && candidate.value === background.value
    );
  });

  if (preset) {
    return { kind: "preset", preset };
  }
  if (background.type === "solid" && hexColorPattern.test(background.value)) {
    return { color: background.value.toLowerCase(), kind: "solid" };
  }
  throw new Error(`Unsupported theme background type: ${background.type}`);
};

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
  return false;
};

const applySemanticPalette = (style: FullStyle, tone: Tone): FullStyle => {
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

/** 浮层卡 surface：跟随背景明暗（主题内部细节，由 foundation 装配） */
export const floatingCardSurface = (
  backgroundChoice: CanvasBackground
): SurfaceStyle =>
  getBackgroundDefinition(backgroundChoice).tone === "dark"
    ? darkSurface
    : lightSurface;

export const applyCanvasConfiguration = (
  baseStyle: FullStyle,
  backgroundChoice: CanvasBackground
): FullStyle => {
  const definition = getBackgroundDefinition(backgroundChoice);
  const backgroundChanged = !canvasBackgroundsEqual(
    resolveCanvasBackground(baseStyle.background),
    backgroundChoice
  );

  if (!backgroundChanged) {
    return baseStyle;
  }

  return applySemanticPalette(
    { ...baseStyle, background: definition.background },
    definition.tone
  );
};
