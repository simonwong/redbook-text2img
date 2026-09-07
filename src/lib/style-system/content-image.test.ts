import { describe, expect, it } from "vitest";
import { type StyleConfiguration, styleSystem } from "./style-system";

describe("内容图片渲染样式", () => {
  it.each([
    ["3:4", "250px"],
    ["1:1", "187.5px"],
    ["9:16", "333.5px"],
  ] as const)("%s 图片最大高度是卡片的一半", (aspectRatio, maxHeight) => {
    const state = styleSystem.hydrate({ overrides: { aspectRatio } });
    for (const page of ["body", "cover"] as const) {
      const { styles } = styleSystem.resolve(state, { page });
      expect(styles.figure).toMatchObject({
        display: "flex",
        flexShrink: 0,
        justifyContent: "center",
        width: "100%",
      });
      expect(styles.img).toMatchObject({
        height: "auto",
        maxHeight,
        maxWidth: "100%",
        width: "auto",
      });
    }
  });
});

describe("图片圆角与阴影", () => {
  it.each([
    ["none", "0px"],
    ["small", "8px"],
    ["large", "20px"],
  ] as const)("%s 圆角在正文与封面生效", (imageRadius, borderRadius) => {
    const state = styleSystem.hydrate({ overrides: { imageRadius } });
    for (const page of ["body", "cover"] as const) {
      expect(styleSystem.resolve(state, { page }).styles.img.borderRadius).toBe(
        borderRadius
      );
    }
  });

  const backgrounds = [
    [{ color: "#ffffff", kind: "solid" }, "light"],
    [{ color: "#111111", kind: "solid" }, "dark"],
    [{ kind: "preset", preset: "trianglify-gray" }, "dark"],
    [
      {
        direction: "vertical",
        from: "#eeeeee",
        kind: "custom-gradient",
        to: "#ffffff",
      },
      "light",
    ],
    [
      {
        dataUrl: "data:image/png;base64,AA==",
        frost: "none",
        kind: "image",
        tone: "dark",
      },
      "dark",
    ],
  ] as const satisfies readonly (readonly [
    StyleConfiguration["background"],
    "light" | "dark",
  ])[];

  it.each(backgrounds)("阴影按画布 %j 明暗派生", (background, tone) => {
    for (const page of ["body", "cover"] as const) {
      for (const imageShadow of ["none", "light", "strong"] as const) {
        const state = styleSystem.hydrate({
          overrides: { background, imageShadow },
        });
        const expected = {
          dark: {
            light: "0 2px 8px rgba(203, 213, 225, 0.12)",
            none: "none",
            strong: "0 6px 20px rgba(203, 213, 225, 0.24)",
          },
          light: {
            light: "0 2px 8px rgba(27, 37, 64, 0.12)",
            none: "none",
            strong: "0 6px 20px rgba(27, 37, 64, 0.24)",
          },
        };
        expect(styleSystem.resolve(state, { page }).styles.img.boxShadow).toBe(
          expected[tone][imageShadow]
        );
      }
    }
  });

  it("图片配置随自定义主题保存、更新、切换与重置", () => {
    const changed = styleSystem.transition(styleSystem.hydrate(undefined), {
      patch: { imageRadius: "large", imageShadow: "strong" },
      type: "update-configuration",
    });
    const saved = styleSystem.transition(changed, {
      name: "配图",
      now: 1,
      type: "save-custom-theme",
    });
    const hydrated = styleSystem.hydrate(JSON.parse(JSON.stringify(saved)));
    expect(styleSystem.read(hydrated).configuration).toMatchObject({
      imageRadius: "large",
      imageShadow: "strong",
    });
    const modified = styleSystem.transition(hydrated, {
      patch: { imageRadius: "none", imageShadow: "none" },
      type: "update-configuration",
    });
    const reset = styleSystem.transition(modified, {
      type: "reset-configuration",
    });
    expect(styleSystem.read(reset).configuration).toMatchObject({
      imageRadius: "large",
      imageShadow: "strong",
    });
    const updated = styleSystem.transition(modified, {
      type: "update-custom-theme",
    });
    const switched = styleSystem.transition(updated, {
      themeId: "clean-light",
      type: "select-theme",
    });
    expect(styleSystem.read(switched).configuration).toMatchObject({
      imageRadius: "small",
      imageShadow: "light",
    });
    const selected = styleSystem.transition(switched, {
      themeId: saved.currentThemeId,
      type: "select-theme",
    });
    expect(
      styleSystem.read(styleSystem.hydrate(selected)).configuration
    ).toMatchObject({ imageRadius: "none", imageShadow: "none" });
  });

  it("旧数据与非法图片选项回落主题默认值", () => {
    for (const overrides of [{}, { imageRadius: "invalid", imageShadow: 8 }]) {
      const state = styleSystem.hydrate({
        currentThemeId: "trianglify-minimalist",
        overrides,
      });
      expect(styleSystem.read(state).configuration).toMatchObject({
        imageRadius: "large",
        imageShadow: "none",
      });
      expect(styleSystem.read(state).isModified).toBe(false);
    }
  });
});

describe("逐图布局", () => {
  it.each([
    ["left", "flex-start"],
    ["center", "center"],
    ["right", "flex-end"],
  ] as const)("%s 对齐与四档尺寸在正文和封面生效", (align, justifyContent) => {
    for (const page of ["body", "cover"] as const) {
      const { styles } = styleSystem.resolve(styleSystem.hydrate(undefined), {
        page,
      });
      for (const [size, width] of [
        ["s", "40%"],
        ["m", "60%"],
        ["l", "80%"],
        ["full", "100%"],
      ] as const) {
        const layout = styles.imageLayout[align][size];
        expect(layout.figure).toMatchObject({
          display: "flex",
          justifyContent,
          width: "100%",
        });
        expect(layout.container).toMatchObject({
          display: "flex",
          justifyContent,
          width,
        });
        expect(styles.img).toMatchObject({
          height: "auto",
          maxWidth: "100%",
          width: "auto",
        });
      }
    }
  });
});

describe("图片页渲染样式", () => {
  it.each(["3:4", "1:1", "9:16"] as const)(
    "%s 图片铺满原卡片，保留白边和圆角",
    (aspectRatio) => {
      for (const cardFrame of ["none", "white"] as const) {
        const state = styleSystem.hydrate({
          currentThemeId: "apple-notes",
          overrides: {
            aspectRatio,
            cardFrame,
            imageRadius: "large",
            imageShadow: "strong",
          },
        });
        const body = styleSystem.resolve(state, { page: "body" });
        const image = styleSystem.resolve(state, { page: "image" });
        expect(image.headerBar).toBeUndefined();
        expect(image.styles.card).toEqual(body.styles.card);
        expect(image.styles.container).toEqual(body.styles.container);
        expect(image.styles.imagePage).toEqual({
          borderRadius: 0,
          boxShadow: "none",
          display: "block",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          width: "100%",
        });
        expect(image.styles.imagePageFooter).toMatchObject({
          bottom: "16px",
          color: "#ffffff",
          left: "16px",
          position: "absolute",
          right: "16px",
          textShadow: "0 1px 3px rgba(0, 0, 0, 0.6)",
        });
      }
    }
  );
});
