import { describe, expect, it } from "vitest";
import { type StyleConfiguration, styleSystem } from "./style-system";

const unsafeCssValuePattern = /https?:|javascript:/i;
// 磨砂只能用 filter，backdrop-filter 在导出链路里被整体忽略
const backdropPattern = /backdrop/i;
// 四种系统字体栈都必须给中文留回退，否则中文会掉进纯拉丁字库的兜底
const chineseFallbackPattern =
  /PingFang SC|Microsoft YaHei|Noto Sans SC|Noto Serif SC|Source Han Serif SC|SimSun|Kaiti SC|STKaiti|KaiTi|AR PL UKai CN|Noto Serif CJK SC/;

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
      aspectRatio: ["3:4", "1:1", "9:16"],
      bodyHeadingAlignment: ["center", "left"],
      cardFrame: ["none", "white"],
      coverLayout: ["center-poster", "top-left", "bottom-left"],
      density: ["compact", "snug", "normal", "relaxed", "spacious"],
      fontId: ["sans", "serif", "kai", "mono"],
      frost: ["none", "light", "medium", "strong"],
    });
  });

  it("公开语义准确的正文标题与封面配置", () => {
    const configuration = styleSystem.read(styleSystem.hydrate(undefined))
      .configuration as unknown as Record<string, unknown>;

    expect(configuration).toMatchObject({
      accentColor: "#111827",
      background: { kind: "preset", preset: "clean-light" },
      bodyHeadingAlignment: "center",
      coverLayout: "center-poster",
    });
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
        accentColor: false,
        aspectRatio: false,
        background: false,
        bodyHeadingAlignment: false,
        cardFrame: false,
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
        accentColor: "#111827",
        aspectRatio: "3:4",
        background: { kind: "preset", preset: "clean-light" },
        bodyHeadingAlignment: "center",
        cardFrame: "none",
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
    // 旧版受控渐变/图案种类已下线，旧值一律丢弃
    { kind: "gradient", gradient: "warm-light" },
    { kind: "gradient", gradient: "https://example.com/x.css" },
    { kind: "pattern", pattern: "dots" },
    {
      direction: "diagonal",
      from: "red",
      kind: "custom-gradient",
      to: "#ffffff",
    },
    {
      direction: "sideways",
      from: "#e0e7ff",
      kind: "custom-gradient",
      to: "#fef3c7",
    },
    { dataUrl: "https://example.com/x.png", kind: "image", tone: "light" },
    { dataUrl: "data:text/html,<p>x</p>", kind: "image", tone: "light" },
    { dataUrl: "data:image/png;base64,iVBORw0KGgo=", kind: "image" },
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
    {
      direction: "diagonal",
      from: "#e0e7ff",
      kind: "custom-gradient",
      to: "#fef3c7",
    },
    {
      direction: "vertical",
      from: "#111827",
      kind: "custom-gradient",
      to: "#374151",
    },
    {
      dataUrl: "data:image/png;base64,iVBORw0KGgo=",
      frost: "none",
      kind: "image",
      tone: "light",
    },
    {
      dataUrl: "data:image/png;base64,iVBORw0KGgo=",
      frost: "medium",
      kind: "image",
      tone: "light",
    },
  ] as const)("自定义背景 %# 可识别并单项恢复", (background) => {
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
      patch: {
        background: {
          direction: "vertical",
          from: "#111827",
          kind: "custom-gradient",
          to: "#374151",
        },
      },
      type: "update-configuration",
    });

    expect(
      styleSystem.transition(modified, {
        patch: { background: { kind: "preset", preset: "clean-light" } },
        type: "update-configuration",
      }).overrides
    ).toEqual({});
  });

  it("自定义渐变背景生成渐变渲染样式", () => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: {
        background: {
          direction: "horizontal",
          from: "#e0e7ff",
          kind: "custom-gradient",
          to: "#fef3c7",
        },
      },
      type: "update-configuration",
    });
    const styles = styleSystem.resolve(state, { page: "body" }).styles;

    expect(styles.container.backgroundImage).toBe(
      "linear-gradient(90deg, #e0e7ff 0%, #fef3c7 100%)"
    );
    expect(styles.container.backgroundSize).toBe("cover");
    expect(styles.container.backgroundRepeat).toBeUndefined();
    // 浅色渐变正文保持深色可读
    expect(styles.p.color).toBe("#000000");
  });

  it("深色自定义渐变自动使用深色基调可读样式", () => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: {
        background: {
          direction: "vertical",
          from: "#111827",
          kind: "custom-gradient",
          to: "#1f2937",
        },
      },
      type: "update-configuration",
    });
    const styles = styleSystem.resolve(state, { page: "body" }).styles;

    expect(styles.p.color).toBe("#ffffff");
  });

  it("图片背景按 cover 居中铺放并按采样基调选取可读语义色", () => {
    const darkImage = {
      dataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
      frost: "none",
      kind: "image",
      tone: "dark",
    } as const;
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { background: darkImage },
      type: "update-configuration",
    });
    const styles = styleSystem.resolve(state, { page: "body" }).styles;

    expect(styles.container.backgroundImage).toBe(
      `url("${darkImage.dataUrl}")`
    );
    expect(styles.container.backgroundSize).toBe("cover");
    expect(styles.container.backgroundPosition).toBe("center");
    expect(styles.p.color).toBe("#ffffff");
  });

  it("自定义渐变与图片背景在导出审计中保持安全", () => {
    for (const background of [
      {
        direction: "diagonal",
        from: "#fbcfe8",
        kind: "custom-gradient",
        to: "#bfdbfe",
      },
      {
        dataUrl: "data:image/png;base64,iVBORw0KGgo=",
        frost: "none",
        kind: "image",
        tone: "light",
      },
      {
        dataUrl: "data:image/png;base64,iVBORw0KGgo=",
        frost: "strong",
        kind: "image",
        tone: "light",
      },
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

  it("其余主题没有装饰顶栏", () => {
    for (const theme of styleSystem.catalog()) {
      if (theme.id === "apple-notes") {
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
  ] as const)("把旧字体 %s 迁移到可靠字体 %s", (legacy, expected) => {
    const state = styleSystem.hydrate({
      currentThemeId: "clean-light",
      overrides: { fontId: legacy },
    });

    expect(styleSystem.read(state).configuration.fontId).toBe(expected);
  });

  it.each(["sans", "serif", "kai", "mono"] as const)(
    "旧持久化字体 %s 直接生效",
    (fontId) => {
      const state = styleSystem.hydrate({
        currentThemeId: "clean-light",
        overrides: { fontId },
      });

      expect(styleSystem.read(state).configuration.fontId).toBe(fontId);
    }
  );

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
        accentColor: "#44403c",
        aspectRatio: "3:4",
        background: { color: "#fefcf3", kind: "solid" },
        bodyHeadingAlignment: "left",
        cardFrame: "none",
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
        accentColor: "#44403c",
        aspectRatio: "3:4",
        background: { color: "#fefcf3", kind: "solid" },
        bodyHeadingAlignment: "left",
        cardFrame: "none",
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
        accentColor: "#111827",
        aspectRatio: "3:4",
        background: { kind: "preset", preset: "clean-light" },
        bodyHeadingAlignment: "center",
        cardFrame: "none",
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
        accentColor: "#44403c",
        aspectRatio: "3:4",
        background: { color: "#fefcf3", kind: "solid" },
        bodyHeadingAlignment: "left",
        cardFrame: "none",
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

  it.each(styleSystem.configurationOptions().fontId)(
    "字体 %s 的 font-family 栈保留中文回退",
    (fontId) => {
      const state = styleSystem.transition(styleSystem.hydrate(undefined), {
        patch: { fontId: fontId as StyleConfiguration["fontId"] },
        type: "update-configuration",
      });

      expect(
        styleSystem.resolve(state, { page: "body" }).styles.container.fontFamily
      ).toMatch(chineseFallbackPattern);
    }
  );

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

  it.each([
    ["3:4", 500],
    ["1:1", 375],
    ["9:16", 667],
  ] as const)("卡片比例 %s 解析为 375×%d 的渲染尺寸", (aspectRatio, height) => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { aspectRatio },
      type: "update-configuration",
    });
    const { styles } = styleSystem.resolve(state, { page: "body" });

    expect(styles.card).toEqual({ frame: null, height, width: 375 });
    expect(styles.container).toMatchObject({
      height: `${height}px`,
      minHeight: `${height}px`,
      minWidth: "375px",
      width: "375px",
    });
  });

  it("封面与正文共用同一张卡片尺寸", () => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { aspectRatio: "9:16" },
      type: "update-configuration",
    });

    expect(styleSystem.resolve(state, { page: "cover" }).styles.card).toEqual(
      styleSystem.resolve(state, { page: "body" }).styles.card
    );
  });

  it.each(styleSystem.catalog())(
    "内置主题 $id 默认输出 3:4 无边框卡片",
    (theme) => {
      const state = styleSystem.hydrate({ currentThemeId: theme.id });
      const snapshot = styleSystem.read(state);
      const { styles } = styleSystem.resolve(state, { page: "body" });

      expect(snapshot.configuration).toMatchObject({
        aspectRatio: "3:4",
        cardFrame: "none",
      });
      expect(styles.card).toEqual({ frame: null, height: 500, width: 375 });
      expect(styles.container).toMatchObject({
        borderRadius: "12px",
        height: "500px",
        minHeight: "500px",
        minWidth: "375px",
        overflow: "hidden",
        width: "375px",
      });
    }
  );

  it("白边把导出节点包成 3px 白色内边距的外层", () => {
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { cardFrame: "white" },
      type: "update-configuration",
    });
    const { styles } = styleSystem.resolve(state, { page: "body" });

    expect(styles.card).toEqual({
      frame: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxSizing: "border-box",
        height: "500px",
        minHeight: "500px",
        minWidth: "375px",
        overflow: "hidden",
        padding: "3px",
        width: "375px",
      },
      height: 500,
      width: 375,
    });
    // 内层退到白边内侧：圆角 13，尺寸各减 6
    expect(styles.container).toMatchObject({
      borderRadius: "13px",
      height: "494px",
      minHeight: "494px",
      minWidth: "369px",
      width: "369px",
    });
  });

  it("白边层只用 html2canvas 可还原的盒模型属性", () => {
    const allowedFrameProperties = new Set([
      "backgroundColor",
      "borderRadius",
      "boxSizing",
      "height",
      "minHeight",
      "minWidth",
      "overflow",
      "padding",
      "width",
    ]);
    const state = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { aspectRatio: "1:1", cardFrame: "white" },
      type: "update-configuration",
    });

    for (const page of ["body", "cover"] as const) {
      const { frame } = styleSystem.resolve(state, { page }).styles.card;
      expect(frame).not.toBeNull();
      for (const [property, value] of Object.entries(frame ?? {})) {
        expect(allowedFrameProperties).toContain(property);
        expect(String(value)).not.toMatch(unsafeCssValuePattern);
      }
      expect(frame).not.toHaveProperty("backdropFilter");
      expect(frame).not.toHaveProperty("boxShadow");
      expect(frame).not.toHaveProperty("filter");
    }
  });

  it("比例与边框可识别、可单项恢复且不牵连其他字段", () => {
    const modified = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { aspectRatio: "9:16", cardFrame: "white" },
      type: "update-configuration",
    });
    const reset = styleSystem.transition(modified, {
      field: "aspectRatio",
      type: "reset-field",
    });

    expect(modified.overrides).toEqual({
      aspectRatio: "9:16",
      cardFrame: "white",
    });
    expect(styleSystem.read(modified).overridden).toMatchObject({
      aspectRatio: true,
      cardFrame: true,
      density: false,
    });
    expect(reset.overrides).toEqual({ cardFrame: "white" });
    expect(styleSystem.read(reset).configuration).toMatchObject({
      aspectRatio: "3:4",
      cardFrame: "white",
    });
  });

  it("丢弃非法的比例与边框并对缺失字段取主题默认", () => {
    const state = styleSystem.hydrate({
      currentThemeId: "reading-mode",
      overrides: {
        aspectRatio: "4:3",
        cardFrame: "black",
        density: "compact",
      },
    });

    expect(state.overrides).toEqual({ density: "compact" });
    expect(styleSystem.read(state).configuration).toMatchObject({
      aspectRatio: "3:4",
      cardFrame: "none",
    });
  });
});

// 改动前生成器为 8 个主题派生的展示级标题色，也是各主题声明的强调色；
// 强调色未被覆盖时这些值必须一字不差
const themeAccentColors = [
  ["clean-light", "#111827"],
  ["trianglify-minimalist", "#0f172a"],
  ["clean-dark", "#f5f5f7"],
  ["gradient-warm", "#4a2a15"],
  ["gradient-cool", "#172b45"],
  ["xiaohongshu-pink", "#64152d"],
  ["reading-mode", "#44403c"],
  ["apple-notes", "#1d1d1f"],
] as const;

describe("强调色", () => {
  it.each(themeAccentColors)(
    "%s 的默认强调色即改动前的标题与加粗色",
    (themeId, accentColor) => {
      const state = styleSystem.hydrate({ currentThemeId: themeId });
      const { styles } = styleSystem.resolve(state, { page: "body" });

      expect(styleSystem.read(state).configuration.accentColor).toBe(
        accentColor
      );
      expect(styles.h1.color).toBe(accentColor);
      expect(styles.h2.color).toBe(accentColor);
      expect(styles.h3.color).toBe(accentColor);
      expect(styles.strong.color).toBe(accentColor);
    }
  );

  it("只作用于标题、加粗、列表标记、引用边线与链接", () => {
    const accentColor = "#7b56c9";
    const before = styleSystem.resolve(styleSystem.hydrate(undefined), {
      page: "body",
    }).styles;
    const after = styleSystem.resolve(
      styleSystem.transition(styleSystem.hydrate(undefined), {
        patch: { accentColor },
        type: "update-configuration",
      }),
      { page: "body" }
    ).styles;
    expect(after.h1.color).toBe(accentColor);
    expect(after.h2.color).toBe(accentColor);
    expect(after.h3.color).toBe(accentColor);
    expect(after.strong.color).toBe(accentColor);
    expect(after.a.color).toBe(accentColor);
    expect(after.blockquote.borderLeft).toBe(`3px solid ${accentColor}`);
    expect(Object.entries(after.ul)).toContainEqual([
      "--marker-color",
      accentColor,
    ]);

    // 段落、次级标题、斜体、代码与引用文字色仍由样式基础按背景派生
    expect(after.p.color).toBe(before.p.color);
    expect(after.h4.color).toBe(before.h4.color);
    expect(after.h5.color).toBe(before.h5.color);
    expect(after.h6.color).toBe(before.h6.color);
    expect(after.em.color).toBe(before.em.color);
    expect(after.code.color).toBe(before.code.color);
    expect(after.blockquote.color).toBe(before.blockquote.color);
    expect(after.ul.color).toBe(before.ul.color);
  });

  it.each([
    // 浅背景上的浅粉被压暗
    { accentColor: "#ffd1dc", background: "#ffffff", expected: "darker" },
    // 深背景上的深紫被提亮
    { accentColor: "#2b2540", background: "#1c1c21", expected: "lighter" },
    // 已达标的颜色原样返回
    { accentColor: "#3f5fbf", background: "#ffffff", expected: "same" },
  ] as const)(
    "在 $background 上把 $accentColor 调整为 $expected",
    ({ accentColor, background, expected }) => {
      const state = styleSystem.transition(styleSystem.hydrate(undefined), {
        patch: { accentColor, background: { color: background, kind: "solid" } },
        type: "update-configuration",
      });
      const applied = String(
        styleSystem.resolve(state, { page: "body" }).styles.h1.color
      );

      if (expected === "same") {
        expect(applied).toBe(accentColor);
      } else {
        expect(applied).not.toBe(accentColor);
        expect(
          expected === "darker"
            ? relativeLuminance(applied) < relativeLuminance(accentColor)
            : relativeLuminance(applied) > relativeLuminance(accentColor)
        ).toBe(true);
      }
      expect(contrastRatio(applied, background)).toBeGreaterThanOrEqual(4.5);
    }
  );

  it("非法强调色被丢弃，缺失时取主题默认", () => {
    const state = styleSystem.hydrate({
      currentThemeId: "clean-dark",
      overrides: { accentColor: "#12g", density: "compact" },
    });

    expect(state.overrides).toEqual({ density: "compact" });
    expect(styleSystem.read(state).configuration.accentColor).toBe("#f5f5f7");
    expect(
      styleSystem.transition(styleSystem.hydrate(undefined), {
        patch: { accentColor: "red" } as unknown as Partial<StyleConfiguration>,
        type: "update-configuration",
      }).overrides
    ).not.toHaveProperty("accentColor");
  });

  it("强调色可识别、可单项恢复且不牵连其他字段", () => {
    const modified = styleSystem.transition(
      styleSystem.hydrate({ currentThemeId: "reading-mode" }),
      { patch: { accentColor: "#E8604C", density: "compact" }, type: "update-configuration" }
    );
    const reset = styleSystem.transition(modified, {
      field: "accentColor",
      type: "reset-field",
    });

    // 大写十六进制规范化为小写，与持久化白名单一致
    expect(modified.overrides).toEqual({
      accentColor: "#e8604c",
      density: "compact",
    });
    expect(styleSystem.read(modified).overridden).toMatchObject({
      accentColor: true,
      density: true,
    });
    expect(reset.overrides).toEqual({ density: "compact" });
    expect(styleSystem.read(reset).configuration.accentColor).toBe("#44403c");
  });
});

describe("图片背景磨砂", () => {
  const imageDataUrl = "data:image/png;base64,iVBORw0KGgo=";
  const imageBackground = (
    frost: "none" | "light" | "medium" | "strong",
    tone: "dark" | "light" = "light"
  ) => ({ dataUrl: imageDataUrl, frost, kind: "image", tone }) as const;
  const resolveWith = (
    background: ReturnType<typeof imageBackground>,
    patch: Partial<StyleConfiguration> = {}
  ) =>
    styleSystem.resolve(
      styleSystem.transition(styleSystem.hydrate(undefined), {
        patch: { background, ...patch },
        type: "update-configuration",
      }),
      { page: "body" }
    ).styles;

  it("无磨砂时渲染样式与磨砂上线前完全一致", () => {
    const styles = resolveWith(imageBackground("none"));

    expect(styles).not.toHaveProperty("frost");
    // 逐字段固定为磨砂上线前（a677ac2）的容器样式
    expect(styles.container).toEqual({
      backgroundImage: `url("${imageDataUrl}")`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      borderRadius: "12px",
      boxSizing: "border-box",
      fontFamily:
        '"Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: "16px",
      height: "500px",
      minHeight: "500px",
      minWidth: "375px",
      overflow: "hidden",
      position: "relative",
      width: "375px",
    });
  });

  it.each([
    ["light", "blur(6px)", "rgba(255, 255, 255, 0.28)"],
    ["medium", "blur(12px)", "rgba(255, 255, 255, 0.42)"],
    ["strong", "blur(20px)", "rgba(255, 255, 255, 0.56)"],
  ] as const)(
    "磨砂 %s 解析为 %s 的模糊层与 %s 的蒙层",
    (frost, blur, veilColor) => {
      const { frost: layers } = resolveWith(imageBackground(frost));

      expect(layers?.blurLayer).toMatchObject({
        backgroundImage: `url("${imageDataUrl}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        filter: blur,
        position: "absolute",
        transform: "scale(1.08)",
      });
      expect(layers?.veil.backgroundColor).toBe(veilColor);
      // 两层都铺满容器，靠容器的 overflow 与圆角裁切
      for (const layer of [layers?.blurLayer, layers?.veil]) {
        expect(layer).toMatchObject({
          bottom: 0,
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        });
      }
      // 内容层压在两层之上
      expect(layers?.contentLayer).toMatchObject({
        position: "relative",
        zIndex: 1,
      });
    }
  );

  it.each([
    ["light", "rgb(255, 255, 255)", "rgba(255, 255, 255, 0.42)"],
    ["dark", "rgb(11, 11, 15)", "rgba(11, 11, 15, 0.42)"],
  ] as const)(
    "%s 基调的蒙层与兜底底色取对应实色",
    (tone, baseColor, veilColor) => {
      const { frost: layers } = resolveWith(imageBackground("medium", tone));

      expect(layers?.blurLayer.backgroundColor).toBe(baseColor);
      expect(layers?.veil.backgroundColor).toBe(veilColor);
    }
  );

  it("磨砂开启时容器把背景图交给模糊层", () => {
    const styles = resolveWith(imageBackground("medium"));

    expect(styles.container.backgroundImage).toBeUndefined();
    expect(styles.container.backgroundColor).toBeUndefined();
    expect(styles.container).toMatchObject({
      borderRadius: "12px",
      overflow: "hidden",
      position: "relative",
    });
  });

  it("白边下模糊层裁在白边内侧的内圆角里", () => {
    const styles = resolveWith(imageBackground("strong"), {
      cardFrame: "white",
    });

    expect(styles.card.frame).toMatchObject({
      overflow: "hidden",
      padding: "3px",
    });
    expect(styles.container).toMatchObject({
      borderRadius: "13px",
      height: "494px",
      overflow: "hidden",
      width: "369px",
    });
    expect(styles.frost?.blurLayer.filter).toBe("blur(20px)");
  });

  it("8 个主题的三档磨砂都不含 backdrop-filter 与 transparent 色标", () => {
    let auditedContexts = 0;

    for (const theme of styleSystem.catalog()) {
      for (const frost of ["light", "medium", "strong"] as const) {
        for (const tone of ["light", "dark"] as const) {
          const state = styleSystem.transition(
            styleSystem.hydrate({ currentThemeId: theme.id }),
            {
              patch: { background: imageBackground(frost, tone) },
              type: "update-configuration",
            }
          );
          for (const page of ["cover", "body"] as const) {
            const { styles } = styleSystem.resolve(state, { page });
            const serialized = JSON.stringify(styles);

            expect(serialized).not.toMatch(backdropPattern);
            expect(serialized).not.toContain("transparent");
            expect(styles.frost?.blurLayer).not.toHaveProperty(
              "backdropFilter"
            );
            for (const value of Object.values(styles.frost?.blurLayer ?? {})) {
              if (typeof value === "string" && value.includes("url(")) {
                expect(value).toContain("data:image/");
              }
            }
            auditedContexts += 1;
          }
        }
      }
    }

    expect(auditedContexts).toBe(96);
  });

  it("切换磨砂档位产生背景覆盖并保留图片与基调", () => {
    const uploaded = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { background: imageBackground("none", "dark") },
      type: "update-configuration",
    });
    const frosted = styleSystem.transition(uploaded, {
      patch: { background: imageBackground("medium", "dark") },
      type: "update-configuration",
    });

    expect(styleSystem.read(frosted).overridden.background).toBe(true);
    expect(styleSystem.read(frosted).configuration.background).toEqual({
      dataUrl: imageDataUrl,
      frost: "medium",
      kind: "image",
      tone: "dark",
    });
    // 只把磨砂调回无，图片与基调仍在
    const cleared = styleSystem.transition(frosted, {
      patch: { background: imageBackground("none", "dark") },
      type: "update-configuration",
    });
    expect(styleSystem.read(cleared).configuration.background).toEqual({
      dataUrl: imageDataUrl,
      frost: "none",
      kind: "image",
      tone: "dark",
    });
    expect(
      styleSystem.resolve(cleared, { page: "body" }).styles
    ).not.toHaveProperty("frost");
  });

  it.each([undefined, "blurred", 3, null])(
    "持久化数据中缺失或非法的磨砂档位回落无磨砂 %#",
    (frost) => {
      const state = styleSystem.hydrate({
        currentThemeId: "clean-light",
        overrides: {
          background: {
            dataUrl: imageDataUrl,
            frost,
            kind: "image",
            tone: "light",
          },
        },
      });

      expect(styleSystem.read(state).configuration.background).toEqual({
        dataUrl: imageDataUrl,
        frost: "none",
        kind: "image",
        tone: "light",
      });
    }
  );

  it("合法磨砂档位在刷新后原样恢复", () => {
    const state = styleSystem.hydrate({
      currentThemeId: "clean-light",
      overrides: {
        background: {
          dataUrl: imageDataUrl,
          frost: "strong",
          kind: "image",
          tone: "light",
        },
      },
    });

    expect(state.overrides.background).toEqual({
      dataUrl: imageDataUrl,
      frost: "strong",
      kind: "image",
      tone: "light",
    });
  });

  it("非图片背景不产生磨砂层", () => {
    for (const background of [
      { color: "#ffffff", kind: "solid" },
      {
        direction: "diagonal",
        from: "#e0e7ff",
        kind: "custom-gradient",
        to: "#fef3c7",
      },
    ] as const) {
      const state = styleSystem.transition(styleSystem.hydrate(undefined), {
        patch: { background },
        type: "update-configuration",
      });

      expect(
        styleSystem.resolve(state, { page: "body" }).styles
      ).not.toHaveProperty("frost");
    }
  });
});
