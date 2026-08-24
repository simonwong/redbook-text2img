import { describe, expect, it } from "vitest";
import { styleSystem } from "./style-system";

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

  it("从空持久化数据恢复默认主题状态", () => {
    expect(styleSystem.hydrate(undefined)).toEqual({
      currentThemeId: "clean-light",
      overrides: {},
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
        density: true,
        fontId: false,
        headingAlignment: false,
        headingDecoration: false,
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
        accentColor: undefined,
        density: "normal",
        fontId: "serif",
        headingAlignment: "center",
        headingDecoration: "underline",
      },
      overrides: { fontId: "serif" },
    });
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
          accentColor: "javascript:alert(1)",
          density: "cramped",
          fontId: "missing-font",
          headingAlignment: "right",
          headingDecoration: "sparkle",
        },
      })
    ).toEqual({
      currentThemeId: "clean-light",
      overrides: {},
    });
  });

  it("把旧版完整配置迁移为稀疏覆盖", () => {
    expect(
      styleSystem.hydrate({
        configuration: {
          accentColor: undefined,
          density: "compact",
          fontId: "auto",
          headingAlignment: "left",
          headingDecoration: "none",
        },
        currentThemeId: "reading-mode",
      })
    ).toEqual({
      currentThemeId: "reading-mode",
      overrides: { density: "compact" },
    });
  });

  it("迁移旧版 transparent 强调色语义", () => {
    expect(
      styleSystem.hydrate({
        adjustments: { accentColor: "transparent" },
        currentThemeId: "clean-light",
      })
    ).toEqual({
      currentThemeId: "clean-light",
      overrides: { headingDecoration: "none" },
    });
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
        accentColor: undefined,
        density: "normal",
        fontId: "auto",
        headingAlignment: "left",
        headingDecoration: "none",
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
        accentColor: undefined,
        density: "compact",
        fontId: "auto",
        headingAlignment: "center",
        headingDecoration: "underline",
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
        accentColor: undefined,
        density: "normal",
        fontId: "auto",
        headingAlignment: "left",
        headingDecoration: "none",
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
      bodyHeadingSize: body.styles.h1.fontSize,
      bodyVerticalAlign: body.styles.content.justifyContent,
      coverHeadingSize: cover.styles.h1.fontSize,
      coverVerticalAlign: cover.styles.content.justifyContent,
    }).toEqual({
      bodyHeadingSize: "1.625em",
      bodyVerticalAlign: "flex-start",
      coverHeadingSize: "2.03125em",
      coverVerticalAlign: "center",
    });
  });

  it.each(styleSystem.catalog())("解析内置主题 $id", (theme) => {
    const state = styleSystem.hydrate({ currentThemeId: theme.id });
    const body = styleSystem.resolve(state, { page: "body" });
    const cover = styleSystem.resolve(state, { page: "cover" });

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
      coverVerticalAlign: "center",
      hasCoverHeadingScale: true,
    });
  });
});
