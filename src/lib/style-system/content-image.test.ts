import { describe, expect, it } from "vitest";
import { styleSystem } from "./style-system";

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
