import { describe, expect, it } from "vitest";
import { type StyleConfiguration, styleSystem } from "./style-system";

const unsafeCssValuePattern = /https?:|javascript:/i;

const relativeLuminance = (hex: string): number => {
  const channels = [1, 3, 5].map((start) => {
    const channel = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.040_45
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrastRatio = (first: string, second: string): number => {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
};

const themeBackgrounds = [
  ["clean-light", { kind: "preset", preset: "clean-light" }],
  ["trianglify-minimalist", { kind: "preset", preset: "trianglify-gray" }],
  ["clean-dark", { kind: "preset", preset: "night-aurora" }],
  ["gradient-warm", { kind: "preset", preset: "warm-sun" }],
  ["gradient-cool", { kind: "preset", preset: "cool-mist" }],
  ["xiaohongshu-pink", { kind: "preset", preset: "cherry-cream" }],
  ["reading-mode", { color: "#fefcf3", kind: "solid" }],
  ["apple-notes", { color: "#fbfbfb", kind: "solid" }],
] as const;
const coverVerticalAlignments = {
  "bottom-left": "flex-end",
  "center-poster": "center",
  "top-left": "flex-start",
} as const;

describe("Style System Interface", () => {
  it("列出 8 个稳定的内置主题", () => {
    expect(styleSystem.catalog().map((theme) => theme.id)).toEqual([
      "clean-light",
      "trianglify-minimalist",
      "clean-dark",
      "gradient-warm",
      "gradient-cool",
      "xiaohongshu-pink",
      "reading-mode",
      "apple-notes",
    ]);
  });

  it("通过公共接口列出封闭配置选项", () => {
    expect(styleSystem.configurationOptions()).toEqual({
      backgroundPreset: [
        "clean-light",
        "trianglify-gray",
        "night-aurora",
        "warm-sun",
        "cool-mist",
        "cherry-cream",
      ],
      bodyHeadingAlignment: ["center", "left"],
      coverLayout: ["center-poster", "top-left", "bottom-left"],
      density: ["compact", "snug", "normal", "relaxed", "spacious"],
      fontId: ["sans", "serif"],
      gradient: ["warm-light", "cool-light", "pink-light", "ocean", "forest"],
      pattern: ["dots", "grid", "diagonal"],
    });
  });

  it("公开语义准确的正文标题与封面配置", () => {
    const configuration = styleSystem.read(styleSystem.hydrate(undefined))
      .configuration as unknown as Record<string, unknown>;

    expect(configuration).toMatchObject({
      background: { kind: "preset", preset: "clean-light" },
      bodyHeadingAlignment: "center",
      coverLayout: "center-poster",
    });
    expect(configuration).not.toHaveProperty("accentColor");
    expect(configuration).not.toHaveProperty("bodyHeadingSize");
    expect(configuration).not.toHaveProperty("contentSurface");
    expect(configuration).not.toHaveProperty("decorationColor");
    expect(configuration).not.toHaveProperty("headingAlignment");
    expect(configuration).not.toHaveProperty("headingDecoration");
  });

  it("从空持久化数据恢复默认主题状态", () => {
    expect(styleSystem.hydrate(undefined)).toEqual({
      currentThemeId: "clean-light",
      overrides: {},
    });
  });

  it("读取快照不能污染主题默认值", () => {
    const state = styleSystem.hydrate(undefined);
    const first = styleSystem.read(state);
    const mutableConfiguration = first.configuration as {
      background: { preset: string };
    };
    const mutableThemeConfiguration = first.themeConfiguration as {
      background: { preset: string };
    };

    mutableConfiguration.background.preset = "night-aurora";
    mutableThemeConfiguration.background.preset = "warm-sun";

    expect(styleSystem.read(state)).toMatchObject({
      configuration: {
        background: { kind: "preset", preset: "clean-light" },
      },
      themeConfiguration: {
        background: { kind: "preset", preset: "clean-light" },
      },
    });
  });

  it("修改单项只产生该字段覆盖", () => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { density: "compact" },
      type: "update-configuration",
    });
    const snapshot = styleSystem.read(state);

    expect({
      density: snapshot.configuration.density,
      overridden: snapshot.overridden,
      overrides: state.overrides,
    }).toEqual({
      density: "compact",
      overridden: {
        background: false,
        bodyHeadingAlignment: false,
        coverLayout: false,
        density: true,
        fontId: false,
      },
      overrides: { density: "compact" },
    });
  });

  it("恢复单项只移除该字段覆盖", () => {
    const modified = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { density: "compact", fontId: "serif" },
      type: "update-configuration",
    });
    const reset = styleSystem.transition(modified, {
      field: "density",
      type: "reset-field",
    });

    expect({
      configuration: styleSystem.read(reset).configuration,
      overrides: reset.overrides,
    }).toEqual({
      configuration: {
        background: { kind: "preset", preset: "clean-light" },
        bodyHeadingAlignment: "center",
        coverLayout: "center-poster",
        density: "normal",
        fontId: "serif",
      },
      overrides: { fontId: "serif" },
    });
  });

  it("正文标题对齐可识别并单项恢复", () => {
    const modified = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { bodyHeadingAlignment: "left" },
      type: "update-configuration",
    });
    const reset = styleSystem.transition(modified, {
      field: "bodyHeadingAlignment",
      type: "reset-field",
    });

    expect(styleSystem.read(modified).overridden.bodyHeadingAlignment).toBe(
      true
    );
    expect(styleSystem.read(reset).overridden.bodyHeadingAlignment).toBe(false);
  });

  it("未知主题回落到默认主题", () => {
    expect(
      styleSystem.read(styleSystem.hydrate({ currentThemeId: "removed-theme" }))
        .theme.id
    ).toBe("clean-light");
  });

  it("丢弃持久化数据中的非法配置", () => {
    expect(
      styleSystem.hydrate({
        currentThemeId: "removed-theme",
        overrides: {
          background: {
            color: "linear-gradient(red, blue)",
            kind: "solid",
          },
          bodyHeadingAlignment: "right",
          coverLayout: "freeform",
          density: "cramped",
          fontId: "missing-font",
          headingAlignment: "right",
        },
      })
    ).toEqual({
      currentThemeId: "clean-light",
      overrides: {},
    });
  });

  it.each([
    { color: "#fff", kind: "solid" },
    { color: "linear-gradient(red, blue)", kind: "solid" },
    { color: "url(https://example.com/image.png)", kind: "solid" },
    { kind: "preset", preset: "https://example.com/image.png" },
    { kind: "preset", preset: "linear-gradient(red, blue)" },
    { kind: "gradient", gradient: "neon-party" },
    { kind: "gradient", gradient: "https://example.com/x.css" },
    { kind: "pattern", pattern: "remote-image" },
    "#ffffff",
  ])("拒绝非法背景配置 %#", (background) => {
    expect(
      styleSystem.hydrate({
        currentThemeId: "clean-light",
        overrides: { background },
      }).overrides
    ).not.toHaveProperty("background");
    expect(
      styleSystem.transition(styleSystem.hydrate(undefined), {
        patch: { background } as unknown as Partial<StyleConfiguration>,
        type: "update-configuration",
      }).overrides
    ).not.toHaveProperty("background");
  });

  it.each(
    themeBackgrounds
  )("主题 %s 的背景可由样式配置表达", (themeId, background) => {
    expect(
      styleSystem.read(styleSystem.hydrate({ currentThemeId: themeId }))
        .configuration.background
    ).toEqual(background);
  });

  it.each([
    { gradient: "warm-light", kind: "gradient" },
    { gradient: "cool-light", kind: "gradient" },
    { gradient: "pink-light", kind: "gradient" },
    { gradient: "ocean", kind: "gradient" },
    { gradient: "forest", kind: "gradient" },
    { kind: "pattern", pattern: "dots" },
    { kind: "pattern", pattern: "grid" },
    { kind: "pattern", pattern: "diagonal" },
  ] as const)("受控背景 %# 可识别并单项恢复", (background) => {
    const modified = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { background },
      type: "update-configuration",
    });
    const reset = styleSystem.transition(modified, {
      field: "background",
      type: "reset-field",
    });

    expect(styleSystem.read(modified).overridden.background).toBe(true);
    expect(modified.overrides.background).toEqual(background);
    expect(
      styleSystem.hydrate({
        currentThemeId: "clean-light",
        overrides: modified.overrides,
      }).overrides.background
    ).toEqual(background);
    expect(styleSystem.read(reset).overridden.background).toBe(false);
  });

  it("选回主题默认背景时删除对应覆盖", () => {
    const modified = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { background: { gradient: "forest", kind: "gradient" } },
      type: "update-configuration",
    });

    expect(
      styleSystem.transition(modified, {
        patch: { background: { kind: "preset", preset: "clean-light" } },
        type: "update-configuration",
      }).overrides
    ).toEqual({});
  });

  it("受控渐变背景生成渐变渲染样式", () => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { background: { gradient: "ocean", kind: "gradient" } },
      type: "update-configuration",
    });
    const styles = styleSystem.resolve(state, { page: "body" }).styles;

    expect(String(styles.container.backgroundImage)).toContain(
      "linear-gradient"
    );
    expect(styles.container.backgroundSize).toBe("cover");
    expect(styles.container.backgroundRepeat).toBeUndefined();
    // 受控渐变全部是浅色基调，正文保持深色可读
    expect(styles.p.color).toBe("#000000");
  });

  it("受控图案背景生成平铺渲染样式", () => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { background: { kind: "pattern", pattern: "dots" } },
      type: "update-configuration",
    });
    const styles = styleSystem.resolve(state, { page: "body" }).styles;

    expect(String(styles.container.backgroundImage)).toContain(
      "data:image/svg+xml"
    );
    expect(styles.container.backgroundRepeat).toBe("repeat");
    expect(styles.container.backgroundSize).toBe("16px 16px");
    // 图案铺在浅色底上，正文保持深色可读
    expect(styles.p.color).toBe("#000000");
  });

  it("受控渐变与图案背景在导出审计中保持安全", () => {
    for (const background of [
      { gradient: "warm-light", kind: "gradient" },
      { kind: "pattern", pattern: "grid" },
    ] as const) {
      const state = styleSystem.transition(styleSystem.hydrate(undefined), {
        patch: { background },
        type: "update-configuration",
      });
      const styles = styleSystem.resolve(state, { page: "body" }).styles;

      for (const style of Object.values(styles)) {
        if (typeof style !== "object" || style === null) {
          continue;
        }
        for (const value of Object.values(style)) {
          if (typeof value !== "string") {
            continue;
          }
          expect(value).not.toMatch(unsafeCssValuePattern);
          if (value.includes("url(")) {
            expect(value).toContain("data:image/");
          }
        }
      }
    }
  });

  it.each([
    ["#ffffff", "light"],
    ["#777777", "light"],
    ["#111827", "dark"],
  ] as const)("纯色背景 %s 自动使用 %s 可读样式", (color, _tone) => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { background: { color, kind: "solid" } },
      type: "update-configuration",
    });
    const styles = styleSystem.resolve(state, { page: "body" }).styles;

    expect(styles.container).toMatchObject({ backgroundColor: color });
    expect(styles.container.backgroundImage).toBeUndefined();
    expect(contrastRatio(String(styles.p.color), color)).toBeGreaterThanOrEqual(
      4.5
    );
    expect(
      contrastRatio(String(styles.h1.color), color)
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ["clean-light", false],
    ["trianglify-minimalist", true],
    ["gradient-warm", true],
    ["apple-notes", false],
  ] as const)("主题 %s 的浮层卡是内部细节（%s）", (themeId, hasSurface) => {
    const state = styleSystem.hydrate({ currentThemeId: themeId });
    const body = styleSystem.resolve(state, { page: "body" }).styles;
    const cover = styleSystem.resolve(state, { page: "cover" }).styles;

    for (const styles of [body, cover]) {
      if (hasSurface) {
        expect(styles.container.padding).toBe("16px");
        expect(styles.innerContainer.backgroundColor).toBeDefined();
        expect(styles.innerContainer.borderRadius).toBeDefined();
        expect(styles.innerContainer.boxShadow).toBeDefined();
      } else {
        expect(styles.container.padding).toBeUndefined();
        expect(styles.innerContainer.backgroundColor).toBeUndefined();
        expect(styles.innerContainer.boxShadow).toBeUndefined();
      }
    }
  });

  it("Apple 备忘录的装饰顶栏是主题内部细节，封面与正文一致", () => {
    const state = styleSystem.hydrate({ currentThemeId: "apple-notes" });
    const body = styleSystem.resolve(state, { page: "body" });
    const cover = styleSystem.resolve(state, { page: "cover" });

    for (const resolved of [body, cover]) {
      expect(resolved.headerBar).toEqual({
        iconColor: "#8a6800",
        icons: { backArrow: true, menu: true, share: true },
      });
      expect(resolved.styles.container.padding).toBeUndefined();
    }
  });

  it("其余主题没有浮层卡或装饰顶栏", () => {
    for (const theme of styleSystem.catalog()) {
      if (
        ["trianglify-minimalist", "gradient-warm", "apple-notes"].includes(
          theme.id
        )
      ) {
        continue;
      }
      const resolved = styleSystem.resolve(
        styleSystem.hydrate({ currentThemeId: theme.id }),
        { page: "body" }
      );

      expect(resolved.headerBar).toBeUndefined();
      expect(resolved.styles.container.padding).toBeUndefined();
      expect(resolved.styles.innerContainer.backgroundColor).toBeUndefined();
    }
  });

  it("背景字段可识别并单项恢复", () => {
    const modified = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { background: { color: "#111827", kind: "solid" } },
      type: "update-configuration",
    });
    const reset = styleSystem.transition(modified, {
      field: "background",
      type: "reset-field",
    });

    expect(styleSystem.read(modified).overridden.background).toBe(true);
    expect(styleSystem.read(reset).overridden.background).toBe(false);
  });

  it("把旧版完整配置迁移为稀疏覆盖", () => {
    expect(
      styleSystem.hydrate({
        configuration: {
          accentColor: undefined,
          density: "compact",
          fontId: "auto",
          headingAlignment: "left",
        },
        currentThemeId: "reading-mode",
      })
    ).toEqual({
      currentThemeId: "reading-mode",
      overrides: { density: "compact" },
    });
  });

  it.each([
    ["compact", "compact"],
    ["snug", "snug"],
    ["normal", "normal"],
    ["relaxed", "relaxed"],
    ["spacious", "spacious"],
  ] as const)("五档密度 %s 原样保留为 %s", (legacy, expected) => {
    const state = styleSystem.hydrate({
      currentThemeId: "clean-light",
      overrides: { density: legacy },
    });

    expect(styleSystem.read(state).configuration.density).toBe(expected);
  });

  it("把旧三档密度 balanced 迁移为像素等价的 normal", () => {
    const state = styleSystem.hydrate({
      currentThemeId: "clean-light",
      overrides: { density: "balanced" },
    });

    expect(styleSystem.read(state).configuration.density).toBe("normal");
    // clean-light 默认密度即 normal，迁移后不产生覆盖
    expect(state.overrides).toEqual({});
  });

  it.each([
    ["system", "sans"],
    ["rounded", "sans"],
    ["kai", "serif"],
    ["mono", "sans"],
  ] as const)("把旧字体 %s 迁移到可靠字体 %s", (legacy, expected) => {
    const state = styleSystem.hydrate({
      currentThemeId: "clean-light",
      overrides: { fontId: legacy },
    });

    expect(styleSystem.read(state).configuration.fontId).toBe(expected);
  });

  it("丢弃会命中对象原型的非法密度", () => {
    const state = styleSystem.hydrate({
      currentThemeId: "clean-light",
      overrides: { density: "__proto__" },
    });

    expect(styleSystem.read(state).configuration.density).toBe("normal");
    expect(state.overrides).toEqual({});
  });

  it("丢弃已移除的标题装饰与装饰颜色覆盖并保留其他字段", () => {
    const state = styleSystem.hydrate({
      currentThemeId: "clean-light",
      overrides: {
        accentColor: "transparent",
        decorationColor: "#e64f7a",
        density: "compact",
        headingDecoration: "wavy",
      },
    });

    expect(state).toEqual({
      currentThemeId: "clean-light",
      overrides: { density: "compact" },
    });
    const configuration = styleSystem.read(state)
      .configuration as unknown as Record<string, unknown>;
    expect(configuration).not.toHaveProperty("decorationColor");
    expect(configuration).not.toHaveProperty("headingDecoration");
  });

  it("设置回主题默认值时删除对应覆盖", () => {
    const modified = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { density: "compact" },
      type: "update-configuration",
    });

    expect(
      styleSystem.transition(modified, {
        patch: { density: "normal" },
        type: "update-configuration",
      }).overrides
    ).toEqual({});
  });

  it("主题升级时采用新默认值并保留用户覆盖", () => {
    const state = styleSystem.hydrate({
      currentThemeId: "gradient-warm",
      overrides: { fontId: "serif" },
    });
    const snapshot = styleSystem.read(state);

    expect(snapshot.configuration).toMatchObject({
      coverLayout: "center-poster",
      density: "normal",
      fontId: "serif",
    });
    expect(snapshot.overridden).toMatchObject({
      coverLayout: false,
      density: false,
      fontId: true,
    });
  });

  it("丢弃已移除的正文标题大小覆盖并保留其他字段", () => {
    const state = styleSystem.hydrate({
      currentThemeId: "gradient-warm",
      overrides: { bodyHeadingSize: "small", density: "compact" },
    });

    expect(state).toEqual({
      currentThemeId: "gradient-warm",
      overrides: { density: "compact" },
    });
    expect(styleSystem.read(state).configuration).not.toHaveProperty(
      "bodyHeadingSize"
    );
  });

  it("丢弃已移除的内容底板覆盖并保留其他字段", () => {
    const state = styleSystem.hydrate({
      currentThemeId: "clean-light",
      overrides: { contentSurface: "notebook", density: "compact" },
    });

    expect(state).toEqual({
      currentThemeId: "clean-light",
      overrides: { density: "compact" },
    });
    expect(styleSystem.read(state).configuration).not.toHaveProperty(
      "contentSurface"
    );
  });

  it("相同有效配置不受主题 ID 影响", () => {
    const coolState = styleSystem.hydrate({ currentThemeId: "gradient-cool" });
    const coolConfiguration = styleSystem.read(coolState).configuration;
    const configuredCleanState = styleSystem.transition(
      styleSystem.hydrate({ currentThemeId: "clean-light" }),
      { patch: coolConfiguration, type: "update-configuration" }
    );

    expect({
      body: styleSystem.resolve(configuredCleanState, { page: "body" }).styles,
      cover: styleSystem.resolve(configuredCleanState, { page: "cover" })
        .styles,
      header: styleSystem.resolve(configuredCleanState, { page: "body" })
        .headerBar,
    }).toEqual({
      body: styleSystem.resolve(coolState, { page: "body" }).styles,
      cover: styleSystem.resolve(coolState, { page: "cover" }).styles,
      header: styleSystem.resolve(coolState, { page: "body" }).headerBar,
    });
  });

  it.each([
    { color: "#fefcf3", kind: "solid" },
    { color: "#fbfbfb", kind: "solid" },
    { kind: "preset", preset: "warm-sun" },
  ] as const)("只改背景 %# 不改变排版或顶栏", (background) => {
    const originalState = styleSystem.hydrate({
      currentThemeId: "clean-light",
    });
    const changedState = styleSystem.transition(originalState, {
      patch: { background },
      type: "update-configuration",
    });
    const originalBody = styleSystem.resolve(originalState, { page: "body" });
    const changedBody = styleSystem.resolve(changedState, { page: "body" });
    const originalCover = styleSystem.resolve(originalState, { page: "cover" });
    const changedCover = styleSystem.resolve(changedState, { page: "cover" });

    expect({
      bodyHeadingFontSize: changedBody.styles.h1.fontSize,
      bodyLetterSpacing: changedBody.styles.h1.letterSpacing,
      bodyWeight: changedBody.styles.h1.fontWeight,
      coverHeadingFontSize: changedCover.styles.h1.fontSize,
      fontFamily: changedBody.styles.container.fontFamily,
      fontSize: changedBody.styles.container.fontSize,
      headerBar: changedBody.headerBar,
    }).toEqual({
      bodyHeadingFontSize: originalBody.styles.h1.fontSize,
      bodyLetterSpacing: originalBody.styles.h1.letterSpacing,
      bodyWeight: originalBody.styles.h1.fontWeight,
      coverHeadingFontSize: originalCover.styles.h1.fontSize,
      fontFamily: originalBody.styles.container.fontFamily,
      fontSize: originalBody.styles.container.fontSize,
      headerBar: originalBody.headerBar,
    });
  });

  it("刷新后恢复当前稀疏状态", () => {
    const selected = styleSystem.transition(styleSystem.hydrate(undefined), {
      themeId: "reading-mode",
      type: "select-theme",
    });
    const modified = styleSystem.transition(selected, {
      patch: { density: "compact" },
      type: "update-configuration",
    });
    const persisted = JSON.parse(
      JSON.stringify({
        currentThemeId: modified.currentThemeId,
        overrides: modified.overrides,
      })
    );
    const restored = styleSystem.hydrate(persisted);

    expect({
      configuration: styleSystem.read(restored).configuration,
      state: restored,
    }).toEqual({
      configuration: {
        background: { color: "#fefcf3", kind: "solid" },
        bodyHeadingAlignment: "left",
        coverLayout: "top-left",
        density: "compact",
        fontId: "serif",
      },
      state: {
        currentThemeId: "reading-mode",
        overrides: { density: "compact" },
      },
    });
  });

  it("切换主题时采用新主题配置", () => {
    const adjusted = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { density: "compact" },
      type: "update-configuration",
    });

    const selected = styleSystem.transition(adjusted, {
      themeId: "reading-mode",
      type: "select-theme",
    });

    expect({
      configuration: styleSystem.read(selected).configuration,
      state: selected,
    }).toEqual({
      configuration: {
        background: { color: "#fefcf3", kind: "solid" },
        bodyHeadingAlignment: "left",
        coverLayout: "top-left",
        density: "normal",
        fontId: "serif",
      },
      state: {
        currentThemeId: "reading-mode",
        overrides: {},
        previousSelection: {
          currentThemeId: "clean-light",
          overrides: { density: "compact" },
        },
      },
    });
  });

  it("撤销主题切换时恢复之前主题和覆盖", () => {
    const modified = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { density: "compact" },
      type: "update-configuration",
    });
    const selected = styleSystem.transition(modified, {
      themeId: "reading-mode",
      type: "select-theme",
    });
    const restored = styleSystem.transition(selected, {
      type: "undo-theme-selection",
    });

    expect({
      configuration: styleSystem.read(restored).configuration,
      state: restored,
    }).toEqual({
      configuration: {
        background: { kind: "preset", preset: "clean-light" },
        bodyHeadingAlignment: "center",
        coverLayout: "center-poster",
        density: "compact",
        fontId: "sans",
      },
      state: {
        currentThemeId: "clean-light",
        overrides: { density: "compact" },
      },
    });
  });

  it("恢复当前主题配置", () => {
    const state = styleSystem.hydrate({
      adjustments: { density: "compact" },
      currentThemeId: "reading-mode",
    });

    const reset = styleSystem.transition(state, {
      type: "reset-configuration",
    });

    expect({
      configuration: styleSystem.read(reset).configuration,
      state: reset,
    }).toEqual({
      configuration: {
        background: { color: "#fefcf3", kind: "solid" },
        bodyHeadingAlignment: "left",
        coverLayout: "top-left",
        density: "normal",
        fontId: "serif",
      },
      state: { currentThemeId: "reading-mode", overrides: {} },
    });
  });

  it("读取当前主题和配置修改状态", () => {
    const snapshot = styleSystem.read(
      styleSystem.hydrate({
        adjustments: { density: "compact" },
        currentThemeId: "reading-mode",
      })
    );

    expect({
      density: snapshot.configuration.density,
      isModified: snapshot.isModified,
      themeId: snapshot.theme.id,
    }).toEqual({
      density: "compact",
      isModified: true,
      themeId: "reading-mode",
    });
  });

  it("针对正文和封面解析不同的渲染样式", () => {
    const state = styleSystem.hydrate(undefined);
    const body = styleSystem.resolve(state, { page: "body" });
    const cover = styleSystem.resolve(state, { page: "cover" });

    expect({
      bodyHeadingFontSize: body.styles.h1.fontSize,
      bodyVerticalAlign: body.styles.content.justifyContent,
      coverHeadingFontSize: cover.styles.h1.fontSize,
      coverVerticalAlign: cover.styles.content.justifyContent,
      coverWeight: cover.styles.h1.fontWeight,
      strongWeight: body.styles.strong.fontWeight,
    }).toEqual({
      bodyHeadingFontSize: "1.625em",
      bodyVerticalAlign: "flex-start",
      coverHeadingFontSize: "2.03125em",
      coverVerticalAlign: "center",
      coverWeight: 600,
      strongWeight: 600,
    });
  });

  it("背景在封面和正文生成相同画布样式", () => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: {
        background: { color: "#111827", kind: "solid" },
      },
      type: "update-configuration",
    });
    const body = styleSystem.resolve(state, { page: "body" }).styles;
    const cover = styleSystem.resolve(state, { page: "cover" }).styles;

    expect({
      backgroundColor: cover.container.backgroundColor,
      innerContainer: cover.innerContainer,
      padding: cover.container.padding,
    }).toEqual({
      backgroundColor: body.container.backgroundColor,
      innerContainer: body.innerContainer,
      padding: body.container.padding,
    });
  });

  it("正文标题对齐不改变封面对齐", () => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { bodyHeadingAlignment: "left" },
      type: "update-configuration",
    });

    expect({
      body: styleSystem.resolve(state, { page: "body" }).styles.h1.textAlign,
      cover: styleSystem.resolve(state, { page: "cover" }).styles.h1.textAlign,
    }).toEqual({ body: "left", cover: "center" });
  });

  it.each([
    ["center-poster", "center", "center", "center"],
    ["top-left", "flex-start", "flex-start", "left"],
    ["bottom-left", "flex-end", "flex-start", "left"],
  ] as const)("封面版式 %s 不改变正文标题对齐", (coverLayout, vertical, horizontal, coverHeadingAlignment) => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { coverLayout },
      type: "update-configuration",
    });
    const body = styleSystem.resolve(state, { page: "body" }).styles;
    const cover = styleSystem.resolve(state, { page: "cover" }).styles;

    expect({
      bodyHeadingAlignment: body.h1.textAlign,
      coverHeadingAlignment: cover.h1.textAlign,
      horizontal: cover.content.alignItems,
      vertical: cover.content.justifyContent,
    }).toEqual({
      bodyHeadingAlignment: "center",
      coverHeadingAlignment,
      horizontal,
      vertical,
    });
  });

  it.each([
    ["clean-light", "normal", "16px"],
    ["trianglify-minimalist", "snug", "15px"],
  ] as const)("主题 %s 由密度 %s 推导正文基础字号 %s", (themeId, density, fontSize) => {
    const state = styleSystem.hydrate({ currentThemeId: themeId });
    const snapshot = styleSystem.read(state);
    const styles = styleSystem.resolve(state, { page: "body" }).styles;

    expect(snapshot.configuration.density).toBe(density);
    expect(styles.container.fontSize).toBe(fontSize);
  });

  it.each(styleSystem.catalog())("解析内置主题 $id", (theme) => {
    const state = styleSystem.hydrate({ currentThemeId: theme.id });
    const configuration = styleSystem.read(state).configuration;
    const body = styleSystem.resolve(state, { page: "body" });
    const cover = styleSystem.resolve(state, { page: "cover" });
    const expectedCoverVerticalAlign =
      coverVerticalAlignments[configuration.coverLayout];

    expect({
      bodyThemeId: body.theme.id,
      bodyVerticalAlign: body.styles.content.justifyContent,
      coverThemeId: cover.theme.id,
      coverVerticalAlign: cover.styles.content.justifyContent,
      hasCoverHeadingScale:
        cover.styles.h1.fontSize !== body.styles.h1.fontSize,
    }).toEqual({
      bodyThemeId: theme.id,
      bodyVerticalAlign: "flex-start",
      coverThemeId: theme.id,
      coverVerticalAlign: expectedCoverVerticalAlign,
      hasCoverHeadingScale: true,
    });
  });

  it("8 个主题的封面和正文只使用 html2canvas 安全的本地样式", () => {
    const unsafeProperties = new Set([
      "backdropFilter",
      "filter",
      "maskImage",
      "mixBlendMode",
    ]);
    let resolvedContexts = 0;

    for (const theme of styleSystem.catalog()) {
      const state = styleSystem.hydrate({ currentThemeId: theme.id });
      for (const page of ["cover", "body"] as const) {
        const resolved = styleSystem.resolve(state, { page });
        const styleObjects = Object.values(resolved.styles).filter(
          (value): value is Record<string, unknown> =>
            typeof value === "object" && value !== null
        );

        for (const style of styleObjects) {
          for (const [property, value] of Object.entries(style)) {
            expect(unsafeProperties).not.toContain(property);
            if (typeof value !== "string") {
              continue;
            }
            expect(value).not.toMatch(unsafeCssValuePattern);
            if (value.includes("url(")) {
              expect(value).toContain("data:image/");
            }
          }
        }
        resolvedContexts += 1;
      }
    }

    expect(resolvedContexts).toBe(16);
  });
});
