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
    coverLayout: "bottom-left",
    density: "normal",
    fontId: "sans",
  },
  "clean-light": {
    background: { kind: "preset", preset: "clean-light" },
    bodyHeadingAlignment: "center",
    coverLayout: "center-poster",
    density: "normal",
    fontId: "sans",
  },
  "gradient-warm": {
    background: { kind: "preset", preset: "warm-sun" },
    bodyHeadingAlignment: "center",
    coverLayout: "center-poster",
    density: "normal",
    fontId: "sans",
  },
  "trianglify-minimalist": {
    background: { kind: "preset", preset: "trianglify-gray" },
    bodyHeadingAlignment: "left",
    coverLayout: "top-left",
    density: "snug",
    fontId: "sans",
  },
} satisfies Record<string, StyleConfiguration>;

const secondFourConfigurations = {
  "apple-notes": {
    background: { color: "#fbfbfb", kind: "solid" },
    bodyHeadingAlignment: "left",
    coverLayout: "center-poster",
    density: "snug",
    fontId: "sans",
  },
  "gradient-cool": {
    background: { kind: "preset", preset: "cool-mist" },
    bodyHeadingAlignment: "center",
    coverLayout: "center-poster",
    density: "normal",
    fontId: "serif",
  },
  "reading-mode": {
    background: { color: "#fefcf3", kind: "solid" },
    bodyHeadingAlignment: "left",
    coverLayout: "top-left",
    density: "normal",
    fontId: "serif",
  },
  "xiaohongshu-pink": {
    background: { kind: "preset", preset: "cherry-cream" },
    bodyHeadingAlignment: "center",
    coverLayout: "center-poster",
    density: "normal",
    fontId: "sans",
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

  it("任意两个主题至少有一个可见配置维度不同", () => {
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
        // 标题装饰维度移除后，清新白/蜜光暖阳仅背景不同（底色风格仍由 Foundation 区分），
        // 守卫目标降级为"任意两主题配置不可完全相同"
        expect(differences.length).toBeGreaterThanOrEqual(1);
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

describe("内置主题 5–8", () => {
  it.each(
    Object.entries(secondFourConfigurations)
  )("%s 通过 Seam 公开完整样式配置", (themeId, configuration) => {
    const snapshot = styleSystem.read(
      styleSystem.hydrate({ currentThemeId: themeId })
    );

    expect(snapshot.themeConfiguration).toEqual(configuration);
    expect(snapshot.configuration).toEqual(configuration);
    expect(snapshot.isModified).toBe(false);
  });

  it("任意两个主题至少有一个可见配置维度不同", () => {
    const configurations = Object.values(secondFourConfigurations);

    for (const [index, configuration] of configurations.entries()) {
      for (const candidate of configurations.slice(index + 1)) {
        const differences = Object.keys(configuration).filter((field) => {
          const key = field as keyof StyleConfiguration;
          return (
            JSON.stringify(configuration[key]) !==
            JSON.stringify(candidate[key])
          );
        });
        // 标题装饰维度移除后，清新白/蜜光暖阳仅背景不同（底色风格仍由 Foundation 区分），
        // 守卫目标降级为"任意两主题配置不可完全相同"
        expect(differences.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it.each(
    Object.entries(secondFourConfigurations)
  )("%s 保留用户覆盖，未覆盖字段采用主题配置", (themeId, configuration) => {
    const state = styleSystem.hydrate({
      currentThemeId: themeId,
      overrides: { density: "spacious" },
    });
    const snapshot = styleSystem.read(state);

    expect(snapshot.themeConfiguration).toEqual(configuration);
    expect(snapshot.configuration).toEqual({
      ...configuration,
      density: "spacious",
    });
    expect(snapshot.overridden.density).toBe(true);
  });

  it.each([
    "reading-mode",
    "apple-notes",
  ])("%s 的纯色或底板语义色满足 WCAG AA", (themeId) => {
    const styles = styleSystem.resolve(
      styleSystem.hydrate({ currentThemeId: themeId }),
      { page: "body" }
    ).styles;
    const background = String(
      styles.innerContainer.backgroundColor ?? styles.container.backgroundColor
    );
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
    expect(styles.a.textDecoration).toBe("underline");
  });

  it("Apple 备忘录由主题内部细节生成装饰顶栏且无底板", () => {
    const resolved = styleSystem.resolve(
      styleSystem.hydrate({ currentThemeId: "apple-notes" }),
      { page: "body" }
    );

    expect(resolved.headerBar).toEqual({
      iconColor: "#8a6800",
      icons: { backArrow: true, menu: true, share: true },
    });
    expect(resolved.styles.container.padding).toBeUndefined();
    expect(resolved.styles.innerContainer.backgroundColor).toBeUndefined();
  });
});
