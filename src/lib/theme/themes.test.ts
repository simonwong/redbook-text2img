import { describe, expect, it } from "vitest";
import {
  type StyleConfiguration,
  styleSystem,
} from "../style-system/style-system";
import { contrastRatio, hexToRgb } from "./color-contrast";

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
} satisfies Record<string, StyleConfiguration>;

const ratio = (foreground: string, background: string): number =>
  contrastRatio(hexToRgb(foreground), hexToRgb(background));

describe("内置主题 1–4", () => {
  it.each(
    Object.entries(firstFourConfigurations)
  )("%s 通过 Seam 公开完整样式配置", (themeId, configuration) => {
    const snapshot = styleSystem.read(
      styleSystem.hydrate({ currentThemeId: themeId })
    );

    expect(snapshot.themeConfiguration).toEqual(configuration);
    expect(snapshot.configuration).toEqual(configuration);
    expect(snapshot.isModified).toBe(false);
  });

  it("任意两个主题至少有两个可见配置维度不同", () => {
    const configurations = Object.values(firstFourConfigurations);

    for (const [index, configuration] of configurations.entries()) {
      for (const candidate of configurations.slice(index + 1)) {
        const differences = Object.keys(configuration).filter((field) => {
          const key = field as keyof StyleConfiguration;
          return (
            JSON.stringify(configuration[key]) !==
            JSON.stringify(candidate[key])
          );
        });
        expect(differences.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it.each([
    "trianglify-minimalist",
    "gradient-warm",
  ])("%s 的浮层语义色从 Seam 解析后满足 WCAG AA", (themeId) => {
    const styles = styleSystem.resolve(
      styleSystem.hydrate({ currentThemeId: themeId }),
      { page: "body" }
    ).styles;
    const background = String(styles.innerContainer.backgroundColor);
    const textColors = [
      styles.h1.color,
      styles.p.color,
      styles.strong.color,
      styles.em.color,
      styles.ul.color,
      styles.a.color,
      styles.footer.color,
    ];

    for (const color of textColors) {
      expect(ratio(String(color), background)).toBeGreaterThanOrEqual(4.5);
    }
    expect(
      ratio(String(styles.mark.color), String(styles.mark.backgroundColor))
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      ratio(
        String(styles.blockquote.color),
        String(styles.blockquote.backgroundColor)
      )
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      ratio(String(styles.code.color), String(styles.code.backgroundColor))
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      ratio(String(styles.pre.color), String(styles.pre.backgroundColor))
    ).toBeGreaterThanOrEqual(4.5);
    expect(styles.a.textDecoration).toBe("underline");
  });
});
