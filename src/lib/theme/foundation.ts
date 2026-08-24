import { TrianglifyGary } from "./backgroundSet";
import { applyCanvasConfiguration } from "./canvas";
import { gradients, spacing, typography } from "./tokens";
import type {
  CoverStyleOverride,
  FullStyle,
  HeaderBarStyle,
  StyleAdjustments,
  TypesetStyle,
} from "./types";

interface StyleFoundation {
  readonly coverStyle: CoverStyleOverride;
  readonly headerBar?: HeaderBarStyle;
  readonly style: FullStyle;
  readonly typeset?: TypesetStyle;
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
  baseFontSize: typography.fontSize.balanced,
  lineHeight: typography.lineHeight.balanced,
};

const baseSpacing = {
  headingGap: spacing.headingGap.balanced,
  padding: spacing.padding.balanced,
  paragraphGap: spacing.paragraphGap.balanced,
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
    link: { color: "#007aff", underline: false },
    list: { color: "#1d1d1f", markerColor: "#8e8e93" },
    paragraph: { color: "#1d1d1f" },
    spacing: baseSpacing,
    typography: baseTypography,
  },
  clean: cleanStyle,
  cool: {
    background: { type: "gradient", value: gradients.coolMist },
    blockquote: {
      background: "rgba(245, 249, 253, 0.72)",
      borderColor: "#5b7bbf",
      boxShadow: "0 1px 14px rgba(60, 90, 140, 0.08)",
      textColor: "#3a577d",
    },
    code: {
      block: {
        background: "rgba(245, 249, 253, 0.7)",
        color: "#1a3556",
      },
      inline: {
        background: "rgba(245, 249, 253, 0.78)",
        color: "#3a577d",
      },
    },
    emphasis: {
      bold: { color: "#1a3556", fontWeight: typography.fontWeight.semibold },
      highlight: { background: "#5b7bbf", color: "#f5f9fd" },
      italic: { color: "#4664a0" },
    },
    heading: { color: "#1a3556", fontWeight: typography.fontWeight.semibold },
    link: { color: "#3a5fab", underline: false },
    list: { color: "#2c486b", markerColor: "#5b7bbf" },
    paragraph: { color: "#2c486b" },
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
      decoration: {
        color: "#a78bfa",
        kind: "underline",
        thickness: "0.16em",
      },
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
      background: "rgba(255, 246, 246, 0.72)",
      borderColor: "#e64f7a",
      boxShadow: "0 1px 14px rgba(214, 78, 122, 0.1)",
      textColor: "#923049",
    },
    code: {
      block: {
        background: "rgba(255, 246, 246, 0.7)",
        color: "#6e1530",
      },
      inline: {
        background: "rgba(255, 246, 246, 0.78)",
        color: "#923049",
      },
    },
    emphasis: {
      bold: { color: "#6e1530", fontWeight: typography.fontWeight.bold },
      highlight: { background: "#e64f7a", color: "#fff6f6" },
      italic: { color: "#a83a5a" },
    },
    heading: {
      color: "#6e1530",
      decoration: { color: "#ff9dbe", kind: "highlight" },
      fontWeight: typography.fontWeight.bold,
    },
    link: { color: "#c83768", underline: false },
    list: { color: "#86283f", markerColor: "#e64f7a" },
    paragraph: { color: "#86283f" },
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
      italic: { color: "#475569" },
    },
    heading: {
      color: "#0f172a",
      decoration: {
        color: "#334155",
        kind: "underline",
        thickness: "0.18em",
      },
      fontWeight: typography.fontWeight.bold,
    },
    link: { color: "#1d4ed8", underline: true },
    list: { color: "#334155", markerColor: "#64748b" },
    paragraph: { color: "#334155" },
    spacing: baseSpacing,
    surface: {
      background: "#f8fafc",
      borderRadius: 16,
      boxShadow: "0 8px 28px rgba(15, 23, 42, 0.18)",
      kind: "floating-card",
      margin: 16,
    },
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
      italic: { color: "#8a4719" },
    },
    heading: {
      color: "#4a2a15",
      decoration: { color: "#f4b76a", kind: "highlight" },
      fontWeight: typography.fontWeight.bold,
    },
    link: { color: "#93400d", underline: true },
    list: { color: "#713715", markerColor: "#a34f17" },
    paragraph: { color: "#713715" },
    spacing: baseSpacing,
    surface: {
      background: "#fffaf2",
      borderRadius: 24,
      boxShadow: "0 10px 30px rgba(120, 53, 15, 0.14)",
      kind: "floating-card",
      margin: 12,
    },
    typography: baseTypography,
  },
};

const profileTypesets: Partial<Record<FoundationProfile, TypesetStyle>> = {
  cool: { fontId: "serif" },
  dark: { letterSpacing: { heading: "0" } },
  pink: { fontId: "sans", headingScale: 1.1 },
  reading: { bodyScale: 1.05, fontId: "serif" },
  triangle: { headingScale: 1.2, letterSpacing: { heading: "-0.02em" } },
  warm: { headingScale: 1.1 },
};

const coverHeadingScales: Partial<Record<FoundationProfile, number>> = {
  pink: 1.15,
  triangle: 1.1,
  warm: 1.15,
};

const appleHeader: HeaderBarStyle = {
  iconColor: "#d4a300",
  icons: { backArrow: true, menu: true, share: true },
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
  if (configuration.background.color === "#fefcf3") {
    return "reading";
  }
  if (configuration.background.color === "#fbfbfb") {
    return "apple";
  }
  return "clean";
};

export const resolveStyleFoundation = (
  configuration: StyleAdjustments
): StyleFoundation => {
  const profile = resolveProfile(configuration);
  const baseStyle = foundationStyles[profile];

  return {
    coverStyle: {
      contentHorizontalAlign: "center",
      contentVerticalAlign: "center",
      headingAlignment: "center",
      headingScale: coverHeadingScales[profile] ?? 1.25,
    },
    headerBar: profile === "apple" ? appleHeader : undefined,
    style: applyCanvasConfiguration(
      baseStyle,
      configuration.background,
      configuration.contentSurface
    ),
    typeset: profileTypesets[profile],
  };
};
