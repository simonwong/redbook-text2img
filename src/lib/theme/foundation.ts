import { GraphiteLowPoly } from "./backgroundSet";
import { applyCanvasConfiguration } from "./canvas";
import { gradients, spacing, typography } from "./tokens";
import type {
  CoverStyleOverride,
  FullStyle,
  HeaderBarStyle,
  StyleAdjustments,
  ThemeInternals,
} from "./types";

interface StyleFoundation {
  readonly coverStyle: CoverStyleOverride;
  readonly headerBar?: HeaderBarStyle;
  readonly style: FullStyle;
}

type FoundationProfile =
  | "apple"
  | "clean"
  | "cool"
  | "dark"
  | "pink"
  | "reading"
  | "triangle"
  | "warm";

/** 阅读模式底色：foundation 档位与 themes 声明共用，resolveProfile 靠它识别 */
export const readingBackgroundColor = "#f9f5ea";

const baseTypography = {
  baseFontSize: typography.fontSize.normal,
  lineHeight: typography.lineHeight.normal,
};

const baseSpacing = {
  headingGap: spacing.headingGap.normal,
  padding: spacing.padding.normal,
  paragraphGap: spacing.paragraphGap.normal,
};

const cleanStyle: FullStyle = {
  background: { type: "gradient", value: gradients.cleanLight },
  blockquote: {
    background: "#eff2f7",
    borderColor: "#1b2540",
    textColor: "#4d5468",
  },
  code: {
    block: { background: "#e9edf4", color: "#2c3f6e" },
    inline: { background: "#e9edf4", color: "#2c3f6e" },
  },
  emphasis: {
    bold: { color: "#1b2540", fontWeight: typography.fontWeight.semibold },
    highlight: { background: "#ffd75e", color: "#1b2540" },
    italic: { color: "#5e6474" },
  },
  heading: { color: "#1b2540", fontWeight: typography.fontWeight.semibold },
  link: { color: "#1b2540", underline: true },
  list: { color: "#3a3f4b", markerColor: "#1b2540" },
  paragraph: { color: "#3a3f4b" },
  spacing: baseSpacing,
  typography: baseTypography,
};

const foundationStyles: Record<FoundationProfile, FullStyle> = {
  apple: {
    background: { type: "solid", value: "#fbfbfb" },
    blockquote: {
      background: "#f5f5f7",
      borderColor: "#d1d1d6",
      textColor: "#48484a",
    },
    code: {
      block: { background: "#f5f5f7", color: "#1d1d1f" },
      inline: { background: "#f5f5f7", color: "#1d1d1f" },
    },
    emphasis: {
      bold: { color: "#1d1d1f", fontWeight: typography.fontWeight.semibold },
      highlight: { background: "#ffcc00", color: "#1d1d1f" },
      italic: { color: "#48484a" },
    },
    heading: { color: "#1d1d1f", fontWeight: typography.fontWeight.semibold },
    link: { color: "#0066cc", underline: true },
    list: { color: "#1d1d1f", markerColor: "#8e8e93" },
    paragraph: { color: "#1d1d1f" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  clean: cleanStyle,
  cool: {
    background: { type: "gradient", value: gradients.coolMist },
    blockquote: {
      background: "#edf2fa",
      borderColor: "#2c5aad",
      boxShadow: "0 1px 14px rgba(60, 90, 140, 0.08)",
      textColor: "#465579",
    },
    code: {
      block: {
        background: "#e4ebf7",
        color: "#2c4f8f",
      },
      inline: {
        background: "#e4ebf7",
        color: "#2c4f8f",
      },
    },
    emphasis: {
      bold: { color: "#2c5aad", fontWeight: typography.fontWeight.semibold },
      highlight: { background: "#2c5aad", color: "#ffffff" },
      italic: { color: "#55617d" },
    },
    heading: { color: "#2c5aad", fontWeight: typography.fontWeight.semibold },
    link: { color: "#2c5aad", underline: true },
    list: { color: "#34405a", markerColor: "#2c5aad" },
    paragraph: { color: "#34405a" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  dark: {
    background: { type: "gradient", value: gradients.darkNight },
    blockquote: {
      background: "#1c2230",
      borderColor: "#8fe3c8",
      boxShadow: "0 1px 12px rgba(74, 214, 172, 0.12)",
      textColor: "#d3d8e3",
    },
    code: {
      block: { background: "#232b3a", color: "#c9f2e6" },
      inline: { background: "#232b3a", color: "#c9f2e6" },
    },
    emphasis: {
      bold: { color: "#8fe3c8", fontWeight: typography.fontWeight.semibold },
      highlight: { background: "#8fe3c8", color: "#0f1420" },
      italic: { color: "#bcc4d3" },
    },
    heading: {
      color: "#8fe3c8",
      fontWeight: typography.fontWeight.semibold,
    },
    link: { color: "#8fe3c8", underline: true },
    list: { color: "#d3d8e3", markerColor: "#8fe3c8" },
    paragraph: { color: "#d3d8e3" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  pink: {
    background: { type: "gradient", value: gradients.cherryCream },
    blockquote: {
      background: "#fff0f3",
      borderColor: "#b32259",
      boxShadow: "0 1px 14px rgba(214, 78, 122, 0.1)",
      textColor: "#5e414c",
    },
    code: {
      block: {
        background: "#ffe5eb",
        color: "#9a2050",
      },
      inline: {
        background: "#ffe5eb",
        color: "#9a2050",
      },
    },
    emphasis: {
      bold: { color: "#b32259", fontWeight: typography.fontWeight.bold },
      highlight: { background: "#b32259", color: "#ffffff" },
      italic: { color: "#715561" },
    },
    heading: {
      color: "#b32259",
      fontWeight: typography.fontWeight.bold,
    },
    link: { color: "#b32259", underline: true },
    list: { color: "#4b333c", markerColor: "#b32259" },
    paragraph: { color: "#4b333c" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  reading: {
    background: { type: "solid", value: readingBackgroundColor },
    blockquote: {
      background: "#f1ebdd",
      borderColor: "#6b4a2e",
      textColor: "#6b625b",
    },
    code: {
      block: { background: "#eee7d7", color: "#5a4636" },
      inline: { background: "#eee7d7", color: "#5a4636" },
    },
    emphasis: {
      bold: { color: "#6b4a2e", fontWeight: typography.fontWeight.semibold },
      highlight: { background: "#f6d67a", color: "#3d3733" },
      italic: { color: "#71675e" },
    },
    heading: { color: "#6b4a2e", fontWeight: typography.fontWeight.medium },
    link: { color: "#6b4a2e", underline: true },
    list: { color: "#4a433d", markerColor: "#6b4a2e" },
    paragraph: { color: "#4a433d" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  triangle: {
    background: { type: "image", value: GraphiteLowPoly },
    blockquote: {
      background: "#2f333c",
      borderColor: "#f4f6fb",
      textColor: "#e1e4eb",
    },
    code: {
      block: { background: "#3b3f4a", color: "#f4f6fb" },
      inline: { background: "#3b3f4a", color: "#f4f6fb" },
    },
    emphasis: {
      bold: { color: "#f4f6fb", fontWeight: typography.fontWeight.bold },
      highlight: { background: "#ffd75e", color: "#1d2026" },
      italic: { color: "#b9bec9" },
    },
    heading: {
      color: "#f4f6fb",
      fontWeight: typography.fontWeight.bold,
    },
    link: { color: "#f4f6fb", underline: true },
    list: { color: "#d6d9e1", markerColor: "#f4f6fb" },
    paragraph: { color: "#d6d9e1" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  warm: {
    background: { type: "gradient", value: gradients.warmSun },
    blockquote: {
      background: "#fff0dc",
      borderColor: "#92530c",
      boxShadow: "0 1px 14px rgba(202, 110, 50, 0.1)",
      textColor: "#5e4a38",
    },
    code: {
      block: { background: "#ffe7ca", color: "#7a4410" },
      inline: { background: "#ffe7ca", color: "#7a4410" },
    },
    emphasis: {
      bold: { color: "#92530c", fontWeight: typography.fontWeight.bold },
      highlight: { background: "#92530c", color: "#ffffff" },
      italic: { color: "#6e5843" },
    },
    heading: {
      color: "#92530c",
      fontWeight: typography.fontWeight.bold,
    },
    link: { color: "#92530c", underline: true },
    list: { color: "#4d3b2b", markerColor: "#92530c" },
    paragraph: { color: "#4d3b2b" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
};

const resolveProfile = (configuration: StyleAdjustments): FoundationProfile => {
  if (configuration.background.kind === "preset") {
    return {
      "cherry-cream": "pink",
      "clean-light": "clean",
      "cool-mist": "cool",
      "night-aurora": "dark",
      "trianglify-gray": "triangle",
      "warm-sun": "warm",
    }[configuration.background.preset] as FoundationProfile;
  }
  if (configuration.background.kind === "solid") {
    if (configuration.background.color === readingBackgroundColor) {
      return "reading";
    }
    if (configuration.background.color === "#fbfbfb") {
      return "apple";
    }
  }
  // 自定义背景（纯色/渐变/图片）回落到 clean 基础，语义色由 applyCanvasConfiguration 按背景明暗覆盖
  return "clean";
};

export const resolveStyleFoundation = (
  configuration: StyleAdjustments,
  internals?: ThemeInternals
): StyleFoundation => {
  const profile = resolveProfile(configuration);
  const styled = applyCanvasConfiguration(
    foundationStyles[profile],
    configuration.background
  );

  return {
    coverStyle: {
      contentHorizontalAlign: "center",
      contentVerticalAlign: "center",
      headingAlignment: "center",
      headingScale: 1.25,
    },
    headerBar: internals?.headerBar,
    style: styled,
  };
};
