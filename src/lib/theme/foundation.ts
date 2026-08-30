import { TrianglifyGary } from "./backgroundSet";
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
    background: "#f8fafc",
    borderColor: "#94a3b8",
    textColor: "#475569",
  },
  code: {
    block: { background: "#f8fafc", color: "#1f2937" },
    inline: { background: "#f1f5f9", color: "#6d28d9" },
  },
  emphasis: {
    bold: { color: "#111827", fontWeight: typography.fontWeight.semibold },
    highlight: { background: "#f59e0b", color: "#111827" },
    italic: { color: "#4b5563" },
  },
  heading: { color: "#111827", fontWeight: typography.fontWeight.semibold },
  link: { color: "#1d4ed8", underline: true },
  list: { color: "#374151", markerColor: "#6b7280" },
  paragraph: { color: "#374151" },
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
      background: "#eef4fb",
      borderColor: "#3f6798",
      boxShadow: "0 1px 14px rgba(60, 90, 140, 0.08)",
      textColor: "#2f4f75",
    },
    code: {
      block: {
        background: "#e8f0f8",
        color: "#233f60",
      },
      inline: {
        background: "#e8f0f8",
        color: "#233f60",
      },
    },
    emphasis: {
      bold: { color: "#172b45", fontWeight: typography.fontWeight.semibold },
      highlight: { background: "#173f7a", color: "#ffffff" },
      italic: { color: "#2f4f75" },
    },
    heading: { color: "#172b45", fontWeight: typography.fontWeight.semibold },
    link: { color: "#173f7a", underline: true },
    list: { color: "#233f60", markerColor: "#3f6798" },
    paragraph: { color: "#233f60" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  dark: {
    background: { type: "gradient", value: gradients.darkNight },
    blockquote: {
      background: "#1b1d2a",
      borderColor: "#8b7cd6",
      boxShadow: "0 1px 12px rgba(124, 102, 196, 0.12)",
      textColor: "#d1d5db",
    },
    code: {
      block: { background: "#171923", color: "#e5e7eb" },
      inline: { background: "#242635", color: "#ddd6fe" },
    },
    emphasis: {
      bold: { color: "#f5f5f7", fontWeight: typography.fontWeight.semibold },
      highlight: { background: "#a78bfa", color: "#171321" },
      italic: { color: "#b6bdcc" },
    },
    heading: {
      color: "#f5f5f7",
      fontWeight: typography.fontWeight.semibold,
    },
    link: { color: "#c4b5fd", underline: true },
    list: { color: "#d1d5db", markerColor: "#c4b5fd" },
    paragraph: { color: "#d1d5db" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  pink: {
    background: { type: "gradient", value: gradients.cherryCream },
    blockquote: {
      background: "#fff3f6",
      borderColor: "#a63255",
      boxShadow: "0 1px 14px rgba(214, 78, 122, 0.1)",
      textColor: "#742039",
    },
    code: {
      block: {
        background: "#fff3f6",
        color: "#742039",
      },
      inline: {
        background: "#fff3f6",
        color: "#742039",
      },
    },
    emphasis: {
      bold: { color: "#64152d", fontWeight: typography.fontWeight.bold },
      highlight: { background: "#8f1740", color: "#ffffff" },
      italic: { color: "#7c2f46" },
    },
    heading: {
      color: "#64152d",
      fontWeight: typography.fontWeight.bold,
    },
    link: { color: "#8f1740", underline: true },
    list: { color: "#742039", markerColor: "#9c2d50" },
    paragraph: { color: "#742039" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  reading: {
    background: { type: "solid", value: "#fefcf3" },
    blockquote: {
      background: "#faf5eb",
      borderColor: "#d6d3d1",
      textColor: "#78716c",
    },
    code: {
      block: { background: "#faf5eb", color: "#57534e" },
      inline: { background: "#f5f5f4", color: "#57534e" },
    },
    emphasis: {
      bold: { color: "#44403c", fontWeight: typography.fontWeight.semibold },
      highlight: { background: "#fbbf24", color: "#44403c" },
      italic: { color: "#78716c" },
    },
    heading: { color: "#44403c", fontWeight: typography.fontWeight.medium },
    link: { color: "#b45309", underline: true },
    list: { color: "#57534e", markerColor: "#a8a29e" },
    paragraph: { color: "#57534e" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  triangle: {
    background: { type: "image", value: TrianglifyGary },
    blockquote: {
      background: "#e2e8f0",
      borderColor: "#64748b",
      textColor: "#334155",
    },
    code: {
      block: { background: "#f1f5f9", color: "#0f172a" },
      inline: { background: "#e2e8f0", color: "#334155" },
    },
    emphasis: {
      bold: { color: "#0f172a", fontWeight: typography.fontWeight.bold },
      highlight: { background: "#1d4ed8", color: "#ffffff" },
      italic: { color: "#334155" },
    },
    heading: {
      color: "#0f172a",
      fontWeight: typography.fontWeight.bold,
    },
    link: { color: "#1e3a8a", underline: true },
    list: { color: "#334155", markerColor: "#64748b" },
    paragraph: { color: "#334155" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  warm: {
    background: { type: "gradient", value: gradients.warmSun },
    blockquote: {
      background: "#fff3e8",
      borderColor: "#c56a24",
      boxShadow: "0 1px 14px rgba(202, 110, 50, 0.1)",
      textColor: "#713715",
    },
    code: {
      block: { background: "#fff3e8", color: "#4a2a15" },
      inline: { background: "#ffedd5", color: "#713715" },
    },
    emphasis: {
      bold: { color: "#4a2a15", fontWeight: typography.fontWeight.bold },
      highlight: { background: "#9a4512", color: "#ffffff" },
      italic: { color: "#713715" },
    },
    heading: {
      color: "#4a2a15",
      fontWeight: typography.fontWeight.bold,
    },
    link: { color: "#7c2d12", underline: true },
    list: { color: "#713715", markerColor: "#a34f17" },
    paragraph: { color: "#713715" },
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
    if (configuration.background.color === "#fefcf3") {
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
