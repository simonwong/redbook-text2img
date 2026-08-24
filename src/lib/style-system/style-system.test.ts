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
      configuration: {
        accentColor: undefined,
        density: "normal",
        fontId: "auto",
        headingAlignment: "center",
        headingDecoration: "underline",
      },
      currentThemeId: "clean-light",
    });
  });

  it("未知主题回落到默认主题", () => {
    expect(
      styleSystem.read(styleSystem.hydrate({ currentThemeId: "removed-theme" }))
        .theme.id
    ).toBe("clean-light");
  });

  it("切换主题时采用新主题配置", () => {
    const adjusted = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { density: "compact" },
      type: "update-configuration",
    });

    expect(
      styleSystem.transition(adjusted, {
        themeId: "reading-mode",
        type: "select-theme",
      })
    ).toEqual({
      configuration: {
        accentColor: undefined,
        density: "normal",
        fontId: "auto",
        headingAlignment: "left",
        headingDecoration: "none",
      },
      currentThemeId: "reading-mode",
    });
  });

  it("恢复当前主题配置", () => {
    const state = styleSystem.hydrate({
      adjustments: { density: "compact" },
      currentThemeId: "reading-mode",
    });

    expect(
      styleSystem.transition(state, { type: "reset-configuration" })
    ).toEqual({
      configuration: {
        accentColor: undefined,
        density: "normal",
        fontId: "auto",
        headingAlignment: "left",
        headingDecoration: "none",
      },
      currentThemeId: "reading-mode",
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
