import { describe, expect, it } from "vitest";
import { getLayoutMode } from "./use-device";

describe("getLayoutMode", () => {
  it.each([
    [320, "mobile"],
    [767, "mobile"],
    [768, "medium"],
    [1199, "medium"],
    [1200, "wide"],
    [1440, "wide"],
  ] as const)("把 %dpx 归类为 %s 布局", (width, expected) => {
    expect(getLayoutMode(width)).toBe(expected);
  });
});
