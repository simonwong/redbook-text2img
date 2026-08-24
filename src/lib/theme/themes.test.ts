import { describe, expect, it } from "vitest";
import { contrastRatio, hexToRgb } from "./color-contrast";
import { presetThemes } from "./themes";
import type { StyleAdjustments } from "./types";

const firstFourConfigurations = {
  "clean-dark": {
    background: { kind: "preset", preset: "night-aurora" },
    bodyHeadingAlignment: "left",
    bodyHeadingSize: "medium",
    contentSurface: "none",
    coverLayout: "bottom-left",
    decorationColor: "#a78bfa",
    density: "balanced",
    fontId: "auto",
    headingDecoration: "underline",
  },
  "clean-light": {
    background: { kind: "preset", preset: "clean-light" },
    bodyHeadingAlignment: "center",
    bodyHeadingSize: "medium",
    contentSurface: "none",
    coverLayout: "center-poster",
    decorationColor: "#64748b",
    density: "balanced",
    fontId: "auto",
    headingDecoration: "none",
  },
  "gradient-warm": {
    background: { kind: "preset", preset: "warm-sun" },
    bodyHeadingAlignment: "center",
    bodyHeadingSize: "large",
    contentSurface: "floating-card",
    coverLayout: "center-poster",
    decorationColor: "#f4b76a",
    density: "balanced",
    fontId: "sans",
    headingDecoration: "highlight",
  },
  "trianglify-minimalist": {
    background: { kind: "preset", preset: "trianglify-gray" },
    bodyHeadingAlignment: "left",
    bodyHeadingSize: "large",
    contentSurface: "floating-card",
    coverLayout: "top-left",
    decorationColor: "#334155",
    density: "compact",
    fontId: "sans",
    headingDecoration: "underline",
  },
} satisfies Record<string, StyleAdjustments>;

const readableBackgrounds = {
  "clean-dark": "#28233a",
  "clean-light": "#ffffff",
  "gradient-warm": "#fffaf2",
  "trianglify-minimalist": "#f8fafc",
} as const;

const ratio = (foreground: string, background: string): number =>
  contrastRatio(hexToRgb(foreground), hexToRgb(background));

describe("内置主题 1–4", () => {
  it.each(
    Object.entries(firstFourConfigurations)
  )("%s 由完整样式配置表达", (themeId, configuration) => {
    const theme = presetThemes.find(({ id }) => id === themeId);

    expect(theme?.configuration).toEqual(configuration);
    expect(theme?.defaults).toBeUndefined();
    expect(Object.keys(theme?.configuration ?? {}).sort()).toEqual(
      Object.keys(configuration).sort()
    );
  });

  it("任意两个主题至少有两个可见配置维度不同", () => {
    const configurations = Object.values(firstFourConfigurations);

    for (const [index, configuration] of configurations.entries()) {
      for (const candidate of configurations.slice(index + 1)) {
        const differences = Object.keys(configuration).filter((field) => {
          const key = field as keyof StyleAdjustments;
          return (
            JSON.stringify(configuration[key]) !==
            JSON.stringify(candidate[key])
          );
        });
        expect(differences.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it.each(
    Object.entries(readableBackgrounds)
  )("%s 的正文语义色满足 WCAG AA", (themeId, canvasBackground) => {
    const theme = presetThemes.find(({ id }) => id === themeId);
    expect(theme).toBeDefined();
    if (!theme) {
      return;
    }

    const contentBackground =
      theme.style.surface?.background ?? canvasBackground;
    const textColors = [
      theme.style.heading.color,
      theme.style.paragraph.color,
      theme.style.emphasis.bold.color,
      theme.style.emphasis.italic.color,
      theme.style.list.color,
      theme.style.link.color,
    ];

    for (const color of textColors) {
      expect(ratio(color, contentBackground)).toBeGreaterThanOrEqual(4.5);
    }
    expect(
      ratio(theme.style.list.markerColor, contentBackground)
    ).toBeGreaterThanOrEqual(3);
    expect(
      ratio(
        theme.style.emphasis.highlight.color,
        theme.style.emphasis.highlight.background
      )
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      ratio(theme.style.blockquote.textColor, theme.style.blockquote.background)
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      ratio(theme.style.code.inline.color, theme.style.code.inline.background)
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      ratio(theme.style.code.block.color, theme.style.code.block.background)
    ).toBeGreaterThanOrEqual(4.5);
    expect(theme.style.link.underline).toBe(true);
  });
});
