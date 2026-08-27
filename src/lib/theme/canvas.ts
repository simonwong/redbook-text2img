import { TrianglifyGary } from "./backgroundSet";
import { hexToRgb, relativeLuminance } from "./color-contrast";
import { gradients } from "./tokens";
import type {
  BackgroundPreset,
  BackgroundStyle,
  CanvasBackground,
  FullStyle,
  GradientPreset,
  PatternPreset,
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

export const gradientPresetIds: readonly GradientPreset[] = [
  "warm-light",
  "cool-light",
  "pink-light",
  "ocean",
  "forest",
];

export const patternPresetIds: readonly PatternPreset[] = [
  "dots",
  "grid",
  "diagonal",
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

const gradientDefinitions: Record<GradientPreset, BackgroundDefinition> = {
  "cool-light": {
    background: { type: "gradient", value: gradients.coolLight },
    tone: "light",
  },
  forest: {
    background: { type: "gradient", value: gradients.forest },
    tone: "light",
  },
  ocean: {
    background: { type: "gradient", value: gradients.ocean },
    tone: "light",
  },
  "pink-light": {
    background: { type: "gradient", value: gradients.pinkLight },
    tone: "light",
  },
  "warm-light": {
    background: { type: "gradient", value: gradients.warmLight },
    tone: "light",
  },
};

/**
 * 受控图案：内联 SVG data-URI 平铺在浅色底上，细线低对比，不抢内容。
 * SVG 必须显式 width/height：html2canvas-pro 按内在尺寸栅格化背景图。
 */
const patternSvg = (svg: string): string =>
  `data:image/svg+xml,${encodeURIComponent(svg)}`;

const patternDefinitions: Record<PatternPreset, BackgroundDefinition> = {
  diagonal: {
    background: {
      repeat: "repeat",
      size: "12px 12px",
      type: "image",
      value: patternSvg(
        "<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><rect width='12' height='12' fill='#f8fafc'/><path d='M0 12 L12 0' stroke='#e2e8f0' stroke-width='1'/></svg>"
      ),
    },
    tone: "light",
  },
  dots: {
    background: {
      repeat: "repeat",
      size: "16px 16px",
      type: "image",
      value: patternSvg(
        "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><rect width='16' height='16' fill='#fafafa'/><circle cx='8' cy='8' r='1' fill='#d6d9de'/></svg>"
      ),
    },
    tone: "light",
  },
  grid: {
    background: {
      repeat: "repeat",
      size: "16px 16px",
      type: "image",
      value: patternSvg(
        "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><rect width='16' height='16' fill='#fafafa'/><path d='M0 0.5 H16 M0.5 0 V16' stroke='#e5e7eb' stroke-width='1'/></svg>"
      ),
    },
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
): BackgroundDefinition => {
  if (choice.kind === "preset") {
    return backgroundDefinitions[choice.preset];
  }
  if (choice.kind === "gradient") {
    return gradientDefinitions[choice.gradient];
  }
  if (choice.kind === "pattern") {
    return patternDefinitions[choice.pattern];
  }
  return {
    background: { type: "solid", value: choice.color },
    tone: getSolidTone(choice.color),
  };
};

const findDefinitionId = <Id extends string>(
  definitions: Record<Id, BackgroundDefinition>,
  ids: readonly Id[],
  background: BackgroundStyle
): Id | undefined =>
  ids.find((id) => {
    const candidate = definitions[id].background;
    return (
      candidate.type === background.type && candidate.value === background.value
    );
  });

export const resolveCanvasBackground = (
  background: BackgroundStyle
): CanvasBackground => {
  const preset = findDefinitionId(
    backgroundDefinitions,
    backgroundPresetIds,
    background
  );
  if (preset) {
    return { kind: "preset", preset };
  }
  const gradient = findDefinitionId(
    gradientDefinitions,
    gradientPresetIds,
    background
  );
  if (gradient) {
    return { gradient, kind: "gradient" };
  }
  const pattern = findDefinitionId(
    patternDefinitions,
    patternPresetIds,
    background
  );
  if (pattern) {
    return { kind: "pattern", pattern };
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
  if (first.kind === "gradient" && second.kind === "gradient") {
    return first.gradient === second.gradient;
  }
  if (first.kind === "pattern" && second.kind === "pattern") {
    return first.pattern === second.pattern;
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
